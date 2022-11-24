const jwt = require("jsonwebtoken");


let userAuth = async function(req, res, next) {      

    try {
        let token = req.headers["x-api-key"];

        if (!token) {
            return res.status(403).send({ status: false, message: "Missing authentication token in request" })
        };

        let decoded = await jwt.verify(token, "Dharam_Digital");

        // if (!decoded) {
        //     return res.status(400).send({ status: false, message: "token is invalid" })
        // }

        // req.userId = decoded.userId

        next();

    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
};




module.exports = { userAuth }