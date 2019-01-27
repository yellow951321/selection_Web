const Content = require('./schema')

function findContentAll(detail_id){
  return Content.findAll({
      where: {detail_id: detail_id, },
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

function insertContentByDetailId(detail_id, start, end, title, content){
  return Content.create({
      content_start: start,
      content_end: end,
      content_title: title,
      content_content: content,
      detail_id: detail_id,
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

function updateContentById(content_id, start, end, title, content){
  return Content.findOne({
      where: {
        content_id: content_id,
      },
    })
    .then(data => {
      data.update({
        content_start: start,
        content_end: end,
        content_title: title,
        content_content: content,
      })
      .then(data => {return data})
      .catch(err => {throw err})
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

function deleteContentById(content_id){
  return Content.destroy({
      where: {
        content_id: content_id,
      },
    })
    .then(() => {return 'OK'})
    .catch(err => {throw err})
}

module.exports = {
  findContentAll,
  insertContentByDetailId,
  updateContentById,
  deleteContentById,
}