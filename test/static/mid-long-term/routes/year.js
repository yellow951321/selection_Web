import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import request from 'supertest'

chai.use(chaiAsPromised)
chai.use(sinonChai)
const expect = chai.expect
const sandbox = sinon.createSandbox();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import pugRender from 'pug-render'
import config from 'projectRoot/config'
import path from 'path'
const midLongTermPugRoot = path.join(config.projectRoot, 'mid-long-term/views')

const render = pugRender(midLongTermPugRoot, {
    locals: {env: process.env},
})

import server from 'projectRoot/server.js'
import yearRouter from 'mid-long-term/routes/year.js'

describe('yearRouter', ()=>{

    context('Get /index', ()=>{
        it('should get /index', async ()=>{
            let dbStub = sinon.stub().callsFake(()=>{
                return []
            })
            // yearRouter.__set__('getAllYear', dbStub)
            console.log(1)
            let output = await request(server).get('/mid-long-term/0/0/index')
            console.log(output.text)
            // console.log(await render('year', {
            //     breadcrumb: [
            //       {
            //         id: 'mid-long-term',
            //         name: '中長程計畫',
            //       },
            //       {
            //         id: res.locals.typeId,
            //         name: typeName,
            //       },
            //       {
            //         id: res.locals.campusId,
            //         name: campusName,
            //       }
            //     ],
            //     id: req.session.userId,
            //     user: res.locals.user,
            //     data
            //   }))
        })
    })
})


