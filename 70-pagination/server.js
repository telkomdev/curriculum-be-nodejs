'use strict';

const express = require('express');
const fileUpload = require('express-fileupload');

// Constants
const HOST = process.env.HOST;
const PORT = process.env.PORT;

const db = require('./app/models');
const dbConfig = require('./app/config/mongodb.config');
const Role = db.role;

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
    initial();
  })
  .catch((err) => {
    console.error('Connection error', err);
    process.exit();
  });

// App
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.get('/', (req, res) => {
  res.send('Hello, now we add pagination feature in our application');
});

//routes
require('./app/routes/item.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/route.routes')(app);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user',
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }
        console.log("added 'user' to roles collection");
      });
      new Role({
        name: 'admin',
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}
