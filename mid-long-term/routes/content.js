import express from 'express'
import Content from  'projectRoot/mid-long-term/models/schemas/Content'
import Data from  'projectRoot/mid-long-term/models/schemas/Data'
import {map, getFromNum ,getFromWord} from 'projectRoot/data/operation/mapping'

const router = express.Router({
   // case sensitive for route path
   caseSensitive: true,
   // parent path req.parmas take precedence over child path
   mergeParams: false,
   // fool proof route path
   strict: false,
})

router.get('/index', async (req,res) => {
})

router.get('/filter', async(req,res)=>{
  	try{
		let aspect = getFromWord(map, { dimension: req.query.dimension, })
		let keypoint = getFromWord(map, {item: req.query.item, })
		let method = getFromWord(map, { detail: req.query.detail, })
		let data = await Content.findAll({
			where: {
				dataId: res.locals.dataId,
				aspect,
				keypoint,
				method,
			},
			attributes: [
				'contentId',
				'title1',
				'title2',
				'title3',
				'title4',
				'content',
				'summary',
				'note',
				'pageFrom',
				'pageTo',
				'aspect',
				'keypoint',
				'method',
				'isChecked',
				'reviewerId',
				'isConflicted',
				'conflictedAspect',
				'conflictedMethod',
				'updateTime',
				'dataId'
			]
		})
		if(data === []){
			res.send('empty');
		}
		data = data.map(contents => contents.dataValues)
		res.render('manage/component/editNodes/own', {
			GLOBAL :{
			contents : data,
			},
		})
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

router.get('/review', async (req, res) => {

    let data = await Content.findAll({
        where: {
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

router.post('/add', async(req,res)=>{
	try{
		let aspect = getFromWord(map, { dimension: req.body.dimension, })
		let keypoint = getFromWord(map, {item: req.body.item, })
		let method = getFromWord(map, { detail: req.body.detail, })

		let data = await Content.create({
			dataId: res.locals.dataId,
			title1: '',
			title2: '',
			title3: '',
			title4: '',
			content: '',
			pageFrom: 1,
			pageTo: 1,
			aspect,
			keypoint,
			method,
			isChecked: 0,
			reviewerId: 0,
			isConflicted: 0,
			updateTime: Date.now(),
		})
		res.render('manage/component/editNodes/newEdit',{
			GLOBAL: {
				index: data.dataValues.contentId
			}
		});
	}catch(err) {
		res.status(404)
	}
})

router.post('/save', async(req,res)=>{
	try{
		// @TODO check if this user have privilige to modify

		let data = await Content.findOne({
			where:{
				contentId: req.body.contentId,
			},
			attributes:[
				'content',
				'summary',
				'reviewerId',
				'title1',
				'title2',
				'title3',
				'title4',
				'pageFrom',
				'pageTo',
				'contentId',
			],
		})
		let savedData = await data.update({
			content: req.body.content,
			summary: req.body.summary,
			reviewerId: req.body.auditor,
			title1: req.body.title1,
			title2: req.body.title2,
			title3: req.body.title3,
			title4: req.body.title4,
			pageFrom: req.body.page.start,
			pageTo: req.body.page.end,
			contentId: req.body.contentId,
		})
		if(savedData){
			res.send('completed')
		}
		else{
			throw new Error('save failed')
		}
	} catch(err) {
		res.status(404)
	}
})


router.delete('/delete', async(req,res)=>{
	try{
		let result = await Content.destroy({
			where:{
			contentId: req.body.contentId,
			},
		})
		console.log(result)
		res.send('completed')
	}
	catch(err){
		res.status(404)
	}
})

export default router