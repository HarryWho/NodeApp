require('dotenv').config()
require('ejs');
const express = require('express')
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')


// create the app server
const app = express()

// static public folder
app.use(express.static('public'))

// ejs and express layouts set up
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')

// Routes
const homeRoute = require('./routes/home/index')
const userRoute = require('./routes/user/user-route')

app.use('/', homeRoute);
app.use('/user', userRoute);


// MongoDB Connect and monitor
mongoose.connect(process.env.MONGO_URL)
const db = mongoose.connection;
db.on('error', (error) => {
  console.log(error.message)
})
db.once('open', () => {
  console.log("Mongo now connected")
})

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server runing on port ${process.env.PORT}`)
})