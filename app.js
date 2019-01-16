const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const logger = require('morgan')

const config = require('./config')
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
app.use(session({
  secret: 'fuck'
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'semantic')))
app.use(express.static(path.join(__dirname, 'routes')))

app.use('/log', loginRouter)
app.use('/signup', signupRouter)
app.use('/man', managerRouter)

app.get('/',(req,res)=>{
  // if no session
  res.redirect('/log')
})

app.listen(config.port)

console.log(config.port, process.env.MODE)
