const fs = require('fs')
const User = require('./schema')
const getYear = async(info)=>{
  if(!info.username)
    throw new Error('no username provided')

  const path = `data/${info.username}`
  const files = await new Promise((res, rej)=>{
    fs.readdir(path, (err, files)=>{
      if(err) rej(err)
      res(files)
    })
  })
  return files
}

const getCampusType = async(info)=>{
  if(!info.year || !info.username)
    throw new Error('no username or year provided')
  const path = `data/${info.username}/${info.year}`
  const files = await new Promise((res, rej)=>{
    fs.readdir(path, (err, files)=>{
      if(err) rej(err)
      res(files)
    })
  })
  return files
}

const getCampus = async(info)=>{
  if(!info.username || !info.year || !info.type)
    throw new Error('No username or year or type')
  const path = `data/${info.username}/${info.year}/${info.type}`
  const files = await new Promise((res, rej)=>{
    fs.readdir(path, (err, files)=>{
      if(err) rej(err)
      res(files)
    })
  })
  return files
}

const findUsernameAsync = async(userId)=>{
  const doc = await new Promise((res, rej)=>{
    User.findOne({
      id : userId,
    }, (err, doc)=>{
      if(err) rej(err)
      if(doc){
        res(doc)
      }
    })
  })
  return doc
}

module.exports = {
  getYear,
  getCampusType,
  getCampus,
  findUsernameAsync,
}