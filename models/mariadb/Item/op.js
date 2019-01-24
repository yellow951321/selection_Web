const Item = require('./schema')

function findItem(dimension_id, item){
    return new Promise( (res, rej) => {
        Item.findOne({
            where: {
                item_name: item,
                dimension_id: dimension_id
            }
        })
        .then(data => res(data))
        .catch(err => rej(err))
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

function insertItemByDimensionId(dimension_id, inputItem){
    return new Promise( async (res,rej) => {
        let outputItem = await findItem(dimension_id, inputItem);
        if(outputItem !== null)
            return res(outputItem)
        Item.create({
            item_name: inputItem,
            dimension_id: dimension_id
        })
        .then(data => res(data))
        .catch(err => rej(err))
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

module.exports ={
    findItem,
    insertItemByDimensionId
}