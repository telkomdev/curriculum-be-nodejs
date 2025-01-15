const express = require('express');
const cors = require('cors');

const app = express();

var corsOptions = {
  origin: process.env.ORIGIN,
};
if (corsOptions.origin != '*') {
  corsOptions.origin = corsOptions.origin.split(' ');
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require('./app/models');
const dbConfig = require('./app/config/mongodb.config');

const Role = db.role;

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

app.get('/', (req, res) => {
  res.json({ message: 'This is ticketing user services.' });
});

//routes
require('./app/routes/user.routes')(app);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server user service is running on port ${PORT}.`);
});

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
