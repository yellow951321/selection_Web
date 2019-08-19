import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import contentUpdate from 'projectRoot/mid-long-term/models/operations/content-update.js'
import {Content, } from 'mid-long-term/models/association.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test mid-long-term/models/operations/content-update.js', ()=>{

  context('test contentUpdate', ()=>{
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
    it('should throw a invalid argument error ', async()=>{
      let invalidType = [1, '1', undefined, null, true, ()=> {return 123}, ]
      for(let arg of invalidType){
        try{
          await contentUpdate(0, arg)
          expect.fail('should not get here')
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('invalid argument')
        }
      }
    })
    it('should throw a contentId is NaN error ', async()=>{
      let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {return 123}, ]
      for(let arg of invalidType){
        try{
          await contentUpdate(arg, {})
          expect.fail('should not get here')
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('contentId is NaN')
        }
      }
    })
    it('should throw a reviewerId is NaN error ', async()=>{
      // it's can be undefined
      let invalidType = [NaN, {}, '1', null, true, ()=> {return 123}, ]
      for(let arg of invalidType){
        try{
          await contentUpdate(0, {reviewerId: arg, })
          expect.fail('should not get here')
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('reviewerId is NaN')
        }
      }
    })
    it('should throw a conflictedAspect is NaN error ', async()=>{
      // it's can be undefined
      let invalidType = [NaN, {}, '1', null, true, ()=> {return 123}, ]
      for(let arg of invalidType){
        try{
          await contentUpdate(0, {conflictedAspect: arg, })
          expect.fail('should not get here')
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('conflictedAspect is NaN')
        }
      }
    })
    it('should throw a conflictedKeypoint is NaN error ', async()=>{
      // it's can be undefined
      let invalidType = [NaN, {}, '1', null, true, ()=> {return 123}, ]
      for(let arg of invalidType){
        try{
          await contentUpdate(0, {conflictedKeypoint: arg, })
          expect.fail('should not get here')
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('conflictedKeypoint is NaN')
        }
      }
    })
    it('should throw a conflictedKeypoint is NaN error ', async()=>{
      // it's can be undefined
      let invalidType = [NaN, {}, '1', null, true, ()=> {return 123}, ]
      for(let arg of invalidType){
        try{
          await contentUpdate(0, {conflictedKeypoint: arg, })
          expect.fail('should not get here')
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('conflictedKeypoint is NaN')
        }
      }
    })
    it('should throw a conflictedMethod is NaN error ', async()=>{
      // it's can be undefined
      let invalidType = [NaN, {}, '1', null, true, ()=> {return 123}, ]
      for(let arg of invalidType){
        try{
          await contentUpdate(0, {conflictedMethod: arg, })
          expect.fail('should not get here')
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('conflictedMethod is NaN')
        }
      }
    })
    it('should throw a isConflicted is NaN error ', async()=>{
      // it's can be undefined
      let invalidType = [2, -2, NaN, '1', {}, null, true, ()=> {return 123}, ]
      for(let arg of invalidType){
        try{
          await contentUpdate(0, {isConflicted: arg, })
          expect.fail('should not get here')
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('isConflicted is not a valid argument')
        }
      }
    })
    it('should throw a isChecked is NaN error ', async()=>{
      // it's can be undefined
      let invalidType = [2, -2, NaN, '1', {}, null, true, ()=> {return 123}, ]
      for(let arg of invalidType){
        try{
          await contentUpdate(0, {isChecked: arg, })
          expect.fail('should not get here')
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('isChecked is not a valid argument')
        }
      }
    })
    it('should throw a fetching data failed error ', async()=>{
      // it's can be undefined
      findOneStub.restore()
      findOneStub = sandbox.stub(Content, 'findOne').throws()
      try{
        await contentUpdate(0, {})
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('fetching data failed')
      }
    })
    it('should throw a updating data failed error ', async()=>{
      // it's can be undefined
      findOneStub.restore()
      findOneStub = sandbox.stub(Content, 'findOne').callsFake(()=>{
        return {
          update: ()=>{
            throw new Error()
          },
        }
      })
      try{
        await contentUpdate(0, {})
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('updating data failed')
      }
    })
  })

})
