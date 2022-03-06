const express = require('express')
const router = express.Router();
const passport = require('passport')

// @desc: Auth with Google
// @route GET /auth/google
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}))

// @desc: Google Auth callback
// @route GET /auth/googe/callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}), (req, res) => {
  res.redirect('/dashboard');
})

// @desc: logout user
// @route GET /auth/logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/');
})


module.exports = router;