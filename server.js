const morgan = require('morgan')
const dotenv = require('dotenv')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const ConnectDB = require('./config/DB');
const passport = require('passport')
const session = require('express-session')
require('ejs');



// load config
dotenv.config({ path: './config/config.env' })

// passport config
require('./config/passport')(passport)

// create the app server
const app = express()

if (process.env.NODE_ENV === 'development') {

  app.use(morgan('dev'))
}

// static public folder
app.use(express.static('public'))

// ejs and express layout s set up
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')

// Express session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false

}))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Routes
const homeRoute = require('./routes/home/index')
const userRoute = require('./routes/user/user-route')
const authRoute = require('./routes/auth/auth')
app.use('/', homeRoute);
app.use('/user', userRoute);
app.use('/auth', authRoute);

// connect MongoDB
ConnectDB()

// Start Server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server runing in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`)
})