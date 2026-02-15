const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const connectdb = require('./config/connectdb')
const userRoutes = require('../ecommerce/routes/userRoutes')
const productRoutes = require('../ecommerce/routes/productRoutes')
const wishlistRoutes = require('../ecommerce/routes/wishlistRoutes')
const authMiddleware = require('./middlewares/authMiddleware')
const cartRoutes = require('../ecommerce/routes/cartRoutes')
const adminMiddleware = require('../ecommerce/middlewares/adminMiddleware')
const orderRoutes = require('../ecommerce/routes/orderRoutes')






app.use(cors())
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/user',userRoutes)
app.use('/api/products',productRoutes)
app.use('/api/wishlist',authMiddleware,wishlistRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api/order',authMiddleware,orderRoutes)

connectdb(process.env.DATABASE_URL)


app.get('/', (req,res)=>{
    res.send("server is running")
    console.log("server is running")
})

const port = process.env.PORT
app.listen(port,()=>{
    console.log(`app is running on ${port}`)
})