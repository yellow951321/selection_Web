const {map, getFromWord, getFromNum, } = require('./mapping')
const chai = require('chai')
const expect = chai.expect

describe('mapping test', ()=>{
  context('get from Number', ()=>{
    it('should return some number', ()=>{
      expect(getFromWord(map, {
        dimension: '教學',
      })).to.equal(0)

      expect(getFromWord(map, {
        dimension: '產學',
      })).to.equal(2)
    })

    expect(getFromWord(map, {
      campus: '中原大學',
      type: '大學',
    })).to.equal(0)

    expect(getFromWord(map, {
      campus: '國立東華大學',
      type: '大學',
    })).to.equal(3)

    expect(getFromWord(map, {
      campus: '元智大學',
      type: '大學',
    })).to.equal(15)

    expect(getFromWord(map, {
      campus: '仁德醫護管理專科學校',
      type: '技專院校',
    })).to.equal(0)

    expect(getFromWord(map, {
      campus: '國立臺南護理專科學校',
      type: '技專院校',
    })).to.equal(5)

  })
  context('get from word', ()=>{
    it('should return some words', ()=>{
      expect(getFromNum(map, {
        dimension: 0,
      })).to.equal('教學')
    })


    it('should return some words', ()=>{
      expect(getFromNum(map, {
        dimension: 2,
      })).to.equal('產學')
    })


    it('should return some words', ()=>{
      expect(getFromNum(map, {
        campus: 12,
        type: 1,
      })).to.equal('長庚科技大學')
      expect(getFromNum(map, {
        type: 1,
      })).to.equal('技專院校')
    })
  })

})
// const result = getFromNum(map,{
//   detail: 26
// })
// const result2 = getFromNum(map,{

// })


// console.log(result)