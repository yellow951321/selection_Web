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

import {Op, } from 'sequelize'

const transferUser = async () => {

  const data = await User.findAll()

  console.log(data)
  data.map( async ({ dataValues, }) => {
    await sinicaUser.create({
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
      await midLongTermData.create({
        campusId: dataValues.campus,
        typeId: dataValues.type,
        yearFrom: dataValues.year,
        yearTo: dataValues.year,
        userId: dataValues.userId,
        dataId: dataValues.dataId,
      })
    })
  } catch(err){
    console.log(err)
  }
}

const transferContent = async () => {
  try {
    for(let i=0; i<33; i++){
      const data = await Content.findAll({
        where: {
          contentId: {
            [Op.and] : {
              [Op.gte]: i*1000+1,
              [Op.lt]: (i+1)*1000
            }
          }
        }
      })

      data.map( async ({dataValues,},i) => {
        await midLongTermContent.create({
          contentId: dataValues.contentId,
          title1: dataValues.title,
          content: dataValues.content,
          summary: dataValues.summary,
          pageFrom: dataValues.pageStart,
          pageTo: dataValues.pageEnd,
          isChecked: 0,
          isConflicted: 0,
          aspect: dataValues.aspect,
          keypoint: dataValues.keypoint,
          method: dataValues.method,
          updateTime: Date.now(),
          dataId: dataValues.dataId,
        })
        console.log(`finished ${i}th querying`)
      })
    }
  } catch( err ){
    console.log(err)
  }
}




// transferUser()

// transferData()

transferContent()