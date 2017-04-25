const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

// Define our model
const userSchema = new Schema({
  firstname : { type: String },
  lastname  : { type: String },
  email     : { type: String, unique: true, lowercase: true },
  password  : String,
  salt      : String
})

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
  const user = this

  // Generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err)

    // Overwrite initial salt value
    user.salt = salt
    
    // Hash (encrypt) password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err)

      // Overwrite plain text password with hashed password
      user.password = hash
      next()
    })
  })
})

// Create the model class
const User = mongoose.model('user', userSchema)

// Export the model
module.exports = User