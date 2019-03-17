const Data = require('../schema/Data')

const findYearAll = async (userId) => {
    try{
        // find all data with the given userId
        let val = await Data.findAll({
            where: {
                userId: userId
            }
        })

        // transfer data in to column year only
        val = val.map((data) => data.year)

        // find and sort the destinct year
        let output = []
        for(let year of val){
            if( !output.includes(year))
                output.push(year)
        }
        output.sort((a,b) => {
            return a-b
        })

        return output;
    }
    catch(err){
        throw err
    }
}

const findTypeAll = async (userId, year) => {
    try{
        // find all data with the given userId and year
        let val = await Data.findAll({
            where: {
                userId: userId,
                year: year
            }
        })

        // transfer data into column type only
        val = val.map((data) => data.type)

        // record the appereared type
        let exists = [false, false]
        for(let type of val){
            if(!exists[type])
                exists[type] = true;

            if(exists[0] && exists[1])
                break;
        }
        let output = []
        for(let index of exists){
            if(exists[index])
                output.push(index)
        }

        return output
    }
    catch(err){
        throw err
    }
}

const findCampusAll =  async (userId, year, type) => {
    try{
         // find all data with the given userId and year
         let val = await Data.findAll({
            where: {
                userId: userId,
                year: year,
                type: type,
            }
        })

        //transfer data into column campus only
        val = val.map((data) => data.campus)
        return val
    }
    catch(err){
        throw err
    }
};