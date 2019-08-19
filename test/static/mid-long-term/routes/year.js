import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import session from 'supertest-session'

chai.use(sinonChai)
const expect = chai.expect
const sandbox = sinon.createSandbox()

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import pugRender from 'pug-render'
import config from 'projectRoot/config'
import path from 'path'
const midLongTermPugRoot = path.join(config.projectRoot, 'mid-long-term/views')

const render = pugRender(midLongTermPugRoot, {
  locals: {env: process.env, },
})

import server from 'projectRoot/server.js'
import yearRouter from 'mid-long-term/routes/year.js'

describe('yearRouter', ()=>{

  context('Get /index', ()=>{
    let testSession = null, authenticatedSession = null, sessionCookie
    before(()=>{
      testSession = session(server)
      sessionCookie = testSession.cookies.find(function(cookie) {
        return cookie.name === connect.sid
      })
    })
    it('should get /index', async()=>{
      let dbStub = sinon.stub().callsFake(()=>{
        return []
      })
      let output = await testSession.get('/mid-long-term/0/0/index')
      console.log(output.text)
    })
    it('should get /index', async()=>{
      await testSession.post('/auth/login')
        .send({username: 'admintest', password: 'admintest', })
        .expect(302)
        .then(()=>{
          authenticatedSession = testSession
        })
      let output = await authenticatedSession.get('/mid-long-term/0/0/index')
        .expect(302)
      console.log(output.text)
    })
  })
})


