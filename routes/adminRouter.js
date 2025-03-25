const { Router } = require('express')
const { adminModel, courseModel } = require("../db")
const { z } = require('zod')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const { adminMiddleware } = require("../middleware/admin")

const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
    const requiredBody = z.object({
        email: z.string().email(),
        password: z.string().min(3).max(10),
        firstName: z.string().min(3).max(16),
        lastName: z.string().min(3).max(16),
    })
    const parsedData = requiredBody.safeParse(req.body)

    if (!parsedData.success) {
        res.status(403).json({
            message: "Incorrect format",
            error: parsedData.error
        })
        return
    }

    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.name;
    const lastName = req.body.name;

    const hashedPassword = await bcrypt.hash(password, 5);

    try {
        await adminModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });
        res.status(200).json({
            message: "ADMIN Signed up successfully!"
        });
    } catch (error) {
        res.status(403).json({
            message: "duplicated email"
        });
    }
})

adminRouter.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const admin = await adminModel.findOne({
        email,
    })

    const passwordMatched = await bcrypt.compare(password, admin.password)

    if (passwordMatched) {
        const token = jwt.sign({
            id: admin._id.toString()
        }, process.env.JWT_ADMIN_PASSWORD)

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect Creds"
        })
    }
})

adminRouter.post("/course", adminMiddleware, async (req, res) => {
    const adminId = req.adminId;
    const requiredBody = z.object({
        title: z.string(),
        description: z.string(),
        price: z.number(),
        imageUrl: z.string(),
    })

    const parsedData = requiredBody.safeParse(req.body)

    if (!parsedData.success) {
        res.status(403).json({
            message: "Incorrect format",
            error: parsedData.error
        })
        return
    }

    const { title, description, price, imageUrl } = req.body

    try {
        const course = await courseModel.create({
            title,
            description,
            price,
            imageUrl, // TODO: Should have actual image url
            creatorId: adminId
        })
        res.status(200).json({
            message: "Course created successfully!",
            courseId: course._id.toString()
        });

    } catch (error) {
        res.status(403).json({
            message: "duplicated course"
        });
    }

})

adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
    const adminId = req.adminId;
    try {
        const courses = await courseModel.find({
            creatorId: adminId
        });
        res.status(200).json({
            message: "Courses fetched successfully!",
            courses,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching courses",
            error: error.message,
        });
    }
});

adminRouter.put("/course", adminMiddleware, async (req, res) => {
    const { courseId, ...updateData } = req.body;

    if (!courseId) {
        return res.status(400).json({
            message: "Course ID is required",
        });
    }

    try {
        const updatedCourse = await courseModel.findByIdAndUpdate(
            courseId,
            updateData,
            { new: true } // Return the updated document
        );

        if (!updatedCourse) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        res.status(200).json({
            message: "Course updated successfully!",
            course: updatedCourse,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating course",
            error: error.message,
        });
    }
});

adminRouter.delete("/course/:id", adminMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCourse = await courseModel.findByIdAndDelete(id);

        if (!deletedCourse) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        res.status(200).json({
            message: "Course deleted successfully!",
            deletedCourse,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting course",
            error: error.message,
        });
    }
});


module.exports = {
    adminRouter
}