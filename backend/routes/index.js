const express = require('express');
const router = express.Router();
const Authentication = require('../controllers/authentication');
const Chat = require('../controllers/chat');
const passportService = require('../services/passport');
const passport = require('passport');

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

/* GET home page. */
router.get('/', requireAuth, function(req, res, next) {
  res.render('index', { title: 'Mining for Goldstein' });
});

/* POST email and password to sign in. */
router.post('/signin', requireSignin, Authentication.signin);

/* POST email and password to sign up. */
router.post('/signup', Authentication.signup);

// TO-DO
router.get('/chat', requireAuth, Chat.getChat);

// TO-DO
router.post('/chat', requireAuth, Chat.postChat);

module.exports = router;
