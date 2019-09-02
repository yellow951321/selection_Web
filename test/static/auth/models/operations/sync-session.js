import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import syncSession from 'projectRoot/auth/models/operations/sync-session.js'
import cookieParser from 'cookie-parser'
import Session from 'auth/models/schemas/session.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test mid-long-term/models/operations/syncSession.js', ()=>{

  context('test syncSession', ()=>{
    let cookieParserStub, SessionFindOneStub
    beforeEach(()=>{
      cookieParserStub = sandbox.stub(cookieParser, 'signedCookies').callsFake(()=>{
        return {
          sekiro: 'testSession',
        }
      })
      SessionFindOneStub = sandbox.stub(Session, 'findOne').callsFake(()=>{
        return {
          userId: 0,
          expiration: Number(new Date(Date.now() + 200000)),
          update: ()=>{return},
          destroy: ()=>{return},
        }
      })
    })
    afterEach(()=>{
      sandbox.restore()
    })
    it('should throw an error message: invalid argument', async()=>{
      let invalidType = [1, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await syncSession(arg)
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('invalid argument')
        }
      }
    })
    it('should throw an error message: parsering cookie failed', async()=>{
      cookieParserStub.restore()
      cookieParserStub = sandbox.stub(cookieParser, 'signedCookies').throws()
      try{
        await syncSession({})
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('parsering cookie failed')
      }
    })
    it('should throw an error message: fetching data failed', async()=>{
      SessionFindOneStub.restore()
      SessionFindOneStub = sandbox.stub(Session, 'findOne').throws()
      try{
        await syncSession({})
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('fetching data failed')
      }
    })
    it('should throw an error message: updating data failed', async()=>{
      SessionFindOneStub.restore()
      SessionFindOneStub = sandbox.stub(Session, 'findOne').callsFake(()=>{
        return {
          userId: 0,
          expiration: Number(new Date(Date.now() + 200000)),
          update: ()=>{throw new Error()},
          destroy: ()=>{return},
        }
      })
      try{
        await syncSession({})
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('updating data failed')
      }
    })
    it('should return correct status and message', async()=>{
      expect(await syncSession({})).to.deep.equal({
        status: 200,
        message: 'sync success',
        userId: 0,
      })
      SessionFindOneStub.restore()
      SessionFindOneStub = sandbox.stub(Session, 'findOne').callsFake(()=>{
        return {
          userId: 0,
          expiration: Number(new Date(Date.now()-1)),
          update: ()=>{return},
          destroy: ()=>{return},
        }
      })
      expect(await syncSession({})).to.deep.equal({
        status: 440,
        message: 'session expired',
      })
      SessionFindOneStub.restore()
      SessionFindOneStub = sandbox.stub(Session, 'findOne').callsFake(()=>{
        return null
      })
      expect(await syncSession({})).to.deep.equal({
        status: 302,
        message: 'session is latest on the server',
      })
    })
  })
})
