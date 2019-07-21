/**
 * dump the data to a csv file with the given dataId
 * @function downloadCsv
 * @param {number} dataId - The ID of the data
 * @returns {string} - return the path of the file
 * @requires fs
 * @requires uniqueFilename
 * @requires csv-writer
 * @requires 'short-term/models/schemas/Content.js'
 * @requires 'projectRoot/lib/static/javascripts/mapping/label.js'
 * @
 */

// import FileSystem module
import fs from 'fs'
// import the uniqueFilename
import uniqueFilename from 'unique-filename'
// import csv-writer module
import {createObjectCsvWriter, } from 'csv-writer'
// import Content module
import Content from 'short-term/models/schemas/Content.js'
// import the label module
import { midLongTermFromNumber, } from 'projectRoot/lib/static/javascripts/mapping/label.js'

export default async(dataId) => {
  try{
    // declare a temp path for the file needed to be downloaded
    let tmpDir = '/tmp/selection_Web'
    /*
    check the path of tmpDir is existed or not
    If it is not existed, create a directory for it.
    */
    if(!fs.existsSync(tmpDir))
      fs.mkdirSync(tmpDir)
    /*
    create a unique filename with the given path
     */
    let filePath = uniqueFilename(tmpDir)
    // setup csvWriter
    const csvWriter = createObjectCsvWriter({
      // define the destination to be store
      path: filePath,
      // the columns of the csv
      header: [
        {id: 'pageFrom', title: '開始頁面', },
        {id: 'pageTo', title: '結束頁面', },
        {id: 'aspect', title: '構面', },
        {id: 'keypoint', title: '推動重點', },
        {id: 'method', title: '具體作法', },
        {id: 'title1', title: '大標題', },
        {id: 'title2', title: '中標題', },
        {id: 'title3', title: '小標題', },
        {id: 'title4', title: '最小標題', },
        {id: 'content', title: '內容', },
        {id: 'summary', title: '摘要', },
        {id: 'note', title: '備註', },
      ],
    })
    // an array to store the content
    let outputObject = []
    // find the all content by given the dataId
    let data = await Content.findAll({
      where: {
        dataId,
      },
      attributes:[
        'pageFrom',
        'pageTo',
        'contentId',
        'title1',
        'title2',
        'title3',
        'title4',
        'content',
        'summary',
        'note',
        'aspect',
        'keypoint',
        'method',
      ],
    })
      .then(data => {
        if(data == null)
          return []
        return data.map(val => val.dataValues)
      })
      .catch(err => {throw err})

    /*
      Rearrange the structure of the content into desired structure
    */
    for(let val of data) {
      let method = midLongTermFromNumber({aspect: val.aspect, keypoint: val.keypoint, method: val.method, }).method
      let keypoint = midLongTermFromNumber({aspect: val.aspect, keypoint: val.keypoint, }).keypoint
      let aspect = midLongTermFromNumber({aspect: val.aspect, }).aspect

      outputObject.push({
        pageFrom: val.pageFrom,
        pageTo: val.pageTo,
        aspect,
        keypoint,
        method,
        title1: val.title1,
        title2: val.title2,
        title3: val.title3,
        title4: val.title4,
        content: val.content,
        summary: val.summary,
        note: val.note,
      })
    }
    // write the content to the pre-set path
    await csvWriter.writeRecords(outputObject)
    // return the file path of the desired data
    return filePath

  }catch(err){
    // error handling
    if(!err.status){
      err = new Error('Error occurred in short-term/models/operations/download-csv.js')
      err.status = 500
    }
    throw err
  }
}