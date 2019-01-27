const Dimension = require('./schema')

function findDimension(campus_id, dimension){
  return Dimension.findOne({
      where: {
        dimension_name: dimension,
        campus_id: campus_id,
      },
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

function insertDimensionByCampusId(campus_id, inputDimension){
  return async() => {
    try{
      let outputDimension = await findDimension(campus_id, inputDimension)
      if(outputDimension !== null){
        return outputDimension
      }
      Dimension.create({
        dimension_name: inputDimension,
        campus_id: campus_id,
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
  findDimension,
  insertDimensionByCampusId,
}