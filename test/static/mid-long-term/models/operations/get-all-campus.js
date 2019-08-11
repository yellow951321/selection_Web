import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {Data, } from 'mid-long-term/models/association.js'
chai.use(sinonChai)

import getAllCampus from 'projectRoot/mid-long-term/models/operations/get-all-campus.js'

const expect = chai.expect

describe('test mid-long-term/models/operations/get-all-cmpus.js', () => {

    context('test get-all-campus',()=>{
        let dbStub
        beforeEach(()=>{
            dbStub = sinon.stub(Data, 'findAll').callsFake(()=>{
                return [{
                    campusId: 0,
                    typeId:   0,
                    content: {
                        length: 0,
                    }
                }]
            })
        })
        afterEach(()=>{
            dbStub.restore();
        })
        it('should throw an invalid argument error ', async()=>{
            let invalidType = [1, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await getAllCampus(arg)
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('invalid argument')
                }
            }
        })

        it('should throw an typeId is NaN. error ', async()=>{
            let invalidType = [NaN , 2, {}, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await getAllCampus({typeId: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('typeId is not valid.')
                }
            }
        })
        it('should return an object ', async()=>{
            let output = await getAllCampus({typeId: 0})
            expect(output).to.be.an('object')
            expect(output).to.have.property('campuses').to.be.a('array')
            expect(output).to.have.property('typeName').to.be.a('string')
            expect(dbStub).to.have.been.calledOnce
        })
    })
})
