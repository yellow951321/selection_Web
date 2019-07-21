import uploadToSinica from 'projectRoot/data/operation/csv-to-db/csv-to-database.js'
import fs from 'fs'
import checkData from 'projectRoot/data/operation/csv-to-db/check-data.js'

const root_dir = '/home/nober/git/selection_Web/data/operation/csv-to-db/'

const main = async (child_dir) => {

  const dirNames = await new Promise((res, rej) => {
    fs.readdir(root_dir + child_dir, { encoding: 'utf8'}, (err, files) => {
      if(err)
        rej(err)
      res(files)
    })
  })
  console.log(dirNames)

  // const finalResult = await Promise.all( dirNames.map( async (fName) => {
  //   return checkData(fName, root_dir + child_dir, 'shortTerm')
  // }))

  // const totalWrongAspect = finalResult.map(d => d.wrongAspect).reduce( (acc, cur) => {
  //   return acc + cur
  // }, 0)

  // const totalEmptyPage = finalResult.map( d => d.emptyPage).reduceRight((acc, cur) => {
  //   return acc + cur
  // }, 0)

  const finalResult = await Promise.all( dirNames.map( async (fName) => {
    return uploadToSinica(fName, root_dir + child_dir, 'shortTerm')
  }))

  fs.writeFile('error-data.json', JSON.stringify(finalResult, null, 2 ), (err)=> {
    if(err)
      console.log(err)
      console.log('OK')
  })


}


main('csv-data/missing-csv-data/')
