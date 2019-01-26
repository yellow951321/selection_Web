const Detail = require('./schema')

function findDetail(item_id, detail){
  return new Promise((res, rej) => {
    Detail.findOne({
      where: {
        detail_name: detail,
        item_id: item_id,
      },
    })
      .then(data => res(data))
      .catch(err => rej(err))
  })
    .then(data => {return data})
    .catch(err => {throw err})
}

function insertDetailByItemId(item_id, inputDetail){
  return new Promise(async(res, rej) => {
    let outputDetail = await findDetail(item_id, inputDetail)
    if(outputDetail !== null)
      return res(outputDetail)
    Detail.create({
      detail_name: inputDetail,
      item_id: item_id,
    })
      .then(data => res(data))
      .catch(err => rej(err))
  })
    .then(data => {return data})
    .catch(err => {throw err})
}

module.exports ={
  findDetail,
  insertDetailByItemId,
}