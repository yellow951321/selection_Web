# data-create.js
<a name="dataCreate"></a>

## dataCreate(info) ⇒ <code>string</code>
Create a new Campus into database given the following information

**Kind**: global function  
**Returns**: <code>string</code> - - return a OK to represent this op is work correctly  
**Thorows**: - Throw an error if the campusId | typeId | userId | year == isNan  

| Param | Type | Description |
| --- | --- | --- |
| info | <code>object</code> |  |
| info.campusId | <code>number</code> | The ID of campus name |
| info.typeId | <code>number</code> | The ID of the type(0 or 1) |
| info.userId | <code>number</code> | The ID of the user |
| info.year | <code>number</code> | The year |

# Source code
```javascript=
import Data from 'mid-long-term/models/schemas/Data.js'
/**
 * Create a new Campus into database given the following information
 * @function dataCreate
 * @param {object} info
 * @param {number} info.campusId - The ID of campus name
 * @param {number} info.typeId - The ID of the type(0 or 1)
 * @param {number} info.userId - The ID of the user
 * @param {number} info.year - The year
 * @returns {string} - return a OK to represent this op is work correctly
 * @thorows - Throw an error if the campusId | typeId | userId | year == isNan
 */
export default async(info={}) =>{
  try{
    info.campusId = Number(info.campusId)
    info.typeId = Number(info.typeId)
    info.userId = Number(info.userId)
    info.yearFrom = Number(info.yearFrom)
    info.yearTo = Number(info.yearTo)
    /**
     * Validate whether the `info.campusId` is `NaN` or not.
     */
    if(Number.isNaN(info.campusId)){
      const err = new Error('campusId is NaN')
      err.status = 400
      throw err
    }
    /**
     * Validate whether the `info.typeId` is `NaN` or not.
     */
    if(Number.isNaN(info.typeId)){
      const err = new Error('typeId is NaN')
      err.status = 400
      throw err
    }
    /**
     * Validate whether the `info.userId` is `NaN` or not.
     */
    if(Number.isNaN(info.userId)){
      const err = new Error('userId is NaN')
      err.status = 400
      throw err
    }

    /**
     * Validate whether the `info.yearFrom` is `NaN` or not.
     */
    if(Number.isNaN(info.yearFrom)){
      const err = new Error('yearFrom is NaN')
      err.status = 400
      throw err
    }
    /**
     * Validate whether the `info.yearTo` is `NaN` or not.
     */
    if(Number.isNaN(info.yearTo)){
      const err = new Error('yearTo is NaN')
      err.status = 400
      throw err
    }
    let campus, result
    try{
      campus = await Data.findOne({
        where:{
          campusId: info.campusId,
          typeId: info.typeId,
          yearFrom: info.yearFrom,
          yearTo: info.yearTo,
        },
      })
    }catch(err){
      /**
       * Catch the error when `Data.findOne` failed
       */
      err = new Error('data fetch fail')
      err.status = 500
      throw err
    }

    try{
      if(campus === null){
        result = await Data.create({
          campusId: info.campusId,
          typeId: info.typeId,
          userId: info.userId,
          yearFrom: info.yearFrom,
          yearTo: info.yearTo,
        })
      }
    }catch(err){
      /**
       * Catch the error when `Data.create` failed
       */
      err = new Error('data create fail')
      err.status = 500
      throw err
    }

    return result
  }catch(err) {
    /**
     * Catch the error whatever it is, and it will check
     * whether this error is identified or not.
     */
    if(!err.status){
      err = new Error('Failed to create data.')
      err.status = 500
    }
    throw err
  }
}
```