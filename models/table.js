const Sequelize = require("sequelize");
const db = require('../database/db')
const User = db.sequelize.define("bdts", {

  full_name: {
    type: Sequelize.STRING
  },
  e_mail: {
    type: Sequelize.STRING
  },
  pswd: {
    type: Sequelize.STRING
  }
},
  {
    //don't add timestap attributes(updateAt, createdAt)
    timestamps: false

  }
)
//synchronizing the model with the database
User.sync().then(() => {
  User.create({
    full_name: 'Neuquen',
    e_mail:'asdf@hotmail.com',
    pswd:'qwerttsdf'
   
  });
  User.create({
    full_name: 'General Roca',
    e_mail:'asdzf@hotmail.com',
    pswd:'qwezxcrttsdf'
   
  });
});
module.exports = User