const express = require('express');
const router = express.Router();
const passportService = require('../services/passport');
const passport = require('passport');

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

const Authentication = require('../controllers/authentication');
const Chat = require('../controllers/chat');

/* POST email and password to sign in. */
router.post('/signin', requireSignin, Authentication.signin);

/* POST email and password to sign up. */
router.post('/signup', Authentication.signup);

// TO-DO
router.get('/chat', requireAuth, Chat.getChat);

// TO-DO
router.put('/chat', requireAuth, Chat.putChat);

// TO-DO
router.post('/chat', requireAuth, Chat.postChat);

module.exports = router;
