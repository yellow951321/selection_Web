import fs from 'fs'
import csv from 'csv-parser'
import {map} from 'projectRoot/lib/static/javascripts/mapping/label.js'

const parse_data = (data) => {

}

const check_data = (data) => {
  try{
    let flag = false
    data['構面'] =  String(data['構面']).trim()
    /**
     * `不具體`
     */
    if ( data['構面'] == -1 && data['推動重點'] == -1){
      data['構面'] = 'G'
    }
    /**
     * `尚未分類`
     */
     if( data['構面'] == -1 && data['推動重點'] != -1){
       data['構面'] = 'H'
     }

     if ( data['構面'] != -1 && map.indexOf(data['構面']) == -1 ) {
      flag = true
    }

    if ( data['頁碼起始'] == "" && data['頁碼結束'] == "" ) {
      data['頁碼起始'] = 0
      data['頁碼結束'] = 0
    }

    if(flag)
      return false

    return data
  }catch(err){
    console.log(err)
  }
}

const valid_data = (content) => {
  try{

    let aspectMap = ['B','C','D','E','F','G','H']
    let {
      aspect = null,
      keypoint = null,
      method = null
    } = content || {}

    aspect = aspectMap.indexOf(aspect)
    if(aspect == - 1)
      throw new Error('There are some problem in check data')
    keypoint = Number(keypoint) - 1
    method = Number(method) - 1


    const result = (() => {
      if(map[aspect]){
        if(map[aspect].keypoint[keypoint]){
          if(map[aspect].keypoint[keypoint].method[method]){
            return map[aspect].keypoint[keypoint].method[method]
          }else {
            return null
          }
        }else{
          return null
        }
      }else{
        return null
      }
    })()

    if(result !== null ){
      return true
    }else {
      return false
    }
  }catch(err){
    console.log(err + 'error occurred in data-valid.js')
  }
}

export default (filename) => {

  let map = ['B','C','D','E','F','G','H']
  let result = []
  let wrongResult = []
  return new Promise((res,rej)=>{
    fs.createReadStream(filename)
    .pipe(csv())
    .on('data', (data) => {
      let flag = false
      /**
       * check block
       */
      let checkedData = check_data(data)
      if( typeof checkedData === 'boolean'){
        flag = true
      }else {
        data = checkedData
      }

      /**
       * valid block
       */
      if( valid_data({
        aspect : data['構面'],
        keypoint : data['推動重點'],
        method : data['作法']
      }) ) {
        flag = true
      }


      if(flag){
        console.log(data)
      }
      let temp = {
        pageFrom : data['頁碼起始'] == "" ? (data['頁碼結束'] == "" ? 0 : data['頁碼結束'])  : data['頁碼起始'],
        pageTo : data['頁碼結束'] == "" ? 0 : data['頁碼結束'],
        title1 : data['大標題'],
        title2 : data['中標題'],
        title3 : data['小標題'],
        title4 : data['最小標題'],
        content : data['內容'],
        summary : data['摘要'],
        note : data['備註'],
        aspect : map.indexOf(data['構面']),
        keypoint : /[GH]/.test(data['構面']) ? 0 : Number(data['推動重點'])-1,
        method : /[GH]/.test(data['構面']) ? 0 : Number(data['作法']) -1,
      }
      if(!flag) {
        result.push(temp)
      }else {
        wrongResult.push(temp)
      }
    })
    .on('end', () => {
      res({
        result,
        wrongResult
      })
      console.log('finished')
    })
    .on('error', () => {
      rej(new Error('Something wrong'))
    })
  })
  .then( data => {
    return data
  })
  .catch( err => {
    console.log(err)
  })
}