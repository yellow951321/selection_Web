const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const loginRouter = require('./routes/login')
const signupRouter = require('./routes/signup')
const managerRouter = require('./routes/manager')
const app = express()

const isDevMode = process.env.MODE == 'DEVELOPMENT'

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

if(isDevMode){
  app.use(logger('dev'))
}
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'semantic')))
app.use(express.static(path.join(__dirname, 'routes')))

app.use('/log', loginRouter)
app.use('/signup', signupRouter)
app.use('/man', managerRouter)

app.listen(process.env.PORT || 3000)

console.log(process.env.PORT, process.env.MODE)
