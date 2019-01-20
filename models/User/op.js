const fs = require('fs')

const getYear = async(info)=>{
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

const getCampusType = (info)=>{
  const username = info.username ? `/${info.username}`: ''
  const year = info.year ? `/${info.year}` : ''
  const path = 'data'+username+year
  return new Promise((res,rej)=>{
    fs.readdir(path,(err,files)=>{
      if(err) rej(err)
      if(files instanceof Array){
        res(files)
      }else{
        rej(new Error(`${files}`))
      }
    })
  })
}
const getCampus = (info)=>{
  const username = info.username ? `/${info.username}`: ''
  const year = info.year ? `/${info.year}` : ''
  const type = info.type ? `/${info.type}` : ''
  const path = 'data'+username+year+type
  return new Promise((res,rej)=>{
    fs.readdir(path,(err,files)=>{
      if(err) rej(err)
      if(files instanceof Array){
        res(files)
      }else{
        rej(new Error(`${files}`))
      }
    })
  })
}

const getProject = (info)=>{
  const username = info.username ? `/${info.username}`: ''
  const year = info.year ? `/${info.year}` : ''
  const type = info.type ? `/${info.type}` : ''
  const campus = info.campus ? `/${info.year +'_'+info.type+'_'+info.campus+'.json'}` : ''
  const path = 'data'+username+year+type+campus
  return new Promise((res,rej)=>{
    fs.readFile(path,'utf-8',(err,data)=>{
      if(err) rej(err)
      if(data){
        res(JSON.parse(data))
      }else{
        rej(new Error('Unknow error in readFile function'))
      }
    })
  })
}
const Fetch = {
  getYear: getYear,
  getCampusType : getCampusType,
  getCampus : getCampus,
  getProject : getProject
}

module.exports = Fetch