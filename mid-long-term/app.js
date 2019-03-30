import path from 'path'
import express from 'express'

import config from 'projectRoot/config.js'
import index from 'mid-long-term/routes/index.js'

const app = express()

app.set('views', path.join(config.projectRoot, 'mid-long-term/views'))
app.set('view engine', 'pug')

app.use('/static', express.static(path.join(config.projectRoot, 'mid-long-term/publics'), {
  cacheControl: false,
  dotfiles: 'ignore',
  etag: false,
  extensions: ['css', 'js', ],
  fallthrough: true,
  immutable: false,
  index: false,
  lastModified: false,
  maxAge: 0,
  redirect: false,
  setHeaders(res){
    res.set('x-timestamp', Date.now())
  },
}))

app.use('/index', index)

export default app
