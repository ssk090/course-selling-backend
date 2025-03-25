const { Router } = require('express')
const { adminModel } = require("../db")
const { z } = require('zod')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')

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

adminRouter.post("/course", (req, res) => { })

adminRouter.get("/course/bulk", (req, res) => { })

adminRouter.put("/course", (req, res) => { })

adminRouter.delete("/course/:id", (req, res) => { })


module.exports = {
    adminRouter
}