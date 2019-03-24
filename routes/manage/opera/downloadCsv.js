const fs = require('fs')
const express = require('express')
const uniqueFilename = require('unique-filename')
// const OpDimension = require('../../../models/mariadb/Dimension/op')
// const OpItem = require('../../../models/mariadb/Item/op')
// const OpDetail = require('../../../models/mariadb/Detail/op')
// const OpContent = require('../../../models/mariadb/Content/op')
const {Content, } = require('../../../models/newModel/association')
const {map, getFromNum, } = require('../../../data/operation/mapping')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})

//@TODO change to send header only
router.get('/:dataId/:campusName', async(req, res)=>{
  try{
    let dataId = req.params.dataId
    // create tmp directory
    let tmpDir = '/tmp/selection_Web'
    if(!fs.existsSync(tmpDir))
      fs.mkdirSync(tmpDir)
    // create a random unique filename
    let filePath = uniqueFilename(tmpDir)

    // setup csvWriter
    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        {id: 'aspect', title: '構面', },
        {id: 'keypoint', title: '推動項目', },
        {id: 'method', title: '推動重點', },
        {id: 'title', title: '標題', },
        {id: 'content', title: '內容', },
      ],
    })

    // write in the tmp output file
    let outputObject = []
    // let dimensions = await OpDimension.findDimensionAll(campusId).map(d => d.dataValues)

    // for(let {dimension_id,dimension_name} of dimensions){
    //     const items = await OpItem.findItemAll(dimension_id).map(d => d.dataValues)
    //     for(let {item_id,item_name} of items){
    //         const details = await OpDetail.findDetailAll(item_id).map(d => d.dataValues)
    //         for(let {detail_id,detail_name} of details){
    //             const contents = await OpContent.findContentAll(detail_id).map(d => d.dataValues)
    //             for(let {content_title,content_content} of contents){
    //                 data.push({
    //                 dimension: getFromNum(map, {dimension: dimension_name}),
    //                 item: getFromNum(map, {item: item_name}),
    //                 detail: getFromNum(map, {detail: detail_name}),
    //                 topic: content_title,
    //                 content: content_content
    //                 })
    //             }
    //         }
    //     }
    // }

    let data = await Content.findAll({
      where: {
        dataId: dataId,
      },
    })
      .then(data => {return data})
      .catch(err => {throw err})

    data = data.map(val => val.dataValues)

    for(let val of data){
      outputObject.push({
        aspect: getFromNum(map, {dimension: val.aspect, }),
        keypoint: getFromNum(map, {item: val.keypoint, }),
        method: getFromNum(map, {detail: val.method, }),
        title: val.title,
        content: val.content,
      })
    }

    await csvWriter.writeRecords(outputObject)

    // send requested output file
    let options = {
      root: '/',
      dotfiles: 'deny',
      headers: {
        'content-type': 'text/csv',
        'Content-Disposition': `attachment;filename=${encodeURIComponent(req.params.campusName)}.csv`,
      },
    }
    res.sendFile(filePath, options, function(err){
      if(err){
        throw err
      }
      else{
        fs.unlink(filePath, function(err){
          if(err)
            throw err
        })
      }
    })
  }
  catch(err){
    console.log(err)
  }
})

module.exports = router