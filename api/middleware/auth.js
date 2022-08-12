const jwt = require("jsonwebtoken");
// const moment = require('moment')

const config = process.env;

const verifyToken = (req, res, next) => {
    // return next();
    try {

        let token = req.headers['authorization'] || req.headers["x-access-token"];
        if(token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }
        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
        const decoded = jwt.verify(token, 'secret');
        req.user = decoded;
        
    } catch (err) {
        console.log(err);
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;