const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//const tasks = require('./routes/tasks')
const cors = require('cors');
const port = precess.env.PORT || 3000;
let mysql = require('mysql');
let jwt = require('jsonwebtoken');
let config = require('./config');
let middleware = require('./middleware');
// for parsing application/json
app.use(bodyParser.json());
app.use(cors());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({
    extended: true
}));

//app.use('/api',tasks);
//DB connection


// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});
app.get('/api', (req, res) => {
    res.json({
        message: 'welcome'
    })
});

// connection configurations
var dbConn = mysql.createConnection({
    host: 'sql7.freemysqlhosting.net',
    user: 'sql7309966',
    password: 'tt891eJYjD',
    database: 'sql7309966'
});

// connect to database
dbConn.connect();


// Retrieve all users 
app.get('/login', function (req, res) {
    dbConn.query('SELECT * FROM bdt', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'users list.' });
    });
});


// Retrieve user with id 
app.get('/user/:id', function (req, res) {
    let user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('SELECT * FROM dbt where id=?', user_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'users list.' });
    });

});


// Add a new user  //signup
app.post('/api/signup', function (req, res) {

    let full_name = req.body.full_name;
    let e_mail = req.body.e_mail;
    let pswd = req.body.pswd;

    if (!full_name) {
        return res.status(400).send({ error: true, message: 'Please provide user' });
    }
    //INSERT INTO table_name ( field1, field2,...fieldN )VALUES( value1, value2,...valueN );
    dbConn.query("INSERT INTO bdt SET ? ", { full_name: full_name, e_mail: e_mail, pswd: pswd }, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'success' });
    });
});

//login jwt

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
                message: 'Authentication failed! Please check the request'
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
let handlers = new HandlerGenerator();


//login
app.post('/api/login', handlers.login);


app.get('/api/home', middleware.checkToken, handlers.index);


//  Update user with id
app.put('/user', function (req, res) {

    let full_name = req.body.full_name;
    let e_mail = req.body.e_mail;
    let pswd = req.body.pswd;


    if (!full_name || !full_name) {
        return res.status(400).send({ error: user, message: 'Please provide user and user_id' });
    }

    dbConn.query("UPDATE dbt SET full_name = ? e_mail id = ? pswd id = ?", [full_name, e_mail, pswd], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
    });
});


//  Delete user
app.delete('/delete', function (req, res) {

    let user_id = req.body.user_id;

    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('DELETE FROM bdt WHERE id = ?', [user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been updated successfully.' });
    });
});

// set port
server.listen(PORT, () => {
    console.log(`Server running on ${PORT}/`);
  });
