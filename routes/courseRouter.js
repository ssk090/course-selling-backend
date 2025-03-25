const { Router } = require('express')
const { courseModel, purchaseModel } = require("../db")
const { userMiddleware } = require("../middleware/user")

const courseRouter = Router();

courseRouter.post('/purchase', userMiddleware, async (req, res) => {
    const courseId = req.body.courseId;
    const userId = req.userId;

    try {
        // Check if the course exists
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        // Check if the user has already purchased the course
        const existingPurchase = await purchaseModel.findOne({ userId, courseId });
        if (existingPurchase) {
            return res.status(400).json({
                message: "Course already purchased",
            });
        }

        // Create the purchase
        const purchase = await purchaseModel.create({
            userId,
            courseId,
        });

        res.status(201).json({
            message: "Course purchased successfully!",
            purchase,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error processing purchase",
            error: error.message,
        });
    }
});

courseRouter.get('/preview', async (req, res) => {
    try {
        const courses = await courseModel.find({})

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
})

module.exports = {
    courseRouter
}