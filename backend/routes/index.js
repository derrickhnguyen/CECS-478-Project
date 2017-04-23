const express = require('express')
const router = express.Router()
const passportService = require('../services/passport')
const passport = require('passport')

const crypto = require('../crypto')

const requireSignin = passport.authenticate('local', { session: false })
const requireAuth = passport.authenticate('jwt', { session: false })

const Authentication = require('../controllers/authentication')
const Chat = require('../controllers/chat')
const User = require('../controllers/user')

/* Testing Route */
router.get('/',  requireAuth, (req, res, next) => {
  crypto.encryptor("Hey I'm derrick", "backend/keys/private/private")
  res.status(201).send({ success: 'success' })
})

/* POST email and password to sign in. */
router.post('/signin', requireSignin, Authentication.signin)

/* POST email and password to sign up. */
router.post('/signup', Authentication.signup)

/* GET chat between two users */
router.get('/chat/:otherUserID', requireAuth, Chat.getChat)

/* GET all chat by one user */
router.get('/allChat', requireAuth, Chat.getAllChat)

/* PUT new message into an existing chat */
router.put('/chat', requireAuth, Chat.putChat)

/* POST new chat into the database */
router.post('/chat', requireAuth, Chat.postChat)

/* GET user's ID by their email */
router.get('/userIdByEmail', requireAuth, User.getUserIdByEmail)

/* GET user by their email */
router.get('/userByEmail', requireAuth, User.getUserByEmail)

/* Get user's name by their ID */
router.get('/userNameById', requireAuth, User.getNameById)

module.exports = router
