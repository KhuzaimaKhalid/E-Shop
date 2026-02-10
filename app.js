const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const connectdb = require('./config/connectdb')
const userRoutes = require('../ecommerce/routes/userRoutes')








app.use(cors())
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

app.use('/api/user',userRoutes)

connectdb(process.env.DATABASE_URL)


app.get('/', (req,res)=>{
    res.send("server is running")
    console.log("server is running")
})

const port = process.env.PORT
app.listen(port,()=>{
    console.log(`app is running on ${port}`)
})