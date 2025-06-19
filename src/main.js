require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const { generic } = require('./middlewares');
const { tagRoute, userRoute, postRoute, postImageRoute, commentRoute, followerRoute } = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use(generic.logRequest);

app.use('/tag', tagRoute);
app.use('/user', userRoute);
app.use('/post', postRoute);
app.use('/postImage', postImageRoute);
app.use('/comment', commentRoute);
app.use('/follower', followerRoute);

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(PORT, () => {
      console.log(`La app arranco en el puerto ${PORT}.`);
    });
  })
  .catch(err => {
    console.error('Error de conexión a MongoDB:', err);
  });