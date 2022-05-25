import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

//@desc    Create Order
//@route   POST/api/orders
//@access  private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order information')
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    })

    const createOrder = await order.save()
    res.status(201).json(createOrder)
  }
})

//@desc    Get order by order id
//@route   GET/api/orders/:id
//@access  private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    )
    if (order) {
      res.json(order)
    } else {
      res.status(404)
      throw new Error('Can\'t find order')
    }
  })
  

//@desc    Get all orders
//@route   GET/api/orders
//@access  private(admin only)
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.json(orders)
})

//@desc    Update paid order
//@route   PUT/api/orders/:id/pay
//@access  private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    }
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('order not found')
  }
})

//@desc    Get the order of the logged in user
//@route   GET/api/orders/myorders
//@access  private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

export {
  addOrderItems,
  getOrderById,
  getOrders,
  updateOrderToPaid,
  getMyOrders,
}