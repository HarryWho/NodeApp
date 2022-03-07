const express = require('express')
const router = express.Router();
const Story = require('../../models/Story')
const Comment = require('../../models/Comment')
const { ensureAuth } = require('../../middleware/auth');




// @desc: Show Stories By Author ID 
// @route GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async(req, res) => {
    try {
      const stories = await Story.find({ user: req.params.userId, status: 'public' })
        .populate({ path: 'user' })
        .sort({ createdAt: 'desc' }).lean()

      res.render('stories/stories', {
        user: req.user,
        caption: `By ${stories[0].user.displayName}`,
        stories: stories
          //helper: require('../../helpers/helpers')
      });
    } catch (err) {
      console.log(err)
      res.render('error/500')
    }

  })
  // @desc: Show Story using :id of story 
  // @route GET /add
router.get('/show/:storyId', ensureAuth, async(req, res) => {
  try {
    const story = await Story.findById(req.params.storyId)
      .populate('user')
    const comments = await Comment.find({ story: req.params.storyId })
      .populate({ path: 'author', select: ['displayName', 'image'] })
      // .populate([{
      //   path: 'author',
      //   model: 'User'
      // }, {
      //   path: 'story',
      //   model: 'Story'
      // }])
    console.log(comments.comment)

    res.render('stories/story', {
      story: story,
      comments: comments,
      user: req.user
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('error/500');
  }

  //res.render('stories/add', { user: req.user });
})

// @desc: Show Add Stories Form 
// @route GET /add
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add', {
    user: req.user,
    action: '/stories',
    caption: 'Save',
    story: new Story()
      //helper: require('../../helpers/helpers')
  });
})

// @desc: Process add form 
// @route POST /
router.post('/', ensureAuth, async(req, res) => {
  try {
    req.body.user = req.user.id

    let story = await Story.create(req.body)
    console.log(story.user._id)
    await Comment.create({ story: story._id, author: story.user._id })
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
        caption: 'Edit'
          //helper: require('../../helpers/helpers')
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

// @desc: Add Comments to Story
// @route POST /stories/comment
router.post('/comment', ensureAuth, async(req, res) => {
  console.log(`storyId: ${req.body.story}, authorId: ${req.body.author}`)
  try {
    const comment = await new Comment({
      comment: req.body.comment,
      story: req.body.storyId,
      author: req.body.authorId
    });
    comment.save()
    res.redirect(`/stories/show/${req.body.storyId}`);
  } catch (err) {
    console.log(err)
    res.render('error/500', { user: req.user });
  }
})
module.exports = router;