import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import dataCreate from 'projectRoot/mid-long-term/models/operations/data-create.js'
import {Data, } from 'mid-long-term/models/association.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test mid-long-term/models/operations/data-create.js', ()=>{

    context('test dataCreate',()=>{
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
        it('should throw a invalid argument error ', async ()=>{
            let invalidType = [1, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await dataCreate(arg)
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('invalid argument')
                }
            }
        })
        it('should throw a campusId is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await dataCreate({
                        campusId: arg, 
                        typeId: 0, 
                        userId: 0, 
                        yearFrom: 1,
                        yearTo: 1
                    })
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('campusId is NaN')
                }
            }
        })
        it('should throw a typeId is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await dataCreate({
                        campusId: 0, 
                        typeId: arg, 
                        userId: 0, 
                        yearFrom: 1,
                        yearTo: 1
                    })
                    expect.fail('should not get here')
                }catch(err){
                    console.log(err)
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('typeId is NaN')
                }
            }
        })
        it('should throw a userId is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await dataCreate({
                        campusId: 0, 
                        typeId: 0, 
                        userId: arg, 
                        yearFrom: 1,
                        yearTo: 1
                    })
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('userId is NaN')
                }
            }
        })
        it('should throw a yearFrom is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await dataCreate({
                        campusId: 0, 
                        typeId:0, 
                        userId:0, 
                        yearFrom: arg,
                        yearTo: 1
                    })
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('yearFrom is NaN')
                }
            }
        })
        it('should throw a yearTo is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await dataCreate({
                        campusId: 0, 
                        typeId:0, 
                        userId:0, 
                        yearFrom: 1,
                        yearTo: arg,
                    })
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('yearTo is NaN')
                }
            }
        })
        it('should throw a data fetch failed error', async()=>{
            findOneStub.restore()
            findOneStub = sandbox.stub(Data, 'findOne').throws()
            try{
                await dataCreate({
                    campusId: 0, 
                    typeId:0, 
                    userId:0, 
                    yearFrom: 1,
                    yearTo: 1,
                })
                expect.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('data fetch failed')
            }
        })
        it('should throw a data create failed error', async()=>{
            createStub.restore()
            createStub = sandbox.stub(Data, 'create').throws()
            try{
                await dataCreate({
                    campusId: 0, 
                    typeId:0, 
                    userId:0, 
                    yearFrom: 1,
                    yearTo: 1,
                })
                expect.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('data creation failed')
            }
        })
        it('should return undefined if data already exist', async()=>{
            findOneStub.restore()
            findOneStub = sandbox.stub(Data, 'findOne').callsFake(()=>{
                return {
                    dataId: 0,
                }
            })
            expect(await dataCreate({
                    campusId: 0, 
                    typeId:0, 
                    userId:0, 
                    yearFrom: 1,
                    yearTo: 1,
            })).to.equal(undefined)
        })
    })
})
