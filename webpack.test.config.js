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

const midLongTermOperationSrcRoot = path.join(config.projectRoot, 'test/static/mid-long-term/models/operations')
const midLongTermOperationDIstRoot = path.join(config.projectRoot, 'test/public/mid-long-term')

const midLongTermOperationConfig = Object.assign({}, webpackJsConfigTemplate, {
  entry: [
    'babel-polyfill',
    path.join(midLongTermOperationSrcRoot, 'content-delete.js'),
    path.join(midLongTermOperationSrcRoot, 'content-save.js'),
    path.join(midLongTermOperationSrcRoot, 'content-update.js'),
    path.join(midLongTermOperationSrcRoot, 'data-create.js'),
    path.join(midLongTermOperationSrcRoot, 'data-delete.js'),
    path.join(midLongTermOperationSrcRoot, 'download-csv.js'),
    path.join(midLongTermOperationSrcRoot, 'get-all-campus.js'),
    path.join(midLongTermOperationSrcRoot, 'get-all-type.js'),
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

module.exports = [
  midLongTermOperationConfig,
  midLongTermRoutesConfig,
]