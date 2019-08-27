# midLongTerm/connect.js
## Members

<dl>
<dt><a href="#host">host</a></dt>
<dd><p>Custom host</p>
</dd>
<dt><a href="#port">port</a></dt>
<dd><p>Custom port</p>
</dd>
<dt><a href="#dialect">dialect</a></dt>
<dd><p>The sql dialect of the dtabase</p>
</dd>
<dt><a href="#omitNull">omitNull</a></dt>
<dd><p>Disable inserting undefined values as NULL
default: false</p>
</dd>
<dt><a href="#native">native</a></dt>
<dd><p>A flag for using a native library or not
-default: false</p>
</dd>
<dt><a href="#logging">logging</a></dt>
<dd><p>remove logging</p>
</dd>
<dt><a href="#define">define</a></dt>
<dd><p>Specify options, which are used when sequelize.define is called.</p>
</dd>
<dt><a href="#operatorsAliases">operatorsAliases</a></dt>
<dd><p>String based operator alias, default value is true which will enable all operators alias
Pass object to limit set of aliased operators or false to disable completely</p>
</dd>
<dt><a href="#sync">sync</a></dt>
<dd><p>Similar for sync: you can define this to always force sync for models</p>
</dd>
<dt><a href="#pool">pool</a></dt>
<dd><p>Pool configuration used to pool database connections</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#MidLongTermDB">MidLongTermDB</a></dt>
<dd><p>The new instance of Class <code>Sequelize</code>, which is set up for connecting to <code>sinivaMidLongTerm</code> db.</p>
</dd>
</dl>

<a name="host"></a>

## host
Custom host

**Kind**: global variable  
<a name="port"></a>

## port
Custom port

**Kind**: global variable  
<a name="dialect"></a>

## dialect
The sql dialect of the dtabase

**Kind**: global variable  
<a name="omitNull"></a>

## omitNull
Disable inserting undefined values as NULL
default: false

**Kind**: global variable  
<a name="native"></a>

## native
A flag for using a native library or not
-default: false

**Kind**: global variable  
<a name="logging"></a>

## logging
remove logging

**Kind**: global variable  
<a name="define"></a>

## define
Specify options, which are used when sequelize.define is called.

**Kind**: global variable  
<a name="operatorsAliases"></a>

## operatorsAliases
String based operator alias, default value is true which will enable all operators alias
Pass object to limit set of aliased operators or false to disable completely

**Kind**: global variable  
<a name="sync"></a>

## sync
Similar for sync: you can define this to always force sync for models

**Kind**: global variable  
<a name="pool"></a>

## pool
Pool configuration used to pool database connections

**Kind**: global variable  
<a name="MidLongTermDB"></a>

## MidLongTermDB
The new instance of Class `Sequelize`, which is set up for connecting to `sinivaMidLongTerm` db.

**Kind**: global constant  

# Source code
```javascript=
import Sequelize from 'sequelize'
import config from 'projectRoot/config.js'

/**
 * The new instance of Class `Sequelize`, which is set up for connecting to `sinivaMidLongTerm` db.
 */
const MidLongTermDB = new Sequelize('sinicaMidLongTerm', `${config.database.user}`, `${config.database.password}`, {
  /** Custom host */
  host: `${config.database.host}`,
  /**
   * Custom port
   */
  port: config.database.port,
  /**
   * The sql dialect of the dtabase
   */
  dialect: 'mysql',
  /**
   * Disable inserting undefined values as NULL
   * default: false
   */
  omitNull: false,
  /**
   * A flag for using a native library or not
   * -default: false
   */
  native: true,
  /**
   * remove logging
   */
  logging: false,
  /**
   * Specify options, which are used when sequelize.define is called.
   */
  define:{
    underscored: true,
    charset: 'utf-8',
    freezeTableName: true,
    dialectOptions:{
      collate: 'utf8mb4_general_ci',
    },
    timestamps: false,
  },
  /**
   * String based operator alias, default value is true which will enable all operators alias
   * Pass object to limit set of aliased operators or false to disable completely
   */
  operatorsAliases: false,
  /**
   * Similar for sync: you can define this to always force sync for models
   */
  sync: { force: false, },
  /**
   * Pool configuration used to pool database connections
   */
  pool: {
    max: 100,
    min: 0,
    acquire: 1000000,
    idle: 200000,
  },
})




export default MidLongTermDB
```

