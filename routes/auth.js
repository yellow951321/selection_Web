const fs = require('fs')
const express = require('express')

const User = require('../models/newModel/schema/User')
const Session = require('../models/newModel/schema/Session')

const router = express.Router({
	// case sensitive for route path
	caseSensitive: true,
	// parent path req.parmas take precedence over child path
	mergeParams: false,
	// fool proof route path
	strict: false,
})

router.get('/login', (req, res)=>{
	if(req.session && req.session.userId)
		res.redirect(`/man/${req.session.userId}`)
	else
		res.render('login')
})

router.post('/login', async(req, res)=>{
	try{
		const doc = await User.findOne({
			where:{
				account: req.body.username,
				password: req.body.password,
			},
		})
		if(doc != null){
			req.session.userId = doc.dataValues.userId

			Session.create({
				sessionId: req.session.id,
				expiration: Number(req.session.cookie.expires),
				userId: doc.userId
			})

			res.redirect(`/man/${req.session.userId}`)
		}else{
			throw new Error(`No account matched ${req.body.username}`)
		}
	}
	catch(err){
		res.status(400).render('login', {error: err.message, })
	}
})

router.get('/logout', async (req, res)=>{
	try {
		await Session.destroy({
			where: {
				sessionId: req.session.id
			}
		})
		await req.session.destroy((err)=>{
			if(err)
				throw err
		})
		res.status(200).redirect('/auth/login')
	} catch (err) {
		res.status(404).render('error',{'message': err.message, 'err':{'status': '404'}})
	}
})

router.get('/signup', (req, res)=>{
	res.render('signup')
})

router.post('/signup', async(req, res)=>{
	var rMatch = new RegExp('<script[\s\S]*?>[\s\S]*?<\/script>', 'gi')
	try{
		if(rMatch.test(req.body.username) || rMatch.test(req.body.password))
			throw new Error('Forbidden password or account')

		const promise = await User.create({
			account : req.body.username,
			password: req.body.password,
		})

		if(promise){
			await new Promise((resolve, reject)=>{
				fs.mkdir(`data/${req.body.username}`, {recursive: true, }, (err)=>{
					if(err) reject(err)
					resolve(true)
				})
			})
		}

		res.status(200).send('OK')
	}
	catch (err){
		res.status(400).render('signup', {error:err.message, })
	}
})

module.exports = router