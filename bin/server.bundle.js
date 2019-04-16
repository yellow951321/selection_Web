/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./auth/app.js":
/*!*********************!*\
  !*** ./auth/app.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var auth_models_schemas_user_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! auth/models/schemas/user.js */ "./auth/models/schemas/user.js");
/* harmony import */ var auth_models_schemas_session_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! auth/models/schemas/session.js */ "./auth/models/schemas/session.js");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }





var app = express__WEBPACK_IMPORTED_MODULE_1___default.a.Router();
app.get('/login', function (req, res) {
  if (req.session && req.session.userId) res.redirect("/man/".concat(req.session.userId));else res.render('login');
});
app.post('/login',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var doc;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return auth_models_schemas_user_js__WEBPACK_IMPORTED_MODULE_2__["default"].findOne({
              where: {
                account: req.body.username,
                password: req.body.password
              }
            });

          case 3:
            doc = _context.sent;

            if (!(doc != null)) {
              _context.next = 10;
              break;
            }

            req.session.userId = doc.dataValues.userId;
            auth_models_schemas_session_js__WEBPACK_IMPORTED_MODULE_3__["default"].create({
              sessionId: req.session.id,
              expiration: Number(req.session.cookie.expires),
              userId: doc.userId
            });
            res.redirect("/man/".concat(req.session.userId));
            _context.next = 11;
            break;

          case 10:
            throw new Error("No account matched ".concat(req.body.username));

          case 11:
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);
            res.status(400).render('login', {
              error: _context.t0.message
            });

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 13]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.get('/logout',
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return auth_models_schemas_session_js__WEBPACK_IMPORTED_MODULE_3__["default"].destroy({
              where: {
                sessionId: req.session.id
              }
            });

          case 3:
            _context2.next = 5;
            return new Promise(function (res, rej) {
              req.session.destroy(function (err) {
                if (err) rej(err);
                res();
              });
            }).catch(function (err) {
              throw err;
            });

          case 5:
            res.status(200).redirect('/auth/login');
            _context2.next = 11;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            res.status(404).render('error', {
              'message': _context2.t0.message,
              'error': {
                'status': '404',
                'stack': 'error'
              }
            });

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 8]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
app.get('/signup', function (req, res) {
  res.render('signup');
});
app.post('/signup',
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var rMatch, promise;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            rMatch = new RegExp('<script[\s\S]*?>[\s\S]*?<\/script>', 'gi');
            _context3.prev = 1;

            if (!(rMatch.test(req.body.username) || rMatch.test(req.body.password))) {
              _context3.next = 4;
              break;
            }

            throw new Error('Forbidden password or account');

          case 4:
            _context3.next = 6;
            return auth_models_schemas_user_js__WEBPACK_IMPORTED_MODULE_2__["default"].create({
              account: req.body.username,
              password: req.body.password
            });

          case 6:
            promise = _context3.sent;

            if (!promise) {
              _context3.next = 10;
              break;
            }

            _context3.next = 10;
            return new Promise(function (resolve, reject) {
              fs__WEBPACK_IMPORTED_MODULE_0___default.a.mkdir("data/".concat(req.body.username), {
                recursive: true
              }, function (err) {
                if (err) reject(err);
                resolve(true);
              });
            });

          case 10:
            res.status(200).send('OK');
            _context3.next = 16;
            break;

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](1);
            res.status(400).render('signup', {
              error: _context3.t0.message
            });

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 13]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
/* harmony default export */ __webpack_exports__["default"] = (app);

/***/ }),

/***/ "./auth/models/operations/connect.js":
/*!*******************************************!*\
  !*** ./auth/models/operations/connect.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sequelize */ "sequelize");
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sequelize__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var projectRoot_config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! projectRoot/config.js */ "./config.js");
/* harmony import */ var projectRoot_config_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(projectRoot_config_js__WEBPACK_IMPORTED_MODULE_1__);


var UserDB = new sequelize__WEBPACK_IMPORTED_MODULE_0___default.a('user', "".concat(projectRoot_config_js__WEBPACK_IMPORTED_MODULE_1___default.a.database.user), "".concat(projectRoot_config_js__WEBPACK_IMPORTED_MODULE_1___default.a.database.password), {
  // Custom host
  host: "".concat(projectRoot_config_js__WEBPACK_IMPORTED_MODULE_1___default.a.database.host),
  // Custom port
  port: projectRoot_config_js__WEBPACK_IMPORTED_MODULE_1___default.a.database.port,
  // The sql dialect of the dtabase
  dialect: 'mysql',
  // Disable inserting undefined values as NULL
  //-default: false
  omitNull: true,
  // a flag for using a native library or not
  //-default: false
  native: true,
  // remove logging
  logging: false,
  // Specify options, which are used when sequelize.define is called.
  define: {
    underscored: true,
    charset: 'utf-8',
    freezeTableName: true,
    dialectOptions: {
      collate: 'utf8mb4_general_ci'
    },
    timestamps: false
  },
  // String based operator alias, default value is true which will enable all operators alias
  // Pass object to limit set of aliased operators or false to disable completely
  operatorsAliases: false,
  // Similar for sync: you can define this to always force sync for models
  sync: {
    force: false
  },
  // pool configuration used to pool database connections
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 30000
  }
});
/* harmony default export */ __webpack_exports__["default"] = (UserDB);

/***/ }),

/***/ "./auth/models/schemas/session.js":
/*!****************************************!*\
  !*** ./auth/models/schemas/session.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sequelize */ "sequelize");
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sequelize__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var auth_models_operations_connect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! auth/models/operations/connect.js */ "./auth/models/operations/connect.js");


