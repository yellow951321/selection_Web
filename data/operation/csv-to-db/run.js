import uploadToSinicaMidLongTerm from 'projectRoot/data/operation/csv-to-db/csv-to-database.js'
import fs from 'fs'

const root_dir = '/home/nober/git/selection_Web/data/operation/csv-to-db/'

const main = async (child_dir) => {

  const dirNames = await new Promise((res, rej) => {
    fs.readdir(root_dir + child_dir, { encoding: 'utf8'}, (err, files) => {
      if(err)
        rej(err)
      res(files)
    })
  })
  console.log(dirNames);
  Promise.all( dirNames.map((fName) => {
    return uploadToSinicaMidLongTerm(fName, root_dir + child_dir)
  }))

}


main('csv-data/csv-data.2_unicode/')
