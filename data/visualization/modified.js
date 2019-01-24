const fs = require('fs')


const readFileAsync = async (path)=>{
  try{
    const data = await new Promise((res,rej)=>{
      fs.readFile(path,(err,data)=>{
        if(err) rej(err)
        data = JSON.parse(data)
        res(data)
      })
    })
    return data
  }
  catch(err){
    console.log(err)
  }
}

const writeFileAsync = async (path,data)=>{
  try{
    await new Promise((res,rej)=>{
      fs.writeFile(path,JSON.stringify(data,null,2),(err)=>{
        if(err) rej(err)
        res()
      })
    })
  }
  catch(err){
    console.log(err)
  }
}

const rearrange = async ()=>{
  const data = await readFileAsync('codeFlower.json')

  writeFileAsync('codeFlower.json',data)
}


rearrange()