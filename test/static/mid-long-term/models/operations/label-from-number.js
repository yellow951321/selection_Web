import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import labelFromNumber from 'projectRoot/mid-long-term/models/operations/label-from-number.js'
import {User, } from 'mid-long-term/models/association.js'

const expect = chai.expect

describe('test mid-long-term/models/operations/label-from-number.js', ()=>{

    context('test labelFromNumber',()=>{
        let dbStub
        beforeEach(()=>{
            dbStub = sinon.stub(User, 'findOne').callsFake(()=>{
                return {
                    account: 'testId',
                }
            })
        })
        afterEach(()=>{
            dbStub.restore()
        })
        it('should throw a invalid argument error ', async ()=>{
            let invalidType = [1, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await labelFromNumber(arg)
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('invalid argument')
                }
            }
        })
        it('should throw a title1 is not valid error ', async ()=>{
            let invalidType = [1 ,{}, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await labelFromNumber({title1: arg})
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
                    await labelFromNumber({title2: arg})
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
                    await labelFromNumber({title3: arg})
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
                    await labelFromNumber({title4: arg})
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
                    await labelFromNumber({content: arg})
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
                    await labelFromNumber({summary: arg})
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
                    await labelFromNumber({note: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('note is not valid')
                }
            }
        })
        it('should throw a isChecked is not valid error ', async ()=>{
            let invalidType = [2, -2, '1', {}, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await labelFromNumber({isChecked: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('isChecked is not valid')
                }
            }
        })
        it('should throw a isConflicted is not valid error ', async ()=>{
            let invalidType = [2, -2, '1', {}, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await labelFromNumber({isConflicted: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('isConflicted is not valid')
                }
            }
        })
        it('should throw a contentId is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await labelFromNumber({dataId: 0, contentId: arg})
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
                    await labelFromNumber({dataId: 0, contentId:0, aspect: arg})
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
                    await labelFromNumber({dataId: 0, contentId:0, aspect:0, keypoint: arg})
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
                    await labelFromNumber({contentId:0, aspect: 0, keypoint: 0, method: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('method is NaN')
                }
            }
        })
        it('should throw a conflictedKeypoint is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await labelFromNumber({contentId:0 , aspect: 0, keypoint: 0, method: 0, conflictedAspect: 0,conflictedKeypoint: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('conflictedKeypoint is NaN')
                }
            }
        })
        it('should throw a conflictedMethod is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', undefined, null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await labelFromNumber({contentId:0, aspect: 0, keypoint: 0, method: 0, conflictedAspect: 0, conflictedKeypoint: 0, conflictedMethod: arg})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('conflictedMethod is NaN')
                }
            }
        })
        it('should throw a fail to transfer label from number error ', async ()=>{
            try{
                await labelFromNumber({contentId:0, aspect: 0, keypoint: 0, method: 10000, reviewerId: 1})
                expect.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('fail to transfer label from number')
            }
            try{
                await labelFromNumber({contentId:0, aspect: 0, keypoint: 10000, method: 0, reviewerId: 1})
                expect.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('fail to transfer label from number')
            }
            try{
                await labelFromNumber({contentId:0, aspect: 10000, keypoint: 0, method: 0, reviewerId: 1})
                expect.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('fail to transfer label from number')
            }
        })
        it('should throw a fail to fetch reviewerId error ', async ()=>{
            dbStub.restore();
            dbStub = sinon.stub(User, 'findOne').throws()
            try{
                await labelFromNumber({contentId:0, aspect: 0, keypoint: 0, method: 0, reviewerId: 1})
                expect.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('fail to fetch reviewerId')
            }
        })
        it('should return an object ', async ()=>{
            expect(await labelFromNumber({
                contentId:0, aspect: 0, keypoint: 0, method: 0,
            })).to.contain({ contentId: 0, aspect: '教學', keypoint: '強化教學品質', method: '創新教學模式' })
            expect(await labelFromNumber({
                contentId:0, aspect: 1, keypoint: 2, method: 3,
            })).to.contain({ contentId: 0, aspect: '研究', keypoint: '學術國際化', method: '雙聯博士學位' })
            expect(await labelFromNumber({
                contentId:0, aspect: 5, keypoint: 2, method: 3,
            })).to.contain({ contentId: 0, aspect: '不具體', keypoint: '不具體', method: '不具體' })
            expect(await labelFromNumber({
                contentId:0, aspect: 6, keypoint: 1, method: 1,
            })).to.contain({ contentId: 0, aspect: '未分類', keypoint: '未分類', method: '未分類' })
        })

    })

})
