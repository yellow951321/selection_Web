/**
 * This webpack file serve the purpose of bundling browser js files.
 * This file should remain untouched, unless you know what you are doing.
 * Also, only use commonJS syntax in this file,
 * DO NOT use any other transformer (ex: Babel) for unnecessary burden.
 */
const path = require('path')
const config = require('./config')

const isDevMode = process.env.NODE_ENV === 'development'

module.exports = {
  devtool: isDevMode ? 'inline-sourcemap' : false,
  mode:    isDevMode ? 'development' : 'production',
  entry: {
    a: path.join(config.projectRoot, 'server.js'),
  },
  output: {
    path: path.join(config.projectRoot, 'bin'),
    filename: 'server.bundle.js',
    publicPath: '/bin'
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    alias: {
      'projectRoot': config.projectRoot,
      'auth': path.join(config.projectRoot, 'auth'),
      'mid-long-term': path.join(config.projectRoot, 'mid-long-term'),
      'short-term': path.join(config.projectRoot, 'short-term'),
    },
  },
  module:  {
    rules: [
      {
        test:    /\.js$/,
        exclude: /(node_modules)/,
        use:     [
          {
            loader:  'babel-loader',
            options: {
              cacheDirectory: true,
              presets:        ['@babel/preset-env', ],
              babelrc:        false,
            },
          }
        ],
      },
      {
        test:  /\.css$/,
        exclude: /(node_modules)/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.pug$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'pug-loader'
          }
        ]
      }
    ],
  },
}