const { Data, User, Content } = require('../../models/newModel/association')
const {map,getFromWord,getFromNum} = require('./mapping')

const countOneCampusMethod = async (info) => {
  try{
    let data = await Data.findOne({
      where:{
        campus: info.campus,
        year: info.year,
        type: info.type,
        userId: info.userId

      },
      attributes: ['dataId']
    }).then( data => {
      if(data != null)
        return data = data.dataId
      else
        throw new Error('No specific Data')
    })

    var GroupOfEachMethod = await Content.findAll({
      where:{
        dataId: data
      },
      attributes: [
        'aspect',
        'keypoint',
        'method',
        'dataId'
      ],
      group: ['method']
    }).then( data => data.map(d => d.dataValues))

    let numberOfEachGroupMethod = await Promise.all(GroupOfEachMethod.map( d => {
      return Content.count({
        where: {
          dataId: d.dataId,
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method
        }
      }).then( number => {
        return {
          aspect: getFromNum(map, { dimension: d.aspect }),
          keypoint: getFromNum(map, { item: d.keypoint }),
          method: getFromNum(map, {detail: d.method }),
          value: number
        }
      })
    }))

    return numberOfEachGroupMethod


  }catch(err) {
    console.log(new Error(err))
  }
}

const countAllCampusMethod = async () => {
  try{
    var GroupOfEachMethod = await Content.findAll({
      attributes: [
        'aspect',
        'keypoint',
        'method'
      ],
      group: ['method']
    }).then( data => data.map(d => d.dataValues))

    let numberOfEachGroupMethod = await Promise.all(GroupOfEachMethod.map( d => {
      return Content.count({
        where: {
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method
        }
      }).then( number => {
        return {
          aspect: getFromNum(map, { dimension: d.aspect }),
          keypoint: getFromNum(map, { item: d.keypoint }),
          method: getFromNum(map, { detail: d.method }),
          value: number
        }
      })
    }))

    return numberOfEachGroupMethod
  }catch(err){
    console.log(new Error(err))
  }
}

const countAllCampusMethodCorToOneCampus = async (info) => {
  try{
    let data = await Data.findOne({
      where:{
        campus: info.campus,
        year: info.year,
        type: info.type,
        userId: info.userId

      },
      attributes: ['dataId']
    }).then( data => {
      if(data != null)
        return data = data.dataId
      else
        throw new Error('No specific Data')
    })

    var GroupOfEachMethod = await Content.findAll({
      where:{
        dataId: data
      },
      attributes: [
        'aspect',
        'keypoint',
        'method',
        'dataId'
      ],
      group: ['method']
    }).then( data => data.map(d => d.dataValues))

    let numberOfEachGroupMethod = await Promise.all( GroupOfEachMethod.map( d => {
      return Content.count({
        where: {
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method
        }
      }).then( number => {
        return {
          aspect: getFromNum(map, { dimension: d.aspect }),
          keypoint: getFromNum(map, { item: d.keypoint }),
          method: getFromNum(map, {detail: d.method }),
          overall: number
        }
      }).then( obj => {
        return Content.count({
          where: {
            dataId: d.dataId,
            aspect: d.aspect,
            keypoint: d.keypoint,
            method: d.method
          }
        }).then( specficNum => {
            obj.self = specficNum
            return obj
        })
      })
    }))

    return numberOfEachGroupMethod


  }catch(err) {
    console.log(new Error(err))
  }
}

const countOneCampusMethodCorToAspect = async (info) =>{
  try{
    let data = await Data.findOne({
      where:{
        campus: info.campus,
        year: info.year,
        type: info.type,
        userId: info.userId

      },
      attributes: ['dataId']
    }).then( data => {
      if(data != null)
        return data = data.dataId
      else
        throw new Error('No specific Data')
    })

    var GroupOfEachMethod = await Content.findAll({
      where:{
        dataId: data,
        aspect: info.aspect,
      },
      attributes: [
        'aspect',
        'keypoint',
        'method',
        'dataId'
      ],
      group: ['method']
    }).then( data => data.map(d => d.dataValues))

    let numberOfEachGroupMethod = await Promise.all( GroupOfEachMethod.map( d => {
      return Content.count({
        where: {
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method
        }
      }).then( number => {
        return {
          aspect: getFromNum(map, { dimension: d.aspect }),
          keypoint: getFromNum(map, { item: d.keypoint }),
          method: getFromNum(map, {detail: d.method }),
          overall: number
        }
      }).then( obj => {
        return Content.count({
          where: {
            dataId: d.dataId,
            aspect: d.aspect,
            keypoint: d.keypoint,
            method: d.method
          }
        }).then( specficNum => {
            obj.self = specficNum
            return obj
        })
      })
    }))

    return numberOfEachGroupMethod

  }catch(err) {

  }
}

