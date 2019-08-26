import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import dataCreate from 'projectRoot/short-term/models/operations/data-create.js'
import {Data, } from 'short-term/models/association.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test short-term/models/operations/data-create.js', ()=>{

  context('test dataCreate', ()=>{
    let findOneStub, createStub
    beforeEach(()=>{
      findOneStub = sandbox.stub(Data, 'findOne').callsFake(()=>{
        return null
      })
      createStub = sandbox.stub(Data, 'create').callsFake(()=>{
        return {
          dataId: 0,
        }
      })
    })
    afterEach(()=>{
      sandbox.restore()
    })

    it('should throw an error message: invalid argument', async()=>{
      let invalidType = [1, '1', undefined, null, true, ()=> {}, ]
      for(let arg of invalidType){
        try{
          await dataCreate(arg)
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('invalid argument')
        }
      }
    })
    it('should throw an error message: campusId is NaN', async()=>{
      let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {}, ]
      for(let arg of invalidType){
        try{
          await dataCreate({
            campusId: arg,
            typeId: 0,
            userId: 0,
            year: 1,
          })
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('campusId is NaN')
        }
      }
    })
    it('should throw an error message: typeId is NaN', async()=>{
      let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {}, ]
      for(let arg of invalidType){
        try{
          await dataCreate({
            campusId: 0,
            typeId: arg,
            userId: 0,
            year: 1,
          })
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('typeId is NaN')
        }
      }
    })
    it('should throw an error message: userId is NaN', async()=>{
      let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {}, ]
      for(let arg of invalidType){
        try{
          await dataCreate({
            campusId: 0,
            typeId: 0,
            userId: arg,
            year: 1,
          })
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('userId is NaN')
        }
      }
    })
    it('should throw an error message: year is NaN', async()=>{
      let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {}, ]
      for(let arg of invalidType){
        try{
          await dataCreate({
            campusId: 0,
            typeId: 0,
            userId: 0,
            year: arg,
          })
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('year is NaN')
        }
      }
    })
    it('should throw an error message: fetching data failed', async()=>{
      findOneStub.restore()
      findOneStub = sandbox.stub(Data, 'findOne').throws()
      try{
        await dataCreate({
          campusId: 0,
          typeId: 0,
          userId: 0,
          year: 1,
        })
        expect.fail('should not get here')
      }
      catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('fetching data failed')
      }
    })
    it('should throw an error message: creating data failed', async()=>{
      createStub.restore()
      createStub = sandbox.stub(Data, 'create').throws()
      try{
        await dataCreate({
          campusId: 0,
          typeId: 0,
          userId: 0,
          year: 108,
        })
        expect.fail('should not get here')
      }
      catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('creating data failed')
      }
    })
    it('should return undefined if data already exists', async()=>{
      findOneStub.restore()
      findOneStub = sandbox.stub(Data, 'findOne').callsFake(()=>{
        return {
          dataId: 0,
        }
      })
      expect(await dataCreate({
        campusId: 0,
        typeId: 0,
        userId: 0,
        year: 108,
      })).to.equal(undefined)
    })
  })
})
