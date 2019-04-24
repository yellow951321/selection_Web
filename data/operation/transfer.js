import User from 'projectRoot/models/schema_old/User.js'

import sinicaUser from 'projectRoot/auth/models/schemas/user.js'
// const midLongTermContent = require('../../mid-long-term/models/schemas/Content')
// const midLongTermData = require('../../mid-long-term/models/schemas/Data')

import Data from 'projectRoot/models/schema_old/Data.js'
import Content from 'projectRoot/models/schema_old/Content.js'



import midLongTermData from 'projectRoot/mid-long-term/models/schemas/Data.js'
import midLongTermContent from 'projectRoot/mid-long-term/models/schemas/Content.js'


//local
import localContent from 'projectRoot/local/models/schemas/Content.js'
import localData from 'projectRoot/local/models/schemas/Data.js'
import localUser from 'projectRoot/local/models/schemas/user.js'


const transferUser = async () => {

  const data = await User.findAll()

  console.log(data)
  data.map( async ({ dataValues, }) => {
    await localUser.create({
      account: dataValues.account,
      password: dataValues.password,
      userId: dataValues.userId,
    })
  })

}

const transferData = async () => {
  try{
    const data = await Data.findAll()

    data.map( async ({ dataValues, }) => {
      await localData.create({
        campusId: dataValues.campus,
        typeId: dataValues.type,
        yearFrom: dataValues.year,
        yearTo: dataValues.year,
        userId: dataValues.userId,
      })
    })
  } catch(err){
    console.log(err)
  }
}

const transferContent = async () => {
  try {
    const data = await Content.findAll()
    data.map( async ({dataValues,}) => {
      await localContent.create({
        contentId: dataValues.contentId,
        title1: dataValues.title,
        content: dataValues.content,
        summary: dataValues.summary,
        pageFrom: dataValues.pageStart,
        pageTo: dataValues.pageEnd,
        isChecked: false,
        isConflicted: false,
        aspect: dataValues.aspect,
        keypoint: dataValues.keypoint,
        method: dataValues.method,
        updateTime: Date.now(),
        dataId: dataValues.dataId,
      })
      console.log("finished one")
    })
  } catch( err ){
    console.log(err)
  }
}




// transferUser()

// transferData()

transferContent()