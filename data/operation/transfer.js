import User from 'projectRoot/models/schema_old/User.js'

import sinicaUser from 'projectRoot/auth/models/schemas/user.js'
// const midLongTermContent = require('../../mid-long-term/models/schemas/Content')
// const midLongTermData = require('../../mid-long-term/models/schemas/Data')

import Data from 'projectRoot/models/schema_old/Data.js'
import Content from 'projectRoot/models/schema_old/Content.js'

import midLongTermData from 'projectRoot/mid-long-term/models/schemas/Data.js'
import midLongTermContent from 'projectRoot/mid-long-term/models/schemas/Content.js'


const transferUser = async () => {

  const data = await User.findAll()

  console.log(data)
  data.map( async ({ dataValues, }) => {
    await sinicaUser.create({
      account: dataValues.account,
      password: dataValues.password
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
        userId: dataValues.userId - 2,
      })
    })
  } catch(err){
    console.log(err)
  }
}




// transferUser()

transferData()