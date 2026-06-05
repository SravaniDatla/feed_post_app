const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch posts' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { content, imageUrl = '' } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const post = await Post.create({
      user: req.user.id,
      content,
      imageUrl,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Unable to create post' });
  }
});

router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({ user: req.user.id, text });
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Unable to add comment' });
  }
});

module.exports = router;
