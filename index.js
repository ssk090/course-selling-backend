const express = require('express');
const { userRouter } = require("./routes/userRouter");
const { courseRouter } = require("./routes/courseRouter");
const { adminRouter } = require("./routes/adminRouter");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();
const port = 3000;

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