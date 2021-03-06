const express = require('express')
const router = express.Router()
const passportService = require('../services/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', { session: false })
const Authentication = require('../controllers/authentication')
const Chat = require('../controllers/chat')
const User = require('../controllers/user')

/* Testing Route */
router.get('/',  requireAuth, (req, res, next) => {
  res.status(201).send({ success: 'success' })
})

/* POST Step 1 of signin authentication */
router.post('/requestSaltAndChallenge', Authentication.requestSaltAndChallenge)

/* Post Step 2 of signin authentication */
router.post('/validateTag', Authentication.validateTag)

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
