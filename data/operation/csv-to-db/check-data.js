
import fs from 'fs'
import csv from 'csv-parser'
import campusMap from 'projectRoot/lib/static/javascripts/mapping/campus.js'

export default (filename, root_dir, typeData = '') => {

  let map = ['B','C','D','E','F','G','H']
  let result = []
  let wrongResult = []
  return new Promise((res,rej)=>{
    let info = filename.split('_')
    console.log(info)
    let year, typeId, campusName, campusId
    if( typeData == 'midLongTerm'){
      year = [info[0], info[1]]
      typeId = info[2] == '大學'? 0 : 1
      campusName = info[3].split(".")[0]
      campusId = campusMap[typeId].campus.indexOf(campusName)
    }else if( typeData == 'shortTerm'){
      year = info[0]
      typeId = info[1] == '大學'? 0 : 1
      campusName = info[2].split(".")[0]
      campusId = campusMap[typeId].campus.indexOf(campusName)
    }
    fs.createReadStream(root_dir + filename)
    .pipe(csv())
    .on('data', (data) => {
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
        wrongAspect++
      }

      if ( data['﻿頁碼起始'] == "" && data['頁碼結束'] == "" ) {
        data['頁碼起始'] = 0
        data['頁碼結束'] = 0
      }else
        data['頁碼起始'] = data['﻿頁碼起始']

      delete data['﻿頁碼起始']
      // data['構面'] = map.indexOf(data['構面'])
      if(flag){
        console.log(info)
      }
      let temp
      if(typeData == 'midLongTerm'){
        temp = {
          campus: campusName,
          yearFrom: year[0],
          yearTo: year[1],
          typeId,
          campusId,
          data
        }
      }else if( typeData == 'shortTerm'){
        temp = {
          campus: campusName,
          year: year,
          typeId,
          campusId,
          data
        }
      }
      if(flag) {
        wrongResult.push(temp)
      } else {
        result.push(temp)
      }
    })
    .on('end', () => {
      res({result, wrongResult})
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
