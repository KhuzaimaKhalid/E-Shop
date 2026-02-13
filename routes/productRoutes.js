const express = require('express')

const { createProducts, fetchProducts, updateProducts, deleteProducts, searchProducts } = require('../controllers/productsController')

const router = express.Router()

router.post('/createProducts', createProducts)
    .get('/fetchProducts/slug/:slug', fetchProducts)
    .put('/updateProducts/:id', updateProducts)
    .post('/deleteProducts/:id', deleteProducts)
    .get('/search', searchProducts)

module.exports = router