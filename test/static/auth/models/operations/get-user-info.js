import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import getUserInfo from 'projectRoot/auth/models/operations/get-user-info.js'
import User from 'auth/models/schemas/user.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test mid-long-term/models/operations/get-user-info.js', ()=>{

  context('test getUserInfo', ()=>{
    afterEach(()=>{
      sandbox.restore()
    })
    it('should throw an error message: invalid argument', async()=>{
      let invalidType = [1, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await getUserInfo(arg)
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('invalid argument')
        }
      }
    })

    it('should throw an error message: userId is NaN', async()=>{
        let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {return}, ]
        for(let arg of invalidType){
          try{
            await getUserInfo({userId: arg, })
            expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
          }catch(err){
            expect(err).to.have.property('status').to.equal(400)
            expect(err).to.have.property('message').to.equal('userId is NaN')
          }
        }
      })
    it('should throw an error message: fetching data failed', async()=>{
      let UserStub = sandbox.stub(User, 'findOne').throws()
      try{
        await getUserInfo({userId: 0, })
        expect.fail(`should not get here`)
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('fetching data failed')
      }
      UserStub.restore()
    })
  })  
})
