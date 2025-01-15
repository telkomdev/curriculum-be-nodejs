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
  })
  .catch((err) => {
    console.error('Connection error', err);
    process.exit();
  });

app.get('/', (req, res) => {
  res.json({ message: 'This is ticketing app, booking service.' });
});

//routes
require('./app/routes/booking.routes')(app);
const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server booking service is running on port ${PORT}.`);
});
