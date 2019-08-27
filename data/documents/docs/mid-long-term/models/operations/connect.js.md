Connect.js
===
- Define the connection between the clients and the database server.

## Members

<dl>
<dt><a href="#host">host</a></dt>
<dd><p>Custom host</p>
</dd>
<dt><a href="#port">port</a></dt>
<dd><p>Custom port defined in <code>config.js</code></p>
</dd>
<dt><a href="#dialect">dialect</a></dt>
<dd><p>The sql dialect of the dtabase</p>
</dd>
<dt><a href="#omitNull">omitNull</a></dt>
<dd><p>Disable inserting undefined values as <code>NULL</code>
default: <code>false</code></p>
</dd>
<dt><a href="#native">native</a></dt>
<dd><p>A flag for using a native library or not
default: <code>false</code></p>
</dd>
<dt><a href="#logging">logging</a></dt>
<dd><p>Removing logging</p>
</dd>
<dt><a href="#define">define</a></dt>
<dd><p>Specify options, which are used when <code>sequelize.define</code> is called</p>
</dd>
<dt><a href="#operatorsAliases">operatorsAliases</a></dt>
<dd><p>String based operator alias, default value is true which will enable all operators alias
Pass object ot limit set of aliased operators or false to diable completely</p>
</dd>
<dt><a href="#sync">sync</a></dt>
<dd><p>Similar for sync: you can define this to always force sync for models</p>
</dd>
<dt><a href="#pool">pool</a></dt>
<dd><p>pool configuration used to pool database connections</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#UserDB">UserDB</a></dt>
<dd><p>The new instance of Class <code>Sequelize</code>, which account information is defined in <code>config.js</code></p>
</dd>
</dl>

<a name="host"></a>

## host
Custom host

**Kind**: global variable  
<a name="port"></a>

## port
Custom port defined in `config.js`

**Kind**: global variable  
<a name="dialect"></a>

## dialect
The sql dialect of the dtabase

**Kind**: global variable  
<a name="omitNull"></a>

## omitNull
Disable inserting undefined values as `NULL`
default: `false`

**Kind**: global variable  
<a name="native"></a>

## native
A flag for using a native library or not
default: `false`

**Kind**: global variable  
<a name="logging"></a>

## logging
Removing logging

**Kind**: global variable  
<a name="define"></a>

## define
Specify options, which are used when `sequelize.define` is called

**Kind**: global variable  
<a name="operatorsAliases"></a>

## operatorsAliases
String based operator alias, default value is true which will enable all operators alias
Pass object ot limit set of aliased operators or false to diable completely

**Kind**: global variable  
<a name="sync"></a>

## sync
Similar for sync: you can define this to always force sync for models

**Kind**: global variable  
<a name="pool"></a>

## pool
pool configuration used to pool database connections

**Kind**: global variable  
<a name="UserDB"></a>

## UserDB
The new instance of Class `Sequelize`, which account information is defined in `config.js`

**Kind**: global constant

