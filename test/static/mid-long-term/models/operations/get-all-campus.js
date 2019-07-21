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

describe('chai test', () => {

    context('test get-all-campus',()=>{
        it('should return an object ', async ()=>{
            let dbStub = sinon.stub(Data, 'findAll').callsFake(()=>{
                return [{
                    campusId: 0,
                    typeId:   0,
                    content: {
                        length: 0,
                    }
                }]
            })

            let output = await getAllCampus(0)

            expect(output).to.be.an('object')
            expect(output).to.have.property('campuses')
            expect(output).to.have.property('typeName')
            expect(dbStub).to.have.been.calledOnce

            dbStub.restore();
        })

        it('should throw an error ', async ()=>{
            let dbStub = sinon.stub(Data, 'findAll').callsFake(()=>{
                return [{
                    campusId: 0,
                    typeId:   0,
                    content: {
                        length: 0,
                    }
                }]
            })
            getAllCampus(null).catch((err)=>{
                expect(err).to.have.property('status').to.equals(500)
            })

            dbStub.restore();
        })
    })

})
