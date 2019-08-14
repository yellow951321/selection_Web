import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import labelFromNumber from 'projectRoot/mid-long-term/models/operations/label-from-number.js'
import {User, } from 'mid-long-term/models/association.js'

import {map, midLongTermFromNumber,} from 'projectRoot/lib/static/javascripts/mapping/label.js'

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
        it('should throw a pageFrom is NaN error ', async ()=>{
            let invalidType = [NaN ,{}, '1', null, true, ()=> {return 123}]
            for(let arg of invalidType){
                try{
                    await labelFromNumber({dataId: 0, contentId: 0, pageFrom: arg,})
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
                    await labelFromNumber({dataId: 0, contentId: 0, pageTo: arg,})
                    expect.fail('should not get here')
                }catch(err){
                    expect(err).to.have.property('status').to.equal(400)
                    expect(err).to.have.property('message').to.equal('pageTo is NaN')
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
            let outRangeLabels = [
                {aspect: 0, keypoint: 0, method: 16},
                {aspect: 0, keypoint: 1, method: 4},
                {aspect: 0, keypoint: 2, method: 4},
                {aspect: 0, keypoint: 3, method: 11},
                {aspect: 0, keypoint: 4, method: 1},
                {aspect: 0, keypoint: 5, method: 5},
                {aspect: 0, keypoint: 6, method: 11},
                {aspect: 0, keypoint: 7, method: 5},
                {aspect: 0, keypoint: 8, method: 7},
                {aspect: 0, keypoint: 9, method: 5},
                {aspect: 0, keypoint: 10, method: 5},
                {aspect: 0, keypoint: 11, method: 6},
                {aspect: 0, keypoint: 12, method: 8},
                {aspect: 0, keypoint: 13, method: 3},
                {aspect: 0, keypoint: 14, method: 6},
                {aspect: 0, keypoint: 15, method: 4},
                {aspect: 0, keypoint: 16, method: 0},
                {aspect: 1, keypoint: 0, method: 13},
                {aspect: 1, keypoint: 1, method: 7},
                {aspect: 1, keypoint: 2, method: 7},
                {aspect: 1, keypoint: 3, method: 4},
                {aspect: 1, keypoint: 4, method: 1},
                {aspect: 1, keypoint: 5, method: 4},
                {aspect: 1, keypoint: 6, method: 0},
                {aspect: 2, keypoint: 0, method: 7},
                {aspect: 2, keypoint: 1, method: 7},
                {aspect: 2, keypoint: 2, method: 6},
                {aspect: 2, keypoint: 3, method: 7},
                {aspect: 2, keypoint: 4, method: 7},
                {aspect: 2, keypoint: 5, method: 4},
                {aspect: 2, keypoint: 6, method: 0},
                {aspect: 3, keypoint: 0, method: 5},
                {aspect: 3, keypoint: 1, method: 4},
                {aspect: 3, keypoint: 2, method: 5},
                {aspect: 3, keypoint: 3, method: 6},
                {aspect: 3, keypoint: 4, method: 6},
                {aspect: 3, keypoint: 5, method: 4},
                {aspect: 3, keypoint: 6, method: 4},
                {aspect: 3, keypoint: 7, method: 0},
                {aspect: 4, keypoint: 0, method: 7},
                {aspect: 4, keypoint: 1, method: 6},
                {aspect: 4, keypoint: 2, method: 9},
                {aspect: 4, keypoint: 3, method: 4},
                {aspect: 4, keypoint: 4, method: 5},
                {aspect: 4, keypoint: 5, method: 4},
                {aspect: 4, keypoint: 6, method: 4},
                {aspect: 4, keypoint: 7, method: 4},
                {aspect: 4, keypoint: 8, method: 5},
                {aspect: 4, keypoint: 9, method: 4},
                {aspect: 4, keypoint: 10, method: 8},
                {aspect: 4, keypoint: 11, method: 0},
            ]
            for(let outRangeLabel of outRangeLabels)
            try{
                await labelFromNumber({contentId:0, aspect: outRangeLabel.aspect, keypoint: outRangeLabel.keypoint, method: outRangeLabel.method, reviewerId: 1})
                expect.fail('should not get here')
            }catch(err){
                expect(err).to.have.property('status').to.equal(500)
                expect(err).to.have.property('message').to.equal('fail to transfer label from number')
            }
            // for(let aspectIndex of [0, 1, 2, 3, 4]){
            //     for(let keypointIndex in map[aspectIndex].keypoint){
            //         console.log(`{aspect: ${aspectIndex}, keypoint: ${keypointIndex}, method: ${map[aspectIndex].keypoint[keypointIndex].method.length}}`)
            //         try{
            //             await labelFromNumber({contentId:0, aspect: Number(aspectIndex), keypoint: Number(keypointIndex), method: map[aspectIndex].keypoint[keypointIndex].method.length, reviewerId: 1})
            //             expect.fail('should not get here')
            //         }catch(err){
            //             expect(err).to.have.property('status').to.equal(500)
            //             expect(err).to.have.property('message').to.equal('fail to transfer label from number')
            //         }
            //     }
            //     console.log(`{aspect: ${aspectIndex}, keypoint: ${map[aspectIndex].keypoint.length}, method: ${0}}`)
            //     try{
            //         await labelFromNumber({contentId:0, aspect: Number(aspectIndex), keypoint: map[aspectIndex].keypoint.length, method: 0, reviewerId: 1})
            //         expect.fail('should not get here')
            //     }catch(err){
            //         expect(err).to.have.property('status').to.equal(500)
            //         expect(err).to.have.property('message').to.equal('fail to transfer label from number')
            //     }
            // }
            try{
                await labelFromNumber({contentId:0, aspect: 7, keypoint: 0, method: 0, reviewerId: 1})
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
            for(let aspectIndex of [0, 1, 2, 3, 4]){
                for(let keypointIndex in map[aspectIndex].keypoint){
                    for(let methodIndex in map[aspectIndex].keypoint[keypointIndex].method){
                        aspectIndex = Number(aspectIndex)
                        keypointIndex = Number(keypointIndex)
                        methodIndex = Number(methodIndex)
                        let expected = {
                            dataId: NaN,
                            isChecked: undefined,
                            isConflicted: undefined,
                            content: undefined,
                            note: undefined,
                            pageFrom: undefined,
                            pageTo: undefined,
                            summary: undefined,
                            title1: undefined,
                            title2: undefined,
                            title3: undefined,
                            title4: undefined,
                            updateTime: undefined,
                        }
                        expected.contentId = 0
                        expected.method = midLongTermFromNumber({aspect: aspectIndex, keypoint: keypointIndex, method: methodIndex, }).method
                        expected.keypoint = midLongTermFromNumber({aspect: aspectIndex, keypoint: keypointIndex, }).keypoint
                        expected.aspect = midLongTermFromNumber({aspect: aspectIndex, }).aspect
                        expect(await labelFromNumber({contentId: expected.contentId, aspect: aspectIndex, keypoint: keypointIndex, method: methodIndex})).to.deep.equal(expected)
                    }
                }
            }expect(await labelFromNumber({
                contentId:0, aspect: 5, keypoint: 2, method: 3,
            })).to.contain({ contentId: 0, aspect: '不具體', keypoint: '不具體', method: '不具體' })
            expect(await labelFromNumber({
                contentId:0, aspect: 6, keypoint: 1, method: 1,
            })).to.contain({ contentId: 0, aspect: '未分類', keypoint: '未分類', method: '未分類' })
        })

    })

})
