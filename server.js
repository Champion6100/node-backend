var express = require('express');
var session = require('express-session')
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');

// for parsing application/json
app.use(bodyParser.json());
app.use(cors());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({
    extended: true
}));


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
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db'
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


// Add a new user  
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



//login

const jwtKey = 'my_secret_key'
const jwtExpirySeconds = 300

const users = {
  champion: 'champion',
  user1: 'password1'
}
app.post('/api/login', (req, res) => {
    // Get credentials from JSON body
    const { full_name, pswd } = req.body
    if (!full_name || !pswd || users[full_name] !== pswd) {
      // return 401 error is username or password doesn't exist, or if password does
      // not match the password in our records
      return res.status(401).end()
    }
  
    // Create a new token with the username in the payload
    // and which expires 300 seconds after issue
    const token = jwt.sign({ full_name }, jwtKey, {
      algorithm: 'HS256',
      expiresIn: jwtExpirySeconds
    })
    console.log('token:', token)
    return res.send({ error: false,data: token });

   
  
    // set the cookie as the token string, with a similar max age as the token
    // here, the max age is in milliseconds, so we multiply by 1000
    
  });
  app.get('/api/home', (req, res) => {
    const { authorization } = req.headers;
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
      jwt.verify(authorization.split(' ')[1], jwtKey, (err) => {
        if (err) {
          console.log('jwt incorrect');
          throw err;
        } else {
          console.log('jwt correct');
          res.send('curUser');
        }
      });
    } else {
      console.log('no authorization');
      res.send('no');
    }
  }
    // We can obtain the session token from the requests cookies, which come with every request
//     var token = req.headers['x-access-token'];
  
//     // if the cookie is not set, return an unauthorized error
//     if (!token) {
//       return res.status(401).end()
//     }
  
//     var payload
//     try {
//       // Parse the JWT string and store the result in `payload`.
//       // Note that we are passing the key in this method as well. This method will throw an error
//       // if the token is invalid (if it has expired according to the expiry time we set on sign in),
//       // or if the signature does not match
//       payload = jwt.verify(token, jwtKey)
//     } catch (e) {
//       if (e instanceof jwt.JsonWebTokenError) {
//         // if the error thrown is because the JWT is unauthorized, return a 401 error
//         return res.status(401).end()
//       }
//       // otherwise, return a bad request error
//       return res.status(400).end()
//     }
  
//     // Finally, return the welcome message to the user, along with their
//     // username given in the token
//     return res.send(`Welcome ${payload.full_name}!`)
//   }
  )
/*
app.post('/login', function (request, response) {
    var full_name = request.body.full_name;
    var pswd = request.body.pswd;
    if (full_name && pswd) {
        connection.query('SELECT * FROM bdt WHERE full_name = ? AND pswd = ?', [full_name, pswd], function (error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.full_name = full_name;
                response.redirect('/');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});
app.post('/api/post', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message:'post',
                authData
            })
        }
    })
    res.json({
        message: 'welcome'
    })

})

app.post('/api/login',  (req, res) => {
   
    const user = {
        full_name: 'champion',
        pswd: 'champion'
    }

    jwt.sign({ user }, 'secretkey', {expiresIn: '30s'}, (err, token) => {
        res.token({
            token
        })
    });

});
//format of token
//authotization; bearer <access_token>

//verfytoken
function verifyToken(req, res, next) {
    //get auth header value
    const bearerHeader = req.headers['authorization']
    //check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        //split at the space
        const bearer = bearerHeader.split('');
        //get token from array
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        //next middleware

    } else {
        //forbidden
        res.sendStatus(403);

    }
}
*/
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
app.listen(3000, function () {
    console.log(' app is running on port 3000');
});

//module.exports = app;