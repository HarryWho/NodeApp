const morgan = require('morgan')
const dotenv = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')
const ConnectDB = require('./config/DB');
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')
const { google, facebook } = require('./config/passport')
require('ejs');



// load config
dotenv.config({ path: './config/config.env' })

// passport config
const myGooglePassport = google(passport)

const myFaceBookPassport = facebook(passport)

// create the app server
const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Logging
if (process.env.NODE_ENV === 'development') {

  app.use(morgan('dev'))
}

// static public folder
app.use(express.static('public'))

// EJS Helpers
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/helpers')

app.use((req, res, next) => {
  res.locals.formatDate = formatDate,
    res.locals.truncate = truncate,
    res.locals.stripTags = stripTags,
    res.locals.editIcon = editIcon,
    res.locals.select = select,
    next()
})

// ejs and express layout s set up
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')
app.set("layout extractStyles", true)
app.set('layout extractScripts', true)

// Express session
app.use(session({
  secret: 'keyboard cat',
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    mongooseConnection: mongoose.connection
  }),
  resave: false,
  saveUninitialized: false
}))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Method Override
app.use(methodOverride('_method'))


// Routes
const homeRoute = require('./routes/home/index')
const userRoute = require('./routes/user/user-route')
const authRoute = require('./routes/auth/auth')
const storyRoute = require('./routes/stories/index');
app.use('/', homeRoute);
app.use('/user', userRoute);
app.use('/auth', authRoute);
app.use('/stories', storyRoute);

// connect MongoDB
ConnectDB()

// Start Server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server runing in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`)
})