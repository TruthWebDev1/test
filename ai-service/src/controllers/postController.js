const { uploadFile } = require('../services/s3Service');

const createPost = async (req, res) => {
  const { content } = req.body;
  const mediaFiles = req.files; // Assuming multer is used for file uploads
  try {
    const media = [];
    if (mediaFiles) {
      for (const file of mediaFiles) {
        const result = await uploadFile(file, `posts/${Date.now()}-${file.originalname}`);
        media.push(result.Location);
      }
    }

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
