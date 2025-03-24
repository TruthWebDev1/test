const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { getPosts, createPost } = require('../controllers/postController');
const router = express.Router();

router.get('/', getPosts);
router.post('/', authMiddleware, createPost);

module.exports = router;
