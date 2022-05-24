import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

//@desc    Request all products
//@route   GET/api/products
//@access  public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
  res.json(products)
})

//@desc    Request single product
//@route   GET/api/products/:id
//@access  public 
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Can\'t find the product')
  }
})

//@desc    Delete single product
//@route   DELETE/api/products/:id
//@access  private（admin only）
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    await product.remove()
    res.json({ message: 'Product deleted successfully' })
  } else {
    res.status(404)
    throw new Error('Can\'t find product')
  }
})

//@desc    create product
//@route   POST/api/products
//@access  private（admin only）
const createProduct = asyncHandler(async (req, res) => {
  //create a product template
  const product = new Product({
    name: 'product name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'brand or company',
    category: 'type',
    countInStock: 0,
    numReviews: 0,
    description: 'description',
    rating: 0,
  })
  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

//@desc    update function
//@route   PUT/api/products/:id
//@access  private（admin only）
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body

  const product = await Product.findById(req.params.id)
  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock
    const updatedProduct = await product.save()
    res.status(201).json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Can\'t find product')
  }
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
}