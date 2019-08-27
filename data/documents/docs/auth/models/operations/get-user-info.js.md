# get-user-info.js

## Functions

<dl>
<dt><a href="#get-user-info">get-user-info(info)</a> ⇒ <code>void</code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#infoObject">infoObject</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="get-user-info"></a>

## get-user-info(info) ⇒ <code>void</code>
**Kind**: global function  
**Throws**:

- userId is NaN
- Data fetch failed


| Param | Type |
| --- | --- |
| info | [<code>infoObject</code>](#infoObject) | 

<a name="infoObject"></a>

## infoObject : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| userId | <code>string</code> \| <code>number</code> | 

 
# Source code
```javascript=
import User from 'auth/models/schemas/user.js'

/**
 * @typedef {object} info
 * @property {string | number} userId
 */

/**
 * @function get-user-info
 * @param {object} info
 * @returns {void}
 * @throws userId is NaN
 * @throws Data fetch failed
 */
export default async(info) => {
  try{
    info.userId = Number(info.userId)
    /**
     * Check the `info.userId` is `number` or not.
     * If not, throw an error with status code, `400`
     */
    if(Number.isNaN(info.userId)){
      let err = new Error('userId is NaN')
      err.status = 400
      throw err
    }

    let user
    try{
      /**
       * Find a data in `User` table with the given
       * `where` and `attributes` properties.
       */
      user = await User.findOne({
        where:{
          userId: info.userId,
        },
        attributes:[
          'account',
        ],
      })
    }catch(err){
      /**
       * This mieght be a potential error, then throw out.
       * 1. The unknow problem when fetching the user's information
       */
      err = new Error('data fetch failed')
      err.status = 500
      throw err
    }

    return user
  }catch(err){
    /**
     * Catch the error whatever it is, and it will check
     * whether this error is identified or not.
     */
    if(typeof err.status !== 'number'){
      err = new Error('data fetch failed')
      err.status = 500
    }
    throw err
  }
}
```
