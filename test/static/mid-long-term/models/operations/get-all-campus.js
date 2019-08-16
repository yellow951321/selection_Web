import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {Data, Content, } from 'mid-long-term/models/association.js'
chai.use(chaiAsPromised)
chai.use(sinonChai)

import getAllCampus from 'projectRoot/mid-long-term/models/operations/get-all-campus.js'

const expect = chai.expect
const sandbox = sinon.createSandbox();

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
        it('should throw an invalid argument error ', async ()=>{
            try{
                await getAllCampus(null)
            }catch(err){
                expect(err).to.have.property('status').to.equals(400)
                expect(err).to.have.property('message').to.equals('invalid argument')
            }
        })

        it('should throw an typeId is NaN. error ', async ()=>{
            try{
                await getAllCampus({typeId: null})
            }catch(err){
                expect(err).to.have.property('status').to.equals(400)
                expect(err).to.have.property('message').to.equals('typeId is NaN.')
            }
        })

        it('should return an object ', async ()=>{
            let output = await getAllCampus({typeId: 0})
            expect(output).to.be.an('object')
            expect(output).to.have.property('campuses').to.be.a('array')
            expect(output).to.have.property('typeName').to.be.a('string')
            expect(dbStub).to.have.been.calledOnce
        })
    })
})
