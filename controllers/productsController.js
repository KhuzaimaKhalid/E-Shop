const Product = require('../models/products')
const sanitizedObject = require('../middlewares/sanitizedObject')


const createProducts = async(req,res) =>{
    const product = new Product(req.body)

    try {
        const products = await product.save()
        res.status(200).json({message:"product created sucessfully", product:product})
    } catch (error) {
       res.status(400).json(`product created failed`)
    }
}

const fetchProducts = async (req,res) => {
    const slug = req.params.slug

    try {
        const products = await Product.findOne({slug:slug})
        res.status(200).json({message:"fetched product sucessfully", products:products})
    } catch (error) {
        res.status(400).json(`fetch products failed`)
    }
}

const updateProducts = async (req,res) => {
    const id = req.params.id
    const body = req.body
    try{
        const product = await Product.findByIdAndUpdate(id,body, {new: true})
        console.log('req.body:', req.body);
console.log('req.params.id:', req.params.id);
         res.status(200).json({message:"updated product sucessfully", product:product})
    } catch (error) {
        res.status(400).json(`updated product failed`)
    }
}

const deleteProducts = async (req,res) => {
    const id = req.params.id
    try{
        const product = await Product.findByIdAndDelete(id)
        res.status(200).json({message:"deleted product sucessfully", product:product})
    } catch (error) {
        res.status(400).json(`deleted product failed`)
    }
}

const searchProducts = async(req,res) => {
    try {
        const sanitizedQuery = {}
        for (const [key,value] of Object.entries(req.query)) {
            if(!key.startsWith('$')){
                if(value && typeof(value) === 'object' && !Array.isArray(value)){
                    sanitizedQuery[key] = sanitizedObject(value)
                } else{
                    sanitizedQuery[key] = value
                }
            }
        }

        const products = await Product.find(sanitizedQuery)
        res.status(200).json({sucess:true, count: products.length, data:products})
    } catch (error) {
        res.status(400).json({sucess: false, message: "search failed"})
    }
}

module.exports = {
    createProducts,
    fetchProducts,
    updateProducts,
    deleteProducts,
    searchProducts
}