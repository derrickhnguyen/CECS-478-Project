const express = require('express');
const router = express.Router();
const capsulator = require('../crypto');
const Authentication = require('../controllers/authentication');
const passportService = require('../services/passport');
const passport = require('passport');

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

/* GET home page. */
router.get('/', requireAuth, function(req, res, next) {
  res.render('index', { title: 'Mining for Goldstein' });
});

router.post('/signin', requireSignin, Authentication.signin);
router.post('/signup', Authentication.signup);

module.exports = router;
