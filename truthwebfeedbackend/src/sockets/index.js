const Post = require('../models/post');

const setupSocket = (io, redisClient) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Handle real-time updates (e.g., post deletion)
    socket.on('deletePost', async (postId) => {
      try {
        await Post.findByIdAndDelete(postId);
        await redisClient.del('posts:page:1:limit:10'); // Invalidate cache
        io.emit('postDeleted', postId); // Notify all clients
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });
  });
};

module.exports = { setupSocket };
