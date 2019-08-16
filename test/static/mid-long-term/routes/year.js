import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import request from 'supertest'

chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect
const sandbox = sinon.createSandbox();

import server from 'projectRoot/server.js'
import yearRouter from 'mid-long-term/routes/year.js'

describe('yearRouter', ()=>{

    context('Get /index', ()=>{
        it('should get /index', ()=>{
            let dbStub = sinon.stub().callsFake(()=>{
                return []
            })
            // yearRouter.__set__('getAllYear', dbStub)

            request(yearRouter).get('/index')
                .expect(200)
        })
    })
})