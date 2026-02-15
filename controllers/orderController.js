const orderModel = require('../models/order')
const productModel = require('../models/products')
const userModel = require('../models/user')
const transporter = require('../config/emailConfig')
const mongoose = require('mongoose')

const createOrder = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const orderData = req.body
        let totalAmount = 0
        let totalItems = 0
        let updatedProducts = []

        for (const item of orderData.items) {
            const product = await productModel.findOneAndUpdate(
                {
                    _id: item.product.id,
                    stock: { $gte: item.quantity }
                },
                {
                    $inc: { stock: -item.quantity }
                },
                {
                    new: true,
                    session
                }
            );

            if (!product) {
                const existingProduct = await productModel.findById(item.product.id)

                if (!existingProduct) {
                    throw new Error(`Product ${item.product.id} not found`)
                }

                throw new Error(`Insufficient stock for ${existingProduct.name} . Available: ${existingProduct.stock}, Requested: ${item.quantity}`);
            }

            totalAmount += product.price * item.quantity
            totalItems += item.quantity
            updatedProducts.push(product)
        }

        const order = new orderModel({
            ...orderData,
            totalAmount,
            totalItems
        })

        const doc = await order.save({ session })

        await session.commitTransaction()

        setImmediate(async () => {
            try {
                const user = await userModel.findById(order.user)

                if (user && user.email) {
                    const invoiceHTML = generateInvoiceHTML(order)

                    await transporter.sendMail({
                        to: user.email,
                        html: invoiceHTML,
                        subject: "Order Recieved"
                    })

                    console.log(`order confirmation email sent to ${user.email}`)
                }
            } catch (error) {
                console.error("Failed to send order confirmation email: ", error)
            }
        })

        res.status(200).json({ message: "order created sucessfully", doc })
    } catch (error) {
        await session.abortTransaction()

        console.error("Order Creation Failed: ", error)

        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message })
        }

        if (error.message.includes("Insufficient stock")) {
            return res.status(400).json({ message: error.message })
        }

        res.status(500).json({
            message: "Failed to create order",
            error
        })
    } finally {
        session.endSession()
    }
}

const getOrder = async (req, res) => {
    try {
        const user = req.user.id
        const order = await orderModel.find({ user: user })

        res.status(200).json({ message: "get orders sucessfullly", order })
    } catch (error) {
        res.status(400).json(error)
    }
}

const getSpecificOrder = async (req, res) => {
    try {
        const id = req.params.id
        const order = await orderModel.findById(id)

        if (!order) {
            return res.status(404).json({ message: "order not found" })
        }

        res.status(200).json({ message: "get orders sucessfullly", order })
    } catch (error) {
        res.status(400).json(error)
    }
}

const cancelOrder = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const user = req.user.id
        const orderId = req.params.id

        const order = await orderModel.findOne({ _id: orderId, user: user }).session(session)
        if (!order) {
            await session.abortTransaction()
            return res.status(404).json({ message: "order not found" })
        }

        if (order.Status === "Shipped" || order.Status === "Delievered") {
            await session.abortTransaction()
            return res.status(400).json({ message: "can not cancel order that has been sucessfully shipped or delievered" })
        }

        for (const item of order.items) {
            await productModel.findByIdAndUpdate(
                item.product.id,
                { $inc: { stock: item.quantity } },
                { session }
            )
        }

        const cancel = await orderModel.findByIdAndDelete(orderId).session(session)

        await session.commitTransaction()

        res.status(200).json({ message: "cancels orders sucessfullly", cancel })

    } catch (error) {
        await session.abortTransaction()

        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid order id format" })
        }

        res.status(500).json({ message: "Failed to cancel order ", error })
    } finally {
        session.endSession()
    }
}

const tracker = async (req, res) => {
    try {
        const user = req.user.id
        const orderId = req.params.id

        const order = await orderModel.findOne({ _id: orderId, user: user })

        if (order.Status === "Delievered") {
            return res.status(202).json({ message: "Order delievered sucessfully", order })
        }

        res.status(200).json({
            message: "Order Shipped sucessfully, will be delievered soon", order: {
                id: order._id,
                status: order.Status,
                currentLocation: order.currentLocation,
                items: order.items,
                totalAmount: order.totalAmount
            }
        })

    } catch (error) {
        res.status(400).json(error)
    }
}


// ---------------------------------------------- ADMIN ROUTES ---------------------------------------------------------------------------------------


const fetchOrder = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 50
        const skip = (page - 1) * limit

        const order = await orderModel.find({}).skip(skip).limit(limit).sort({ createdAt: -1 })

        const totalOrders = await orderModel.countDocuments()


        res.status(200).json({
            message: "Orders fetched sucessfully", order, pagination: {
                page,
                limit,
                totalOrders,
                totalPages: Math.ceil(totalOrders / limit)
            }
        })
    } catch (error) {
        res.status(400).json(error)
    }
}

const fetchOrderById = async (req, res) => {
    try {
        const id = req.params.id
        const order = await orderModel.findOne({ _id: id })

        if (!order) {
            return res.status(404).json({ message: "order not found" })
        }

        res.status(200).json({ message: "fetched order sucessfullly", order })
    } catch (error) {
        res.status(400).json(error)
    }
}

const updateOrderStatus = async(req,res) =>{
    try {
        const id = req.params.id
        const {status} = req.body

        if(!status){
            return res.status(400).json({ message: "status not found" })
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(id,{status},{new:true,runValidators:true})

        if (!updatedOrder) {
            return res.status(404).json({ message: "order not found" })
        }

        res.status(200).json({ message: "updated order sucessfullly", updatedOrder })
    } catch (error) {
        res.status(400).json(error)
    }
}

const updateOrder = async(req,res) =>{
    try {
        const id = req.params.id

        const allowedUpdates = ['Status', 'selectedAddress', 'currentLocation','paymentStatus'];
        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const updatedOrder = await orderModel.findByIdAndUpdate(id,updates,{new:true,runValidators:true})

        if (!updatedOrder) {
            return res.status(404).json({ message: "order not found" })
        }

        res.status(200).json({ message: "updated order sucessfullly", updatedOrder })
    } catch (error) {
        console.error(error)
        res.status(400).json(error)
    }
}

const deleteOrder = async(req,res) =>{
    try {
        const id = req.params.id
        const order = await orderModel.findById(id)

        if(!order){
            return res.status(404).json({ message: "order not found" })
        }

        const deleteOrder = await orderModel.findByIdAndDelete(id)

        res.status(200).json({ message: "deleted order sucessfullly", deleteOrder })
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports = {
    createOrder,
    getOrder,
    getSpecificOrder,
    cancelOrder,
    tracker,
    fetchOrder,
    fetchOrderById,
    updateOrderStatus,
    updateOrder,
    deleteOrder
}