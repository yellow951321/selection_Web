import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai) 

import labelFromNumber from 'projectRoot/mid-long-term/models/operations/label-from-number.js'

const expect = chai.expect
const sandbox = sinon.createSandbox();

describe('chai test', () => {

    context('test label-from-number',()=>{
        it('should return an object ', async ()=>{
            let mappingStub = sinon.stub().callsFake(()=>{
                return {
                    method: 'testMethod',
                    keypoint: 'testKeypoint',
                    aspect: 'testAspect'
                }
            })
            labelFromNumber.__set__('midLongTermFromNumber', mappingStub)
            let output = await labelFromNumber({
                dataValues: {aspect: 0, keypoint: 0, method: 0},
            })

            expect(output).to.be.an('object')
            expect(output).to.deep.equal({
                method: 'testMethod',
                keypoint: 'testKeypoint',
                aspect: 'testAspect'
            })
            expect(mappingStub).to.have.been.calledThrice

            labelFromNumber.__ResetDependency__('midLongTermFromNumber')
        })

        it('should return an array ', async ()=>{
            let mappingStub = sinon.stub().callsFake(()=>{
                return {
                    method: 'testMethod',
                    keypoint: 'testKeypoint',
                    aspect: 'testAspect'
                }
            })
            labelFromNumber.__set__('midLongTermFromNumber', mappingStub)
            let output = await labelFromNumber([
                {
                    dataValues: {aspect: 0, keypoint: 0, method: 0},
                },
                {
                    dataValues: {aspect: 0, keypoint: 0, method: 1},
                }
            ])

            expect(output).to.be.an('array')
            expect(mappingStub).to.have.been.callCount(6)

            labelFromNumber.__ResetDependency__('midLongTermFromNumber')
        })
    })

})
