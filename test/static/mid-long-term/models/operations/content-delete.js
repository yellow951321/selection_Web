import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import contentDelete from 'projectRoot/mid-long-term/models/operations/content-delete.js'
import {Content, } from 'mid-long-term/models/association.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test mid-long-term/models/operations/content-delete.js', ()=>{
  let destroyStub
  beforeEach(()=>{
    destroyStub = sandbox.stub(Content, 'destroy').callsFake(()=>{
      return {
        contentId: 0,
      }
    })
  })
  afterEach(()=>{
    sandbox.restore()
  })
  context('test contentDelete', ()=>{
    it('should throw an error message: invalid argument', async()=>{
      let invalidType = [1, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await contentDelete(arg)
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('invalid argument')
        }
      }
    })
    it('should throw an error message: contentId is NaN', async()=>{
      let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await contentDelete({contentId: arg, })
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('contentId is NaN')
        }
      }
    })
    it('should throw an error message: contentId is NaN', async()=>{
      let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await contentDelete({contentId: arg, })
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('contentId is NaN')
        }
      }
    })
    it('should throw an error message: deleting data failed', async()=>{
      destroyStub.restore()
      destroyStub = sandbox.stub(Content, 'destroy').throws()
      try{
        await contentDelete({contentId: 0, })
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('deleting data failed')
      }
    })
  })
})