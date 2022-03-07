const express = require('express')
const router = express.Router();
const Story = require('../../models/Story')
const { ensureAuth } = require('../../middleware/auth');


// @desc: Show Add Stories Form 
// @route GET /add
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add', { user: req.user, action: '/stories', caption: 'Save' });
})

// @desc: Show Story using :id of story 
// @route GET /add
router.get('/show/:id', ensureAuth, async(req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate({ path: 'user', select: 'displayName' }).lean();
    console.log(req.user)
    res.render('stories/story', { story: story, user: req.user });
  } catch (err) {
    console.log(err)
    res.status(500).render('error/500');
  }

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

// @desc: Get Edit Stories Form 
// @route GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async(req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (req.user.id == story.user._id) {
      res.render('stories/add', {
        story: story,
        user: req.user,
        action: `/stories/${story._id}?_method=PUT`,
        caption: 'Edit',
        helper: require('../../helpers/helpers')
      });
    } else {
      res.redirect('/public');
    }
  } catch (err) {
    console.log(err)
    res.render('error/500', { user: req.user });
  }
})

// @desc: Update Story 
// @route PUT /stories/:id
router.put('/:id', ensureAuth, async(req, res) => {
    try {
      await Story.findByIdAndUpdate(req.params.id, req.body);
      res.redirect('/dashboard')
    } catch (err) {
      console.log(err)
      res.render('error/500', { user: req.user });
    }
  })
  // @desc: Delete Story
  // @route DELETE /stories/:id
router.delete('/:id', ensureAuth, async(req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id, req.body);
    res.redirect('/dashboard')
  } catch (err) {
    console.log(err)
    res.render('error/500', { user: req.user });
  }
})
module.exports = router;