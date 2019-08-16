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
    path.join(midLongTermOperationSrcRoot, 'label-from-number.js'),
    path.join(midLongTermOperationSrcRoot, 'get-all-campus.js'),
  ],
  output: {
    path: midLongTermOperationDIstRoot,
    filename: 'mid-long-term-opration.test.js',
  },
})

const midLongTermRouterSrcRoot = path.join(config.projectRoot, 'test/static/mid-long-term/routes')
const midLongTermRouterDIstRoot = path.join(config.projectRoot, 'test/public/mid-long-term')

const midLongTermRouterConfig = Object.assign({}, webpackJsConfigTemplate, {
  entry: [
    'babel-polyfill',
    path.join(midLongTermRouterSrcRoot, 'year.js'),
  ],
  output: {
    path: midLongTermRouterDIstRoot,
    filename: 'mid-long-term-router.test.js',
  },
})

module.exports = [
  midLongTermOperationConfig,
  midLongTermRouterConfig,
]