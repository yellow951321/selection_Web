const Year = require('../Year/schema')
const Campus = require('./schema')

function findCampus(year_id, campus_name, campus_type){
  return new Promise ((res, rej) => {
    Campus.findOne({
      where: {
        campus_name: campus_name,
        campus_type: campus_type,
        year_id: year_id,
      },
    })
      .then(data => res(data))
      .catch(err => rej(err))
  })
    .then(data => {return data})
    .catch(err => {throw err})
}

function findCampusAll(year_id){
  return new Promise ((res, rej) => {
    Campus.findAll({
      where: {
        year_id: year_id,
      },
    })
      .then(data => res(data))
      .catch(err => rej(err))
  })
    .then(data => {return data})
    .catch(err => {throw err})
}

function findCampusByType(year_id, inputType){
  return new Promise((res, rej) => {
    Campus.findAll({
      where: {
        campus_type: inputType,
        year_id: year_id,
      },
    })
      .then(data => res(data))
      .catch(err => rej(err))
  })
    .then(data => {return data})
    .catch(err => {throw err})
}

function findCampusById(campus_id){
  return Campus.findOne({
    where:{
      campus_id: campus_id
    }
  })
}

function deleteCampus(campus_id){
  return new Promise((res, rej) => {
    // record the yearid
    Campus.findOne({
      where: {campus_id: campus_id, },
    })
      .then(data => res(data.year_id))
      .catch(err => rej(err))
  })
    .then(year_id => {
      //destroy campus
      Campus.findAll({
        where: {year_id: year_id, },
      })
        .then(campuses => {
          console.log(campuses.length)
          // check if there is only one campus under this year_id
          // if it's true, delete the year together
          if(campuses.length === 1){
            Year.destroy({
              where: {year_id: year_id, },
            })
              .then(() => {
                return 'OK'
              })
          }
          else{
            Campus.destroy({
              where: {campus_id: campus_id, },
            })
              .then(() => {
                return 'OK'
              })
          }
        })
        .then(data => {return data})
        .catch(err => {throw err})
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

function insertCampusByYearId(year_id, inputCampus, inputType){
  return new Promise (async(res, rej) => {
    let outputCampus = await findCampus(year_id, inputCampus, inputType,);
    if(outputCampus !== null){
      return res(outputCampus)
    }
    Campus.create({
      campus_type: inputType,
      campus_name: inputCampus,
      year_id: year_id,
    })
      .then(data => res(data))
      .catch(err => rej(err))
  })
    .then(data => {return data})
    .catch(err => {throw err})
}

module.exports ={
  findCampus,
  findCampusAll,
  findCampusByType,
  findCampusById,
  insertCampusByYearId,
  deleteCampus,
}