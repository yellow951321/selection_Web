import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import getContent from 'projectRoot/mid-long-term/models/operations/get-content.js'
import {Content, } from 'mid-long-term/models/association.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test mid-long-term/models/operations/get-contentjs', ()=>{

  context('test getContent', ()=>{
    let dbStub
    beforeEach(()=>{
      dbStub = sandbox.stub(Content, 'findAll').callsFake(()=>{
        return [{
          contentId: 0,
          aspect: 0,
          keypoint: 0,
          method: 0,
        }, ]
      })
    })
    afterEach(()=>{
      sandbox.restore()
    })
    it('should throw an error message: dataId is NaN', async()=>{
      let invalidType = ['ABC', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await getContent(0, 0, 0, arg)
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }
        catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('dataId is NaN')
        }
      }
    })
    it('should throw an error message: aspect is NaN', async()=>{
      let invalidType = [NaN, 'ABC', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await getContent(arg, 0, 0, 0)
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }
        catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('aspect is NaN')
        }
      }
    })
    it('should throw an error message: keypoint is NaN', async()=>{
      let invalidType = [NaN, 'ABC', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await getContent(0, arg, 0, 0)
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }
        catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('keypoint is NaN')
        }
      }
    })
    it('should throw an error message: method is NaN', async()=>{
      let invalidType = [NaN, 'ABC', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await getContent(0, 0, arg, 0)
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }
        catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('method is NaN')
        }
      }
    })
    it('should throw an error message: isChecked is not a valid option', async()=>{
      let invalidType = [2, -2, NaN, 'ABC', null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await getContent(0, 0, 0, 0, arg)
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }
        catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('isChecked is not a valid option')
        }
      }
    })
    it('should throw an error message: isConflicted is not a valid option', async()=>{
      let invalidType = [2, -2, NaN, 'ABC', null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await getContent(0, 0, 0, 0, -1, arg)
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }
        catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('isConflicted is not a valid option')
        }
      }
    })
    it('should return empty data', async()=>{
      dbStub.restore()
      dbStub = sinon.stub(Content, 'findAll').callsFake(()=>{
        return []
      })
      expect(await getContent(0, 0, 0, 0)).to.equal('empty data')

      dbStub.restore()
      dbStub = sinon.stub(Content, 'findAll').callsFake(()=>{
        return null
      })
      expect(await getContent(0, 0, 0, 0)).to.equal('empty data')
    })
    it('should throw an error message: data formatting failed', async()=>{
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
        dbStub.restore()
        dbStub = sandbox.stub(Content, 'findAll').callsFake(()=>{
          return [{
            contentId: 0,
            aspect: outRangeLabel.aspect,
            keypoint: outRangeLabel.keypoint,
            method: outRangeLabel.method,
          }, ]
        })
        try{
          await getContent(0, 0, 0, 0)
          expect.fail('should not get here')
        }
        catch(err){
          expect(err).to.have.property('status').to.equal(500)
          expect(err).to.have.property('message').to.equal('data formatting failed')
        }
      }
    })
    it('should return a array', async()=>{
      expect(await getContent(0, 0, 0, 0)).to.be.instanceOf(Array).to.have.lengthOf(1)
    })
  })
})