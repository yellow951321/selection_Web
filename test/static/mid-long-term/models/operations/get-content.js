import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(chaiAsPromised)
chai.use(sinonChai)

import getContent from 'projectRoot/mid-long-term/models/operations/get-content.js'
import {Content, } from 'mid-long-term/models/association.js'

const expect = chai.expect
const should = chai.should()

describe('test mid-long-term/models/operations/get-contentjs', ()=>{

    context('test getContent', ()=>{
        let labelFromNumberStub, dbStub
        beforeEach(()=>{
            labelFromNumberStub = sinon.stub().callsFake(()=>{
                return 'test string'
            })
            getContent.__set__('labelFromNumber', labelFromNumberStub)
            dbStub = sinon.stub(Content, 'findAll').callsFake(()=>{
                return ['test']
            })
        })
        afterEach(()=>{
            getContent.__ResetDependency__('labelFromNumber')
            dbStub.restore()
        })
        it('should throw a dataId is NaN error', async()=>{
            try{
                await getContent(0, 0, 0, undefined)
                should.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('dataId is NaN')
            }
        })
        it('should throw a aspect is NaN error', async()=>{
            try{
                await getContent(undefined, 0, 0, 0)
                should.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('aspect is NaN')
            }
        })
        it('should throw a keypoint is NaN error', async()=>{
            try{
                await getContent(0, undefined, 0, 0)
                should.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('keypoint is NaN')
            }
        })
        it('should throw a method is NaN error', async()=>{
            try{
                await getContent(0, 0, undefined, 0)
                should.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('method is NaN')
            }
        })
        it('should throw a isChecked is not a valid option error', async()=>{
            try{
                await getContent(0, 0, 0, 0, NaN)
                should.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('isChecked is not a valid option')
            }
            try{
                await getContent(0, 0, 0, 0, 2)
                should.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('isChecked is not a valid option')
            }
            try{
                await getContent(0, 0, 0, 0, -2)
                should.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('isChecked is not a valid option')
            }
        })
        it('should throw a isConflicted is not a valid option error', async()=>{
            try{
                await getContent(0, 0, 0, 0, -1, NaN)
                should.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('isConflicted is not a valid option')
            }
            try{
                await getContent(0, 0, 0, 0, -1, 2)
                should.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('isConflicted is not a valid option')
            }
            try{
                await getContent(0, 0, 0, 0, -1, -2)
                should.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(400)
                expect(err).to.have.property('message').to.equal('isConflicted is not a valid option')
            }
        })
        it('should return empty data', async()=>{
            dbStub.restore()
            dbStub = sinon.stub(Content, 'findAll').callsFake(()=>{
                return []
            })
            expect(await getContent(0, 0, 0, 0)).to.equal('empty data')

            dbStub.restore()
            dbStub = sinon.stub(Content, 'findAll').callsFake(()=>{
                return null
            })
            expect(await getContent(0, 0, 0, 0)).to.equal('empty data')
        })
        it('should return test string', async()=>{
            expect(await getContent(0, 0, 0, 0)).to.equal('test string')
        })
    })
})