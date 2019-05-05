import midLongTermContent from 'mid-long-term/models/schemas/Content.js'

import {map, getFromNum, getFromWord} from 'projectRoot/data/operation/mapping.js'

import {shortTermFromWord, midLongTermFromNumber} from 'lib/static/javascripts/mapping/label.js'




const updateContent = async () => {

  let data = await midLongTermContent.findAll({
    attributes: [
      'aspect',
      'keypoint',
      'method'
    ]
  })

  await Promise.all( data.map( async d => {
    let aspectName = getFromNum(map, {dimension: d.aspect})
    let keypointName = getFromNum(map, {item: d.keypoint})
    let methodName = getFromNum(map, {detail: d.method})
    console.log(d.aspect, d.keypoint, d.method)
    console.log(aspectName, keypointName, methodName)

    const {aspect, keypoint ,method, } = shortTermFromWord({
      aspect: aspectName,
      keypoint: keypointName,
      method: methodName
    })
    await d.update({
      aspect: aspect,
      keypoint: keypoint,
      method: method
    }).then(d => {
      console.log("finished")
    })
  }))

}

updateContent()