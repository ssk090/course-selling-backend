const express = require('express')
const { userRouter } = require("./routes/userRouter")
const { courseRouter } = require("./routes/courseRouter")
const app = express()
const port = 3000

app.use("/user", userRouter);
app.use("/course", courseRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})