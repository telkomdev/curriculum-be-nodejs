'use strict';

const express = require('express');

// Constants
const HOST = process.env.HOST;
const PORT = process.env.PORT;

// App
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('Hello Route. Try GET/POST to /api/v1/item');
});

//routes
require('./app/routes/item.routes')(app);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);