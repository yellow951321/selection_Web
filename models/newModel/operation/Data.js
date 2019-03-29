const { Data, User, Content, } = require('../association')
const { map, getFromNum, getFromWord, } = require('../../../data/operation/mapping')

const findYearAll = async(userId) => {
  try{
    // find all data with the given userId
    let val = await Data.findAll({
      where: {
        userId: userId,
      },
    })

    // transfer data in to column year only
    val = val.map((data) => data.dataValues.year)
    // console.log(val)
    // find and sort the destinct year
    let output = []
    for(let year of val){
      if(!output.includes(year))
        output.push(year)
    }
    output.sort((a, b) => {
      return a-b
    })

    return output
  }
  catch(err){
    throw err
  }
}

const findTypeAll = async(userId, year) => {
  try{
    // find all data with the given userId and year
    let val = await Data.findAll({
      where: {
        userId: userId,
        year: year,
      },
    })
    // transfer data into column type only
    val = val.map((data) => data.dataValues.type)
    val = val.filter((value, index, self)=>{
      return self.indexOf(value) === index
    })

    return val
  }
  catch(err){
    throw err
  }
}

const findCampusAll = async(userId, year, type) => {
  try{
    // find all data with the given userId and year
    let val = await Data.findAll({
      where: {
        userId: userId,
        year: year,
        type: type,
      },
    })

    //transfer data into column campus only
    val = val.map(data => {
      return {
        campus : data.dataValues.campus,
        dataId : data.dataValues.dataId,
      }
    })

    // val = val.filter((value, index,self)=>{
    //     return self.indexOf(value) === index
    // })
    val = val.map(campusInfo => {
      return [getFromNum(map, {
        campus: campusInfo.campus,
        type: type,
      }), campusInfo.dataId, ]
    })
    return val
  }
  catch(err){
    throw err
  }
}

const findCampusOne = async(info) =>{
  try{
    let campus = await Data.findOne({
      where:{
        campus: info.campusId,
        year: info.year,
        type: info.typeId,
        userId: info.userId,
      },
    })
    if(campus == null)
      return null
    else
      var {dataValues, } = campus

    return dataValues
  } catch(err){
    console.log(err)
  }
}
const createNewProject = async(info) =>{
  try{
    console.log(info)
    let outputCampus = await findCampusOne(info)
    if(outputCampus !== null)
      return outputCampus

    return Data.create({
      campus: info.campusId,
      year: info.year,
      type: info.type,
      userId: info.userId,
    })
  }catch(err) {
    console.log(new Error(err))
  }
}

const deleteProject = async(info) =>{
  try{
    Data.destroy({
      where: {
        dataId: info.dataId,
      },
    })
      .then(() => 'OK')
      .catch(() => { throw new Error('No specified project') })
  }catch(err) {
    console.log(new Error(err))
  }
}
module.exports = {
  findYearAll,
  findTypeAll,
  findCampusAll,
  findCampusOne,
  createNewProject,
  deleteProject,
}