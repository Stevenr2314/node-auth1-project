const Users = require('../users/users-model')
const bcrypt = require('bcryptjs')
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  console.log(req.session.name)
  if(!req.session.name){
    next({status: 401, message: " You shall not pass!"})
  } else {
    next()
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
function checkUsernameFree(req, res, next) {
  let {username} = req.body
  Users.find()
    .then(users => {
      if(users.find(user => user.username === username)){
        next({status: 422, message: "Username taken"})
      } else {
        next()
      }
    })
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists(req, res, next) {
  let {username} = req.body
  Users.find()
    .then(users => {
      if(!users.find(user => user.username === username)){
        next({status: 401, message: "Invalid Credentials"})
      } else {
        next()
      }
    })
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  if (!req.body.password || req.body.password.length < 3){
    next({status: 422, message: "Password must be longer than 3 chars"})
  } else {
    next()
  }
}

function checkPassword(req, res, next) {
  let {password} = req.body
  Users.findBy({username: req.body.username})
    .then(users => {
      if(!bcrypt.compareSync(password, users[0].password)){
        next({status: 401, message: "Invalid credentials"})
      } else {
        next()
      }
    })
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
  checkPassword
}