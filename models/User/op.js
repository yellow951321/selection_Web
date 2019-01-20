const fs = require('fs')

const getYear = async (info)=>{
  if(!info.username)
    throw new Error('no username provided')

  const path = `data/${info.username}`
  const files = await new Promise((res,rej)=>{
    fs.readdir(path,(err,files)=>{
      if(err) rej(err)
      res(files)
    })
  })
  return files;
}

const getCampusType = async (info)=>{
  if(!info.year || !info.username)
    throw new Error('no username or year provided')
  const path = `data/${info.username}/${info.year}`
  const files = await new Promise((res,rej)=>{
    fs.readdir(path,(err,files)=>{
      if(err) rej(err)
      res(files)
    })
  })
  return files
}

const getCampus = async (info)=>{
  if(!info.username || !info.year || !info.type)
    throw new Error('No username or year or type')
  const path = `data/${info.username}/${info.year}/${info.type}`
  const files = await new Promise((res,rej)=>{
    fs.readdir(path,(err,files)=>{
      if(err) rej(err)
      res(files)
    })
  })
  return files
}

const getProject = async (info)=>{
  if(!info.username || !info.year || !info.type || !info.campus)
    throw new Error('No username or year or type or campus')
  const path = `data/${info.username}/${info.year}/${info.type}/${info.campus}`
  const files = await new Promise((res,rej)=>{
    fs.readFile(path,'utf-8',(err,data)=>{
      if(err) rej(err)
      res(JSON.parse(data))
    })
  })
  return files
}
const Fetch = {
  getYear: getYear,
  getCampusType : getCampusType,
  getCampus : getCampus,
  getProject : getProject
}

module.exports = Fetch