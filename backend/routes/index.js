const express = require('express')
const router = express.Router()
const passportService = require('../services/passport')
const passport = require('passport')

const requireSignin = passport.authenticate('local', { session: false })
const requireAuth = passport.authenticate('jwt', { session: false })

const Crypto = require('../crypto')

const Authentication = require('../controllers/authentication')
const Chat = require('../controllers/chat')
const User = require('../controllers/user')

/* Testing Route */
router.get('/',  requireAuth, (req, res, next) => {
  const encryptedObg = Crypto.encryptor("Good, good! Thanks, man!", 'backend/keys/public/public');
  res.status(201).send(encryptedObg);
})

/* POST email and password to sign in. */
router.post('/signin', requireSignin, Authentication.signin)

/* POST email and password to sign up. */
router.post('/signup', Authentication.signup)

/* GET chat between two users */
router.get('/chat/:otherUserID', requireAuth, Chat.getChat)

/* PUT new message into an existing chat */
router.put('/chat', requireAuth, Chat.putChat)

/* POST new chat into the database */
router.post('/chat', requireAuth, Chat.postChat)

/* GET user's ID by their email */
router.get('/userIdByEmail', requireAuth, User.getUserIdByEmail)

/* GET user by their email */
router.get('/userByEmail', requireAuth, User.getUserByEmail)

module.exports = router
