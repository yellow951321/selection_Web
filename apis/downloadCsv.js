const fs = require('fs')
const express = require('express')
const config = require('../config')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

const router = express.Router({
    // case sensitive for route path
    caseSensitive: true,
    // parent path req.parmas take precedence over child path
    mergeParams: false,
    // fool proof route path
    strict: false,
})

router.get('/', async (req, res)=>{
    try{
        let filename = 'test.csv'
        const csvWriter = await createCsvWriter({
            path: filename,
            header: [
                {id: 'name', title: 'Name'},
                {id: 'surname', title: 'Surname'},
                {id: 'age', title: 'Age'},
                {id: 'gender', title: 'Gender'},
            ]
        })
        for(i=0; i<2; ++i){
            const data = [
                {
                name: 'John',
                surname: 'Snow',
                age: 26,
                gender: 'M'
                }
            ];
            await csvWriter
                .writeRecords(data)
        }

        var options = {
            root: config.path,
            dotfiles: 'deny',
            headers: {
                'content-type': 'text/html',
                'Content-Disposition': `attachment;filename=${filename}`
            }
        };
        await res.sendFile(filename, options, function(err){
            if(err){
                throw err
            }
            else{
                console.log('success')
                fs.unlink(`${config.path}/${filename}`, function(err){
                    console.log(err)
                })
            }
        })
    }
    catch(err){
        console.log(err)
    }
})

module.exports = router