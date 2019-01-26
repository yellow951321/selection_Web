const Year = require('./schema')

function findYear(user_id, year){
  return new Promise((res, rej) => {
    Year.findOne({
      where: {
        year: year,
        user_id: user_id,
      },
    })
      .then(data => res(data))
      .catch(err => rej(err))
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

function insertYearByUserId(user_id, inputYear){
  return new Promise(async(res, rej) => {
    let outputYear = await findYear(user_id, inputYear)
    if(outputYear !== null)
      return res(outputYear)
    Year.create({
      year: inputYear,
      user_id: user_id,
    })
      .then(data => res(data))
      .catch(err => rej(err))
  })
    .then(data => {return data})
    .catch(err => {throw err})
}


module.exports ={
  findYear,
  findYearAll,
  insertYearByUserId,
}