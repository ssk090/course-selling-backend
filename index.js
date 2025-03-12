const express = require('express');
const { userRouter } = require("./routes/userRouter");
const { courseRouter } = require("./routes/courseRouter");
const { adminRouter } = require("./routes/adminRouter");
const app = express();
const port = 3000;

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})