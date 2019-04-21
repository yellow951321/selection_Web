// import {User, Data, Content} from 'projectRoot/mid-long-term/models/association.js'
import Data from 'projectRoot/mid-long-term/models/schemas/Data.js'

const findTypeAll = async (userId) => {
  try{
    // find all data with the given userId and year
    let val = await Data.findAll({
      where: {
        userId: userId,
      },
    })
    // transfer data into column type only
    val = val.map((data) => data.dataValues.typeId)
    val = val.filter((value, index, self)=>{
      return self.indexOf(value) === index
    })
    return val
  }
  catch(err){
    throw err
  }
}

const findCampusAll = async (userId, typeId) => {
  try{
    // find all data with the given userId and typeId
    let val = await Data.findAll({
      where:{
        userId: userId,
        typeId: typeId
      }
    })

    // transfer data into column campusId only
    val = val.map( data => data.dataValues.campusId )
    val = val.filter( (value, index, self) => {
      return self.indexOf(value) === index
    })

    return val
  }catch(err){
    console.log(err)
  }
}

const findYearAll = async (info={}) => {
  try{
    let val = await Data.findAll({
      where:{
        userId: info.userId,
        typeId: info.typeId,
        campusId: info.campusId
      }
    })

    val.map( data => data.dataValues )

    return val

  }catch(err) {
    console.log(err)
  }
}


const parseYear = (data) => {
  try{

    let t = {}
    data.map( data => {
      if(t.hasOwnProperty(data.yearFrom)){
        t[data.yearFrom].push({
          year: data.yearTo,
          progression: `${(Math.random()*100).toFixed(2)}%`,
          unsolved: `${Math.random()%2 ? 'Yes' : 'No'}`,
          time: new Date().getDate()
        })
      }else {
        t[data.yearFrom] = []
        t[data.yearFrom].push({
          year: data.yearTo,
          progression: `${(Math.random()*100).toFixed(2)}%`,
          unsolved: `${(Math.random()*10)%2 ? 'Yes' : 'No'}`,
          time: new Date().getDate()
        })
      }
    })
    let tt = []
    Object.keys(t).map( data => {
      tt.push({
        year: data,
        info: t[data]
      })
    })
    return tt
  }catch(err){
    console.log(err)
  }
}

export {
  findTypeAll,
  findCampusAll,
  findYearAll,
  parseYear,
}