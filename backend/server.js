import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/db.js'
import prodcutRoutes from './routes/productRoutes.js'

dotenv.config()
connectDB()

const app = express()

app.get('/', (req, res) => {
  res.send('Server is running...')
})
app.use('/api/products', prodcutRoutes)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on ${PORT} port`.yellow.bold
  )
)