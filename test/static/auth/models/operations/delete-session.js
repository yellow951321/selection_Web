import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import deleteSession from 'projectRoot/auth/models/operations/delete-session.js'
import Session from 'auth/models/schemas/session.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test mid-long-term/models/operations/content-auth.js', ()=>{

  context('test contentAuth', ()=>{
    afterEach(()=>{
      sandbox.restore()
    })
    it('should throw an error message: invalid argument', async()=>{
      let invalidType = [1, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await deleteSession(arg)
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('invalid argument')
        }
      }
    })
    it('should throw an error message: deleting session failed', async()=>{
      let sessionStub = sandbox.stub(Session, 'destroy').throws()
      try{
        await deleteSession({sessionId: 'testSession', })
        expect.fail(`should not get here`)
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('deleting session failed')
      }
      sessionStub.restore()
    })
  })  
})
