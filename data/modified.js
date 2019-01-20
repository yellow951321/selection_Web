const fs = require('fs')

fs.readFile('107_普通大學_中山醫學大學.json', (err, data)=>{
  if(err) return console.log(err)
  if(data){
    data = JSON.parse(data)
    for(dimension in data)
      for(item in data[dimension])
        for(detail in data[dimension][item]){
          console.log(detail)
          //console.log(detail.length > 0);
          console.log(data[dimension][item][detail].length)
          if(data[dimension][item][detail] instanceof Array && data[dimension][item][detail].length > 0){
            data[dimension][item][detail] = data[dimension][item][detail].filter((ele)=>{
              return ele.title != '' && ele.title != ''
            })
            data[dimension][item][detail].forEach((ele)=>{
              console.log(ele)
              var a = ele.page[0].split('-')
              ele.page[0] = a[0]
              ele.page[1] = a[1]
            })
          }
        }
  }
  console.log(data)
  fs.writeFile('107_普通大學_中山醫學大學.json', JSON.stringify(data,null,2), (err)=>{
    if(err) console.log(err)
  })
})