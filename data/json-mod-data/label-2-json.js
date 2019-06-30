const {map} = require('../../lib/static/javascripts/mapping/label.js')
const fs = require('fs')
const main  = () => {
  try{
    let dump = {}
    map.forEach( (aspect) => {
      dump[aspect.shortTerm] = []
      aspect.keypoint.forEach( (keypoint)=>{
        dump[aspect.shortTerm].push(keypoint.shortTerm)
        keypoint.method.forEach((method) => {
          dump[aspect.shortTerm].push(method.shortTerm)
        })
      })
    })
    json_dump = JSON.stringify(dump, null, 2)
    fs.writeFileSync('label.json', json_dump, {encoding: 'utf-8'})

    console.log(JSON.stringify(dump,null,2))
  }catch(err){
    console.log(err)
  }
}


main()