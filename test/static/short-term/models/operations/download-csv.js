import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

import downloadCsv from 'short-term/models/operations/download-csv.js'
import fs from 'fs'
import {Content, Data, } from 'short-term/models/association.js'

const expect = chai.expect
const sandbox = sinon.createSandbox()

describe('test short-term/models/operations/download-csv.js', ()=>{

  context('test downloadCsv', ()=>{
    let exsistsSyncStub, mkdirSyncStub, uniqueFilenameStub, createObjectCsvWriterStub, ContentDbStub, DataDbStub
    beforeEach(()=>{
      exsistsSyncStub = sandbox.stub(fs, 'existsSync').callsFake(()=>{
        return false
      })
      mkdirSyncStub = sandbox.stub(fs, 'mkdirSync').callsFake(()=>{
        return true
      })
      uniqueFilenameStub = sandbox.stub().callsFake(()=>{
        return 'testing Path'
      })
      downloadCsv.__set__('uniqueFilename', uniqueFilenameStub)
      createObjectCsvWriterStub = sandbox.stub().callsFake(()=>{
        return {
          message: 'testing Config',
          writeRecords: ()=>{
            return {
              message: 'writing succeed',
            }
          },
        }
      })
      downloadCsv.__set__('createObjectCsvWriter', createObjectCsvWriterStub)
      ContentDbStub = sandbox.stub(Content, 'findAll').callsFake(()=>{
        return [{
          pageFrom: 0,
          pageTo: 0,
          contentId: 0,
          title1: '1',
          title2: '2',
          title3: '3',
          title4: '4',
          content: 'test',
          summary: 'test',
          note: 'test',
          aspect: 0,
          keypoint: 0,
          method: 0,
        }, ]
      })
      DataDbStub = sandbox.stub(Data, 'findOne').callsFake(()=>{
        return {
          year: 108,
          campusId: 0,
          typeId: 0,
        }
      })
    })
    afterEach(()=>{
      downloadCsv.__ResetDependency__('uniqueFilename')
      downloadCsv.__ResetDependency__('createObjectCsvWriter')
      sandbox.restore()
    })
    it('should throw an error message: invalid argument', async()=>{
      let invalidType = [1, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await downloadCsv(arg)
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('invalid argument')
        }
      }
    })
    it('should throw an error message: dataId is NaN', async()=>{
      let invalidType = [NaN, {}, '1', undefined, null, true, ()=> {return}, ]
      for(let arg of invalidType){
        try{
          await downloadCsv({dataId: arg, })
          expect.fail(`should not get here with arg ${invalidType} with type ${typeof invalidType}`)
        }catch(err){
          expect(err).to.have.property('status').to.equal(400)
          expect(err).to.have.property('message').to.equal('dataId is NaN')
        }
      }
    })
    it('should throw an error message: create file failed', async()=>{
      exsistsSyncStub.restore()
      exsistsSyncStub = sandbox.stub(fs, 'existsSync').throws()
      try{
        await downloadCsv({dataId: 0, })
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(507)
        expect(err).to.have.property('message').to.equal('create file failed')
      }
      exsistsSyncStub.restore()
      exsistsSyncStub = sandbox.stub(fs, 'existsSync').callsFake(()=>{
        return false
      })

      mkdirSyncStub.restore()
      mkdirSyncStub = sandbox.stub(fs, 'mkdirSync').throws()
      try{
        await downloadCsv({dataId:0, })
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(507)
        expect(err).to.have.property('message').to.equal('create file failed')
      }
      mkdirSyncStub.restore()
      mkdirSyncStub = sandbox.stub(fs, 'mkdirSync').callsFake(()=>{
        return true
      })

      downloadCsv.__ResetDependency__('uniqueFilename')
      downloadCsv.__set__('uniqueFilename', sandbox.stub().throws())
      try{
        await downloadCsv({dataId:0, })
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(507)
        expect(err).to.have.property('message').to.equal('create file failed')
      }
    })
    it('should throw an error message: setting csv config failed', async()=>{
      downloadCsv.__ResetDependency__('createObjectCsvWriter')
      downloadCsv.__set__('createObjectCsvWriter', sandbox.stub().throws())
      try{
        await downloadCsv({dataId:0, })
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('setting csv config failed')
      }
    })
    it('should throw an error message: fetching data failed', async()=>{
      ContentDbStub.restore()
      ContentDbStub = sandbox.stub(Content, 'findAll').throws()
      try{
        await downloadCsv({dataId:0, })
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('fetching data failed')
      }
    })
    it('should throw an error message: data formatting failed', async()=>{
      downloadCsv.__set__('shortTermFromNumber', sandbox.stub().throws())
      try{
        await downloadCsv({dataId:0, })
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('data formatting failed')
      }
      downloadCsv.__ResetDependency__('shortTermFromNumber')
    })
    it('should throw adata featch failed', async()=>{
      DataDbStub.restore()
      DataDbStub = sandbox.stub(Data, 'findOne').throws()
      try{
        await downloadCsv({dataId:0, })
        expect.fail('should not get here')
      }catch(err){
        expect(err).to.have.property('status').to.equal(500)
        expect(err).to.have.property('message').to.equal('data featch failed')
      }
    })
    it('should return a object', async()=>{
      expect(await downloadCsv({dataId:0, })).to.deep.equal({
        filePath: 'testing Path',
        data: {
          campusId: 0,
          typeId: 0,
          year: 108,
        },
      })
    })
  })
})