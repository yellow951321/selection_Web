import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import getContent from 'projectRoot/mid-long-term/models/operations/get-content.js'
import {Content, } from 'mid-long-term/models/association.js'

const expect = chai.expect
const should = chai.should()

describe('test mid-long-term/models/operations/get-contentjs', ()=>{

    context('test getContent', ()=>{
        let dbStub, labelFromNumberStub
        beforeEach(()=>{
            dbStub = sinon.stub(Content, 'findAll').callsFake(()=>{
                return [{
                    contentId: 0,
                    aspect: 0,
                    keypoint: 0,
                    method: 0,
                }]
            })
        })
        afterEach(()=>{
            dbStub.restore()
        })
        it('should throw a dataId is NaN error', async()=>{
            let invalidType = ['ABC', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await getContent(0, 0, 0, arg)
                    should.fail('should not get here')
                }
                catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('dataId is NaN')
                }
            }
        })
        it('should throw a aspect is NaN error', async()=>{
            let invalidType = [NaN, 'ABC', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await getContent(arg, 0, 0, 0)
                    should.fail('should not get here')
                }
                catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('aspect is NaN')
                }
            }
        })
        it('should throw a keypoint is NaN error', async()=>{
            let invalidType = [NaN, 'ABC', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await getContent(0, arg, 0, 0)
                    should.fail('should not get here')
                }
                catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('keypoint is NaN')
                }
            }
        })
        it('should throw a method is NaN error', async()=>{
            let invalidType = [NaN, 'ABC', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await getContent(0, 0, arg, 0)
                    should.fail('should not get here')
                }
                catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('method is NaN')
                }
            }
        })
        it('should throw a isChecked is not a valid option error', async()=>{
            let invalidType = [2, -2, NaN, 'ABC', null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await getContent(0, 0, 0, 0, arg)
                    should.fail('should not get here')
                }
                catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('isChecked is not a valid option')
                }
            }
        })
        it('should throw a isConflicted is not a valid option error', async()=>{
            let invalidType = [2, -2, NaN, 'ABC', null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await getContent(0, 0, 0, 0, -1, arg)
                    should.fail('should not get here')
                }
                catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('isConflicted is not a valid option')
                }
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
        it('should throw a data formatting failed', async()=>{
            labelFromNumberStub = sinon.stub().throws()
            getContent.__set__('labelFromNumber', labelFromNumberStub)
            try{
                await getContent(0, 0, 0, 0)
                should.fail('should not get here')
            }
            catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('data formatting failed')
            }
            getContent.__ResetDependency__('labelFromNumber')
        })
        it('should return a array', async()=>{
            expect(await getContent(0, 0, 0, 0)).to.be.instanceOf(Array).to.have.lengthOf(1)
        })
    })
})