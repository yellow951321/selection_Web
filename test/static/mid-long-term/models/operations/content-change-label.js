import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import contentChangeLabel from 'projectRoot/mid-long-term/models/operations/content-change-label.js'
import {Content, } from 'mid-long-term/models/association.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test mid-long-term/models/operations/content-change-label.js', ()=>{

  context('test contentChangeLabel', ()=>{
    let findOneStub
    beforeEach(()=>{
      findOneStub = sandbox.stub(Content, 'findOne').callsFake(()=>{
        return {
          update: ()=>{
            return 'testing data'
          },
        }
      })
    })
    afterEach(()=>{
      sandbox.restore()
    })
    it('should throw an error message: invalid argument', async()=>{
      let invalidType = [1, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await contentChangeLabel(arg)
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
          await contentChangeLabel({contentId: arg, })
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('contentId is NaN')
        }
      }
    })
    it('should throw an error message: aspect is NaN', async()=>{
      let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await contentChangeLabel({
            contentId: 0,
            aspect: arg,
          })
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('aspect is NaN')
        }
      }
    })
    it('should throw an error message: keypoint is NaN', async()=>{
      let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await contentChangeLabel({
            contentId: 0,
            aspect: 0,
            keypoint: arg,
          })
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('keypoint is NaN')
        }
      }
    })
    it('should throw an error message: method is NaN', async()=>{
      let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await contentChangeLabel({
            contentId: 0,
            aspect: 0,
            keypoint: 0,
            method: arg,
          })
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('method is NaN')
        }
      }
    })
    it('should throw an error message: fetching data failed', async()=>{
      findOneStub.restore()
      findOneStub = sandbox.stub(Content, 'findOne').throws()
      try{
        await contentChangeLabel({
          contentId: 0,
          aspect: 0,
          keypoint: 0,
          method: 0,
        })
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('fetching data failed')
      }
    })
    it('should throw an error message: updating data failed', async()=>{
      findOneStub.restore()
      findOneStub = sandbox.stub(Content, 'findOne').callsFake(()=>{
        return {
          update: ()=>{
            throw new Error()
          },
        }
      })
      try{
        await contentChangeLabel({
          contentId: 0,
          aspect: 0,
          keypoint: 0,
          method: 0,
        })
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('updating data failed')
      }
    })
  })
})
