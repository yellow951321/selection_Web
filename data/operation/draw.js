const { Data, Content, } = require('../../models/association_old')
const {map, getFromNum, } = require('./mapping')

const countOneCampusMethod = async(info) => {
  try{
    let data = await Data.findOne({
      where:{
        campus: info.campus,
        year: info.year,
        type: info.type,
        userId: info.userId,

      },
      attributes: ['dataId', ],
    }).then(data => {
      if(data != null)
        return data = data.dataId
      else
        throw new Error('No specific Data')
    })

    var GroupOfEachMethod = await Content.findAll({
      where:{
        dataId: data,
      },
      attributes: [
        'aspect',
        'keypoint',
        'method',
        'dataId',
      ],
      group: ['method', ],
    }).then(data => data.map(d => d.dataValues))

    let numberOfEachGroupMethod = await Promise.all(GroupOfEachMethod.map(d => {
      return Content.count({
        where: {
          dataId: d.dataId,
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method,
        },
      }).then(number => {
        return {
          aspect: getFromNum(map, { dimension: d.aspect, }),
          keypoint: getFromNum(map, { item: d.keypoint, }),
          method: getFromNum(map, {detail: d.method, }),
          value: number,
        }
      })
    }))

    return numberOfEachGroupMethod


  }catch(err) {
    console.log(new Error(err))
  }
}

const countAllCampusMethod = async() => {
  try{
    var GroupOfEachMethod = await Content.findAll({
      attributes: [
        'aspect',
        'keypoint',
        'method',
      ],
      group: ['method', ],
    }).then(data => data.map(d => d.dataValues))

    let numberOfEachGroupMethod = await Promise.all(GroupOfEachMethod.map(d => {
      return Content.count({
        where: {
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method,
        },
      }).then(number => {
        return {
          aspect: getFromNum(map, { dimension: d.aspect, }),
          keypoint: getFromNum(map, { item: d.keypoint, }),
          method: getFromNum(map, { detail: d.method, }),
          value: number,
        }
      })
    }))

    return numberOfEachGroupMethod
  }catch(err){
    console.log(new Error(err))
  }
}

