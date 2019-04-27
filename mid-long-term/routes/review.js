import express from 'express'
import Content from 'projectRoot/mid-long-term/models/schemas/Content.js'
import Data from 'projectRoot/mid-long-term/models/schemas/Data.js'
import {map, getFromNum ,getFromWord} from 'projectRoot/data/operation/mapping'


const router = express.Router({
    // case sensitive for route path
    caseSensitive: true,
    // parent path req.parmas take precedence over child path
    mergeParams: false,
    // fool proof route path
    strict: false,
})

router.get('/', async (req, res) => {

    let data = await Content.findAll({
        where: {
            dataId: res.locals.dataId,
            reviewerId: req.session.userId,
            isChecked: 0,
        },
        attributes: [
            'contentId',
            'dataId',
            'title1',
            'title2',
            'title3',
            'title4',
            'content',
            'pageFrom',
            'pageTo',
            'aspect',
            'keypoint',
            'method',
            'conflictedAspect',
            'conflictedKeypoint',
            'conflictedMethod',
            'reviewerId',
            'updateTime',
        ]
    })
    data.map( (data) => {
        let temp = data.dataValues;
        temp.aspect = getFromNum(map, {dimension: temp.aspect})
        temp.keypoint = getFromNum(map, {item: temp.keypoint})
        temp.method = getFromNum(map, {detail: temp.method})

        temp.conflictedAspect = getFromNum(map, {dimension: temp.conflictedAspect})
        temp.conflictedKeypoint = getFromNum(map, {item: temp.conflictedKeypoint})
        temp.conflictedMethod = getFromNum(map, {detail: temp.conflictedMethod})
        return temp;
    })

    let type = getFromNum(map, { type: res.locals.typeId})
    let campusName = getFromNum( map, {
      type: res.locals.typeId,
      campus: res.locals.campusId
    })
    res.render('manage/review.pug',{
      GLOBAL:{
        channel: {
            id: 'mid-long-term',
            name: '中長程計畫'
        },
        id: req.session.userId,
        user: res.locals.user,
        type: {
            id: res.locals.typeId,
            name: type,
        },
        campus: {
            id: res.locals.campusId,
            name: campusName,
        },
        contents: data,
      }
    })
})

router.post('/conflict', async (req, res) => {
    try{
        let data = await Content.findOne({
            where:{
                contentId: req.body.contentId,
            },
            attributes:[
                'contentId'
            ],
        })
        let conflictedAspect = getFromWord(map, {dimension: req.body.conflictedAspect})
        let conflictedKeypoint = getFromWord(map, {item: req.body.conflictedKeypoint})
        let conflictedMethod = getFromWord(map, {detail: req.body.conflictedMethod})
        let newData = await data.update({
            conflictedAspect,
            conflictedKeypoint,
            conflictedMethod,
            isConflicted: 1,
        })

        if(newData){
            res.send('completed')
        }
        else{
            throw new Error('failed')
        }
    }
    catch(err){
        res.status(404)
    }
})

router.post('/check', async (req, res) => {
    try{
        let data = await Content.findOne({
            where:{
                contentId: req.body.contentId,
            },
            attributes:[
                'contentId'
            ],
        })
        let newData = await data.update({
            isChecked: 1,
        })

        if(newData){
            res.send('completed')
        }
        else{
            throw new Error('failed')
        }
    }
    catch(err){

    }
})

export default router