const Campus = require('./schema')

function findCampus(year_id, campus_type, campus_name){
    return new Promise( (res,rej) => {
        Campus.findOne({
            where: {
                campus_type: campus_type,
                campus_name: campus_name,
                year_id: year_id
            }
        })
        .then(data => res(data))
        .catch(err => rej(err))
    })
    .then(data => {return data})
    .catch(err => {throw err})
}

function insertCampusByYearId(year_id, inputCampus, inputType,){
    return new Promise( async (res, rej) => {
        try{
            let outputCampus = await findCampus(year_id, inputCampus, inputType,);
            if(outputCampus !== null)
                return res(outputCampus)
            Campus.create({
                campus_type: inputType,
                campus_name: inputCampus,
                year_id: year_id
            })
            .then(data => res(data))
            .catch(err => rej(err))
        }
        catch(err){
            rej(err)
        }
    })
    .then(data => {return data})
    .catch(err => {throw err })
}

module.exports ={
    findCampus,
    insertCampusByYearId,
}