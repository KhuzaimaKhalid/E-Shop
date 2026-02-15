const express = require('express')
const adminMiddleware = require('../middlewares/adminMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')
const {createOrder, getOrder, getSpecificOrder, cancelOrder, tracker, fetchOrder, fetchOrderById, updateOrderStatus, updateOrder, deleteOrder} = require('../controllers/orderController')
const router = express.Router()

router.post('/createOrder',authMiddleware,createOrder)
.get('/getOrder',authMiddleware,getOrder)
.get('/getSpecificOrder/:id',authMiddleware,getSpecificOrder)
.post('/cancelOrder/:id',authMiddleware,cancelOrder)
.post('/tracker/:id',authMiddleware,tracker)
.get('/fetchOrder',adminMiddleware,fetchOrder)
.get('/fetchOrderById/:id',adminMiddleware,fetchOrderById)
.put('/updateOrderStatus/:id',adminMiddleware,updateOrderStatus)
.put('/updateOrder/:id',adminMiddleware,updateOrder)
.post('/deleteOrder/:id',adminMiddleware,deleteOrder)

module.exports = router