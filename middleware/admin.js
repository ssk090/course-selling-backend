const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
    const token = req.headers.token

    const response = jwt.verify(token, process.env.JWT_ADMIN_PASSWORD)

    if (response) {
        req.adminId = response.id;
        next();
    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
}

module.exports = {
    adminMiddleware
}