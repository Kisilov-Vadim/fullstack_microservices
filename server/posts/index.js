const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
const posts = {};

app.use(cors());
app.use(bodyParser.json());

app.get('/posts', (_, res) => res.send(posts));

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id, title
  };

  // Send event to event bus
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: {id, title},
  }).catch((err) => console.log(err.message));

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received Event:', req.body.type);

  res.send({ status: 'OK' });
});

app.listen(4000, () => {
  console.log('Listening on 4000');
});