const Wishlist = require('../models/wishlist')

const addToWishlist = async(req,res) =>{
    const {id} = req.user
    const wishlist = new Wishlist({...req.body, user:id})
    try {
        const doc = await wishlist.save()
        res.status(200).json({message:"add to wishlist sucessfully", doc})
    } catch (error) {
        res.status(400).json("add to wishlist failed")
    }
}

const deleteWishlist = async(req,res) =>{
    const {id} = req.params
    const user = req.user.id

    try {
        const item = await Wishlist.findOne({ _id: id, user: user })

    if(!item){
        return res.status(404).json({ message: "item not found, delete wishlist failed" })
    }

    const doc = await Wishlist.findByIdAndDelete(id)
    res.status(200).json({message:"delete wishlist sucessfully", doc})
    } catch (error) {
        res.status(400).json("delete wishlist failed")
    }
}

const fetchWishlist = async (req,res) =>{
    const user = req.user.id

    try {
        const items = await Wishlist.find({user:user})
        res.status(200).json({ message: "fetch wishlist sucessfully", items})
    } catch (error) {
        res.status(400).json(error)
    }
}

const clearWishlist = async (req, res) => {
    const user = req.user.id
    try {
        const items = await Wishlist.find({user:user})
        if(!items){
            return res.status(404).json({ message: "items not found, clear wishlist failed" })
        }

        const doc = await Wishlist.deleteMany({user:user})
        res.status(200).json("clear wishlist sucessfully")
    } catch (error) {
        res.status(400).json({ message: "clear wishlist failed", error})
    }
}

module.exports = {
    addToWishlist,
    deleteWishlist,
    fetchWishlist,
    clearWishlist
}