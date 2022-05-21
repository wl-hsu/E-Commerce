import express from 'express'
import asyncHandler from 'express-async-handler'
const router = express.Router()
import Product from '../models/productModel.js'

//@desc    Request all products
//@route   GET/api/products
//@access  public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await Product.find({})
    // test error
    // res.status(401)
    // throw new Error('No access right')
    res.json(products)
  })
)

//@desc    Request a single product
//@route   GET/api/products/:id
//@access  public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
      res.json(product)
    } else {
      res.status(404)
      throw new Error('can\'t find the product')
    }
  })
)

export default router