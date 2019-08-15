import uploadToSinica from 'projectRoot/data/operation/csv-to-db/csv-to-database.js'
import fs from 'fs'
import TSV from 'tsv'
import checkData from 'projectRoot/data/operation/csv-to-db/check-data.js'
import validData from 'projectRoot/data/operation/csv-to-db/data-valid.js'
import upload2db from 'projectRoot/data/operation/csv-to-db/upload-to-db.js'

const root_dir = '/home/nober/git/selection_Web/data/operation/csv-to-db/'
// const folderName = 'csv-data.2_unicode'
// const child_dir = `csv-data/data/${folderName}/`

const main = async (child_dir, folderName, uploading=false) => {

  const dirNames = await new Promise((res, rej) => {
    fs.readdir(root_dir + child_dir, { encoding: 'utf8'}, (err, files) => {
      if(err)
        rej(err)
      res(files)
    })
  })
  console.log(dirNames)

  /**
   * check data
   */
  let finalResult = await Promise.all( dirNames.map( async (fName) => {
    const typeData = fName.split('_').length != 3 ? 'midLongTerm' : 'shortTerm'
    return checkData(fName, root_dir + child_dir, typeData)
  }))

  /**
   * valid data
   */
  finalResult = await Promise.all( finalResult.map( ({result, wrongResult}) => {
    result = result.filter( (data) => {
      if( validData({
            aspect : data.data['構面'],
            keypoint : data.data['推動重點'],
            method : data.data['作法']
          })
      ) return true
      else {
        if(data.error === undefined ){
          data.error = 'valid error'
        }
        wrongResult.push(data)
        return false
      }
    })

    // fs.writeFileSync(`${root_dir}csv-data/error-data/${result[0].campus}.json`, JSON.stringify(wrongResult, null, 2))
    // console.log(wrongResult)
    return {
      result, wrongResult
    }
  }))
  let makeFile = await new Promise((res,rej)=>{
    fs.stat(`${root_dir}csv-data/error-data/${folderName}`, (err, dir)=>{
      if(err)
        rej(err)
      else
        res(dir.isDirectory)
    })
  }).catch(err => {
    console.log(err)
  })
  if(!makeFile)
    fs.mkdirSync(`${root_dir}csv-data/error-data/${folderName}`)

  await Promise.all( finalResult.map( async ({result, wrongResult}) => {
    if(uploading)
      await upload2db(result, 'shortTerm')

    let outputData = result.map(d => {
      return d.data
    })
    let tsvFile = TSV.stringify(outputData)

    fs.writeFileSync(`${root_dir}csv-data/tsv-data/${result[0].campus}.tsv`, tsvFile)
    // fs.writeFileSync(`${root_dir}csv-data/error-data/${folderName}/${result[0].campus}.json`, JSON.stringify(wrongResult, null, 2))
    if(uploading)
      console.log(`${result[0].campus} upload finished`)
    else
      console.log(`${result[0].campus} authentication finished`)
  }))

}




for(let i=1;i<=5;i++){
  const folderName = `csv-data.${i}_unicode`
  const child_dir = `csv-data/data/${folderName}/`
  main(child_dir, folderName, false)
}


