const OpUser = require('../../models/mariadb/User/op')
const OpYear = require('../../models/mariadb/Year/op')
const OpCampus = require('../../models/mariadb/Campus/op')
const OpDimension = require('../../models/mariadb/Dimension/op')
const OpItem = require('../../models/mariadb/Item/op')
const OpDetail = require('../../models/mariadb/Detail/op')
const OpContent = require('../../models/mariadb/Content/op')
const {map,getFromWord,getFromNum} = require('./mapping')
const fs = require('fs')

const findAllCampusIdWithRespectUser = async (user_id)=>{
  try{
    let result = {}
    result.user = user_id

    const arr_yearId = await OpYear.findYearAll(user_id).map(d=> d.dataValues.year_id)

    let year = []

    await new Promise(async (res,rej)=>{
      for(let year_id of arr_yearId){
        let arr_campusId = await OpCampus.findCampusAll(year_id).then(data=>{
          return  data.map(d=> d.dataValues.campus_id)
          })
        let t = {}
        t[year_id] = arr_campusId
        year.push(t)
      }
      res()
    })

    result.year = year

    return result
  }
  catch(err){
    console.log(err)
  }
}

const countAllDetailRespectToCampusId = async (campus_id)=>{
  try{
    let result = {}
    result[campus_id] = {}
    const dimensions = await OpDimension.findDimensionAll(campus_id).map(d=>d.dataValues)
    await new Promise(async (res,rej)=>{
      for(let {dimension_id,dimension_name} of dimensions){
        result[campus_id][dimension_name] = {}
        const items = await OpItem.findItemAll(dimension_id).map(d=>d.dataValues)
        for(let {item_id,item_name} of items){
          result[campus_id][dimension_name][item_name] = {}
          const details = await OpDetail.findDetailAll(item_id).map(d=>d.dataValues)
          for(let {detail_id,detail_name} of details){
            const contentNum = await OpContent.countContentByDetailId(detail_id)
            console.log(contentNum)
            result[campus_id][dimension_name][item_name][detail_name] = contentNum
          }
        }
      }
      res()
    })
    return result
  }
  catch(err){
    console.log(err)
  }
}


const convertToWord = (obj)=>{
  let result = {}
  Object.keys(obj).map(campus_id=>{
    result[campus_id] = {}
    Object.keys(obj[campus_id]).map(dimension_id=>{
      const dimension_word = getFromNum(map,{
        dimension: dimension_id
      })
      result[campus_id][dimension_word] = {}
      Object.keys(obj[campus_id][dimension_id]).map(item_id=>{
        const item_word = getFromNum(map,{
          item: item_id
        })
        result[campus_id][dimension_word][item_word] = {}
        Object.keys(obj[campus_id][dimension_id][item_id]).map(detail_id=>{
            const detail_word = getFromNum(map,{
              detail: detail_id
            })
            result[campus_id][dimension_word][item_word][detail_word] = obj[campus_id][dimension_id][item_id][detail_id]
        })
      })
    })
  })

  return result
}

const convertToJson = (obj,flag)=>{

  let result = []

  Object.keys(obj).map(campus_id=>{
    Object.keys(obj[campus_id]).map(dimension_word=>{
      Object.keys(obj[campus_id][dimension_word]).map(item_word=>{
        Object.keys(obj[campus_id][dimension_word][item_word]).map(detail_word=>{
          let t = {
            detail: detail_word,
            value : obj[campus_id][dimension_word][item_word][detail_word]
          }
          result.push(t)
        })
      })
    })
  })
  if(flag.json == true){
    fs.writeFile('test.json',JSON.stringify(result,null,2),(err)=>{
      if(err) console.log(err)
    })
  }else{
    return result
  }
}

const findParentByDetail = (target_detail)=>{
    var data = fs.readFileSync('data/projectSchema.json','utf-8')

    data = JSON.parse(data)
    let result
    for(let dimension in data){
      if(dimension != "學校" || "年度" || "類型"){
        for(let item in data[dimension]){
          for(let detail in data[dimension][item]){
            if(detail === target_detail){
              result = {
                dimension: dimension,
                item: item,
                detail: target_detail
              }
            }
          }
        }
      }
    }

    return result
}

const test = async ()=>{

  const result = await countAllDetailRespectToCampusId(2)
  console.log(result)
  const result_word = convertToWord(result)

  convertToJson(result_word)

}

// test()


module.exports = {
  findAllCampusIdWithRespectUser,
  countAllDetailRespectToCampusId,
  convertToWord,
  convertToJson,
  findParentByDetail
}