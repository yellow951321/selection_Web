import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import contentAuth from 'projectRoot/short-term/models/operations/content-auth.js'
import {Data, } from 'short-term/models/association.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test short-term/models/operations/content-auth.js', ()=>{

  context('test contentAuth', ()=>{
    let findOneStub
    beforeEach(()=>{
      findOneStub = sandbox.stub(Data, 'findOne').callsFake(()=>{
        return {
          userId: 0,
          typeId: 0,
          canpusId: 0,
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
          await contentAuth(arg)
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
          await contentAuth({dataId: arg, })
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('dataId is NaN')
        }
      }
    })
    it('should throw an error message: userId is NaN', async()=>{
      let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await contentAuth({
            dataId: 0,
            userId: arg,
          })
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('userId is NaN')
        }
      }
    })
    it('should throw an error message: fetching data failed', async()=>{
      findOneStub.restore()
      findOneStub = sandbox.stub(Data, 'findOne').throws()
      try{
        await contentAuth({
          dataId: 0,
          userId: 0,
        })
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('fetching data failed')
      }
    })
    it('should throw an error message: data not Found', async()=>{
      findOneStub.restore()
      findOneStub = sandbox.stub(Data, 'findOne').callsFake(()=>{
        return null
      })
      try{
        await contentAuth({
          dataId: 0,
          userId: 0,
        })
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(404)
        expect(err).to.have.property('message').to.equal('data not Found')
      }
    })
    it('should return correct message', async()=>{
      expect(await contentAuth({
        dataId: 0,
        userId: 1,
      })).to.have.property('message').to.equal('as a reviewer')
      expect(await contentAuth({
        dataId: 0,
        userId: 0,
      })).to.have.property('message').to.equal('as an editor')
    })
  })
})
