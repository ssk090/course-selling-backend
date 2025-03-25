const { Router } = require('express');
const { z } = require('zod');
const bcrypt = require('bcrypt')
const { userModel } = require('../db');
const jwt = require("jsonwebtoken");
const { userMiddleware } = require('../middleware/user');

const userRouter = Router();

userRouter.post('/signup', async (req, res) => {
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
        await userModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });
        res.status(200).json({
            message: "Signed up successful"
        });
    } catch (error) {
        res.status(403).json({
            message: "duplicated email"
        });
    }
})
userRouter.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModel.findOne({
        email,
    })

    const passwordMatched = await bcrypt.compare(password, user.password)

    if (passwordMatched) {
        const token = jwt.sign({
            user: user._id.toString()
        }, process.env.JWT_USER_SECRET)

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect Creds"
        })
    }
})
userRouter.get('/purchases', userMiddleware, async (req, res) => {


    console.log("userId", req.userId)
})

module.exports = {
    userRouter
}
