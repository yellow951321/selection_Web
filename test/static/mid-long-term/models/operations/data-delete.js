import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {Data, } from 'mid-long-term/models/association.js'
chai.use(sinonChai)

import dataDelete from 'projectRoot/mid-long-term/models/operations/data-delete.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test mid-long-term/models/operations/data-delete.js', () => {

    context('test date-delete',()=>{
        let findOneStub, deleteStub
        beforeEach(()=>{
            findOneStub = sandbox.stub(Data, 'findOne').callsFake(()=>{
                return {
                    userId: 0,
                }
            })
            deleteStub = sandbox.stub(Data, 'destroy').callsFake(()=>{
                return {
                    dataId: 0,
                }
            })
        })
        afterEach(()=>{
            sandbox.restore();
        })
        it('should throw a dataId is NaN error', async()=>{
            let invalidType = ['ABC', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await dataDelete(arg, 0)
                    expect.fail('should not get here')
                }
                catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('dataId is NaN')
                }
            }
        })
        it('should throw a userId is NaN error', async()=>{
            let invalidType = ['ABC', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await dataDelete(0, arg)
                    expect.fail('should not get here')
                }
                catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('userId is NaN')
                }
            }
        })
        it('should throw a fetching data failed error', async()=>{
            findOneStub.restore()
            findOneStub = sandbox.stub(Data, 'findOne').throws()
            try{
                await dataDelete(0, 0)
                expect.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('fetching data failed')
            }
        })
        it('should throw a No specified dataId error', async()=>{
            findOneStub.restore()
            findOneStub = sandbox.stub(Data, 'findOne').callsFake(()=>{
                return null
            })
            try{
                await dataDelete(0, 0)
                expect.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('No specified dataId')
            }
        })
        it('should throw a Unauthorized error', async()=>{
            findOneStub.restore()
            findOneStub = sandbox.stub(Data, 'findOne').callsFake(()=>{
                return {
                    userId: 1,
                }
            })
            try{
                await dataDelete(0, 0)
                expect.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(401)
                expect(err).to.have.property('message').to.equal('Unauthorized')
            }
        })
        it('should throw a data delete failed error', async()=>{
            deleteStub.restore()
            deleteStub = sandbox.stub(Data, 'destroy').throws()
            try{
                await dataDelete(0, 0)
                expect.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('data delete failed')
            }
        })
    })
})
