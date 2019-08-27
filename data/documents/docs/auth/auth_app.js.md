# auth/app.js
<a name="module_userApp"></a>

## userApp
The Auth app root route

**Requires**: <code>module:express</code>, <code>module:path</code>, <code>module:cookie-parser</code>, <code>module:&#x27;auth/models/schemas/user.js&#x27;</code>, <code>module:&#x27;auth/models/schemas/session.js&#x27;</code>, <code>module:&#x27;auth/models/operations/sync-session.js&#x27;</code>  

* [userApp](#module_userApp)
    * [~checkSession()](#module_userApp..checkSession)
    * [~login()](#module_userApp..login)
    * [~channel()](#module_userApp..channel)
    * [~logout()](#module_userApp..logout)
    * [~errorRender(path, middleware)](#module_userApp..errorRender)

<a name="module_userApp..checkSession"></a>

### userApp~checkSession()
Check the sessionId in the cookie if its status is `login` or not.(stored in database)
automatically login

**Kind**: inner method of [<code>userApp</code>](#module_userApp)  
<a name="module_userApp..login"></a>

### userApp~login()
The login route

**Kind**: inner method of [<code>userApp</code>](#module_userApp)  
<a name="module_userApp..channel"></a>

### userApp~channel()
The channel route

**Kind**: inner method of [<code>userApp</code>](#module_userApp)  
<a name="module_userApp..logout"></a>

### userApp~logout()
The logout route

**Kind**: inner method of [<code>userApp</code>](#module_userApp)  
<a name="module_userApp..errorRender"></a>

### userApp~errorRender(path, middleware)
The error handling route used to render the error page

**Kind**: inner method of [<code>userApp</code>](#module_userApp)  