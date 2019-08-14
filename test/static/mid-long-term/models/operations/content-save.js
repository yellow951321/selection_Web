import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import contentSave from 'projectRoot/mid-long-term/models/operations/content-save.js'
import {Content, Data, } from 'mid-long-term/models/association.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test mid-long-term/models/operations/content-save.js', ()=>{

    context('test contentSave',()=>{
        let ContentFindOneStub, ContentUpdateStub, DataFindOneStub
        beforeEach(()=>{
            ContentFindOneStub = sandbox.stub(Content, 'findOne').callsFake(()=>{
               return 'testing content'
            })
            ContentUpdateStub = sandbox.stub(Content, 'update').callsFake(()=>{
                return 'testing content'
             })
            DataFindOneStub = sandbox.stub(Data, 'findOne').callsFake(()=>{
                return {
                    userId: 0, 
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
                    await contentSave(arg)
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('invalid argument')
                }
            }
        })
        it('should throw a userId is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await contentSave({userId: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('userId is NaN')
                }
            }
        })
        it('should throw a title1 is not valid error ', async ()=>{
            let invalidType = [1 ,{}, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await contentSave({userId: 0, contentId: 0,  title1: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('title1 is not valid')
                }
            }
        })
        it('should throw a title2 is not valid error ', async ()=>{
            let invalidType = [1 ,{}, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await contentSave({userId: 0, contentId: 0,  title2: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('title2 is not valid')
                }
            }
        })
        it('should throw a title3 is not valid error ', async ()=>{
            let invalidType = [1 ,{}, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await contentSave({userId: 0, contentId: 0,  title3: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('title3 is not valid')
                }
            }
        })
        it('should throw a title4 is not valid error ', async ()=>{
            let invalidType = [1 ,{}, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await contentSave({userId: 0, contentId: 0,  title4: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('title4 is not valid')
                }
            }
        })
        it('should throw a content is not valid error ', async ()=>{
            let invalidType = [1 ,{}, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await contentSave({userId: 0, contentId: 0,  content: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('content is not valid')
                }
            }
        })
        it('should throw a summary is not valid error ', async ()=>{
            let invalidType = [1 ,{}, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await contentSave({userId: 0, contentId: 0,  summary: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('summary is not valid')
                }
            }
        })
        it('should throw a note is not valid error ', async ()=>{
            let invalidType = [1 ,{}, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await contentSave({userId: 0, contentId: 0,  note: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('note is not valid')
                }
            }
        })
        it('should throw a pageFrom is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await contentSave({userId: 0, contentId: 0,  pageFrom: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('pageFrom is NaN')
                }
            }
        })
        it('should throw a pageTo is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await contentSave({userId: 0, contentId: 0,  pageTo: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('pageTo is NaN')
                }
            }
        })
        it('should throw a fetching data failed error ', async ()=>{
            ContentFindOneStub.restore()
            ContentFindOneStub = sandbox.stub(Content, 'findOne').throws()
            try{
                await contentSave({userId: 0, contentId: 0, })
                expect.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('fetching data failed')
            }
            ContentFindOneStub.restore()
            ContentFindOneStub = sandbox.stub(Content, 'findOne').callsFake(()=>{
                return 'testing content'
            })
            DataFindOneStub.restore()
            DataFindOneStub = sandbox.stub(Data, 'findOne').throws()
            try{
                await contentSave({userId: 0, contentId: 0, })
                expect.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('fetching data failed')
            }
        })
        it('should throw a fetching data failed error ', async ()=>{
            DataFindOneStub.restore()
            DataFindOneStub = sandbox.stub(Data, 'findOne').callsFake(()=>{
                return null
            })
            try{
                await contentSave({userId: 0, contentId: 0, })
                expect.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(404)
                expect(err).to.have.property('message').to.equal('data not found')
            }
        })
        it('should throw a data not found error ', async ()=>{
            DataFindOneStub.restore()
            DataFindOneStub = sandbox.stub(Data, 'findOne').callsFake(()=>{
                return null
            })
            try{
                await contentSave({userId: 0, contentId: 0, })
                expect.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(404)
                expect(err).to.have.property('message').to.equal('data not found')
            }
        })
        it('should throw a Unauthorized error ', async ()=>{
            DataFindOneStub.restore()
            DataFindOneStub = sandbox.stub(Data, 'findOne').callsFake(()=>{
                return {
                    userId: 1,
                }
            })
            try{
                await contentSave({userId: 0, contentId: 0, })
                expect.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(405)
                expect(err).to.have.property('message').to.equal('Unauthorized')
            }
        })
        it('should throw a updating data failed error ', async ()=>{
            ContentUpdateStub.restore()
            ContentUpdateStub = sandbox.stub(Content, 'update').throws()
            try{
                await contentSave({userId: 0, contentId: 0, })
                expect.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('updating data failed')
            }
        })
    })

})
