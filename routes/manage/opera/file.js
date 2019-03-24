const express = require('express')
const router = express.Router({
  // case sensitive for route path
  caseSensitive: true,
  // parent path req.parmas take precedence over child path
  mergeParams: false,
  // fool proof route path
  strict: false,
})
const { User, Data, Content, } = require('../../../models/newModel/association')
const { map, getFromWord, getFromNum, } = require('../../../data/operation/mapping')


const { createNewProject, deleteProject, } = require('../../../models/newModel/operation/Data')

router.post('/add', async(req, res)=>{
  try{
    /**
     * @todo year, type, campus validation
     */
    let typeId = req.body.type
    let type = getFromNum(map, { type: req.body.type, })
    let campusId = getFromWord(map, {
      campus: req.body.campus,
      type,
    })

    let newProject = await createNewProject({
      campusId,
      year: req.body.year,
      type: typeId,
      userId: req.session.userId,
    })

    res.redirect(`/man/${req.session.userId}/${req.body.year}/${type}/${req.body.campus}`)
    console.log('Add operation is finished')

  }
  catch (err){
    res.status(409).render('error', {
      message : err,
      error: {
        status: err.status,
      },
    })
  }
})

router.delete('/delete', async(req, res)=>{
  try{
    const user = await User.findOne({
      where:{
        userId: req.session.userId,
      },
    })
    if(user == null)
      throw new Error(`No userId ${req.session.userId}`)

    await deleteProject({
      dataId: req.body.dataId,
    })
    res.status(200).send('OK')
  }
  catch (err){
    console.log(err)
    res.status(409).render('error', {
      message : err,
      error: {
        status: err.status,
      },
    })
  }
})

module.exports = router

