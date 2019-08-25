const path = require('path')
const nodeExternals = require('webpack-node-externals')
const config = require('./config')

const isDevMode = process.env.NODE_ENV === 'development'

const webpackJsConfigTemplate = {
  devtool: isDevMode ? 'inline-sourcemap' : false,
  mode:    isDevMode ? 'development' : 'production',
  target: 'node',
  externals: [nodeExternals(), ],
  resolve: {
    alias: {
      'projectRoot':   config.projectRoot,
      'auth':          path.join(config.projectRoot, 'auth'),
      'mid-long-term': path.join(config.projectRoot, 'mid-long-term'),
      'short-term':    path.join(config.projectRoot, 'short-term'),
      'lib': path.join(config.projectRoot, 'lib'),
    },
  },
  module:  {
    rules: [
      {
        test:    /\.js$/,
        exclude: /(node_modules)/,
        use:     [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets:        ['@babel/preset-env', ],
              babelrc:        false,
              plugins:        ['babel-plugin-rewire', ],
            },
          },
        ],
      },
    ],
  },
}

const authOperationSrcRoot = path.join(config.projectRoot, 'test/static/auth/models/operations')
const authOperationDIstRoot = path.join(config.projectRoot, 'test/public/auth')

const authOperationConfig = Object.assign({}, webpackJsConfigTemplate, {
  entry: [
    'babel-polyfill',
    path.join(authOperationSrcRoot, 'delete-session.js'),
    path.join(authOperationSrcRoot, 'get-user-info.js'),
    path.join(authOperationSrcRoot, 'login.js'),
    path.join(authOperationSrcRoot, 'sync-session.js'),
  ],
  output: {
    path: authOperationDIstRoot,
    filename: 'auth-opration.test.js',
  },
})
const midLongTermOperationSrcRoot = path.join(config.projectRoot, 'test/static/mid-long-term/models/operations')
const midLongTermOperationDIstRoot = path.join(config.projectRoot, 'test/public/mid-long-term')

const midLongTermOperationConfig = Object.assign({}, webpackJsConfigTemplate, {
  entry: [
    'babel-polyfill',
    path.join(midLongTermOperationSrcRoot, 'content-auth.js'),
    path.join(midLongTermOperationSrcRoot, 'content-change-label.js'),
    path.join(midLongTermOperationSrcRoot, 'content-create.js'),
    path.join(midLongTermOperationSrcRoot, 'content-delete.js'),
    path.join(midLongTermOperationSrcRoot, 'content-save.js'),
    path.join(midLongTermOperationSrcRoot, 'content-update.js'),
    path.join(midLongTermOperationSrcRoot, 'data-create.js'),
    path.join(midLongTermOperationSrcRoot, 'data-delete.js'),
    path.join(midLongTermOperationSrcRoot, 'download-csv.js'),
    path.join(midLongTermOperationSrcRoot, 'get-all-campus.js'),
    path.join(midLongTermOperationSrcRoot, 'get-all-type.js'),
    path.join(midLongTermOperationSrcRoot, 'get-all-year.js'),
    path.join(midLongTermOperationSrcRoot, 'get-content.js'),
    path.join(midLongTermOperationSrcRoot, 'label-from-number.js'),
  ],
  output: {
    path: midLongTermOperationDIstRoot,
    filename: 'mid-long-term-opration.test.js',
  },
})

const midLongTermRoutesSrcRoot = path.join(config.projectRoot, 'test/static/mid-long-term/routes')
const midLongTermRoutesDIstRoot = path.join(config.projectRoot, 'test/public/mid-long-term')

const midLongTermRoutesConfig = Object.assign({}, webpackJsConfigTemplate, {
  entry: [
    'babel-polyfill',
    path.join(midLongTermRoutesSrcRoot, 'year.js'),
  ],
  output: {
    path: midLongTermRoutesDIstRoot,
    filename: 'mid-long-term-route.test.js',
  },
})

const shortTermOperationSrcRoot = path.join(config.projectRoot, 'test/static/short-term/models/operations')
const shortTermOperationDIstRoot = path.join(config.projectRoot, 'test/public/short-term')

const shortTermOperationConfig = Object.assign({}, webpackJsConfigTemplate, {
  entry: [
    'babel-polyfill',
    path.join(shortTermOperationSrcRoot, 'content-auth.js'),
    path.join(shortTermOperationSrcRoot, 'content-change-label.js'),
    path.join(shortTermOperationSrcRoot, 'content-create.js'),
    path.join(shortTermOperationSrcRoot, 'content-delete.js'),
    path.join(shortTermOperationSrcRoot, 'content-update.js'),
    path.join(shortTermOperationSrcRoot, 'data-create.js'),
    path.join(shortTermOperationSrcRoot, 'data-delete.js'),
    path.join(shortTermOperationSrcRoot, 'download-csv.js'),
    path.join(shortTermOperationSrcRoot, 'get-all-campus.js'),
    path.join(shortTermOperationSrcRoot, 'get-all-type.js'),
    path.join(shortTermOperationSrcRoot, 'get-all-year.js'),
    path.join(shortTermOperationSrcRoot, 'get-content.js'),
    path.join(shortTermOperationSrcRoot, 'label-from-number.js'),
  ],
  output: {
    path: shortTermOperationDIstRoot,
    filename: 'short-term-opration.test.js',
  },
})

module.exports = [
  authOperationConfig,
  midLongTermOperationConfig,
  midLongTermRoutesConfig,
  shortTermOperationConfig,
]