import dataCreate from 'mid-long-term/models/operations/data-create.js'

export default async (info) => {
    try{
        await dataCreate({
            campusId: info.campusId,
            yearFrom: info.yearFrom,
            yearTo: info.yearTo,
            typeId: info.typeId,
            userId: info.userId,
        })
    }
    catch(err){
        if(!err.status){
            const err = new Error('mid-long-term/data/add post operation error')
            err.status = 500
        }
        throw err
    }
}