var Session = auth_models_operations_connect_js__WEBPACK_IMPORTED_MODULE_1__["default"].define('session', {
  tableId: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.INTEGER(32).UNSIGNED,
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  sessionId: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.STRING(45),
    allowNull: false,
    unique: true
  },
  expiration: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.STRING(45),
    allowNull: false
  },
  userId: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.INTEGER(32).UNSIGNED,
    allowNull: false
  }
});
/* harmony default export */ __webpack_exports__["default"] = (Session);

/***/ }),

/***/ "./auth/models/schemas/user.js":
/*!*************************************!*\
  !*** ./auth/models/schemas/user.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sequelize */ "sequelize");
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sequelize__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var auth_models_operations_connect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! auth/models/operations/connect.js */ "./auth/models/operations/connect.js");


var User = auth_models_operations_connect_js__WEBPACK_IMPORTED_MODULE_1__["default"].define('user', {
  userId: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.INTEGER(32).UNSIGNED,
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  account: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.STRING(20),
    allowNull: false,
    unique: true
  },
  password: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.STRING(20),
    allowNull: false
  }
});
/* harmony default export */ __webpack_exports__["default"] = (User);

/***/ }),

/***/ "./config.js":
/*!*******************!*\
  !*** ./config.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports) {

var config = {
  'database': {
    'host': '140.116.245.105',
    'port': 33060,
    'user': 'eechen',
    'password': '123'
  },
  'server': {
    'domain': 'localhost',
    'port': 3000,
    'secret': 'deepest and darkest secret'
  },
  'projectRoot': '/home/nober/git/selection_Web'
};
module.exports = config;

/***/ }),

/***/ "./mid-long-term/app.js":
/*!******************************!*\
  !*** ./mid-long-term/app.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var projectRoot_config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! projectRoot/config.js */ "./config.js");
/* harmony import */ var projectRoot_config_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(projectRoot_config_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var mid_long_term_routes_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mid-long-term/routes/index.js */ "./mid-long-term/routes/index.js");




var app = express__WEBPACK_IMPORTED_MODULE_1___default()();
app.set('views', path__WEBPACK_IMPORTED_MODULE_0___default.a.join(projectRoot_config_js__WEBPACK_IMPORTED_MODULE_2___default.a.projectRoot, 'mid-long-term/views'));
app.set('view engine', 'pug');
app.use('/static', express__WEBPACK_IMPORTED_MODULE_1___default.a.static(path__WEBPACK_IMPORTED_MODULE_0___default.a.join(projectRoot_config_js__WEBPACK_IMPORTED_MODULE_2___default.a.projectRoot, 'mid-long-term/publics'), {
  cacheControl: false,
  dotfiles: 'ignore',
  etag: false,
  extensions: ['css', 'js'],
  fallthrough: true,
  immutable: false,
  index: false,
  lastModified: false,
  maxAge: 0,
  redirect: false,
  setHeaders: function setHeaders(res) {
    res.set('x-timestamp', Date.now());
  }
}));
app.use('/index', mid_long_term_routes_index_js__WEBPACK_IMPORTED_MODULE_3__["default"]);
/* harmony default export */ __webpack_exports__["default"] = (app);

/***/ }),

/***/ "./mid-long-term/routes/index.js":
/*!***************************************!*\
  !*** ./mid-long-term/routes/index.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);

var router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();
router.get('/', function (req, res) {
  res.render('index');
});
/* harmony default export */ __webpack_exports__["default"] = (router);

/***/ }),

/***/ "./server.js":
/*!*******************!*\
  !*** ./server.js ***!
  \*******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ "http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var compression__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! compression */ "compression");
/* harmony import */ var compression__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(compression__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var express_session__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! express-session */ "express-session");
/* harmony import */ var express_session__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express_session__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! cookie-parser */ "cookie-parser");
/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(cookie_parser__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var morgan__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! morgan */ "morgan");
/* harmony import */ var morgan__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(morgan__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var projectRoot_config_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! projectRoot/config.js */ "./config.js");
/* harmony import */ var projectRoot_config_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(projectRoot_config_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var auth_models_schemas_session_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! auth/models/schemas/session.js */ "./auth/models/schemas/session.js");
/* harmony import */ var auth_app_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! auth/app.js */ "./auth/app.js");
/* harmony import */ var mid_long_term_app_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! mid-long-term/app.js */ "./mid-long-term/app.js");
/* harmony import */ var short_term_app_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! short-term/app.js */ "./short-term/app.js");
function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }












var isDevMode = "development" == 'development';
var server = express__WEBPACK_IMPORTED_MODULE_1___default()();
http__WEBPACK_IMPORTED_MODULE_0___default.a.createServer(server);
server.listen(projectRoot_config_js__WEBPACK_IMPORTED_MODULE_6___default.a.server.port);

if (isDevMode) {
  server.use(morgan__WEBPACK_IMPORTED_MODULE_5___default()('dev'));
}

