/**
 * This webpack file serve the purpose of bundling browser js files.
 * This file should remain untouched, unless you know what you are doing.
 * Also, only use commonJS syntax in this file,
 * DO NOT use any other transformer (ex: Babel) for unnecessary burden.
 */
const path = require('path')
const config = require('./config')

const isDevMode = process.env.NODE_ENV === 'development'

const webpackConfigTemplate = {
  devtool: isDevMode ? 'inline-sourcemap' : false,
  mode:    isDevMode ? 'development' : 'production',
  target: 'web',
  resolve: {
    alias: {
      'projectRoot': config.projectRoot,
      'auth': path.join(config.projectRoot, 'auth'),
      'mid-long-term': path.join(config.projectRoot, 'mid-long-term'),
      'short-term': path.join(config.projectRoot, 'short-term'),
      'lib': path.join(config.projectRoot, 'lib')
    },
  },
  module:  {
    rules: [
      {
        test:    /\.js$/,
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
    ],
  },
}

const authSrcRoot = path.join(config.projectRoot, 'auth/static/javascripts')
const authDistRoot = path.join(config.projectRoot, 'auth/public/javascripts')
const authConfig = Object.assign({}, webpackConfigTemplate, {
  entry: {
    'login': path.join(authSrcRoot, 'login.js'),
    'signup': path.join(authSrcRoot, 'signup.js'),
  },
  output: {
    path: authDistRoot,
    filename: '[name].bundle.js',
  },
})

const midLongTermSrcRoot = path.join(config.projectRoot, 'mid-long-term/static/javascripts')
const midLongTermDistRoot = path.join(config.projectRoot, 'mid-long-term/public/javascripts')
const midLongTermConfig = Object.assign({}, webpackConfigTemplate, {
  entry: {
    'campus': path.join(midLongTermSrcRoot, 'campus.js'),
    'draw': path.join(midLongTermSrcRoot, 'draw.js'),
    'edit': path.join(midLongTermSrcRoot, 'edit.js'),
    'review': path.join(midLongTermSrcRoot, 'review.js'),
    'type': path.join(midLongTermSrcRoot, 'type.js'),
    'year': path.join(midLongTermSrcRoot, 'year.js'),
  },
  output: {
    path: midLongTermDistRoot,
    filename: '[name].bundle.js',
  },
})

const shortTermSrcRoot = path.join(config.projectRoot, 'short-term/static/javascripts')
const shortTermDistRoot = path.join(config.projectRoot, 'short-term/public/javascripts')
const shortTermConfig = Object.assign({}, webpackConfigTemplate, {
  entry: {
    'year': path.join(shortTermSrcRoot, 'manage/year.js'),
  },
  output: {
    path: shortTermDistRoot,
    filename: '[name].bundle.js',
  },
})


module.exports = [
    authConfig,
    midLongTermConfig,
    shortTermConfig,
]