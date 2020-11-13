const { query } = require("express");
const db = require("../models");
const Orders = db.orders;
const product = db.product
const sortOrder = {
    asc: 1,
    desc: -1
}

exports.createOrderObject = async (request) => {
    try {
        const orderedProduct = await product.findById(request.product_id)
        if (orderedProduct.quantity > request.quantity) {
            const totalPrice = orderedProduct.price * request.quantity
            let discountedPrice = 0
            if (request.quantity >= 3) {
                discountedPrice = (20 * totalPrice) / 100
            }
            return {
                user: request.user_id,
                product: request.product_id,
                quantity: request.quantity,
                total_price: totalPrice,
                discounted_price: totalPrice - discountedPrice,
                available_quantity: orderedProduct.quantity - request.quantity
            }
        } else {
            throw {
                code: 400,
                message: `Only ${orderedProduct.quantity} items left`
            }
        }
    } catch (error) {
        console.log("Error occured while retrieve product", error)
        throw {
            code: error.code || 404,
            message: error.message || `Error retrieving product with id=${request.product_id}`
        }
    }
}

exports.createOrderUpdateObject = async (request, orderId) => {
    try {
        updateObj = {}
        const orderedProduct = await product.findById(request.product)
        const order = await Orders.findById(orderId)
        let availableQuantity = orderedProduct.quantity
        if (order.product == request.product) {
            availableQuantity = orderedProduct.quantity + order.quantity
        } else if (order.product != request.product) {
            updateObj["product"] = request.product
            updateObj["available_quantity"] = availableQuantity - request.quantity
            await product.findByIdAndUpdate(order.product, { $inc: { quantity: order.quantity } }, { useFindAndModify: false })
        }
        if (order.user != request.user) {
            updateObj["user"] = request.user
        }
        if (order.quantity != request.quantity) {
            updateObj["quantity"] = request.quantity
            if (availableQuantity > request.quantity) {
                const totalPrice = orderedProduct.price * request.quantity
                let discountedPrice = 0
                if (request.quantity >= 3) {
                    discountedPrice = (20 * totalPrice) / 100
                }
                quantityPrice = {
                    total_price: totalPrice,
                    discounted_price: totalPrice - discountedPrice,
                    available_quantity: availableQuantity - request.quantity
                }
                updateObj = { ...updateObj, ...quantityPrice }
            } else {
                throw {
                    code: 400,
                    message: `Only ${orderedProduct.quantity} items left`
                }
            }
        }
        return updateObj

    } catch (error) {
        console.log("Error occured while retrieve", error)
        throw {
            code: error.code || 404,
            message: error.message || `Error retrieving with id=${request.product_id}`
        }
    }
}

exports.getSortQuery = (sort) => {
    return {
        $sort: {
            [sort.field]: sortOrder[sort.order]
        }
    }
}

exports.getDateRangeQuery = (dateRange) => {
    return {
        $match: {
            updatedAt: {
                $gte: new Date(dateRange.from),
                $lte: new Date(dateRange.to)
            }
        }
    }
}

exports.getTextSearchQuery = (search_text) => {
    return {
        $match: {
            $or: [
                {
                    "product_info.name": { $regex: new RegExp(search_text), $options: "i" }
                },
                {
                    "user_info.first_name": { $regex: new RegExp(search_text), $options: "i" }
                },
                {
                    "user_info.last_name": { $regex: new RegExp(search_text), $options: "i" }
                }
            ]
        }
    }
}

exports.getQuery = (request) => {
    queryObj = [
        {
            $lookup: {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "product_info"
            }
        },
        { $unwind: "$product_info" },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user_info"
            }
        },
        { $unwind: "$user_info" }
    ]
    if (request.search_text) {
        queryObj.push(this.getTextSearchQuery(request.search_text))
    }

    if (request.sort) {
        queryObj.push(this.getSortQuery(request.sort))

    }

    if (request.date_range) {
        queryObj.push(this.getDateRangeQuery(request.date_range))

    }
    return queryObj
}