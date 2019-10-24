let jwt = require('jsonwebtoken');
const config = require('./config.js')

class HandlerGenerator {
    login(req, res) {
        let full_name = req.body.full_name;
        let pswd = req.body.pswd;
        // For the given username fetch user from DB
        let mockedUsername = 'champion';
        let mockedPassword = 'champion';

        if (full_name && pswd) {
            if (full_name === mockedUsername && pswd === mockedPassword) {
                let token = jwt.sign({ full_name: full_name },
                    config.secret,
                    {
                        expiresIn: '24h' //expires in 24 hours
                    }
                );
                //return the jwt token for the future API calls
                res.json({
                    success: true,
                    message: 'Authentication successful!',
                    token: token
                });
            } else {
                res.send(403).json({
                    success: false,
                    message: 'Incorrect username or password'
                });
            }
        } else {
            res.send(400).json({
                success: false,
                message: 'Authenticaation failed! Please check the request'
            });
        }
    }
    index (req, res) {
        res.json({
            success:true,
            message: 'Index page'
        });
    }
}

module.exports = {
    HandlerGenerator: HandlerGenerator
}