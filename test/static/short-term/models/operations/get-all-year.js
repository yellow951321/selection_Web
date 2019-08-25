import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import getAllYear from 'projectRoot/short-term/models/operations/get-all-year.js'
import {Data, } from 'short-term/models/association.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test short-term/models/operations/get-all-year.js', ()=>{

  context('test getAllYear', ()=>{
    let findAllStub
    it('should throw an Error message: fetching data failed', async()=>{
      findAllStub = sandbox.stub(Data, 'findAll').throws()
      try{
        await getAllYear()
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('fetching data failed')
      }
      findAllStub.restore()
    })
  })
})