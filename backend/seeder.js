import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import connectDB from './config/db.js'

dotenv.config()
connectDB()

//Insert sample data into database
const importData = async () => {
  try {
    //Clear sample data from database
    await Order.deleteMany()
    await User.deleteMany()
    await Product.deleteMany()

    //Implement sample data insertion
    const createdUsers = await User.insertMany(users)

    const adminUser = createdUsers[0]._id

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser }
    })

    await Product.insertMany(sampleProducts)

    console.log('Sample data inserted successfully'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

//Insert sample data into database
const destroyData = async () => {
  try {
    //Clear sample data from database
    await Order.deleteMany()
    await User.deleteMany()
    await Product.deleteMany()

    console.log('Sample data destroyed successfully'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

//Determine the function executed by the command line
if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}