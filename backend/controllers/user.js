const User = require('../models/user')

/*
* Gets a user by their email.
* 
* @param   {Object}   req
* @param   {Object}   res
* @return  {Function} next
*/
exports.getUserIdByEmail = (req, res, next) => {
  // Check if user is verified.
  if (req.user) {
    // Grab user's ID from user query in URL.
    const userEmail = req.query.email
    if (!userEmail) {
      // Send error if user did not provide query in URL.
      res.status(422).send({ error: 'userEmail must be provided' })
    } else {
      // Find user in User model based on their email.
      User.findOne({ email: userEmail }, (err, user) => {
        if (err) {
          // Send 500 status if there is an error.
          res.status(500).send({ error: err })
        } else if (user) {
          res.status(201).send(user._id)
        } else {
          res.status(422).send({ error: 'Unsuccessfully retrieved user' })
        }
      })
    }
  }
}

exports.getUserByEmail = (req, res, next) => {
  if (req.user) {
    const userEmail = req.query.email
    if (!userEmail) {
      res.status(422).send({ error: 'userEmail must be provided' })
    } else {
      User.findOne({ email: userEmail }, (err, user) => {
        if (err) {
          res.status(500).send({ error: err })
        } else if (user) {
          res.status(201).send({
            firstname: user.firstname,
            lastname: user.lastname,
            id: user._id
          })
        } else {
          res.status(422).send({ error: 'Unsuccessfully retrieved user' })
        }
      })
    }
  }
}

exports.getNameById = (req, res, next) => {
  if(req.user) {
    const userId = req.query.id
    if(!userId) {
      res.status(422).send({ error: 'ID must be provided' })
    } else {
      User.findById(userId, (err, user) => {
        if (err) {
          res.status(500).send({ error: err })
        } else if (user) {
          res.status(201).send({
            firstname: user.firstname,
            lastname: user.lastname
          })
        } else {
          res.status(422).send({ error: 'Unable to retrieve name' })
        }
      })
    }
  }
}