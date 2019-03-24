const { Data, Content, } = require('../association')
const Sequelize = require('sequelize')
const { map, getFromNum, getFromWord, } = require('../../../data/operation/mapping')


const findAllGroupContents = async(userId, year, typeId, campusId)=>{
  try{

    let data = await Data.findAll({
      where: {
        userId: userId,
        year: year,
        type: typeId,
        campus: campusId,
      },
      attributes: ['dataId', ],
    })

    data = data.map(data=>data.dataId)
    data = await Promise.all(data.map(dataId => {
      return Content.findAll({
        attributes: [
          'contentId',
          'content',
          'title',
          'pageStart',
          'pageEnd',
          'aspect',
          'keypoint',
          'method',
        ],
        where: {
          dataId,
        },
      })
    }))

    return data
  } catch (err) {
    console.log(new Error(err))
  }

  // console.log(JSON.stringify(data, null, 2))
}

const findOneGroupContents = async(projectInfo, contentInfo) => {
  try{
    let data = await Data.findOne({
      where:{
        userId: projectInfo.userId,
        year: projectInfo.year,
        type: projectInfo.typeId,
        campus: projectInfo.campusId,
      },
      attributes: ['dataId', ],
    })

    let { dataId, } = data.dataValues
    data = await Content.findAll({
      attributes:[
        'contentId',
        'content',
        'title',
        'summary',
        'pageStart',
        'pageEnd',
        'aspect',
        'keypoint',
        'method',
      ],
      where: {
        aspect: contentInfo.aspect,
        keypoint: contentInfo.keypoint,
        method: contentInfo.method,
        dataId,
      },
    })
    return data

  }catch(err){
    console.log(new Error(err))
  }
}

const insertContent = async(info)=>{
  try{
    return Content.create({
      content: info.content,
      title: info.title,
      pageStart: info.pageStart,
      pageEnd: info.pageEnd,
      aspect: info.aspect,
      keypoint: info.keypoint,
      method: info.method,
      dataId: info.dataId,
    })
  } catch(err) {
    console.log(new Error(err))
  }
}

const updateContent = async(info) =>{
  try{
    let data = await Content.findOne({
      where:{
        contentId: info.contentId,
      },
      attributes:[
        'content',
        'title',
        'pageStart',
        'pageEnd',
        'contentId',
      ],
    })
    let savedData = await data.update({
      content: info.content,
      title: info.title,
      pageStart: info.pageStart,
      pageEnd: info.pageEnd,
      contentId: info.contentId,
      summary: info.summary,
    })

    return savedData
  } catch(err) {
    console.log(new Error(err))
  }
}

const deleteContent = async(contentId) => {
  try{
    await Content.destroy({
      where:{
        contentId,
      },
    }).then(() => 'OK')
      .catch(err => { throw err })
  }catch(err){
    console.log(new Error(err))
  }
}

module.exports = {
  findOneGroupContents,
  findAllGroupContents,
  insertContent,
  updateContent,
  deleteContent,
}