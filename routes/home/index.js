const express = require('express')
const router = express.Router();

// @desc: Login/Landing page
// @route GET /
router.get('/', (req, res) => {
  res.render("home/home")
})

// @desc: dashboard page
// @route GET /dashboard
router.get('/dashboard', (req, res) => {
  res.render("home/dashboard")
})

// @desc: login page
// @route GET /login
router.get('/login', (req, res) => {
  res.render("home/login", { layout: 'layouts/login' })
})
module.exports = router;