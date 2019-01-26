const Dimension = require('./schema')

function findDimension(campus_id, dimension){
  return new Promise((res, rej) => {
    Dimension.findOne({
      where: {
        dimension_name: dimension,
        campus_id: campus_id,
      },
    })
      .then(data => res(data))
      .catch(err => rej(err))
  })
    .then(data => {return data})
    .catch(err => {throw err})
}

function findDimensionAll(campus_id){
  return Dimension.findAll({
    where:{
      campus_id: campus_id
    }
  })
}

function insertDimensionByCampusId(campus_id, inputDimension){
  return new Promise(async(res, rej) => {
    let outputDimension = await findDimension(campus_id, inputDimension)
    if(outputDimension !== null){
      return res(outputDimension)
    }
    Dimension.create({
      dimension_name: inputDimension,
      campus_id: campus_id,
    })
      .then(data => res(data))
      .catch(err => rej(err))
  })
    .then(data => {return data})
    .catch(err => {throw err})
}

module.exports ={
  findDimension,
  findDimensionAll,
  insertDimensionByCampusId,
}