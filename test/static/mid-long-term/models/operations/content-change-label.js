import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import contentChangeLabel from 'projectRoot/mid-long-term/models/operations/content-change-label.js'
import {Content, } from 'mid-long-term/models/association.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test mid-long-term/models/operations/content-change-label.js', ()=>{

    context('test contentChangeLabel',()=>{
        let findOneStub
        beforeEach(()=>{
            findOneStub = sandbox.stub(Content, 'findOne').callsFake(()=>{
                return {
                    update: ()=>{
                        return 'testing data'
                    },
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
                    await contentChangeLabel(arg)
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('invalid argument')
                }
            }
        })
        it('should throw a contentId is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await contentChangeLabel({contentId: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('contentId is NaN')
                }
            }
        })
        it('should throw a aspect is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await contentChangeLabel({
                        contentId: 0,
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
                    await contentChangeLabel({
                        contentId: 0,
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
                    await contentChangeLabel({
                        contentId: 0,
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
        it('should throw a fetching data failed error ', async ()=>{
            findOneStub.restore()
            findOneStub = sandbox.stub(Content, 'findOne').throws()
            try{
                await contentChangeLabel({
                    contentId: 0,
                    aspect: 0,
                    keypoint: 0,
                    method: 0,
                })
                expect.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('fetching data failed')
            }
        })
        it('should throw a updating data failed error ', async ()=>{
            findOneStub.restore()
            findOneStub = sandbox.stub(Content, 'findOne').callsFake(()=>{
                return {
                    update: ()=>{
                        throw new Error()
                    },
                }
            })
            try{
                await contentChangeLabel({
                    contentId: 0,
                    aspect: 0,
                    keypoint: 0,
                    method: 0,
                })
                expect.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('updating data failed')
            }
        })
    })
})
