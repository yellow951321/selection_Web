const Content = require('./schema')

function findContentAll(detail_id){
    return new Promise( (res,rej) => {
        Content.findAll({
            where: {detail_id: detail_id}
        })
        .then(data => res(data))
        .catch(err => rej(err))
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

function insertContentByDetailId(detail_id, start, end, title, content){
    return new Promise( (res, rej) => {
        Content.create({
            content_start: start,
            content_end: end,
            content_title: title,
            content_content: content,
            detail_id: detail_id
        })
        .then(data => res(data))
        .catch(err => rej(err))
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

function updateContentById(content_id, start, end, title, content){
    return new Promise ( async (res,rej) => {
        Content.findOne({
            where: {
                content_id: content_id
            }
        })
        .then(data => {
            data.update({
                content_start: start,
                content_end: end,
                content_title: title,
                content_content: content
            })
            .then(data => res(data))
            .catch(err => rej(err))
        })
        .catch(err => rej(err))
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

function deleteContentById(content_id){
    return new Promise ( async (res,rej) => {
        Content.findOne({
            where: {
                content_id: content_id
            }
        })
        .then(data => {
            data.destroy()
            console.log('after deletion')
            res('OK')
        })
        .catch(err => rej(err))
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

module.exports = {
    findContentAll,
    insertContentByDetailId,
    updateContentById,
    deleteContentById
}