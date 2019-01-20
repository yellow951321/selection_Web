const fs = require('fs')

const pathGen = (username,year,type,campus)=>{
  return `data/${username}/${year}/${type}/${year}_${type}_${campus}.json`
}

const pathGenWithoutCampus = (username,year,type)=>{
  return `data/${username}/${year}/${type}`
}

const pathGenDeleteName = (username,year,type,campus)=>{
  return `data/${username}/${year}/${type}/${year}_${type}_${campus}_d.json`
}

const splitArrayIntoContext = (arr)=>{
  var temp = []
  for(name of arr){
    let temp
    var context = name.split('_')
    if(msContentScript.length <= 3){
      t = content[2].match(/[^.]+/)[0]
      temp.push(t)
    }
  }
  return temp
}

const objToNode = (range,project)=>{
  var context = []
  if(project[range.dimension][range.item][range.detail] instanceof Array && project[range.dimension][range.item][range.detail].length > 0){
    for(const [index,content] of project[range.dimension][range.item][range.detail].entries()){
      let t = {};
      t.content = content.paragraph
      t.title = content.title
      t.page = {}
      t.page.start = content.page[0]
      t.page.end = content.page[1]
      t.index = index

      context.push(t)
    }
  }
  return context
}

const nodeToObj = async (path,info,body)=>{
  const data = await new Promise((res,rej)=>{
    fs.readFile(path,'utf-8',(err,data)=>{
      if(err) rej(err)
      if(data){
        data = JSON.parse(data)
        res(data)
      }
    })
  })
  if(body instanceof Object){
    let t = new ContentSchema(body.page,body.data,body.title);
    let arr = data[info.dimension][info.item][info.detail]
    arr[info.index] = t
  }
  return data
}

function ContentSchema(page,paragraph,title){
  if(page.start && page.end){
    this.page = []
    this.page[0] = page.start
    this.page[1] = page.end
  }
  this.paragraph = paragraph ? paragraph : ''
  this.title = title ? title : ''
}

const checkFileAsync = async (path,pathWithoutCampus)=>{
  try{
    const state = await new Promise((res,rej)=>{
      fs.stat(path,(err,state)=>{
        if(err)
          rej(err)
        if(state)
          res(true)
      })
    })
    return state
  }
  catch (err){
    const signal = await new Promise((res,rej)=>{
      fs.mkdir(pathWithoutCampus,{recursive: true},(err)=>{
        if(err) rej(new Error(err))
        res(true)
      })
    })
    return signal
  }
}

module.exports = {
  pathGen,
  pathGenWithoutCampus,
  pathGenDeleteName,
  splitArrayIntoContext,
  objToNode,
  nodeToObj,
  checkFileAsync,
  ContentSchema
}