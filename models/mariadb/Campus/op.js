const Year = require('../Year/schema')
const Campus = require('./schema')

function findCampus(year_id, campus_name, campus_type){
  return Campus.findOne({
      where: {
        campus_name: campus_name,
        campus_type: campus_type,
        year_id: year_id,
      },
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

function findCampusAll(year_id){
  return Campus.findAll({
      where: {
        year_id: year_id,
      },
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

function findCampusByType(year_id, inputType){
  return Campus.findAll({
      where: {
        campus_type: inputType,
        year_id: year_id,
      },
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
  return async () => {
    try{
      console.log(12313)
      // record the yearid
      let year_id = await Campus.findOne({
          where: {campus_id: campus_id, },
        })
        .then(data => {return data.year_id})
        .catch(err => {throw err})
      //destroy campus
      let campuses = await Campus.findAll({
          where: {year_id: year_id, },
        })
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
    }
    catch(err){
      throw err
    }
  }
}

function insertCampusByYearId(year_id, inputCampus, inputType){
  return async() => {
    try{
      let outputCampus = await findCampus(year_id, inputCampus, inputType,);
      if(outputCampus !== null){
        return outputCampus
      }
      await Campus.create({
        campus_type: inputType,
        campus_name: inputCampus,
        year_id: year_id,
      })
      .then(data => {return data})
      .catch(err => {throw err})
    }
    catch(err){
      throw err
    }
  }
}

module.exports ={
  findCampus,
  findCampusAll,
  findCampusByType,
  findCampusById,
  insertCampusByYearId,
  deleteCampus,
}