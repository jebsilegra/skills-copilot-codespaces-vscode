// Create web server

// Import modules
const express = require('express');
const router = express.Router();
const { Comment } = require('../models/comment');
const { User } = require('../models/user');
const { Post } = require('../models/post');
const { auth } = require('../middleware/auth');

//=================================
//             Comments
//=================================

// Get comments
router.get('/', (req, res) => {
  Comment.find()
    .populate('writer')
    .exec((err, comments) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, comments });
    });
});

// Get comment by id
router.get('/:id', (req, res) => {
  Comment.findById(req.params.id)
    .populate('writer')
    .exec((err, comment) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, comment });
    });
});

// Create comment
router.post('/', auth, (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, comment) => {
    if (err) return res.status(400).send(err);
    Comment.find({ _id: comment._id })
      .populate('writer')
      .exec((err, result) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, result });
      });
  });
});

// Update comment
router.put('/:id', auth, (req, res) => {
  Comment.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, comment) => {
    if (err) return res.status(400).send(err);
    Comment.find({ _id: comment._id })
      .populate('writer')
      .exec((err, result) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, result });
      });
  });
});

// Delete comment
router.delete('/:id', auth, (req, res) => {
  Comment.findByIdAndDelete(req.params.id, (err, comment) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, comment });
  });
});

module.exports = router;