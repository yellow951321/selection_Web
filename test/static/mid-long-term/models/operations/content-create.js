import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import contentCreate from 'projectRoot/mid-long-term/models/operations/content-create.js'
import {Content, } from 'mid-long-term/models/association.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test mid-long-term/models/operations/content-create.js', ()=>{

    context('test contentCreate',()=>{
        let createStub
        beforeEach(()=>{
            createStub = sandbox.stub(Content, 'create').callsFake(()=>{
                return {
                    title1: null,
                    title2: null,
                    title3: null,
                    title4: null,
                    content: null,
                    summary: null,
                    note: null,
                    isChecked: 0,
                    isConflicted: 0,
                    contentId: 0,
                    aspect: 0,
                    keypoint: 0,
                    method: 0,
                }
            })
        })
        afterEach(()=>{
            sandbox.restore()
        })
        it('should throw a invalid argument error ', async ()=>{
            let invalidType = [1, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await contentCreate(arg)
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('invalid argument')
                }
            }
        })
        it('should throw a dataId is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await contentUpdate({dataId: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('dataId is NaN')
                }
            }
        })
        it('should throw a aspect is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await contentUpdate({
                        dataId: 0,
                        aspect: arg,
                    })
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('aspect is NaN')
                }
            }
        })
        it('should throw a keypoint is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await contentUpdate({
                        dataId: 0,
                        aspect: 0,
                        keypoint: arg,
                    })
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('keypoint is NaN')
                }
            }
        })
        it('should throw a method is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await contentUpdate({
                        dataId: 0,
                        aspect: 0,
                        keypoint: 0,
                        method: arg,
                    })
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('method is NaN')
                }
            }
        })
        it('should throw a creating data failed error ', async ()=>{
            createStub.restore()
            createStub = sandbox.stub(Content, 'create').throws()
            try{
                await contentUpdate({
                    dataId: 0,
                    aspect: 0,
                    keypoint: 0,
                    method: 0,
                })
                expect.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('creating data failed')
            }
        })
    })

})
