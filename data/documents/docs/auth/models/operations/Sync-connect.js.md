# Sync-connect.js

<a name="sync-session"></a>

## sync-session(req) ⇒ <code>void</code>
**Kind**: global function  
**Throws**:

- Data fetch failed
- Data update or destroy failed
- Failed in syncSession


| Param | Type | Description |
| --- | --- | --- |
| req | <code>object</code> | It is a request object |

**Example**  
```js
// if it execute well, return `void`
syncSession(req)
```

# Source code
```javascript=
import Session from 'auth/models/schemas/session.js'
import config from 'projectRoot/config.js'
import cookieParser from 'cookie-parser'


/**
 * @function sync-session
 * @param {object} req - It is a request object
 * @returns {void}
 * @throws Data fetch failed
 * @throws Data update or destroy failed
 * @throws Failed in syncSession
 * @example
 * // if it execute well, return `void`
 * syncSession(req)
 */
export default async(req) => {
  try{
    /**
     * `sessionId` will be reset after restarting server,
     * we need to update the session after every connection
     */
    let sessionId = cookieParser.signedCookies(req.cookies, config.server.secret)['sekiro']

    if(sessionId !== req.session.id){
      let data
      try{
        data = await Session.findOne({
          attribute: [
            'expiration',
            'userId',
          ],
          where: {
            sessionId,
          },
        })
      }catch(err){
       /**
       * It only catch the error when
       * it occurs exception in executing `Session.findOne`
       */
        err = new Error('Data fetch failed')
        err.status = 500
        throw err
      }

      try{
        if(data !== null){
          if(Number(data.expiration) > Date.now()){
            req.session.userId = data.userId
            await data.update({
              sessionId: req.session.id,
            })
          }
          else{
            await data.destroy()
          }
        }
      }catch(err){
        /**
       * It only catch the error when
       * it occurs exception in executing `data.update`
       */
        err = new Error('Data update or destroy failed')
        err.status = 500
        throw err
      }
    }
  }catch(err) {
    /**
     * Catch the error whatever it is, and it will check
     * whether this error is identified or not.
     */
    if(typeof err.status !== 'number'){
      err = new Error('Failed in syncSession.')
      err.status = 500
    }
    throw err
  }
}
```

