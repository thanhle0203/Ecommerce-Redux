const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/ecommerce', { userNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err))

app.listen(5000, () => {
    console.log('Server is running on port 5000')
});

const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')

app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)