const countAllCampusMethodCorToOneCampus = async(info) => {
  try{
    let data = await Data.findOne({
      where:{
        campus: info.campus,
        year: info.year,
        type: info.type,
        userId: info.userId,

      },
      attributes: ['dataId', ],
    }).then(data => {
      if(data != null)
        return data = data.dataId
      else
        throw new Error('No specific Data')
    })

    var GroupOfEachMethod = await Content.findAll({
      where:{
        dataId: data,
      },
      attributes: [
        'aspect',
        'keypoint',
        'method',
        'dataId',
      ],
      group: ['method', ],
    }).then(data => data.map(d => d.dataValues))

    let numberOfEachGroupMethod = await Promise.all(GroupOfEachMethod.map(d => {
      return Content.count({
        where: {
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method,
        },
      }).then(number => {
        return {
          aspect: getFromNum(map, { dimension: d.aspect, }),
          keypoint: getFromNum(map, { item: d.keypoint, }),
          method: getFromNum(map, {detail: d.method, }),
          overall: number,
        }
      }).then(obj => {
        return Content.count({
          where: {
            dataId: d.dataId,
            aspect: d.aspect,
            keypoint: d.keypoint,
            method: d.method,
          },
        }).then(specficNum => {
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

const countOneCampusMethodCorToAspect = async(info) =>{
  try{
    let data = await Data.findOne({
      where:{
        campus: info.campus,
        year: info.year,
        type: info.type,
        userId: info.userId,

      },
      attributes: ['dataId', ],
    }).then(data => {
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
        'dataId',
      ],
      group: ['method', ],
    }).then(data => data.map(d => d.dataValues))

    let numberOfEachGroupMethod = await Promise.all(GroupOfEachMethod.map(d => {
      return Content.count({
        where: {
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method,
        },
      }).then(number => {
        return {
          aspect: getFromNum(map, { dimension: d.aspect, }),
          keypoint: getFromNum(map, { item: d.keypoint, }),
          method: getFromNum(map, {detail: d.method, }),
          overall: number,
        }
      }).then(obj => {
        return Content.count({
          where: {
            dataId: d.dataId,
            aspect: d.aspect,
            keypoint: d.keypoint,
            method: d.method,
          },
        }).then(specficNum => {
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
        userId: info.userId,

      },
      attributes: ['dataId', ],
    }).then(data => {
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
      },
      attributes: [
        'aspect',
        'keypoint',
        'method',
        'dataId',
      ],
      group: ['method', ],
    }).then(data => data.map(d => d.dataValues))

    let numberOfEachGroupMethod = await Promise.all(GroupOfEachMethod.map(d => {
      return Content.count({
        where: {
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method,
        },
      }).then(number => {
        return {
          aspect: getFromNum(map, { dimension: d.aspect, }),
          keypoint: getFromNum(map, { item: d.keypoint, }),
          method: getFromNum(map, {detail: d.method, }),
          overall: number,
        }
      }).then(obj => {
        return Content.count({
          where: {
            dataId: d.dataId,
            aspect: d.aspect,
            keypoint: d.keypoint,
            method: d.method,
          },
        }).then(specficNum => {
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

const countCampusAll = async(info) => {
  try{
    let data = await Data.findOne({
      where:{
        campus: info.campus,
        year: info.year,
        type: info.type,
        userId: info.userId,
      },
      attributes: ['dataId', ],
    }).then(data => {
      if(data != null)
        return data = data.dataId
      else
        throw new Error('No specific Data')
    })

    var GroupOfEachMethod = await Content.findAll({
      where:{
        dataId: data, //dataId
      },
      attributes: [
        'aspect',
        'keypoint',
        'method',
        'dataId',
      ],
      group: ['method', ],
    }).then(data => data.map(d => d.dataValues))

    let dataOfEachGroupMethod = await Promise.all(GroupOfEachMethod.map(d => {
      return Content.count({
        attributes:[
          'dataId',
        ],
        where: {
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method,
        },
        group: ['dataId', ],
      }).then(number => {
        number = number.sort((a, b) => {
          return a.count - b.count
        })
        return {
          aspect: getFromNum(map, { dimension: d.aspect, }),
          keypoint: getFromNum(map, { item: d.keypoint, }),
          method: getFromNum(map, {detail: d.method, }),
          methodId: d.method,
          selfId: d.dataId,
          data: number,
        }
      })
    }))

    return dataOfEachGroupMethod

  }catch(err) {
    console.log(err)
  }
}

const countCampusRespectToAspect = async(info) => {
  try{
    let data = await Data.findOne({
      where:{
        campus: info.campus,
        year: info.year,
        type: info.type,
        userId: info.userId,

      },
      attributes: ['dataId', ],
    }).then(data => {
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
        'dataId',
      ],
      group: ['method', ],
    }).then(data => data.map(d => d.dataValues))

    let numberOfEachGroupMethod = await Promise.all(GroupOfEachMethod.map(d => {
      return Content.count({
        attributes:[
          'dataId',
        ],
        where: {
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method,
        },
        group: ['dataId', ],
      }).then(number => {
        number = number.sort((a, b) => {
          return a.count - b.count
        })
        return {
          aspect: getFromNum(map, { dimension: d.aspect, }),
          keypoint: getFromNum(map, { item: d.keypoint, }),
          method: getFromNum(map, {detail: d.method, }),
          methodId: d.method,
          selfId: d.dataId,
          data: number,
        }
      })
    }))

    return numberOfEachGroupMethod

  }catch(err) {
    console.log(err)
  }
}

const countCampusRespectToKey = async(info) => {
  try{
    let data = await Data.findOne({
      where:{
        campus: info.campus,
        year: info.year,
        type: info.type,
        userId: info.userId,

      },
      attributes: ['dataId', ],
    }).then(data => {
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
      },
      attributes: [
        'aspect',
        'keypoint',
        'method',
        'dataId',
      ],
      group: ['method', ],
    }).then(data => data.map(d => d.dataValues))

    let numberOfEachGroupMethod = await Promise.all(GroupOfEachMethod.map(d => {
      return Content.count({
        attributes:[
          'dataId',
        ],
        where: {
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method,
        },
        group: ['dataId', ],
      }).then(number => {
        number = number.sort((a, b) => {
          return a.count - b.count
        })
        return {
          aspect: getFromNum(map, { dimension: d.aspect, }),
          keypoint: getFromNum(map, { item: d.keypoint, }),
          method: getFromNum(map, {detail: d.method, }),
          methodId: d.method,
          selfId: d.dataId,
          data: number,
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
        userId: info.userId,

      },
      attributes: ['dataId', ],
    }).then(data => {
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
        method: info.method,
      },
      attributes: [
        'aspect',
        'keypoint',
        'method',
        'dataId',
      ],
      group: ['method', ],
    }).then(data => data.map(d => d.dataValues))

    let numberOfEachGroupMethod = await Promise.all(GroupOfEachMethod.map(d => {
      return Content.count({
        attributes:[
          'dataId',
        ],
        where: {
          aspect: d.aspect,
          keypoint: d.keypoint,
          method: d.method,
        },
        group: ['dataId', ],
      }).then(number => {
        number = number.sort((a, b) => {
          return a.count - b.count
        })
        return {
          aspect: getFromNum(map, { dimension: d.aspect, }),
          keypoint: getFromNum(map, { item: d.keypoint, }),
          method: getFromNum(map, {detail: d.method, }),
          methodId: d.method,
          selfId: d.dataId,
          data: number,
        }
      })
    }))

    return numberOfEachGroupMethod

  }catch(err) {
    console.log(err)
  }
}

module.exports = {
  countCampusAll,
  countCampusRespectToAspect,
  countCampusRespectToKey,
  countCampusRespectToMethod,
}