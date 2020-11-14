const { orders } = require("../models");
const db = require("../models");
const Orders = db.orders;
const product = db.product
const orderService = require("../services/orders.services")
const PAGE_SIZE = 5
// Create and Save a new users
exports.create = async (req, res) => {
    if (!req.body.quantity) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    try {
        let orderObj = await orderService.createOrderObject(req.body)
        const order = new Orders(orderObj);
        data = await order.save()
        await product.findByIdAndUpdate(req.body.product_id, { quantity: orderObj.available_quantity }, { useFindAndModify: false })
        res.send(data)
    } catch (error) {
        res
            .status(error.code || 500)
            .send({ message: error });
    }

};

// Update a orders by the id in the request
exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;
    try {
        let orderObj = await orderService.createOrderUpdateObject(req.body, id)
        let data = await orders.findByIdAndUpdate(id, orderObj, { useFindAndModify: false })
        if (!data) {
            res.status(404).send({
                message: `Cannot update orders with id=${id}. Maybe orders was not found!`
            });
        }
        if (orderObj.available_quantity)
            await product.findByIdAndUpdate(req.body.product, { quantity: orderObj.available_quantity }, { useFindAndModify: false })
        res.send({ message: "order was updated successfully." });
    } catch (error) {
        res
            .status(error.code || 500)
            .send({ message: error });
    }
};

// Retrieve all userss from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Orders.find(condition)
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

exports.search = (req, res) => {
    const sort = req.body.sort;
    const date_range = req.body.date_range;
    let condition = {}
    page = req.body.page
    condition = orderService.getQuery(req.body)
    Orders.aggregate(condition)
        .skip(page*PAGE_SIZE).limit(PAGE_SIZE)
        .then(data => {
            Orders.aggregate(condition).then(result=>{
                res.send({
                    result : data,
                    totalPages:  result.length
                });
            })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving userss."
            });
        })
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Orders.findByIdAndRemove(id, { useFindAndModify: false })
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

// Find a single product with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Orders.findById(id)
        .populate('user product')
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found order with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving order with id=" + id });
        });
};


