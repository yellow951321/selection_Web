import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai) 

import labelFromNumber from 'projectRoot/mid-long-term/models/operations/label-from-number.js'
import User from 'projectRoot/auth/models/schemas/user.js'

const expect = chai.expect

describe('test mid-long-term/models/operations/label-from-number.js', () => {

    context('test labelFromNumber',()=>{
        let mappingStub, dbStub
        beforeEach(()=>{
            mappingStub = sinon.stub().callsFake(()=>{
                return {
                    method: 'testMethod',
                    keypoint: 'testKeypoint',
                    aspect: 'testAspect'
                }
            })
            labelFromNumber.__set__('midLongTermFromNumber', mappingStub)

            dbStub = sinon.stub(User, 'findOne').callsFake(()=>{
                return {
                    account: 'testId',
                }
            })
        })
        afterEach(()=>{
            labelFromNumber.__ResetDependency__('midLongTermFromNumber')
            dbStub.restore()
        })
        it('should throw an invalid argument error ', async ()=>{
            try{
                await labelFromNumber(null)
            }catch(err){
                expect(err).to.have.property('status').to.equals(400)
                expect(err).to.have.property('message').to.equals('invalid argument')
            }
            dbStub.restore();
        })
        it('should throw an contentID is NaN error ', async ()=>{
            try{
                await labelFromNumber({contentId: NaN})
            }catch(err){
                expect(err).to.have.property('status').to.equals(400)
                expect(err).to.have.property('message').to.equals('contentId is NaN')
            }
            dbStub.restore();
        })
        it('should throw an aspect is NaN error ', async ()=>{
            try{
                await labelFromNumber({aspect: NaN})
            }catch(err){
                expect(err).to.have.property('status').to.equals(400)
                expect(err).to.have.property('message').to.equals('aspect is NaN')
            }
            dbStub.restore();
        })
        it('should throw an keypoint is NaN error ', async ()=>{
            try{
                await labelFromNumber({keypoint: NaN})
            }catch(err){
                expect(err).to.have.property('status').to.equals(400)
                expect(err).to.have.property('message').to.equals('keypoint is NaN')
            }
            dbStub.restore();
        })
        it('should throw an method is NaN error ', async ()=>{
            try{
                await labelFromNumber({method: NaN})
            }catch(err){
                expect(err).to.have.property('status').to.equals(400)
                expect(err).to.have.property('message').to.equals('method is NaN')
            }
            dbStub.restore();
        })
        it('should return an object ', async ()=>{
            let output = await labelFromNumber({
                aspect: 0, keypoint: 0, method: 0,
            })
            expect(output).to.be.an('object')
            expect(mappingStub).to.have.been.calledThrice
        })

        it('should return an array ', async ()=>{
            let output = await labelFromNumber([
                {
                    aspect: 0, keypoint: 0, method: 0,
                },
                {
                    aspect: 0, keypoint: 0, method: 1,
                },
            ])
            expect(output).to.be.an('array')
            expect(mappingStub).to.have.been.callCount(6)
        })
    })

})
