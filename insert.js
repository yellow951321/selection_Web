const { map,getFromWord,getFromNum } = require('./data/operation/mapping');
const { insertYearByUserId } = require('./models/mariadb/Year/op')
const { insertCampusByYearId } = require('./models/mariadb/Campus/op')
const { insertDimensionByCampusId } = require('./models/mariadb/Dimension/op')
const { insertItemByDimensionId } = require('./models/mariadb/Item/op')
const { insertDetailByItemId } = require('./models/mariadb/Detail/op')
const { InsertContentByDetailId, updateContentById} = require('./models/mariadb/Content/op')
const fs = require('fs');
const User = require('./models/mariadb/User/schema');

const hihi = async () =>{
    try{
        let files = await new Promise(( res,rej ) =>fs.readdir(`${__dirname}/data/大學/1`, (err, file) => {
            if(err) return rej(err)
            return res(file)
        }))

        files = files.map(val => `${__dirname}/data/大學/1/${val}`)
        files.forEach(val => insertdata(val, '123456'))
    }
    catch(err){
        console.log(err)
    }
}

function readSchema(path){
    return new Promise( (res,rej) => {
        fs.readFile(path,'utf-8',(err,data)=>{
            if(err) rej(err)
            res(data)
        })
    })
    .then(data => JSON.parse(data))
    .then(data => {return data})
}

function findUserByName(name){
    return new Promise( (res,rej) => {
        User.findOne({
            where: {user_name: name}
        })
        .then(data => res(data))
        .catch(err => rej(err))
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

async function insertdata(path, username){
    let originData = await readSchema(path);
    console.log(typeof originData)
    let user = await findUserByName(username)

    let year = await insertYearByUserId(user.user_id, originData['年度'])
    let campus = await insertCampusByYearId(year.year_id, getFromWord(map,{
        campus: originData['學校'],
        type: originData['類型']
    }), map['type'].indexOf(originData['類型']))

    Reflect.ownKeys(originData).forEach( async (dim) => {
        if(dim == '年度'||dim =='學校'||dim =='類型'){
            return
        }
        console.log(getFromWord(map,{
            dimension: dim
        }))
        let dimension = await insertDimensionByCampusId(campus.campus_id, getFromWord(map,{
            dimension: dim
        }))
        Reflect.ownKeys(originData[dim]).forEach( async (itm) => {
            let item = await insertItemByDimensionId(dimension.dimension_id, getFromWord(map, {
                item: itm
            }))
            Reflect.ownKeys(originData[dim][itm]).forEach( async (det) => {
                let detail = await insertDetailByItemId(item.item_id, getFromWord(map,{
                    detail: det
                }))
                originData[dim][itm][det].forEach( async (cont) => {
                    InsertContentByDetailId(detail.detail_id, cont['page'][0], cont['page'][1], cont['title'], cont['paragraph'])
                })
            })
        })
    })
}

hihi()
