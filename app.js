var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var router = require('./backend/routes/index')
var mongoose = require('mongoose')

var app = express()

// DB Setup
mongoose.connect('mongodb://localhost:/chat')
mongoose.connection
  .once('open', () => {
    console.log('Database good to go!')
  })
  .on('error', (error) => {
    console.warn('Warning', error)
  })

// View engine setup.
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// HTTP request logger middleware.
app.use(logger('combined'))

// Parses all request body as json type.
// Only objects with key-value pairs will be accepted.
app.use(bodyParser.json({ type: '*/*' }))
app.use(bodyParser.urlencoded({ extended: false }))

// Cookie parser middleware.
app.use(cookieParser())

app.use('/', router)

// Catch 404 and forward to error handler.
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
});

// Error handler.
app.use((err, req, res, next) => {
  // Set locals, only providing error in development.
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // Render the error page.
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
