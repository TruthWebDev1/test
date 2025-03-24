const Post = require('../models/post');
const Ad = require('../models/ad');
const redisClient = require('../config/redis');

const getPosts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const cacheKey = `posts:page:${page}:limit:${limit}`;

  try {
    // Check cache first
    const cachedPosts = await redisClient.get(cacheKey);
    if (cachedPosts) {
      return res.json(JSON.parse(cachedPosts));
    }

    // Fetch posts and ads from database
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('userId', 'username handle');

    const ads = await Ad.find().sort({ createdAt: -1 }).limit(1); // Fetch one ad per page
    const response = { posts, ad: ads[0] || null };

    // Cache response for 5 minutes
    await redisClient.setEx(cacheKey, 300, JSON.stringify(response));

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPost = async (req, res) => {
  const { content, media } = req.body;
  try {
    const post = new Post({ userId: req.user._id, content, media });
    await post.save();

    // Invalidate cache for recent posts
    await redisClient.del('posts:page:1:limit:10');

    // Notify connected clients via WebSocket
    const io = req.app.get('socketio');
    io.emit('newPost', post);

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getPosts, createPost };
