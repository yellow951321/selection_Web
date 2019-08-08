import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(chaiAsPromised)
chai.use(sinonChai)

import labelFromNumber from 'projectRoot/mid-long-term/models/operations/label-from-number.js'
import {User, } from 'mid-long-term/models/association.js'

const expect = chai.expect
const should = chai.should()

describe('test mid-long-term/models/operations/label-from-number.js', ()=>{

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
        it('should throw a invalid argument error ', async ()=>{
            try{
                await labelFromNumber(null)
                should.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('invalid argument')
            }
        })
        it('should throw a contentID is NaN error ', async ()=>{
            try{
                await labelFromNumber({contentId: NaN})
                should.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('contentId is NaN')
            }
        })
        it('should throw a aspect is NaN error ', async ()=>{
            try{
                await labelFromNumber({contentId:0, aspect: NaN})
                should.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('aspect is NaN')
            }
        })
        it('should throw a keypoint is NaN error ', async ()=>{
            try{
                await labelFromNumber({contentId:0, aspect:0, keypoint: NaN})
                should.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('keypoint is NaN')
            }
        })
        it('should throw a method is NaN error ', async ()=>{
            try{
                await labelFromNumber({contentId:0, aspect: 0, keypoint: 0, method: NaN})
                should.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('method is NaN')
            }
        })
        it('should throw a conflictedKeypoint is NaN error ', async ()=>{
            try{
                await labelFromNumber({contentId:0 , aspect: 0, keypoint: 0, method: 0, conflictedAspect: 0,conflictedKeypoint: NaN})
                should.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('conflictedKeypoint is NaN')
            }
        })
        it('should throw a conflictedMethod is NaN error ', async ()=>{
            try{
                await labelFromNumber({contentId:0, aspect: 0, keypoint: 0, method: 0, conflictedAspect: 0, conflictedKeypoint: 0, conflictedMethod: NaN})
                should.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('conflictedMethod is NaN')
            }
        })
        it('should throw a fail to fetch reviewerId error ', async ()=>{
            dbStub.restore();
            dbStub = sinon.stub(User, 'findOne').throws()
            try{
                await labelFromNumber({contentId:0, aspect: 0, keypoint: 0, method: 0, reviewerId: 1})
                should.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('fail to fetch reviewerId')
            }
        })
        it('should return an object ', async ()=>{
            let output = await labelFromNumber({
                contentId:0, aspect: 0, keypoint: 0, method: 0,
            })
            expect(output).to.be.an('object')
            expect(mappingStub).to.have.been.calledThrice
        })

        it('should return an array ', async ()=>{
            let output = await labelFromNumber([
                {
                    contentId:0, aspect: 0, keypoint: 0, method: 0,
                },
                {
                    contentId:0, aspect: 0, keypoint: 0, method: 1,
                },
            ])
            expect(output).to.be.an('array')
            expect(mappingStub).to.have.been.callCount(6)
        })
    })

})
