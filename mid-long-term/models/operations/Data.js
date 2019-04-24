// import {User, Data, Content} from 'projectRoot/mid-long-term/models/association.js'
import Data from 'projectRoot/mid-long-term/models/schemas/Data.js'
import Content from 'projectRoot/mid-long-term/models/schemas/Content.js'

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
      },
      attributes: [
        'dataId',
        'campusId',
        'typeId',
        'yearFrom',
        'yearTo',
        'userId'
      ]
    })

    val.map( data => data.dataValues )

    return val

  }catch(err) {
    console.log(err)
  }
}

const parseInfo = async (dataId) => {
  try{
    let data = await Content.findAll({
      where: {
        dataId: dataId
      }
    })

    data = data.map( ({dataValues, } ) => {
      return dataValues
    })

    let numUnreview = 0, numChecked = 0, numUnsolved = 0
    let lastModifiedYear = -1, lastModifiedMonth = -1, lastModifiedDate = -1
    data.map( e => {
      if( e.isChecked == 0 && e.isConflicted == 0){
        numUnreview = numUnreview +1
      }else if( e.isChecked == 1){
        numChecked = numChecked +1
      }else if( e.isChecked == 0 && e.isConflicted == 1){
        numUnsolved = numUnsolved +1
      }

      let arr = e.updateTime.split("-")
      let year = Number(arr[0]), month = Number(arr[1]), date = Number(arr[2])
      if( lastModifiedYear < year ){
        lastModifiedYear = year
        lastModifiedMonth = month
        lastModifiedDate = date
      }else if( lastModifiedYear == year && lastModifiedMonth < month){
        lastModifiedYear = year
        lastModifiedMonth = month
        lastModifiedDate = date
      }else if( lastModifiedMonth == month && lastModifiedDate < date){
        lastModifiedYear = year
        lastModifiedMonth = month
        lastModifiedDate = date
      }
    })

    let progression = (((numChecked)/(numChecked+numUnsolved+numUnreview))*100).toFixed(2)

    return {
      progression,
      unsolved: numUnsolved == 0 ? 'No' : 'Yes',
      updateTime: String(`${lastModifiedYear}-${lastModifiedMonth}-${lastModifiedDate}`)
    }
  } catch(err) {
    console.log(err)
  }
}


const parseYear = async (data) => {
  try{

    let t = {}
    await Promise.all( data.map( async data => {
      let info = await parseInfo(data.dataId)
      if(t.hasOwnProperty(data.yearFrom)){
        t[data.yearFrom].push({
          year: data.yearTo,
          progression: info.progression,
          unsolved: info.unsolved,
          time: info.updateTime
        })
      }else {
        t[data.yearFrom] = []
        t[data.yearFrom].push({
          year: data.yearTo,
          progression: info.progression,
          unsolved: info.unsolved,
          time: info.updateTime
        })
      }
    }))
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


const projectCreate = () => {
  // wait for shou
}

const projectDelete = async (info={}) => {
  try {
    return Data.destroy({
      where: {
        dataId: info.dataId
      }
    })
    .then(() => 'ok')
    .catch(() => {
      throw new Error('No specified project')
    })
  } catch (err) {
    console.log(err)
  }
}

export {
  findTypeAll,
  findCampusAll,
  findYearAll,
  parseYear,
  projectCreate,
  projectDelete,
}