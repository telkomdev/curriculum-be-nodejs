'use strict';

const express = require('express');

// Constants
const HOST = process.env.HOST;
const PORT = process.env.PORT;

const db = require('./app/models');
const dbConfig = require('./app/config/mongodb.config');

// DB
db.mongoose
  .connect(`${dbConfig.URI}/${dbConfig.DB}`, {
    authSource: 'admin',
    user: `${dbConfig.USER}`,
    pass: `${dbConfig.PASS}`,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successfully connect to MongoDB.');
  })
  .catch((err) => {
    console.error('Connection error', err);
    process.exit();
  });

// App
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('Hello Mongodb. Try GET/POST to /api/v1/item');
});

//routes
require('./app/routes/item.routes')(app);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);