const countOneCampusMethodCorToAspectKey = async(info) =>{
  try{
    let data = await Data.findOne({
      where:{
        campus: info.campus,
        year: info.year,
        type: info.type,
        userId: info.userId

      },
      attributes: ['dataId']
    }).then( data => {
      if(data != null)
        return data = data.dataId
      else
        throw new Error('No specific Data')
    })

    var GroupOfEachMethod = await Content.findAll({
      where:{
        dataId: data,
        aspect: info.aspect,
        keypoint: info.keypoint
      },
      attributes: [
        'aspect',
        'keypoint',
        'method',
        'dataId'
      ],
      group: ['method']
    }).then( data => data.map(d => d.dataValues))

    let numberOfEachGroupMethod = await Promise.all( GroupOfEachMethod.map( d => {
      return Content.count({
        where: {
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method
        }
      }).then( number => {
        return {
          aspect: getFromNum(map, { dimension: d.aspect }),
          keypoint: getFromNum(map, { item: d.keypoint }),
          method: getFromNum(map, {detail: d.method }),
          overall: number
        }
      }).then( obj => {
        return Content.count({
          where: {
            dataId: d.dataId,
            aspect: d.aspect,
            keypoint: d.keypoint,
            method: d.method
          }
        }).then( specficNum => {
            obj.self = specficNum
            return obj
        })
      })
    }))

    return numberOfEachGroupMethod

  }catch(err){
    console.log(new Error(err))
  }
}

const countCampusAll = async (info) => {
  try{
    let data = await Data.findOne({
      where:{
        campus: info.campus,
        year: info.year,
        type: info.type,
        userId: info.userId
      },
      attributes: ['dataId']
    }).then( data => {
      if(data != null)
        return data = data.dataId
      else
        throw new Error('No specific Data')
    })

    var GroupOfEachMethod = await Content.findAll({
      where:{
        dataId: data
      },
      attributes: [
        'aspect',
        'keypoint',
        'method',
        'dataId'
      ],
      group: ['method']
    }).then( data => data.map(d => d.dataValues))

    let numberOfEachGroupMethod = await Promise.all( GroupOfEachMethod.map( d => {
      return Content.count({
        attributes:[
          'dataId'
        ],
        where: {
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method
        },
        group: ['dataId']
      }).then( number => {
        number = number.sort( (a,b) => {
          return a.count - b.count
        })
        let index = number.findIndex(e => {
          return e.dataId == d.dataId
        })
        let foundCampus = number[index]
        let matchNum = number.map( (d,i) => {
          if( foundCampus.count == d.count )
            return i
        })
        matchNum = matchNum.filter( d => d)
        console.log(matchNum)
        let highest = number[number.length - 1].count
        return {
          aspect: getFromNum(map, { dimension: d.aspect }),
          keypoint: getFromNum(map, { item: d.keypoint }),
          method: getFromNum(map, {detail: d.method }),
          self: foundCampus.count,
          highest,
          rank: matchNum[matchNum.length-1]/number.length
        }
      })
    }))

    return numberOfEachGroupMethod

  }catch(err) {
    console.log(err)
  }
}

const countCampusRespectToAspect = async (info) => {
  try{
    let data = await Data.findOne({
      where:{
        campus: info.campus,
        year: info.year,
        type: info.type,
        userId: info.userId

      },
      attributes: ['dataId']
    }).then( data => {
      if(data != null)
        return data = data.dataId
      else
        throw new Error('No specific Data')
    })

    var GroupOfEachMethod = await Content.findAll({
      where:{
        dataId: data,
        aspect: info.aspect,
      },
      attributes: [
        'aspect',
        'keypoint',
        'method',
        'dataId'
      ],
      group: ['method']
    }).then( data => data.map(d => d.dataValues))

    let numberOfEachGroupMethod = await Promise.all( GroupOfEachMethod.map( d => {
      return Content.count({
        attributes:[
          'dataId'
        ],
        where: {
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method
        },
        group: ['dataId']
      }).then( number => {
        number = number.sort( (a,b) => {
          return a.count - b.count
        })
        console.log(number)
        let index = number.findIndex(e => {
          return e.dataId == d.dataId
        })
        let foundCampus = number[index]
        let highest = number[number.length - 1].count
        return {
          aspect: getFromNum(map, { dimension: d.aspect }),
          keypoint: getFromNum(map, { item: d.keypoint }),
          method: getFromNum(map, {detail: d.method }),
          self: foundCampus.count,
          highest,
          rank: index/number.length
        }
      })
    }))

    return numberOfEachGroupMethod

  }catch(err) {
    console.log(err)
  }
}

