const fs = require('fs')


const readdir = async()=>{
  const files = await new Promise((res, rej)=>{
    fs.readdir('root/', (err, files)=>{
      if(err) rej(err)
      res(files)
    })
  })

  var pathCol = []
  if(files instanceof Array){
    for(let num of files){
      const campuses = await new Promise((res, rej)=>{
        fs.readdir(`root/${num}`, (err, files)=>{
          if(err) rej(err)
          res(files)
        })
      })
      if(campuses instanceof Array){
        campuses.forEach((ele)=>{
          pathCol.push(`root/${num}/${ele}`)
        })
      }
    }
  }
  return pathCol
}

const readdirStep = async(path)=>{
  try{
    const files = await new Promise((res, rej)=>{
      fs.readdir(path, (err, files)=>{
        if(err) rej(err)
        res(files)
      })
    })
    var pathCol = []
    files.forEach((ele)=>{
      pathCol.push(path+'/'+ele)
    })
    console.log(pathCol)
    return pathCol
  }
  catch(err){
    console.log(err)
  }
}

const lint = async(path)=>{
  const pathCol = await readdirStep(path)
  if(!(pathCol instanceof Array))
    throw new Error('pathCol is not a array')
  pathCol.forEach((ele)=>{
    mod(ele)
  })
}

const mod = async(path)=>{
  try{
    const data = await new Promise((res, rej)=>{
      fs.readFile(path, (err, data)=>{
        if(err) rej(err)
        console.log(path)
        data = JSON.parse(data)
        res(data)
      })
    })

    const standardDatta = await new Promise((res,rej)=>{
      fs.readFile('../projectSchema.json',(err,data)=>{
        if(err) rej(err)
        data = JSON.parse(data)
        res(data)
      })
    })

    await new Promise((res,rej)=>{
      for(dimension in data)
        for(item in data[dimension])
          for(detail in data[dimension][item]){
            if(data[dimension][item][detail] instanceof Array && data[dimension][item][detail].length > 0){
              data[dimension][item][detail] = data[dimension][item][detail].filter((ele)=>{
                return ele.title != '' && ele.title != ''
              })
              data[dimension][item][detail].forEach((ele)=>{
                if(!ele.page[1] && ele.page[0]){
                  var a = ele.page[0].split('-')
                  ele.page[0] = a[0] || ''
                  ele.page[1] = a[1] || ''
                }
              })
            }
          }
      res()
    })
    fs.writeFile(path, JSON.stringify(data, null, 2), (err)=>{
      if(err) console.log(err)
      console.log(`${path} finished`)
    })
  }
  catch(err){
    console.log(err)
  }
}

//lint()
//const pathCol = readdirStep('root/1')
//lint('root/1')
//lint('root/2')
//lint('root/3')
//lint('root/4')
//lint('root/5')
//lint('root/6')
