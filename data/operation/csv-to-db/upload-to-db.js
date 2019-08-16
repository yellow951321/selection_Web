import midLongTermData from 'projectRoot/mid-long-term/models/schemas/Data.js'
import midLongTermContent from 'projectRoot/mid-long-term/models/schemas/Content.js'
import shortTermData from 'projectRoot/short-term/models/schemas/Data.js'
import shortTermContent from 'projectRoot/short-term/models/schemas/Content.js'

import campusMap from 'projectRoot/lib/static/javascripts/mapping/campus.js'



export default async (data=[], typeData) => {
  try{
    const map = ['B','C','D','E','F','G','H']
    const campusId = data[0].campusId
    const typeId = data[0].typeId
    let dbData, dbContent, tempData
    if(typeData == 'shortTerm'){
      dbData = shortTermData
      dbContent = shortTermContent
      tempData = {
        typeId,
        year : data[0].year,
        campusId,
        userId: 6
      }
    }else if(typeData == 'midLongTerm'){
      dbData = midLongTermData
      dbContent = midLongTermContent
      tempData = {
        yearFrom : data[0].yearFrom,
        yearTo : data[0].yearTo,
        typeId,
        campusId,
        userId: 6
      }
    }
    /**
     * create cmapus
     */

    const campusData = await dbData
    .create(tempData)
    .then( data => data.dataValues )
    .catch( (err)=> {
      console.log(err)
      return
    })
    /**
     * create content
     */
    await Promise.all( data.map(async ({data}) => {
      const d = {
        pageFrom : data['頁碼起始'],
        pageTo : data['頁碼結束'],
        title1 : data['大標題'],
        title2 : data['中標題'],
        title3 : data['小標題'],
        title4 : data['最小標題'],
        content : data['內容'],
        summary : data['摘要'],
        note : data['備註'],
        aspect : map.indexOf(data['構面']),
        keypoint : /[GH]/.test(data['構面']) ? 0 : Number(data['推動重點']) - 1,
        method : /[GH]/.test(data['構面']) ? 0 : Number(data['作法']) -1
      }
      await dbContent.create({
        title1: d.title1,
        title2: d.title2,
        title3: d.title3,
        title4: d.title4,
        content: d.content,
        summary: d.summary,
        pageFrom: d.pageFrom,
        pageTo: d.pageTo,
        isChecked: 0,
        isConflicted: 0,
        aspect: d.aspect,
        keypoint: d.keypoint,
        method: d.method,
        updateTime: Date.now(),
        dataId: campusData.dataId,
      }).catch( (err) => {
        console.log(campusData.campusId)
        console.log('occurred error')
        console.log(data)
        console.log(err)
        console.log('==================================')
      })
    }))
  }catch(err){
    console.log(err)
    throw new Error(err)
  }
}