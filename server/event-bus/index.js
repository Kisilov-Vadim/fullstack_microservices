const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const events = [];
const app = express();

app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  const event = req.body;

  events.push(event);

  await axios.post('http://posts-srv:4000/events', event).catch((err) => console.log(err.message));
  await axios.post('http://comments-srv:4001/events', event).catch((err) => console.log(err.message));
  await axios.post('http://query-srv:4002/events', event).catch((err) => console.log(err.message));
  await axios.post('http://moderation-srv:4003/events', event).catch((err) => console.log(err.message));

  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('Event bus listening on 4005');
});