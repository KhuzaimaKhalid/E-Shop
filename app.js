const express = require('express')
const app = express()

app.use(express.json())





app.get('/', (req,res)=>{
    res.send("server is running")
    console.log("server is running")
})

const port = 3000
app.listen(port,()=>{
    console.log(`app is running on ${port}`)
})