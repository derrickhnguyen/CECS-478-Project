const mongoose = require('mongoose')
const Schema = mongoose.Schema
const scrypt = require('scrypt')

// Define our model
const userSchema = new Schema({
  firstname : { type: String },
  lastname  : { type: String },
  email     : { type: String, unique: true, lowercase: true },
  password  : Buffer
})

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
  const user = this
  scrypt.kdf(user.password, {N: 1, r: 1, p: 1}, function(err, result) {
    if (err) return next(err)
    user.password = result
    next()
  })
})

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  const user = this
  scrypt.verifyKdf(user.password, new Buffer(candidatePassword), function(err, result) {
    if (err) return callback(err)
    callback(null, result)
  })
}

// Create the model class
const User = mongoose.model('user', userSchema)

// Export the model
module.exports = User