const db = require('../models');
const Route = db.route;
const fs = require('fs');
const { parse } = require('csv-parse');
const { helper } = require('../helper');

exports.create = (req, res) => {
  if (
    !req.body.from |
    !req.body.to |
    !req.body.price |
    !req.body.departureTime
  ) {
    res.status(400).send({
      message: 'Field from, to, price, departureTime cannot be empty',
    });
    return;
  }
  const route = new Route({
    from: req.body.from,
    to: req.body.to,
    price: req.body.price,
    departureTime: req.body.departureTime,
  });

  route
    .save(route)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the route.',
      });
    });
};

async function saveRoute(route) {
  console.log('Route from :', route.from);
  try {
    await Route.updateOne(
      {
        from: route.from,
        to: route.to,
        price: route.price,
        departureTime: route.departureTime,
      },
      {
        from: route.from,
        to: route.to,
        price: route.price,
        departureTime: route.departureTime,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
}

exports.import = (req, res) => {
  if (!req.files) {
    return res.status(400).send({ message: 'No files were uploaded' });
  }
  const file = req.files.routeFile;
  const path = process.env.FILE_PATH + '/' + file.name;
  file.mv(path, (err) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
  });
  Route.deleteMany({});
  fs.createReadStream(path)
    .pipe(
      parse({
        comment: '#',
        columns: true,
      })
    )
    .on('data', async (data) => {
      console.log('Route data:', data);
      saveRoute(data);
    })
    .on('error', (err) => {
      reject(err);
      return res.status(500).send({ message: err.message });
    })
    .on('end', async () => {
      res.status(200).send({ message: 'Route data has successfully imported' });
    });
};

exports.findAll = (req, res) => {
  const { from, to, page, size } = req.query;
  let condition = {};
  let ret = {};
  if (req.query.from) {
    condition.from = { $regex: new RegExp(from), $options: 'i' };
  }
  if (req.query.to) {
    condition.to = { $regex: new RegExp(to), $options: 'i' };
  }
  if (req.query.departureTime) {
    condition.departureTime = {
      $reges: new RegExp(departureTime),
      $options: 'i',
    };
  }

  const { limit, offset } = helper.getPagination(page - 1, size);

  Route.paginate(condition, { offset, limit })
    .then((data) => {
      ret.status = 1;
      ret.count = data.totalDocs;
      ret.totalPages = data.totalPages;
      ret.currentPage = data.page;
      ret.routes = data.docs;
      res.send(ret);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving routes.',
      });
    });
};

//Find single ticket by id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Route.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: 'Not found route with id ' + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: 'Error retrieving route with id =' + id });
    });
};

//Update a ticket by the id
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update cannot be empty!',
    });
  }
  const id = req.params.id;
  Route.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update route with id=${id}. Maybe route was not found!`,
        });
      } else res.send({ message: 'Route was updated successfully.' });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating route with id=' + id,
      });
    });
};
