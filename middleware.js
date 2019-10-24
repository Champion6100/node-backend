let jwt = require('jsonwebtoken');
const config = require('./config.js')

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];//express headers //Capture headers with names ‘x-access-token’ or ‘Authorization.’
    //The OR operator (||) returns true if one or both expressions are true, otherwise it returns false
    if (token.startsWith('Bearer')) { //If the header is in ‘Authorization: Bearer xxxx…’ format, strip unwanted prefix before token.
        //remove Bearer from string
        token = token.slice(7, token.length);//array.slice(start, end)
    }

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
    
};
module.exports = {
    checkToken: checkToken
}