server.use(compression__WEBPACK_IMPORTED_MODULE_2___default.a);
server.use(cookie_parser__WEBPACK_IMPORTED_MODULE_4___default()());
server.use(express__WEBPACK_IMPORTED_MODULE_1___default.a.json({
  inflate: true,
  limit: '5GB',
  strict: true,
  type: 'application/json'
}));
server.use(express__WEBPACK_IMPORTED_MODULE_1___default.a.urlencoded({
  extended: true,
  inflate: true,
  limit: '5GB',
  parameterLimit: 1000,
  type: ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/html', 'application/xhtml+xml', 'application/xml']
}));
server.use(express_session__WEBPACK_IMPORTED_MODULE_3___default()({
  cookie: {
    path: '/',
    httpOnly: !isDevMode,
    domain: projectRoot_config_js__WEBPACK_IMPORTED_MODULE_6___default.a.server.domain,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: true
    /**
     * @todo add https
     */
    // secure: isDevMode,

  },
  name: 'sekiro',
  proxy: false,
  secret: projectRoot_config_js__WEBPACK_IMPORTED_MODULE_6___default.a.server.secret,
  resave: false,
  rolling: false,
  saveUninitialized: false,
  unset: 'destroy'
})); // check the sessionId in the cookie
// if it's status 'login' (stored in database)
// automatically login

server.use(
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, _ref, next) {
    var sessionId, data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _objectDestructuringEmpty(_ref);

            sessionId = cookie_parser__WEBPACK_IMPORTED_MODULE_4___default.a.signedCookies(req.cookies, projectRoot_config_js__WEBPACK_IMPORTED_MODULE_6___default.a.server.secret)['sekiro']; // sessionId will be reset after restarting server
            // we need to update session after every connection

            if (!(sessionId !== req.session.id)) {
              _context.next = 16;
              break;
            }

            _context.next = 5;
            return auth_models_schemas_session_js__WEBPACK_IMPORTED_MODULE_7__["default"].findOne({
              where: {
                sessionId: sessionId
              }
            });

          case 5:
            data = _context.sent;

            if (!(data !== null)) {
              _context.next = 16;
              break;
            }

            if (!(Number(data.expiration) > Date.now())) {
              _context.next = 13;
              break;
            }

            req.session.userId = data.userId;
            _context.next = 11;
            return data.update({
              sessionId: req.session.id
            });

          case 11:
            _context.next = 16;
            break;

          case 13:
            if (!(Number(data.expiration) < Date.now())) {
              _context.next = 16;
              break;
            }

            _context.next = 16;
            return data.destroy();

          case 16:
            next();

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}());
server.use('/auth', auth_app_js__WEBPACK_IMPORTED_MODULE_8__["default"]);
server.use('/mid-long-term', mid_long_term_app_js__WEBPACK_IMPORTED_MODULE_9__["default"]);
server.use('/short-term', short_term_app_js__WEBPACK_IMPORTED_MODULE_10__["default"]);

/***/ }),

/***/ "./short-term/app.js":
/*!***************************!*\
  !*** ./short-term/app.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);

var app = express__WEBPACK_IMPORTED_MODULE_0___default()();
/* harmony default export */ __webpack_exports__["default"] = (app);

/***/ }),

/***/ 0:
/*!****************************************!*\
  !*** multi babel-polyfill ./server.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! babel-polyfill */"babel-polyfill");
module.exports = __webpack_require__(/*! /home/nober/git/selection_Web/server.js */"./server.js");


/***/ }),

