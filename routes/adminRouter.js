const { Router } = require('express')

const adminRouter = Router();

adminRouter.post("/login", (req, res) => { })

adminRouter.post("/signup", (req, res) => { })

adminRouter.post("/course", (req, res) => { })

adminRouter.get("/course/bulk", (req, res) => { })

adminRouter.put("/course/:id", (req, res) => { })

adminRouter.delete("/course/:id", (req, res) => { })


module.exports = {
    adminRouter
}