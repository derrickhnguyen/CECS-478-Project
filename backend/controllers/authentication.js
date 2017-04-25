const jwt = require('jwt-simple')
const User = require('../models/user')
const config = require('../config')
const CryptoJS = require("crypto-js")

function tokenForUser(user) {
  const timestamp = new Date().getTime()
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin1 = (req, res, next) => {
  res.status(201).send(req.user)
}

exports.signin2 = (req, res, next) => {
  const { email, challenge, tag } = req.body
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      return next(err)
    }

    if(!user) {
      return res.status(422).send({ error: 'Could not find user' })
    }

    const password = user.password;
    const newTag = CryptoJS.HmacSHA256(challenge, password).toString()
    if(newTag === tag) {
      res.status(201).send({
        token: tokenForUser(user),
        firstname: user.firstname,
        lastname: user.lastname,
        id: user._id
      })
    } else {
      res.status(422).send({ error: 'Tags do not match' })
    }
  })
}

exports.signup = (req, res, next) => {
  // Get values from the request body.
  const firstname = req.body.firstname
  const lastname = req.body.lastname
  const email = req.body.email
  const password = req.body.password

  // Validate that both email and password are present.
  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' })
  }

  // See if a user with the given email exists.
  User.findOne({ email: email }, (err, existingUser) => {
    if (err) {
      return next(err)
    }

    // If a user with email does exist, return an error.
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' })
    }

    // If a user with email does NOT exist, create and save user record.
    const user = new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password
    })

    user.save((err) => {
      if (err) {
        return next(err)
      }

      // Respond to request indicating the user was created.
      res.send({
        token: tokenForUser(user),
        firstname: user.firstname,
        lastname: user.lastname,
        id: user._id
      })
    })
  })
}