/***/ "babel-polyfill":
/*!*********************************!*\
  !*** external "babel-polyfill" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "sequelize":
/*!****************************!*\
  !*** external "sequelize" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sequelize");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYXV0aC9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vYXV0aC9tb2RlbHMvb3BlcmF0aW9ucy9jb25uZWN0LmpzIiwid2VicGFjazovLy8uL2F1dGgvbW9kZWxzL3NjaGVtYXMvc2Vzc2lvbi5qcyIsIndlYnBhY2s6Ly8vLi9hdXRoL21vZGVscy9zY2hlbWFzL3VzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY29uZmlnLmpzIiwid2VicGFjazovLy8uL21pZC1sb25nLXRlcm0vYXBwLmpzIiwid2VicGFjazovLy8uL21pZC1sb25nLXRlcm0vcm91dGVzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NlcnZlci5qcyIsIndlYnBhY2s6Ly8vLi9zaG9ydC10ZXJtL2FwcC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJiYWJlbC1wb2x5ZmlsbFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNvbXByZXNzaW9uXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY29va2llLXBhcnNlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzLXNlc3Npb25cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJtb3JnYW5cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic2VxdWVsaXplXCIiXSwibmFtZXMiOlsiYXBwIiwiZXhwcmVzcyIsIlJvdXRlciIsImdldCIsInJlcSIsInJlcyIsInNlc3Npb24iLCJ1c2VySWQiLCJyZWRpcmVjdCIsInJlbmRlciIsInBvc3QiLCJVc2VyIiwiZmluZE9uZSIsIndoZXJlIiwiYWNjb3VudCIsImJvZHkiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwiZG9jIiwiZGF0YVZhbHVlcyIsIlNlc3Npb24iLCJjcmVhdGUiLCJzZXNzaW9uSWQiLCJpZCIsImV4cGlyYXRpb24iLCJOdW1iZXIiLCJjb29raWUiLCJleHBpcmVzIiwiRXJyb3IiLCJzdGF0dXMiLCJlcnJvciIsIm1lc3NhZ2UiLCJkZXN0cm95IiwiUHJvbWlzZSIsInJlaiIsImVyciIsImNhdGNoIiwick1hdGNoIiwiUmVnRXhwIiwidGVzdCIsInByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnMiLCJta2RpciIsInJlY3Vyc2l2ZSIsInNlbmQiLCJVc2VyREIiLCJTZXF1ZWxpemUiLCJjb25maWciLCJkYXRhYmFzZSIsInVzZXIiLCJob3N0IiwicG9ydCIsImRpYWxlY3QiLCJvbWl0TnVsbCIsIm5hdGl2ZSIsImxvZ2dpbmciLCJkZWZpbmUiLCJ1bmRlcnNjb3JlZCIsImNoYXJzZXQiLCJmcmVlemVUYWJsZU5hbWUiLCJkaWFsZWN0T3B0aW9ucyIsImNvbGxhdGUiLCJ0aW1lc3RhbXBzIiwib3BlcmF0b3JzQWxpYXNlcyIsInN5bmMiLCJmb3JjZSIsInBvb2wiLCJtYXgiLCJtaW4iLCJhY3F1aXJlIiwiaWRsZSIsInRhYmxlSWQiLCJ0eXBlIiwiSU5URUdFUiIsIlVOU0lHTkVEIiwicHJpbWFyeUtleSIsImFsbG93TnVsbCIsInVuaXF1ZSIsImF1dG9JbmNyZW1lbnQiLCJTVFJJTkciLCJtb2R1bGUiLCJleHBvcnRzIiwic2V0IiwicGF0aCIsImpvaW4iLCJwcm9qZWN0Um9vdCIsInVzZSIsInN0YXRpYyIsImNhY2hlQ29udHJvbCIsImRvdGZpbGVzIiwiZXRhZyIsImV4dGVuc2lvbnMiLCJmYWxsdGhyb3VnaCIsImltbXV0YWJsZSIsImluZGV4IiwibGFzdE1vZGlmaWVkIiwibWF4QWdlIiwic2V0SGVhZGVycyIsIkRhdGUiLCJub3ciLCJyb3V0ZXIiLCJpc0Rldk1vZGUiLCJwcm9jZXNzIiwic2VydmVyIiwiaHR0cCIsImNyZWF0ZVNlcnZlciIsImxpc3RlbiIsImxvZ2dlciIsImNvbXByZXNzaW9uIiwiY29va2llUGFyc2VyIiwianNvbiIsImluZmxhdGUiLCJsaW1pdCIsInN0cmljdCIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsInBhcmFtZXRlckxpbWl0IiwiaHR0cE9ubHkiLCJkb21haW4iLCJzYW1lU2l0ZSIsIm5hbWUiLCJwcm94eSIsInNlY3JldCIsInJlc2F2ZSIsInJvbGxpbmciLCJzYXZlVW5pbml0aWFsaXplZCIsInVuc2V0IiwibmV4dCIsInNpZ25lZENvb2tpZXMiLCJjb29raWVzIiwiZGF0YSIsInVwZGF0ZSIsImF1dGgiLCJtaWRMb25nVGVybSIsInNob3J0VGVybSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFFQTtBQUNBO0FBRUEsSUFBTUEsR0FBRyxHQUFHQyw4Q0FBTyxDQUFDQyxNQUFSLEVBQVo7QUFFQUYsR0FBRyxDQUFDRyxHQUFKLENBQVEsUUFBUixFQUFr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Ozs7Ozs7O0FDQUEsMEM7Ozs7Ozs7Ozs7O0FDQUEsb0M7Ozs7Ozs7Ozs7O0FDQUEsNEM7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsc0MiLCJmaWxlIjoic2VydmVyLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsImltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnXG5cbmltcG9ydCBVc2VyIGZyb20gJ2F1dGgvbW9kZWxzL3NjaGVtYXMvdXNlci5qcydcbmltcG9ydCBTZXNzaW9uIGZyb20gJ2F1dGgvbW9kZWxzL3NjaGVtYXMvc2Vzc2lvbi5qcydcblxuY29uc3QgYXBwID0gZXhwcmVzcy5Sb3V0ZXIoKVxuXG5hcHAuZ2V0KCcvbG9naW4nLCAocmVxLCByZXMpPT57XG4gIGlmKHJlcS5zZXNzaW9uICYmIHJlcS5zZXNzaW9uLnVzZXJJZClcbiAgICByZXMucmVkaXJlY3QoYC9tYW4vJHtyZXEuc2Vzc2lvbi51c2VySWR9YClcbiAgZWxzZVxuICAgIHJlcy5yZW5kZXIoJ2xvZ2luJylcbn0pXG5cbmFwcC5wb3N0KCcvbG9naW4nLCBhc3luYyhyZXEsIHJlcyk9PntcbiAgdHJ5e1xuICAgIGNvbnN0IGRvYyA9IGF3YWl0IFVzZXIuZmluZE9uZSh7XG4gICAgICB3aGVyZTp7XG4gICAgICAgIGFjY291bnQ6IHJlcS5ib2R5LnVzZXJuYW1lLFxuICAgICAgICBwYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmQsXG4gICAgICB9LFxuICAgIH0pXG4gICAgaWYoZG9jICE9IG51bGwpe1xuICAgICAgcmVxLnNlc3Npb24udXNlcklkID0gZG9jLmRhdGFWYWx1ZXMudXNlcklkXG5cbiAgICAgIFNlc3Npb24uY3JlYXRlKHtcbiAgICAgICAgc2Vzc2lvbklkOiByZXEuc2Vzc2lvbi5pZCxcbiAgICAgICAgZXhwaXJhdGlvbjogTnVtYmVyKHJlcS5zZXNzaW9uLmNvb2tpZS5leHBpcmVzKSxcbiAgICAgICAgdXNlcklkOiBkb2MudXNlcklkLFxuICAgICAgfSlcblxuICAgICAgcmVzLnJlZGlyZWN0KGAvbWFuLyR7cmVxLnNlc3Npb24udXNlcklkfWApXG4gICAgfWVsc2V7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGFjY291bnQgbWF0Y2hlZCAke3JlcS5ib2R5LnVzZXJuYW1lfWApXG4gICAgfVxuICB9XG4gIGNhdGNoKGVycil7XG4gICAgcmVzLnN0YXR1cyg0MDApLnJlbmRlcignbG9naW4nLCB7ZXJyb3I6IGVyci5tZXNzYWdlLCB9KVxuICB9XG59KVxuXG5hcHAuZ2V0KCcvbG9nb3V0JywgYXN5bmMocmVxLCByZXMpPT57XG4gIHRyeSB7XG4gICAgLy8gcmVtb3ZlIHNlc3Npb24gYW5kIHJlbW92ZSB0aGUgbG9naW4gcmVjb3JkIGluIHRoZSBkYXRhYmFzZVxuICAgIGF3YWl0IFNlc3Npb24uZGVzdHJveSh7XG4gICAgICB3aGVyZToge1xuICAgICAgICBzZXNzaW9uSWQ6IHJlcS5zZXNzaW9uLmlkLFxuICAgICAgfSxcbiAgICB9KVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgcmVxLnNlc3Npb24uZGVzdHJveSgoZXJyKT0+e1xuICAgICAgICBpZihlcnIpXG4gICAgICAgICAgcmVqKGVycilcbiAgICAgICAgcmVzKClcbiAgICAgIH0pXG4gICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHRocm93IGVyclxuICAgICAgfSlcbiAgICByZXMuc3RhdHVzKDIwMCkucmVkaXJlY3QoJy9hdXRoL2xvZ2luJylcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmVzLnN0YXR1cyg0MDQpLnJlbmRlcignZXJyb3InLCB7J21lc3NhZ2UnOiBlcnIubWVzc2FnZSwgJ2Vycm9yJzp7J3N0YXR1cyc6ICc0MDQnLCAnc3RhY2snOiAnZXJyb3InLCB9LCB9KVxuICB9XG59KVxuXG5hcHAuZ2V0KCcvc2lnbnVwJywgKHJlcSwgcmVzKT0+e1xuICByZXMucmVuZGVyKCdzaWdudXAnKVxufSlcblxuYXBwLnBvc3QoJy9zaWdudXAnLCBhc3luYyhyZXEsIHJlcyk9PntcbiAgdmFyIHJNYXRjaCA9IG5ldyBSZWdFeHAoJzxzY3JpcHRbXFxzXFxTXSo/PltcXHNcXFNdKj88XFwvc2NyaXB0PicsICdnaScpXG4gIHRyeXtcbiAgICBpZihyTWF0Y2gudGVzdChyZXEuYm9keS51c2VybmFtZSkgfHwgck1hdGNoLnRlc3QocmVxLmJvZHkucGFzc3dvcmQpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3JiaWRkZW4gcGFzc3dvcmQgb3IgYWNjb3VudCcpXG5cbiAgICBjb25zdCBwcm9taXNlID0gYXdhaXQgVXNlci5jcmVhdGUoe1xuICAgICAgYWNjb3VudCA6IHJlcS5ib2R5LnVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkLFxuICAgIH0pXG5cbiAgICBpZihwcm9taXNlKXtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gICAgICAgIGZzLm1rZGlyKGBkYXRhLyR7cmVxLmJvZHkudXNlcm5hbWV9YCwge3JlY3Vyc2l2ZTogdHJ1ZSwgfSwgKGVycik9PntcbiAgICAgICAgICBpZihlcnIpIHJlamVjdChlcnIpXG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCgnT0snKVxuICB9XG4gIGNhdGNoIChlcnIpe1xuICAgIHJlcy5zdGF0dXMoNDAwKS5yZW5kZXIoJ3NpZ251cCcsIHtlcnJvcjplcnIubWVzc2FnZSwgfSlcbiAgfVxufSlcblxuZXhwb3J0IGRlZmF1bHQgYXBwIiwiaW1wb3J0IFNlcXVlbGl6ZSBmcm9tICdzZXF1ZWxpemUnXG5cbmltcG9ydCBjb25maWcgZnJvbSAncHJvamVjdFJvb3QvY29uZmlnLmpzJ1xuXG5jb25zdCBVc2VyREIgPSBuZXcgU2VxdWVsaXplKCAndXNlcicsIGAke2NvbmZpZy5kYXRhYmFzZS51c2VyfWAsIGAke2NvbmZpZy5kYXRhYmFzZS5wYXNzd29yZH1gLCB7XG4gIC8vIEN1c3RvbSBob3N0XG4gIGhvc3Q6IGAke2NvbmZpZy5kYXRhYmFzZS5ob3N0fWAsXG4gIC8vIEN1c3RvbSBwb3J0XG4gIHBvcnQ6IGNvbmZpZy5kYXRhYmFzZS5wb3J0LFxuICAvLyBUaGUgc3FsIGRpYWxlY3Qgb2YgdGhlIGR0YWJhc2VcbiAgZGlhbGVjdDogJ215c3FsJyxcbiAgLy8gRGlzYWJsZSBpbnNlcnRpbmcgdW5kZWZpbmVkIHZhbHVlcyBhcyBOVUxMXG4gIC8vLWRlZmF1bHQ6IGZhbHNlXG4gIG9taXROdWxsOiB0cnVlLFxuICAvLyBhIGZsYWcgZm9yIHVzaW5nIGEgbmF0aXZlIGxpYnJhcnkgb3Igbm90XG4gIC8vLWRlZmF1bHQ6IGZhbHNlXG4gIG5hdGl2ZTogdHJ1ZSxcblxuICAvLyByZW1vdmUgbG9nZ2luZ1xuICBsb2dnaW5nOiBmYWxzZSxcblxuICAvLyBTcGVjaWZ5IG9wdGlvbnMsIHdoaWNoIGFyZSB1c2VkIHdoZW4gc2VxdWVsaXplLmRlZmluZSBpcyBjYWxsZWQuXG4gIGRlZmluZTp7XG4gICAgdW5kZXJzY29yZWQ6IHRydWUsXG4gICAgY2hhcnNldDogJ3V0Zi04JyxcbiAgICBmcmVlemVUYWJsZU5hbWU6IHRydWUsXG4gICAgZGlhbGVjdE9wdGlvbnM6e1xuICAgICAgY29sbGF0ZTogJ3V0ZjhtYjRfZ2VuZXJhbF9jaScsXG4gICAgfSxcbiAgICB0aW1lc3RhbXBzOiBmYWxzZSxcbiAgfSxcbiAgLy8gU3RyaW5nIGJhc2VkIG9wZXJhdG9yIGFsaWFzLCBkZWZhdWx0IHZhbHVlIGlzIHRydWUgd2hpY2ggd2lsbCBlbmFibGUgYWxsIG9wZXJhdG9ycyBhbGlhc1xuICAvLyBQYXNzIG9iamVjdCB0byBsaW1pdCBzZXQgb2YgYWxpYXNlZCBvcGVyYXRvcnMgb3IgZmFsc2UgdG8gZGlzYWJsZSBjb21wbGV0ZWx5XG4gIG9wZXJhdG9yc0FsaWFzZXM6IGZhbHNlLFxuICAvLyBTaW1pbGFyIGZvciBzeW5jOiB5b3UgY2FuIGRlZmluZSB0aGlzIHRvIGFsd2F5cyBmb3JjZSBzeW5jIGZvciBtb2RlbHNcbiAgc3luYzogeyBmb3JjZTogZmFsc2UsIH0sXG4gIC8vIHBvb2wgY29uZmlndXJhdGlvbiB1c2VkIHRvIHBvb2wgZGF0YWJhc2UgY29ubmVjdGlvbnNcbiAgcG9vbDoge1xuICAgIG1heDogNSxcbiAgICBtaW46IDAsXG4gICAgYWNxdWlyZTogMzAwMDAsXG4gICAgaWRsZTogMzAwMDAsXG4gIH0sXG59KVxuXG5leHBvcnQgZGVmYXVsdCBVc2VyREIiLCJpbXBvcnQgU2VxdWVsaXplIGZyb20gJ3NlcXVlbGl6ZSdcblxuaW1wb3J0IFVzZXJEQiBmcm9tICdhdXRoL21vZGVscy9vcGVyYXRpb25zL2Nvbm5lY3QuanMnXG5cbmNvbnN0IFNlc3Npb24gPSBVc2VyREIuZGVmaW5lKCdzZXNzaW9uJywge1xuICB0YWJsZUlkOiB7XG4gICAgdHlwZTogU2VxdWVsaXplLklOVEVHRVIoMzIpLlVOU0lHTkVELFxuICAgIHByaW1hcnlLZXk6IHRydWUsXG4gICAgYWxsb3dOdWxsOiBmYWxzZSxcbiAgICB1bmlxdWU6IHRydWUsXG4gICAgYXV0b0luY3JlbWVudDogdHJ1ZSxcbiAgfSxcbiAgc2Vzc2lvbklkOiB7XG4gICAgdHlwZTogU2VxdWVsaXplLlNUUklORyg0NSksXG4gICAgYWxsb3dOdWxsOiBmYWxzZSxcbiAgICB1bmlxdWU6IHRydWUsXG4gIH0sXG4gIGV4cGlyYXRpb246e1xuICAgIHR5cGU6IFNlcXVlbGl6ZS5TVFJJTkcoNDUpLFxuICAgIGFsbG93TnVsbDogZmFsc2UsXG4gIH0sXG4gIHVzZXJJZDp7XG4gICAgdHlwZTogU2VxdWVsaXplLklOVEVHRVIoMzIpLlVOU0lHTkVELFxuICAgIGFsbG93TnVsbDogZmFsc2UsXG4gIH0sXG59KVxuXG5leHBvcnQgZGVmYXVsdCBTZXNzaW9uIiwiaW1wb3J0IFNlcXVlbGl6ZSBmcm9tICdzZXF1ZWxpemUnXG5cbmltcG9ydCBVc2VyREIgZnJvbSAnYXV0aC9tb2RlbHMvb3BlcmF0aW9ucy9jb25uZWN0LmpzJ1xuXG5jb25zdCBVc2VyID0gVXNlckRCLmRlZmluZSgndXNlcicsIHtcbiAgdXNlcklkOntcbiAgICB0eXBlOiBTZXF1ZWxpemUuSU5URUdFUigzMikuVU5TSUdORUQsXG4gICAgcHJpbWFyeUtleTogdHJ1ZSxcbiAgICBhbGxvd051bGw6IGZhbHNlLFxuICAgIHVuaXF1ZTogdHJ1ZSxcbiAgICBhdXRvSW5jcmVtZW50OiB0cnVlLFxuICB9LFxuICBhY2NvdW50OntcbiAgICB0eXBlOiBTZXF1ZWxpemUuU1RSSU5HKDIwKSxcbiAgICBhbGxvd051bGw6IGZhbHNlLFxuICAgIHVuaXF1ZTogdHJ1ZSxcbiAgfSxcbiAgcGFzc3dvcmQ6e1xuICAgIHR5cGU6IFNlcXVlbGl6ZS5TVFJJTkcoMjApLFxuICAgIGFsbG93TnVsbDogZmFsc2UsXG4gIH0sXG59KVxuXG5leHBvcnQgZGVmYXVsdCBVc2VyIiwiY29uc3QgY29uZmlnID0ge1xuICAnZGF0YWJhc2UnOiB7XG4gICAgJ2hvc3QnOiAnMTQwLjExNi4yNDUuMTA1JyxcbiAgICAncG9ydCc6IDMzMDYwLFxuICAgICd1c2VyJzogJ2VlY2hlbicsXG4gICAgJ3Bhc3N3b3JkJzogJzEyMycsXG4gIH0sXG4gICdzZXJ2ZXInOiB7XG4gICAgJ2RvbWFpbic6ICdsb2NhbGhvc3QnLFxuICAgICdwb3J0JzogMzAwMCxcbiAgICAnc2VjcmV0JzogJ2RlZXBlc3QgYW5kIGRhcmtlc3Qgc2VjcmV0JyxcbiAgfSxcbiAgJ3Byb2plY3RSb290JzogJy9ob21lL25vYmVyL2dpdC9zZWxlY3Rpb25fV2ViJyxcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb25maWdcbiIsImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJ1xuXG5pbXBvcnQgY29uZmlnIGZyb20gJ3Byb2plY3RSb290L2NvbmZpZy5qcydcbmltcG9ydCBpbmRleCBmcm9tICdtaWQtbG9uZy10ZXJtL3JvdXRlcy9pbmRleC5qcydcblxuY29uc3QgYXBwID0gZXhwcmVzcygpXG5cbmFwcC5zZXQoJ3ZpZXdzJywgcGF0aC5qb2luKGNvbmZpZy5wcm9qZWN0Um9vdCwgJ21pZC1sb25nLXRlcm0vdmlld3MnKSlcbmFwcC5zZXQoJ3ZpZXcgZW5naW5lJywgJ3B1ZycpXG5cbmFwcC51c2UoJy9zdGF0aWMnLCBleHByZXNzLnN0YXRpYyhwYXRoLmpvaW4oY29uZmlnLnByb2plY3RSb290LCAnbWlkLWxvbmctdGVybS9wdWJsaWNzJyksIHtcbiAgY2FjaGVDb250cm9sOiBmYWxzZSxcbiAgZG90ZmlsZXM6ICdpZ25vcmUnLFxuICBldGFnOiBmYWxzZSxcbiAgZXh0ZW5zaW9uczogWydjc3MnLCAnanMnLCBdLFxuICBmYWxsdGhyb3VnaDogdHJ1ZSxcbiAgaW1tdXRhYmxlOiBmYWxzZSxcbiAgaW5kZXg6IGZhbHNlLFxuICBsYXN0TW9kaWZpZWQ6IGZhbHNlLFxuICBtYXhBZ2U6IDAsXG4gIHJlZGlyZWN0OiBmYWxzZSxcbiAgc2V0SGVhZGVycyhyZXMpe1xuICAgIHJlcy5zZXQoJ3gtdGltZXN0YW1wJywgRGF0ZS5ub3coKSlcbiAgfSxcbn0pKVxuXG5hcHAudXNlKCcvaW5kZXgnLCBpbmRleClcblxuZXhwb3J0IGRlZmF1bHQgYXBwXG4iLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJ1xuXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpXG5cbnJvdXRlci5nZXQoJy8nLCAocmVxLHJlcyk9PntcbiAgcmVzLnJlbmRlcignaW5kZXgnKVxufSlcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyIiwiaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCdcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAnY29tcHJlc3Npb24nXG5pbXBvcnQgc2Vzc2lvbiBmcm9tICdleHByZXNzLXNlc3Npb24nXG5pbXBvcnQgY29va2llUGFyc2VyIGZyb20gJ2Nvb2tpZS1wYXJzZXInXG5pbXBvcnQgbG9nZ2VyIGZyb20gJ21vcmdhbidcblxuaW1wb3J0IGNvbmZpZyBmcm9tICdwcm9qZWN0Um9vdC9jb25maWcuanMnXG5pbXBvcnQgU2Vzc2lvbiBmcm9tICdhdXRoL21vZGVscy9zY2hlbWFzL3Nlc3Npb24uanMnXG5pbXBvcnQgYXV0aCBmcm9tICdhdXRoL2FwcC5qcydcbmltcG9ydCBtaWRMb25nVGVybSBmcm9tICdtaWQtbG9uZy10ZXJtL2FwcC5qcydcbmltcG9ydCBzaG9ydFRlcm0gZnJvbSAnc2hvcnQtdGVybS9hcHAuanMnXG5cbmNvbnN0IGlzRGV2TW9kZSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09ICdkZXZlbG9wbWVudCdcblxuY29uc3Qgc2VydmVyID0gZXhwcmVzcygpXG5cbmh0dHAuY3JlYXRlU2VydmVyKHNlcnZlcilcbnNlcnZlci5saXN0ZW4oY29uZmlnLnNlcnZlci5wb3J0KVxuXG5pZihpc0Rldk1vZGUpe1xuICBzZXJ2ZXIudXNlKGxvZ2dlcignZGV2JykpXG59XG5cbnNlcnZlci51c2UoY29tcHJlc3Npb24pXG5zZXJ2ZXIudXNlKGNvb2tpZVBhcnNlcigpKVxuc2VydmVyLnVzZShleHByZXNzLmpzb24oe1xuICBpbmZsYXRlOiB0cnVlLFxuICBsaW1pdDogJzVHQicsXG4gIHN0cmljdDogdHJ1ZSxcbiAgdHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxufSkpXG5zZXJ2ZXIudXNlKGV4cHJlc3MudXJsZW5jb2RlZCh7XG4gIGV4dGVuZGVkOiB0cnVlLFxuICBpbmZsYXRlOiB0cnVlLFxuICBsaW1pdDogJzVHQicsXG4gIHBhcmFtZXRlckxpbWl0OiAxMDAwLFxuICB0eXBlOiBbXG4gICAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICAgJ211bHRpcGFydC9mb3JtLWRhdGEnLFxuICAgICd0ZXh0L2h0bWwnLFxuICAgICdhcHBsaWNhdGlvbi94aHRtbCt4bWwnLFxuICAgICdhcHBsaWNhdGlvbi94bWwnLFxuICBdLFxufSkpXG5zZXJ2ZXIudXNlKHNlc3Npb24oe1xuICBjb29raWU6IHtcbiAgICBwYXRoOiAnLycsXG4gICAgaHR0cE9ubHk6ICFpc0Rldk1vZGUsXG4gICAgZG9tYWluOiBjb25maWcuc2VydmVyLmRvbWFpbixcbiAgICBleHBpcmVzOiBuZXcgRGF0ZShEYXRlLm5vdygpICsgMTAwMCo2MCo2MCoyNCo3KSxcbiAgICBtYXhBZ2U6IDEwMDAqNjAqNjAqMjQqNyxcbiAgICBzYW1lU2l0ZTogdHJ1ZSxcbiAgICAvKipcbiAgICAgKiBAdG9kbyBhZGQgaHR0cHNcbiAgICAgKi9cbiAgICAvLyBzZWN1cmU6IGlzRGV2TW9kZSxcblxuICB9LFxuICBuYW1lOiAnc2VraXJvJyxcbiAgcHJveHk6IGZhbHNlLFxuICBzZWNyZXQ6IGNvbmZpZy5zZXJ2ZXIuc2VjcmV0LFxuICByZXNhdmUgOiBmYWxzZSxcbiAgcm9sbGluZzogZmFsc2UsXG4gIHNhdmVVbmluaXRpYWxpemVkIDogZmFsc2UsXG4gIHVuc2V0OiAnZGVzdHJveScsXG59KSlcblxuLy8gY2hlY2sgdGhlIHNlc3Npb25JZCBpbiB0aGUgY29va2llXG4vLyBpZiBpdCdzIHN0YXR1cyAnbG9naW4nIChzdG9yZWQgaW4gZGF0YWJhc2UpXG4vLyBhdXRvbWF0aWNhbGx5IGxvZ2luXG5zZXJ2ZXIudXNlKGFzeW5jKHJlcSwge30sIG5leHQpID0+IHtcbiAgbGV0IHNlc3Npb25JZCA9IGNvb2tpZVBhcnNlci5zaWduZWRDb29raWVzKHJlcS5jb29raWVzLCBjb25maWcuc2VydmVyLnNlY3JldClbJ3Nla2lybyddXG5cbiAgLy8gc2Vzc2lvbklkIHdpbGwgYmUgcmVzZXQgYWZ0ZXIgcmVzdGFydGluZyBzZXJ2ZXJcbiAgLy8gd2UgbmVlZCB0byB1cGRhdGUgc2Vzc2lvbiBhZnRlciBldmVyeSBjb25uZWN0aW9uXG4gIGlmKHNlc3Npb25JZCAhPT0gcmVxLnNlc3Npb24uaWQpe1xuICAgIGxldCBkYXRhID0gYXdhaXQgU2Vzc2lvbi5maW5kT25lKHtcbiAgICAgIHdoZXJlOiB7XG4gICAgICAgIHNlc3Npb25JZCxcbiAgICAgIH0sXG4gICAgfSlcbiAgICBpZihkYXRhICE9PSBudWxsKXtcbiAgICAgIGlmKE51bWJlcihkYXRhLmV4cGlyYXRpb24pID4gRGF0ZS5ub3coKSl7XG4gICAgICAgIHJlcS5zZXNzaW9uLnVzZXJJZCA9IGRhdGEudXNlcklkXG4gICAgICAgIGF3YWl0IGRhdGEudXBkYXRlKHtcbiAgICAgICAgICBzZXNzaW9uSWQ6IHJlcS5zZXNzaW9uLmlkLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgZWxzZSBpZihOdW1iZXIoZGF0YS5leHBpcmF0aW9uKSA8IERhdGUubm93KCkpe1xuICAgICAgICBhd2FpdCBkYXRhLmRlc3Ryb3koKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBuZXh0KClcbn0pXG5cbnNlcnZlci51c2UoJy9hdXRoJywgYXV0aClcbnNlcnZlci51c2UoJy9taWQtbG9uZy10ZXJtJywgbWlkTG9uZ1Rlcm0pXG5zZXJ2ZXIudXNlKCcvc2hvcnQtdGVybScsIHNob3J0VGVybSkiLCJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJ1xuXG5jb25zdCBhcHAgPSBleHByZXNzKClcblxuZXhwb3J0IGRlZmF1bHQgYXBwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29tcHJlc3Npb25cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29va2llLXBhcnNlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3Mtc2Vzc2lvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1vcmdhblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInNlcXVlbGl6ZVwiKTsiXSwic291cmNlUm9vdCI6IiJ9