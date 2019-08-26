import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import login from 'projectRoot/auth/models/operations/login.js'
import User from 'auth/models/schemas/user.js'
import Session from 'auth/models/schemas/session.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test mid-long-term/models/operations/login.js', ()=>{

  context('test login', ()=>{
    let UserFindOneStub, SessionCreateStub
    beforeEach(()=>{
      UserFindOneStub = sandbox.stub(User, 'findOne').callsFake(()=>{
        return {
          userId: 0,
        }
      })
      SessionCreateStub = sandbox.stub(Session, 'create').callsFake(()=>{
        return
      })
    })
    afterEach(()=>{
      sandbox.restore()
    })
    it('should throw an error message: invalid argument', async()=>{
      let invalidType = [1, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await login(arg)
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('invalid argument')
        }
      }
    })
    it('should throw an error message: fetching data failed', async()=>{
      UserFindOneStub.restore()
      UserFindOneStub = sandbox.stub(User, 'findOne').throws()
      try{
        await login({expiration: 0, })
        expect.fail(`should not get here`)
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('fetching data failed')
      }
      UserFindOneStub.restore()
    })
    it('should throw an error message: fetching data failed', async()=>{
      let account = 'testAccount'
      UserFindOneStub.restore()
      UserFindOneStub = sandbox.stub(User, 'findOne').callsFake(()=>{
        return null
      })
      try{
        await login({account, expiration: 0, })
        expect.fail(`should not get here`)
      }catch(err){
        expect(err).to.have.property('status').to.equal(401)
        expect(err).to.have.property('message').to.equal(`No account matched ${account}.`)
      }
      UserFindOneStub.restore()
    })
    it('should throw an error message: expiration is NaN', async()=>{
        let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {return}, ]
        for(let arg of invalidType){
          try{
            await login({expiration: arg, })
            expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
          }catch(err){
            expect(err).to.have.property('status').to.equal(400)
            expect(err).to.have.property('message').to.equal('expiration is NaN')
          }
        }
      })
    it('should throw an error message: creating session failed', async()=>{
      SessionCreateStub.restore()
      SessionCreateStub = sandbox.stub(Session, 'create').throws()
      try{
        await login({expiration: 0, })
        expect.fail(`should not get here`)
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('creating session failed')
      }
      SessionCreateStub.restore()
    })
  })  
})
