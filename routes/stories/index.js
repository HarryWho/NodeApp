const express = require('express')
const router = express.Router();
const Story = require('../../models/Story')
const { ensureAuth } = require('../../middleware/auth');
const { route } = require('express/lib/application');
// @desc: Show Add Stories Form 
// @route GET /add
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add', { user: req.user });
})

// @desc: Show Story using :id of story 
// @route GET /add
router.get('/:id', ensureAuth, (req, res) => {

  res.render('stories/add', { user: req.user });
})

// @desc: Process add form 
// @route POST /
router.post('/', ensureAuth, async(req, res) => {
  try {
    req.body.user = req.user.id
    await Story.create(req.body)
    res.redirect('/dashboard')

  } catch (err) {
    console.log(err)
    res.render('error/500')
  }
})
module.exports = router;