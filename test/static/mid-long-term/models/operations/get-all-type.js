import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {Data, } from 'mid-long-term/models/association.js'
chai.use(sinonChai)

import getAllType from 'projectRoot/mid-long-term/models/operations/get-all-type.js'

const expect = chai.expect

describe('test mid-long-term/models/operations/get-all-type.js', () => {

    context('test get-all-type',()=>{
        let dbStub
        it('should throw a data fetch failed error', async ()=>{
            dbStub = sinon.stub(Data, 'findAll').throws()
            try{
                await getAllType()
                expect.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('data fetch failed')
            }
            dbStub.restore();
        })
        it('should throw a data formatting failed error', async ()=>{
            dbStub = sinon.stub(Data, 'findAll').callsFake(()=>{
                return [{
                    typeId: null,
                },]
            })
            try{
                await getAllType()
                expect.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('data formatting failed')
            }
            dbStub.restore();
        })
        it('should return a array with two object', async ()=>{
            dbStub = sinon.stub(Data, 'findAll').callsFake(()=>{
                return [{
                    typeId: 0,
                },
                {
                    typeId: 1,
                }]
            })
            let output = await getAllType()
            expect(output).to.be.a('array').to.have.lengthOf(2)
            expect(output[0]).to.deep.equal({
                name: '大學',
                id: 0,
            })
            expect(output[1]).to.deep.equal({
                name: '技專院校',
                id: 1,
            })
            dbStub.restore();
        })
    })
})
