const User = require('../models/user')

/*
* Gets a user by their ID.
* 
* @param   {Object}   req
* @param   {Object}   res
* @return  {Function} next
*/
export.getUserById = (req, res, next) => {
	// Check if user is verified.
	if (req.user) {
		// Grab user's ID from URL parameter.
		const userID = req.params.id
		if (!userID) 
			// Send error if user did not provide parameter.
			res.status(422).send({ error: 'userID must be provided' })

		else {
			// Find user in User model based on their ID.
			User.findById(userID, (err, user) => {
				if (err)
					// Send 500 status if there is an error.
					res.status(500).send({ error: err })

				else if (user) {
					res.status(201).json(user)
				}

				else
					res.status(422).send({ error: 'Unsuccessfully retrieved user' })
			})
		}
	}
}

/*
* Gets a user by their email.
* 
* @param   {Object}   req
* @param   {Object}   res
* @return  {Function} next
*/
export.getUserByEmail = (req, res, next) => {
	// Check if user is verified.
	if (req.user) {
		// Grab user's ID from user query in URL.
		const userEmail = req.query.email
		if (!userEmail)
			// Send error if user did not provide query in URL.
			res.status(422).send({ error: 'userEmail must be provided' })

		else {
			// Find user in User model based on their email.
			User.findBy({ email: userEmail }, (err, user) => {
				if (err)
					// Send 500 status if there is an error.
					res.status(500).send({ error: err })

				else if (user) {
					res.status(201).json(user)
				}

				else
					res.status(422).send({ error: 'Unsuccessfully retrieved user' })
			})
		}
	}
}