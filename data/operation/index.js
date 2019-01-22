const fs = require('fs')

var arr = [];
const readCampus = async ()=>{
  try{
    const rootF = await new Promise((res,rej)=>{
      fs.readdir('root/',(err,files)=>{
        if(err) rej(err)
        res(files)
      })
    })

    const rootF2 = await new Promise((res,rej)=>{
      fs.readdir('root2/',(err,files)=>{
        if(err) rej(err)
        res(files)
      })
    })

    if(rootF instanceof Array && rootF2 instanceof Array){
      const [universities,collages] = await Promise.all([
        (async ()=>{
          var arr = []
          for(let name of rootF2){
            await new Promise((res,rej)=>{
              fs.readdir('root2/'+name,(err,names)=>{
                if(err) rej(err)
                names.forEach((e)=>{
                  e = e.split('.')
                  arr.push(e[0])
                })
                res()
              })
            })
          }
          return arr
        })(),
        (async ()=>{
          var arr = []
          for(let name of rootF){
            await new Promise((res,rej)=>{
              fs.readdir('root/'+name,(err,names)=>{
                if(err) rej(err)
                names.forEach((e)=>{
                  e = e.split('.')
                  arr.push(e[0])
                })
                res()
              })
            })
          }
          return arr
        })()
      ])
      console.log(universities)
      console.log(collages)
      var campus = {
        0: universities,
        1: collages
      }
      fs.writeFile('result.json',JSON.stringify(campus,null,2),(err)=>{
        if(err) console.log(err)
      })
    }
  }
  catch(err){
    console.log(err)
  }
}
// fs.readdir('root/',(err,files)=>{
//   if(err) console.log(err)
//   if(files instanceof Array){
//     files.forEach((path)=>{
//       fs.readdir('root/'+path,(err,names)=>{
//         if(err) console.log(err)
//         names.forEach((e)=>{
//           arr.push(e)
//         })
//         var campus = {
//           0:[],
//           1:arr
//         }
//         // fs.writeFile('result.json',JSON.stringify(campus,null,2),(err)=>{
//         //   if(err) console.log(err)
//         // })
//       })
//     })
//   }
// })

// fs.readdir('root2/',(err,files)=>{
//   if(err) console.log(err)
//   if(files instanceof Array){
//     files.forEach((path)=>{
//       fs.readdir('root2/'+path,(err,names)=>{
//         if(err) console.log(err)
//         names.forEach((e)=>{
//           arr.push(e)
//         })
//         var campus = {
//           0:[],
//           1:arr
//         }
//         fs.writeFile('result.json',JSON.stringify(campus,null,2),(err)=>{
//           if(err) console.log(err)
//         })
//       })
//     })
//   }
// })

readCampus()