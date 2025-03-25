const jwt = require("jsonwebtoken");

const userMiddleware = (req, res, next) => {
    const token = req.headers.token

    const response = jwt.verify(token, process.env.JWT_USER_SECRET)

    if (response) {
        req.userId = response.user;
        next();
    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
}

module.exports = {
    userMiddleware
}