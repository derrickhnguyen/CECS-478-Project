const jwt = require('jwt-simple')
const User = require('../models/user')
const config = require('../config')

function tokenForUser(user) {
  const timestamp = new Date().getTime()
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = (req, res, next) => {
  // User has already had their email and password auth'd
  // We just need to give them a token.
  res.send({ token: tokenForUser(req.user) })
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
      res.json({ token: tokenForUser(user) })
    })
  })
}