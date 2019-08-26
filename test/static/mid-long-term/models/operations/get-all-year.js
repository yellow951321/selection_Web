import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import getAllYear from 'projectRoot/mid-long-term/models/operations/get-all-year.js'
import {Content, Data, User, } from 'mid-long-term/models/association.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test mid-long-term/models/operations/get-all-year.js', ()=>{

  context('test getAllYear', ()=>{
    let DatafindAllStub, UserFindOneStub, ContentCountStub, ContentFindAllStub
    beforeEach(()=>{
      DatafindAllStub = sandbox.stub(Data, 'findAll').callsFake(()=>{
        return [{
          dataId: 0,
          yearFrom: 1,
          yearTo: 2,
          userId: 0,
        }, ]
      })
      UserFindOneStub = sandbox.stub(User, 'findOne').callsFake(()=>{
        return {
          userId: 0,
          account: 'test account',
        }
      })
      ContentCountStub = sandbox.stub(Content, 'count').callsFake(()=>{
        return 1
      })
      ContentFindAllStub = sandbox.stub(Content, 'findAll').callsFake(()=>{
        return 1
      })
    })
    afterEach(()=>{
      sandbox.restore()
    })
    it('should throw an error message: invalid argument', async()=>{
      let invalidType = [1, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await getAllYear(arg)
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('invalid argument')
        }
      }
    })
    it('should throw an error message: typeId is NaN', async()=>{
      let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await getAllYear({typeId: arg, })
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('typeId is NaN')
        }
      }
    })
    it('should throw an error message: campusId is NaN', async()=>{
      let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await getAllYear({
            typeId: 0,
            campusId: arg,
          })
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('campusId is NaN')
        }
      }
    })
    it('should throw an error message: fetching data failed', async()=>{
      DatafindAllStub.restore()
      DatafindAllStub = sandbox.stub(Data, 'findAll').throws()
      try{
        await getAllYear({
          typeId: 0,
          campusId: 0,
        })
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('fetching data failed')
      }
    })
    it('should throw an error message: data failed', async()=>{
      UserFindOneStub.restore()
      UserFindOneStub = sandbox.stub(User, 'findOne').throws()
      try{
        await getAllYear({
          typeId: 0,
          campusId: 0,
        })
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('formatting data failed')
      }
      UserFindOneStub.restore()
      UserFindOneStub = sandbox.stub(User, 'findOne').callsFake(()=>{
        return {
          userId: 0,
          account: 'test account',
        }
      })
      ContentCountStub.restore()
      ContentCountStub = sandbox.stub(Content, 'count').throws()
      try{
        await getAllYear({
          typeId: 0,
          campusId: 0,
        })
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('formatting data failed')
      }
      ContentCountStub.restore()
      ContentCountStub = sandbox.stub(Content, 'count').callsFake(()=>{
        return 1
      })
      ContentFindAllStub.restore()
      ContentFindAllStub = sandbox.stub(Content, 'findAll').throws()
      try{
        await getAllYear({
          typeId: 0,
          campusId: 0,
        })
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('formatting data failed')
      }
    })
  })
})
