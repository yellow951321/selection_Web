const fs = require('fs')
const User = require('./models/mariadb/User/schema')
const Year = require('./models/mariadb/Year/schema')
// const type = require('./models/mariadb/Type/schema')
// const campus = require('./models/mariadb/Campus/schema')
// const dimension = require('./models/mariadb/Dimension/schema')
// const item= require('./models/mariadb/Item/schema')
// const detail= require('./models/mariadb/Detail/schema')
// const contain= require('./models/mariadb/Contain/schema')

const hihi = async () =>{
    try{
        let originData = await readSchema();
        let user = await findUserByName('123456')
        let year = await insertYearByUserId(user.user_id, '108')
        console.log(year.year_id)
        console.log(year.year)
        console.log(year.user_id)
    }
    catch(err){
        console.log(err)
    }
}

function readSchema(){
    return new Promise( (res,rej) => {
        fs.readFile(`${__dirname}/data/大學/1/中原大學.json`,'utf-8',(err,data)=>{
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

function findYear(user_id, year){
    return new Promise( (res,rej) => {
        Year.findOne({
            where: {
                year: year,
                user_id: user_id,
            }
        })
        .then(data => res(data))
        .catch(err => rej(err))
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

function insertYearByUserId(user_id, inputYear){
    return new Promise( async (res, rej) => {
        try{
            let outputYear = await findYear(user_id, inputYear);
            if(outputYear !== null)
                res(outputYear)
            Year.create({
                year: inputYear,
                user_id: user_id
            })
            .then(data => res(data))
            .catch(err => rej(err))
        }
        catch(err){
            rej(err)
        }
    })
    .then(data => {return data})
    .catch(err => {throw err })
}

hihi()
