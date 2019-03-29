const { readFile, writeFile, } = require('fs')

const parseSchema = async(path) => {
  try{
    var schema = await new Promise((res, rej)=>{
      readFile(path, 'utf-8', (err, data)=>{
        if(err)
          rej(new Error(err))
        res(JSON.parse(data))
      })
    })

    let aspectLabel = [], keypointLabel = [], methodLabel = []
    await new Promise((res, rej)=>{
      Object.keys(schema).map((aspect) => {
        if(aspect != '年度' && aspect != '學校' && aspect != '類型'){
          aspectLabel.push(aspect)
          Object.keys(schema[aspect]).map((keypoint) => {
            keypointLabel.push(keypoint)
            Object.keys(schema[aspect][keypoint]).map((method) => {
              methodLabel.push(method)
            })
          })
        }
      })
      res()
    })

    return {
      aspectLabel,
      keypointLabel,
      methodLabel,
    }
  } catch(err){
    console.log(err)
  }
}


const outputFile = async(path, data) => {
  try{
    await new Promise((res, rej)=>{
      writeFile(path, data, (err)=>{
        if(err)
          rej(err)
        res()
      })
    })
  }catch(err){
    console.log(err)
  }
}

// const test = () =>{
//   return new Promise((res,rej)=>{
//     let t = parseSchema('../projectSchema.json')
//     res(t)
//   })
// }

// var t = test()
// t.then(data => console.log(data))

module.exports = {
  parseSchema,
  outputFile,
}

