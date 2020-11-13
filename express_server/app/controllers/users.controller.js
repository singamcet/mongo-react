const db = require("../models");
const Users = db.users;

// Create and Save a new users
exports.create = (req, res) => {
  // Validate request
  if (!req.body.first_name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // Create a users
  const users = new Users({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    address: req.body.address,
    email: req.body.email,
    password:req.body.password
  });
  // Save users in the database
  users
    .save(users)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the users."
      });
    });
};

// Retrieve all userss from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Users.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving userss."
      });
    });
};

// Find a single users with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Users.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found users with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving users with id=" + id });
    });
};

// Update a users by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Users.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update users with id=${id}. Maybe users was not found!`
        });
      } else res.send({ message: "users was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating users with id=" + id
      });
    });
};

// Delete a users with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Users.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete users with id=${id}. Maybe users was not found!`
        });
      } else {
        res.send({
          message: "users was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete users with id=" + id
      });
    });
};


