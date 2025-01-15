'use strict';

const express = require('express');

// Constants
const HOST = '0.0.0.0';
const PORT = 8080;

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);