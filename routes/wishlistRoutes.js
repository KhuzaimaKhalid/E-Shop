const express = require('express')
const { addToWishlist, deleteWishlist, fetchWishlist, clearWishlist } = require('../controllers/wishlistController')
const router = express.Router()

router.post('/addToWishlist', addToWishlist)
    .post('/deleteWishlist/:id', deleteWishlist)
    .get('/fetchWishlist', fetchWishlist)
    .post('/clearWishlist', clearWishlist)

module.exports = router