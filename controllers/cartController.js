const cart = require('../models/cart')
const wishlist = require('../models/wishlist')

const fetchCart = async (req, res) => {
    const { id } = req.user
    try {
        const cartItems = await cart.find({ user: id }).populate('products')
        res.status(200).json({ message: "fetch cart sucessfully", cartItems })
    } catch (error) {
        res.status(400).json(error)
    }
}

const addToCart = async (req, res) => {
    const { id } = req.user
    const Cart = new cart({ ...req.body, user: id })
    try {
        const doc = await Cart.save()
        const result = await doc.populate('products')
        res.status(200).json({ message: "add to cart sucessfully", result })
    } catch (error) {
        res.status(400).json(error)
    }
}

const updateCart = async (req, res) => {
    const {id} = req.params
    const user = req.user.id

    try {
        const body = req.body
        const cartitem = await cart.findOne({_id:id,user:user})

        if (cartitem) {
            const doc = await cart.findByIdAndUpdate(id, body, { new: true })
            const result = await doc.populate('products')
            return res.status(200).json({ message: "updated cart sucessfully", result })
        } else {
            return res.status(404).json({ message: "cart item not found, update cart failed" })
        }

    } catch (error) {
        console.error(error)
        res.status(400).json({ message: "update cart failed", error})
    }
}

const deleteCart = async (req, res) => {
    const {id} = req.params
    const user = req.user.id

    try {
        const cartitem = await cart.findOne({ _id: id, user: user })
        if (!cartitem) {
            return res.status(404).json({ message: "cart item not found, delete cart failed" })
        }
        const doc = await cart.findByIdAndDelete(id)
        res.status(200).json("deleted cart sucessfully")
    } catch (error) {
        res.status(400).json({ message: "delete cart failed", error})
    }
}

const clearCart = async (req, res) => {
    const user = req.user.id
    try {
        const cartitems = await cart.find({user:user})
        if(!cartitems){
            return res.status(404).json({ message: "cart items not found, clear cart failed" })
        }

        if(cartitems.length === 0){
            return res.status(404).json({ message: "cart items not found, clear cart failed" })
        }

        const doc = await cart.deleteMany({user:user})
        res.status(200).json("clear cart sucessfully")
    } catch (error) {
        res.status(400).json({ message: "clear cart failed", error})
    }
}

const addCartItemToWishlist = async (req,res) =>{
    try {
        const {itemId} = req.params
        const user = req.user.id

        const cartItem = await cart.findOne({_id:itemId,user:user})

        if(!cartItem){
            return res.status(404).json({ message: "cart items not found,addCartItemToWishlist failed" })
        }

        const productId = cartItem.products

        const alreadyInWishlist = await wishlist.findOne({user:user,products:productId})

        if(!alreadyInWishlist){
            const itemAdded = await wishlist.create({user:user,products:productId})
            return res.status(200).json({message:"addCartItemToWishlist sucessfully",itemAdded})
        }

        res.status(201).json({message:"item already in wishlist",productId})
    } catch (error) {
        res.status(404).json({ message: "addCartItemToWishlist failed" })
    }
}

module.exports = {
    fetchCart,
    addToCart,
    deleteCart,
    updateCart,
    clearCart,
    addCartItemToWishlist
}