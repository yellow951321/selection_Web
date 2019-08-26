import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import contentCreate from 'projectRoot/short-term/models/operations/content-create.js'
import {Content, } from 'short-term/models/association.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test short-term/models/operations/content-create.js', ()=>{

  context('test contentCreate', ()=>{
    let createStub
    beforeEach(()=>{
      createStub = sandbox.stub(Content, 'create').callsFake(()=>{
        return {
          title1: null,
          title2: null,
          title3: null,
          title4: null,
          content: null,
          summary: null,
          note: null,
          isChecked: 0,
          isConflicted: 0,
          contentId: 0,
          aspect: 0,
          keypoint: 0,
          method: 0,
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
          await contentCreate(arg)
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('invalid argument')
        }
      }
    })
    it('should throw an error message: dataId is NaN', async()=>{
      let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await contentCreate({dataId: arg, })
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('dataId is NaN')
        }
      }
    })
    it('should throw an error message: aspect is NaN', async()=>{
      let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await contentCreate({
            dataId: 0,
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
          await contentCreate({
            dataId: 0,
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
          await contentCreate({
            dataId: 0,
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
    it('should throw an error message: creating data failed', async()=>{
      createStub.restore()
      createStub = sandbox.stub(Content, 'create').throws()
      try{
        await contentCreate({
          dataId: 0,
          aspect: 0,
          keypoint: 0,
          method: 0,
        })
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('creating data failed')
      }
    })
    it('should throw an error message: creating data failed', async()=>{
      let outRangeLabels = [
        {aspect: 0, keypoint: 0, method: 16, },
        {aspect: 0, keypoint: 1, method: 4, },
        {aspect: 0, keypoint: 2, method: 4, },
        {aspect: 0, keypoint: 3, method: 11, },
        {aspect: 0, keypoint: 4, method: 1, },
        {aspect: 0, keypoint: 5, method: 5, },
        {aspect: 0, keypoint: 6, method: 11, },
        {aspect: 0, keypoint: 7, method: 5, },
        {aspect: 0, keypoint: 8, method: 7, },
        {aspect: 0, keypoint: 9, method: 5, },
        {aspect: 0, keypoint: 10, method: 5, },
        {aspect: 0, keypoint: 11, method: 6, },
        {aspect: 0, keypoint: 12, method: 8, },
        {aspect: 0, keypoint: 13, method: 3, },
        {aspect: 0, keypoint: 14, method: 6, },
        {aspect: 0, keypoint: 15, method: 4, },
        {aspect: 0, keypoint: 16, method: 0, },
        {aspect: 1, keypoint: 0, method: 13, },
        {aspect: 1, keypoint: 1, method: 7, },
        {aspect: 1, keypoint: 2, method: 7, },
        {aspect: 1, keypoint: 3, method: 4, },
        {aspect: 1, keypoint: 4, method: 1, },
        {aspect: 1, keypoint: 5, method: 4, },
        {aspect: 1, keypoint: 6, method: 0, },
        {aspect: 2, keypoint: 0, method: 7, },
        {aspect: 2, keypoint: 1, method: 7, },
        {aspect: 2, keypoint: 2, method: 6, },
        {aspect: 2, keypoint: 3, method: 7, },
        {aspect: 2, keypoint: 4, method: 7, },
        {aspect: 2, keypoint: 5, method: 4, },
        {aspect: 2, keypoint: 6, method: 0, },
        {aspect: 3, keypoint: 0, method: 5, },
        {aspect: 3, keypoint: 1, method: 4, },
        {aspect: 3, keypoint: 2, method: 5, },
        {aspect: 3, keypoint: 3, method: 6, },
        {aspect: 3, keypoint: 4, method: 6, },
        {aspect: 3, keypoint: 5, method: 4, },
        {aspect: 3, keypoint: 6, method: 4, },
        {aspect: 3, keypoint: 7, method: 0, },
        {aspect: 4, keypoint: 0, method: 7, },
        {aspect: 4, keypoint: 1, method: 6, },
        {aspect: 4, keypoint: 2, method: 9, },
        {aspect: 4, keypoint: 3, method: 4, },
        {aspect: 4, keypoint: 4, method: 5, },
        {aspect: 4, keypoint: 5, method: 4, },
        {aspect: 4, keypoint: 6, method: 4, },
        {aspect: 4, keypoint: 7, method: 4, },
        {aspect: 4, keypoint: 8, method: 5, },
        {aspect: 4, keypoint: 9, method: 4, },
        {aspect: 4, keypoint: 10, method: 8, },
        {aspect: 4, keypoint: 11, method: 0, },
      ]
      for(let outRangeLabel of outRangeLabels){
        createStub.restore()
        createStub = sandbox.stub(Content, 'create').callsFake(()=>{
          return {
            title1: null,
            title2: null,
            title3: null,
            title4: null,
            content: null,
            summary: null,
            note: null,
            isChecked: 0,
            isConflicted: 0,
            contentId: 0,
            aspect: outRangeLabel.aspect, 
            keypoint: outRangeLabel.keypoint, 
            method: outRangeLabel.method,
          }
        })
        try{
          await contentCreate({dataId:0, aspect: 0, keypoint: 0, method: 0, })
          expect.fail('should not get here')
        }catch(err){
          expect(err).to.have.property('status').to.equal(500)
          expect(err).to.have.property('message').to.equal('converting label from number failed')
        }
      }
    })
  })
})
