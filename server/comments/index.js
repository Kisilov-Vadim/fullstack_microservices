const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
const commentsByPostId = {};

app.use(cors());
app.use(bodyParser.json());

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content });
  commentsByPostId[req.params.id] = comments;

  axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      content,
      id: commentId,
      postId: req.params.id,
    },
  }).catch((err) => console.log(err.message));

  res.status(201).send(comments);
});

app.post('/events', (req, res) => {
  console.log('Received Event:', req.body.type);

  res.send({ status: 'OK' });
});

app.listen(4001, () => console.log('Listening on 4001'));