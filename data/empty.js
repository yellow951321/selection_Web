const fs = require('fs');

fs.readFile('projectSchema.empty.json',(err,data)=>{
  if(err) return console.log(err)
  if(data){
    data = JSON.parse(data);
    for(dimension in data)
      for(item in data[dimension])
        for(detail in data[dimension][item]){
          console.log(detail);
          //console.log(detail.length > 0);
          data[dimension][item][detail] = [];
        }
  }
  console.log(data);
  fs.writeFile('projectSchema.empty.json',JSON.stringify(data),(err)=>{
    if(err) console.log(err);
  })
});