import {Content, User, } from 'mid-long-term/models/association.js'

const parseInfo = async(dataId) => {
  try{
    let data = await Content.findAll({
      where: {
        dataId: dataId,
      },
      attributes:[
        'contentId',
        'isChecked',
        'isConflicted',
        'updateTime',
      ],
    })

    data = data.map(({dataValues, }) => {
      return dataValues
    })

    let numUnreview = 0, numChecked = 0, numUnsolved = 0
    let lastModifiedYear = -1, lastModifiedMonth = -1, lastModifiedDate = -1
    data.map(e => {
      if(e.isChecked == 0 && e.isConflicted == 0){
        numUnreview = numUnreview + 1
      }else if(e.isChecked == 1){
        numChecked = numChecked + 1
      }else if(e.isChecked == 0 && e.isConflicted == 1){
        numUnsolved = numUnsolved + 1
      }

      let arr = e.updateTime.split('-')
      let year = Number(arr[0]), month = Number(arr[1]), date = Number(arr[2])
      if(lastModifiedYear < year){
        lastModifiedYear = year
        lastModifiedMonth = month
        lastModifiedDate = date
      }else if(lastModifiedYear == year && lastModifiedMonth < month){
        lastModifiedYear = year
        lastModifiedMonth = month
        lastModifiedDate = date
      }else if(lastModifiedMonth == month && lastModifiedDate < date){
        lastModifiedYear = year
        lastModifiedMonth = month
        lastModifiedDate = date
      }
    })
    let total = numChecked+numUnsolved+numUnreview
    // let progression = (((numChecked)/total)*100).toFixed(0)
    let unChecked = ((numUnreview/total)*100).toFixed(0)
    let isChecked = ((numChecked/total)*100).toFixed(0)
    let unsolved = ((numUnsolved/total)*100).toFixed(0)
    return {
      unChecked,
      isChecked,
      unsolved,
      updateTime: String(`${lastModifiedYear}-${lastModifiedMonth}-${lastModifiedDate}`),
    }
  } catch(err) {
    console.log(err)
  }
}


export default async(data) => {
  try{

    let t = {}
    await Promise.all(data.map(async data => {
      let info = await parseInfo(data.dataId)
      let user = await User.findOne({
        where: {
          userId: data.userId,
        },
      })

      if(t.hasOwnProperty(data.yearFrom)){
        t[data.yearFrom].push({
          year: data.yearTo,
          dataId: data.dataId,
          unChecked: info.unChecked,
          isChecked: info.isChecked,
          unsolved: info.unsolved,
          time: info.updateTime,
          user: {
            id: user.userId,
            name: user.account,
          },
        })
      }else {
        t[data.yearFrom] = []
        t[data.yearFrom].push({
          year: data.yearTo,
          dataId: data.dataId,
          unChecked: info.unChecked,
          isChecked: info.isChecked,
          unsolved: info.unsolved,
          time: info.updateTime,
          user: {
            id: user.userId,
            name: user.account,
          },
        })
      }
    }))
    let tt = []
    Object.keys(t).map(data => {
      tt.push({
        year: data,
        info: t[data],
      })
    })
    // console.log(JSON.stringify(tt, null, 2))
    return tt
  }catch(err){
    throw new Error('Error ocurred in parse-year.js', err)
  }
}
