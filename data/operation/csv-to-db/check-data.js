
import fs from 'fs'
import csv from 'csv-parser'
export default (filename, root_dir, typeData = '') => {

  let map = ['B','C','D','E','F','G','H']
  let result = []
  let wrongAspect = 0, emptyPage = 0
  return new Promise((res,rej)=>{
    let info = filename.split('_')
    console.log(info)
    let year, typeId, campusName
    if( typeData == 'midLongTerm'){
      year = [info[0], info[1]]
      typeId = info[2] == '大學'? 0 : 1
      campusName = info[3]
    }else if( typeData == 'shortTerm'){
      year = info[0]
      typeId = info[1] == '大學'? 0 : 1
      campusName = info[2]
    }
    fs.createReadStream(root_dir + filename)
    .pipe(csv())
    .on('data', (data) => {
      let flag = false
      data['構面'] =  String(data['構面']).trim()
      if ( map.indexOf(data['構面']) == -1 ) {
        flag = true
        wrongAspect++
      }

      if ( data['頁碼起始'] == "" && data['頁碼結束'] == "" ) {
        flag = true
        emptyPage++
      }

      if(flag){
        console.log(info)
      }
      if(flag) {
        let temp
        if(typeData == 'midLongTerm'){
          temp = {
            campus: campusName,
            yearFrom: year[0],
            yearTo: year[1],
            data
          }
        }else if( typeData == 'shortTerm'){
          temp = {
            campus: campusName,
            year: year,
            data
          }
        }
        result.push(temp)
      }
    })
    .on('end', () => {
      res({result, wrongAspect, emptyPage})
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
