import fs from 'fs'
import csv from 'csv-parser'


export default (filename) => {

  let map = ['B','C','D','E','F','G','H']
  let result = []
  let wrongResult = []
  return new Promise((res,rej)=>{
    fs.createReadStream(filename)
    .pipe(csv())
    .on('data', (data) => {
      let flag = false

      if ( map.indexOf(data['構面']) == -1 ){
        flag = true
      }

      if ( data['頁碼起始'] == "" && data['頁碼結束'] == "" && flag){
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