const express = require('express')
const {fetchCart, addToCart, deleteCart, updateCart, clearCart, addCartItemToWishlist} = require('../controllers/cartController')
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/addToCart',authMiddleware,addToCart)
.get('/fetchCart',authMiddleware,fetchCart)
.post('/deleteCart/:id',authMiddleware,deleteCart)
.put('/updateCart/:id',authMiddleware, updateCart)
.post('/clearCart',authMiddleware,clearCart)
.post('/addCartItemToWishlist/:itemId',authMiddleware,addCartItemToWishlist)

module.exports = router