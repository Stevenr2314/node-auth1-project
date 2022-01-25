const router = require('express').Router()
const { checkPasswordLength, checkUsernameExists, checkUsernameFree, checkPassword} = require('./auth-middleware')
const Users = require('../users/users-model')
const bcrypt = require('bcryptjs')

router.post('/register', checkPasswordLength, checkUsernameFree, (req, res, next) => {
  const credentials = req.body
  const hash = bcrypt.hashSync(credentials.password, 14)
  credentials.password = hash
  Users.add(credentials)
    .then(user => res.status(200).json(user))
    .catch(err => next(err))
})

router.post('/login', checkUsernameExists, checkPassword, (req,res,next) => {
  req.session.name = req.body.username
  res.status(200).json({message: `Welcome ${req.session.name}`})

})

router.get('/logout', (req,res,next) => {
  if(req.session){
    req.session.destroy(err => {
      if(err){
        next({message: "error loggin out"})
      } else {
        res.status(200).json({message: "logged out"})
      }
    })
  } else {
    res.status(200).json({message: "no session"})
  }
})

module.exports = router