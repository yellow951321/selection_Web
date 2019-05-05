import midLongTermContent from 'mid-long-term/models/schemas/Content.js'

import {map, getFromNum, getFromWord} from 'projectRoot/data/operation/mapping.js'

import {midLongTermFromWord, midLongTermFromNumber} from 'lib/static/javascripts/mapping/label.js'




const updateContent = async () => {
  let data = await midLongTermContent.findAll({
    attributes: [
      'aspect',
      'keypoint',
      'method'
    ]
  })

  data = data.map(d=> d.dataValues)
  console.log(data)

}

updateContent()