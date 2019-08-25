import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import request from 'supertest'

chai.use(sinonChai)
const expect = chai.expect

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { JSDOM, } from 'jsdom'
import campusMap from 'projectRoot/lib/static/javascripts/mapping/campus.js'
import server from 'projectRoot/server.js'

describe('yearRouter', ()=>{

  context('Get /index', ()=>{
    let agent, cookie
    
    before((done)=>{
      agent = request.agent(server)
      agent.post('/auth/login')
        .send({username: 'admintest', password: 'admintest', })
        .expect(302)
        .end((err, res)=>{
          cookie = res.header['set-cookie']
          done()
        })
    })
    it('should test', (done)=>{
      let typeId, campusId
      typeId = 0
      campusId = 0
      agent.get(`/mid-long-term/${typeId}/${campusId}/index`)
        .set('Cookie', cookie)
        .send()
        .expect(200)
        .expect((res)=>{
          const dom = new JSDOM(res.text)
          let breadcrumbElement = dom.window.document.querySelector('.breadcrumb').firstChild.children
          expect(breadcrumbElement[0].innerHTML).to.be.a('string')
          expect(breadcrumbElement[2].innerHTML).to.equal('中長程計畫')
          expect(breadcrumbElement[4].innerHTML).to.equal(campusMap[typeId].type)
          expect(breadcrumbElement[6].innerHTML).to.equal(campusMap[typeId].campus[campusId])
        })
        .end(done)
    })
  })
})


