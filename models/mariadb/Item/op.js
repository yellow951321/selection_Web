const Item = require('./schema')

function findItem(dimension_id, item){
  return Item.findOne({
      where: {
        item_name: item,
        dimension_id: dimension_id,
      },
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

function insertItemByDimensionId(dimension_id, inputItem){
  return async() => {
    try{
      let outputItem = await findItem(dimension_id, inputItem)
      if(outputItem !== null)
        return outputItem
      Item.create({
        item_name: inputItem,
        dimension_id: dimension_id,
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
  findItem,
  insertItemByDimensionId,
}