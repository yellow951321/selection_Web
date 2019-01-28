const { map, getFromWord, getFromNum, } = require('./data/operation/mapping')
const { insertYearByUserId, findAllCampusbyYearId, } = require('./models/mariadb/Year/op')
const { insertCampusByYearId, deleteCampus, } = require('./models/mariadb/Campus/op')
const { insertDimensionByCampusId, } = require('./models/mariadb/Dimension/op')
const { insertItemByDimensionId, } = require('./models/mariadb/Item/op')
const { insertDetailByItemId, } = require('./models/mariadb/Detail/op')
const { insertContentByDetailId, updateContentById, } = require('./models/mariadb/Content/op')
const fs = require('fs')
const User = require('./models/mariadb/User/schema')

const hihi = async() =>{
  try{
    // let files = await new Promise(( res,rej ) =>fs.readdir(`${__dirname}/data/大學/1`, (err, file) => {
    //     if(err) return rej(err)
    //     return res(file)
    // }))

    // files = files.map(val => `${__dirname}/data/大學/1/${val}`)
    // for(let val of files){
    //     await insertdata(val, '123456')
    // }

    let output = await deleteCampus(19)
    console.log(output)
  }
  catch(err){
    console.log(err.message)
  }
}

function readSchema(path){
  return new Promise((res, rej) => {
    fs.readFile(path, 'utf-8', (err, data)=>{
      if(err) rej(err)
      res(data)
    })
  })
    .then(data => JSON.parse(data))
    .then(data => {return data})
}

function findUserByName(name){
  return new Promise((res, rej) => {
    User.findOne({
      where: {user_name: name, },
    })
      .then(data => res(data))
      .catch(err => rej(err))
  })
    .then(data => {return data})
    .catch(err => {throw err})
}

async function insertdata(path, username){
  try{
    let originData = await readSchema(path)
    let user = await findUserByName(username)
    let year = await insertYearByUserId(user.user_id, originData['年度'])()
    let campus = await insertCampusByYearId(year.year_id, getFromWord(map, {
      campus: originData['學校'],
      type: originData['類型'],
    }), map['type'].indexOf(originData['類型']))()

    for(let dim of Reflect.ownKeys(originData)){
      if(dim == '年度'||dim =='學校'||dim =='類型'){
        continue
      }
      // error handle
      if (getFromWord(map, { dimension: dim, }) == -1){
        throw new Error(`index is -1, mapping error at ${originData['學校']}`)
      }
      for(let itm of Reflect.ownKeys(originData[dim])){
        // error handle
        if (getFromWord(map, { item: itm, }) == -1){
          throw new Error(`index is -1, mapping error at ${originData['學校']}/${itm}`)
        }
        for(let det of Reflect.ownKeys(originData[dim][itm])){
          // error handle
          if (getFromWord(map, { detail: det, }) == -1){
            throw new Error(`index is -1, mapping error at ${originData['學校']}/${itm}`)
          }
          // declare out of for loop
          let dimension = {}
          let item = {}
          let detail = {}
          for(let cont of originData[dim][itm][det]){
            // only the first content need to insert
            // this ensure details containing at least one content
            // insert dimension, item, and detail
            if(originData[dim][itm][det].indexOf(cont) == 0){
              dimension = await insertDimensionByCampusId(campus.campus_id, getFromWord(map, {
                dimension: dim,
              }))()
              item = await insertItemByDimensionId(dimension.dimension_id, getFromWord(map, {
                item: itm,
              }))()
              detail = await insertDetailByItemId(item.item_id, getFromWord(map, {
                detail: det,
              }))()
            }
            if(cont['page'][0] === null){
              cont['page'][0] = '1'
            }
            if(cont['page'][1] === null){
              cont['page'][1] = cont['page']['0']
            }
            // await insertContentByDetailId(detail.detail_id, cont['page'][0], cont['page'][1], cont['title'], cont['paragraph'])
          }
        }
      }
    }
  }
  catch(err){
    throw err
  }
}

hihi()
