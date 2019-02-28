const fs = require('fs')
const express = require('express')
const config = require('../config')
const uniqueFilename = require('unique-filename')
const OpDimension = require('../models/mariadb/Dimension/op')
const OpItem = require('../models/mariadb/Item/op')
const OpDetail = require('../models/mariadb/Detail/op')
const OpContent = require('../models/mariadb/Content/op')
const {map,getFromWord,getFromNum} = require('../data/operation/mapping')
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
router.get('/:campus_id/:campus_name', async (req, res)=>{
    try{
        let campus_id = req.params.campus_id
        // create tmp directory
        let tmpDir = '/tmp/selection_Web'
        if(!fs.existsSync(tmpDir))
            fs.mkdirSync(tmpDir)
        let filePath = `${uniqueFilename(tmpDir)}`

        // setup csvWriter
        const csvWriter = createCsvWriter({
            path: filePath,
            header: [
                {id: 'dimension', title: '構面'},
                {id: 'item', title: '推動項目'},
                {id: 'detail', title: '推動重點'},
                {id: 'topic', title: '標題'},
                {id: 'content', title: '內容'},
            ]
        })

        // write in the tmp output file
        let data = []
        let dimensions = await OpDimension.findDimensionAll(campus_id).map(d => d.dataValues)

        for(let {dimension_id,dimension_name} of dimensions){
            const items = await OpItem.findItemAll(dimension_id).map(d => d.dataValues)
            for(let {item_id,item_name} of items){
                const details = await OpDetail.findDetailAll(item_id).map(d => d.dataValues)
                for(let {detail_id,detail_name} of details){
                    const contents = await OpContent.findContentAll(detail_id).map(d => d.dataValues)
                    for(let {content_title,content_content} of contents){
                        data.push({
                        dimension: getFromNum(map, {dimension: dimension_name}),
                        item: getFromNum(map, {item: item_name}),
                        detail: getFromNum(map, {detail: detail_name}),
                        topic: content_title,
                        content: content_content
                        })
                    }
                }
            }
        }
        await csvWriter.writeRecords(data)

        let options = {
            //@TODO change the temp file to the global /tmp file
            // and create a temp file for this app (if it's doesn't exist)
            root: '/',
            dotfiles: 'deny',
            headers: {
                'content-type': 'text/html',
                'Content-Disposition': `attachment;filename=${encodeURIComponent(req.params.campus_name)}.csv`
            }
        };
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