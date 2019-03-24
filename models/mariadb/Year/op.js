const Year = require('./schema')

function findYear(user_id, year){
  return Year.findOne({
    where: {
      year: year,
      user_id: user_id,
    },
  })
    .then(data => {return data})
    .catch(err => {throw err})
}

function findYearAll(user_id){
  return Year.findAll({
    where: {
      user_id: user_id,
    },
  })
}

function findYearById(year_id){
  return Year.findOne({
    where:{
      year_id: year_id,
    },
  })
}

function insertYearByUserId(user_id, inputYear){
  return async() => {
    try{
      let outputYear = await findYear(user_id, inputYear)
      if(outputYear !== null)
        return outputYear
      return Year.create({
        year: inputYear,
        user_id: user_id,
      })
        .then(data => { console.log('created');return data})
        .catch(err => {throw err})
    }
    catch(err){
      throw err
    }
  }
}


module.exports ={
  findYear,
  findYearAll,
  findYearById,
  insertYearByUserId,
}