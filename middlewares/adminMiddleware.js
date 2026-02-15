const jwt = require('jsonwebtoken')
const userModel = require('../models/user')


const adminMiddleware = async (req,res,next) =>{
    let token
    const{authorization} = req.headers

    if(authorization && authorization.startsWith("Bearer")){
        try {
            token = authorization.split(' ')[1]
            const {userID} = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await userModel.findById(userID).select("-password")
            if(!req.user.isAdmin){
                return res.status(401).send({"status":"failed", "message":"No admin"})
            }
            return next()
        } catch (error) {
            console.log(error)
            return res.status(403).send({"status":"failed", "message":"Unauthorized User"})
        }
    } 

    if(!token){
        return res.status(404).send({"status":"failed", "message":"Unauthorized User No Token"})
    }
}

module.exports = adminMiddleware