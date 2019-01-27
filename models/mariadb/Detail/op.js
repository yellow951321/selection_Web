const Detail = require('./schema')

function findDetail(item_id, detail){
  return Detail.findOne({
      where: {
        detail_name: detail,
        item_id: item_id,
      },
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

function insertDetailByItemId(item_id, inputDetail){
  return async() => {
    try{
      let outputDetail = await findDetail(item_id, inputDetail)
      if(outputDetail !== null)
        return outputDetail
      Detail.create({
        detail_name: inputDetail,
        item_id: item_id,
      })
        .then(data => {return data})
        .catch(err => {return err})
    }
    catch(err){
      throw err
    }
  }
}

module.exports ={
  findDetail,
  insertDetailByItemId,
}