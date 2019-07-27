import uploadToSinica from 'projectRoot/data/operation/csv-to-db/csv-to-database.js'
import fs from 'fs'
import checkData from 'projectRoot/data/operation/csv-to-db/check-data.js'
import validData from 'projectRoot/data/operation/csv-to-db/data-valid.js'
import upload2db from 'projectRoot/data/operation/csv-to-db/upload-to-db.js'

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

  /**
   * check data
   */
  let finalResult = await Promise.all( dirNames.map( async (fName) => {
    return checkData(fName, root_dir + child_dir, 'shortTerm')
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
        wrongResult.push(data)
        return false
      }
    })

    fs.writeFileSync(`${root_dir}error-data/${result[0].campus}.json`, JSON.stringify(wrongResult, null, 2))
    return {
      result, wrongResult
    }
  }))

  await Promise.all( finalResult.map( async ({result, wrongResult}) => {
    await upload2db(result, 'shortTerm')
    fs.writeFileSync(`${root_dir}error-data/${result[0].campus}.json`, JSON.stringify(wrongResult, null, 2))
    console.log(`${result[0].campus} upload finished`)
  }))

}


main('csv-data/csv-data.4_unicode/')
