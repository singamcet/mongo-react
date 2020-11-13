module.exports = app => {
  const product = require("../controllers/product.controller.js");

  var router = require("express").Router();

  // Create a new product
  router.post("/", product.create);

  // Retrieve all product
  router.get("/", product.findAll);

  // Retrieve all published product
  router.get("/published", product.findAllPublished);

  // Retrieve a single product with id
  router.get("/:id", product.findOne);

  // Update a product with id
  router.put("/:id", product.update);

  // Delete a product with id
  router.delete("/:id", product.delete);

  // Delete all
  router.delete("/", product.deleteAll);

  app.use("/api/product", router);
};
