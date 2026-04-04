const express = require('express');
const cors = require('cors');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/posts', postsRouter);
app.use('/api/posts/:postId/comments', commentsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'サーバーエラーが発生しました' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