const countCampusRespectToKey = async (info) => {
  try{
    let data = await Data.findOne({
      where:{
        campus: info.campus,
        year: info.year,
        type: info.type,
        userId: info.userId

      },
      attributes: ['dataId']
    }).then( data => {
      if(data != null)
        return data = data.dataId
      else
        throw new Error('No specific Data')
    })

    var GroupOfEachMethod = await Content.findAll({
      where:{
        dataId: data,
        aspect: info.aspect,
        keypoint: info.keypoint
      },
      attributes: [
        'aspect',
        'keypoint',
        'method',
        'dataId'
      ],
      group: ['method']
    }).then( data => data.map(d => d.dataValues))

    let numberOfEachGroupMethod = await Promise.all( GroupOfEachMethod.map( d => {
      return Content.count({
        attributes:[
          'dataId'
        ],
        where: {
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method
        },
        group: ['dataId']
      }).then( number => {
        number = number.sort( (a,b) => {
          return a.count - b.count
        })
        console.log(number)
        let index = number.findIndex(e => {
          return e.dataId == d.dataId
        })
        let foundCampus = number[index]
        let highest = number[number.length - 1].count
        return {
          aspect: getFromNum(map, { dimension: d.aspect }),
          keypoint: getFromNum(map, { item: d.keypoint }),
          method: getFromNum(map, {detail: d.method }),
          self: foundCampus.count,
          highest,
          rank: index/number.length
        }
      })
    }))

    return numberOfEachGroupMethod

  }catch(err) {
    console.log(err)
  }
}

const countCampusRespectToMethod = async(info) => {
  try{
    let data = await Data.findOne({
      where:{
        campus: info.campus,
        year: info.year,
        type: info.type,
        userId: info.userId

      },
      attributes: ['dataId']
    }).then( data => {
      if(data != null)
        return data = data.dataId
      else
        throw new Error('No specific Data')
    })

    var GroupOfEachMethod = await Content.findAll({
      where:{
        dataId: data,
        aspect: info.aspect,
        keypoint: info.keypoint,
        method: info.method
      },
      attributes: [
        'aspect',
        'keypoint',
        'method',
        'dataId'
      ],
      group: ['method']
    }).then( data => data.map(d => d.dataValues))

    let numberOfEachGroupMethod = await Promise.all( GroupOfEachMethod.map( d => {
      return Content.count({
        attributes:[
          'dataId'
        ],
        where: {
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method
        },
        group: ['dataId']
      }).then( number => {
        number = number.sort( (a,b) => {
          return a.count - b.count
        })
        console.log(number)
        let index = number.findIndex(e => {
          return e.dataId == d.dataId
        })
        let foundCampus = number[index]
        let highest = number[number.length - 1].count
        return {
          aspect: getFromNum(map, { dimension: d.aspect }),
          keypoint: getFromNum(map, { item: d.keypoint }),
          method: getFromNum(map, {detail: d.method }),
          self: foundCampus.count,
          highest,
          rank: index/number.length
        }
      })
    }))

    return numberOfEachGroupMethod

  }catch(err) {
    console.log(err)
  }
}
const test = async ()=>{

  // const result = await countOneCampusMethod({
  //   campus: 1,
  //   year: 107,
  //   type: 0,
  //   userId: 6
  // })
  // const result = await countAllCampusMethodCorToOneCampus({
  //   campus: 1,
  //   year: 107,
  //   type: 0,
  //   userId: 6
  // })
  // const result = await countAllCampusMethod()
  // const result = await countOneCampusMethodCorToAspect({
  //   campus: 1,
  //   year: 107,
  //   type: 0,
  //   userId: 6,
  //   aspect: 0
  // })
  // const result = await countOneCampusMethodCorToAspectKey({
  //   campus: 1,
  //   year: 107,
  //   type: 0,
  //   userId: 6,
  //   aspect: 0,
  //   keypoint: 0
  // })
  // const result = await countCampusRespectToAspect({
    // campus: 1,
    // year: 107,
    // type: 0,
    // userId: 6,
    // aspect: 0,
  // })
  // const result = await countCampusRespectToKey({
  //   campus: 1,
  //   year: 107,
  //   type: 0,
  //   userId: 6,
  //   aspect: 0,
  //   keypoint: 0
  // })
  const result = await countCampusRespectToMethod({
    campus: 1,
    year: 107,
    type: 0,
    userId: 6,
    aspect: 0,
    keypoint: 0,
    method: 0
  })
  console.log(JSON.stringify(result,null ,2))

}


module.exports = {
  countCampusAll,
  countCampusRespectToAspect,
  countCampusRespectToKey,
  countCampusRespectToMethod
}