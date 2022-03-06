const express = require('express')
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../../middleware/auth')
const Story = require('../../models/Story')


// @desc: Login/Landing page
// @route GET /
router.get('/', (req, res) => {
  res.render("home/home", { user: req.user })
})

// @desc: dashboard page
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async(req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean()
    res.render("home/dashboard", {
      user: req.user,
      stories: stories
    })
  } catch (err) {
    console.log(err)
    res.render('error/500')
  }
})

// @desc: login page
// @route GET /login
router.get('/login', ensureGuest, (req, res) => {

  res.render("home/login", { layout: 'layouts/login' })
})
module.exports = router;