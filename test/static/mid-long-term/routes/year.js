import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'


chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect
const sandbox = sinon.createSandbox();

import yearRouter from 'mid-long-term/routes/year.js'

describe('yearRouter', ()=>{

    context('Get /index', ()=>{

    })
})