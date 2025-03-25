const express = require('express');
const { userRouter } = require("./routes/userRouter");
const { courseRouter } = require("./routes/courseRouter");
const { adminRouter } = require("./routes/adminRouter");
const rateLimit = require('express-rate-limit');
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();
const port = 3000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 100 requests per windowMs
    message: {
        message: "Too many requests from this IP, please try again later."
    }
});

app.use(limiter);
app.use(express.json());
app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

async function main() {
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    })
}

main();