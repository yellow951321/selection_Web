/**
 * This webpack file serve the purpose of bundling browser js files.
 * This file should remain untouched, unless you know what you are doing.
 * Also, only use commonJS syntax in this file,
 * DO NOT use any other transformer (ex: Babel) for unnecessary burden.
 */
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const config = require('./config.js')
const browserSupportConditions = require('./browser-list.js')

const isDevMode = process.env.NODE_ENV === 'development'


/**
 * JS config section.
 * Put all js files and js files only in this section.
 */
const webpackJsConfigTemplate = {
  devtool: isDevMode ? 'inline-sourcemap' : false,
  mode:    isDevMode ? 'development' : 'production',
  target: 'web',
  resolve: {
    alias: {
      'projectRoot': config.projectRoot,
      'auth': path.join(config.projectRoot, 'auth'),
      'mid-long-term': path.join(config.projectRoot, 'mid-long-term'),
      'short-term': path.join(config.projectRoot, 'short-term'),
      'lib': path.join(config.projectRoot, 'lib'),
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
          },
        ],
      },
    ],
  },
}

const authJsSrcRoot = path.join(config.projectRoot, 'auth/static/javascripts')
const authJsDistRoot = path.join(config.projectRoot, 'auth/public/javascripts')
const authJsConfig = Object.assign({}, webpackJsConfigTemplate, {
  entry: {
    'login': path.join(authJsSrcRoot, 'login.js'),
    'signup': path.join(authJsSrcRoot, 'signup.js'),
  },
  output: {
    path: authJsDistRoot,
    filename: '[name].bundle.js',
  },
})

const midLongTermJsSrcRoot = path.join(config.projectRoot, 'mid-long-term/static/javascripts')
const midLongTermJsDistRoot = path.join(config.projectRoot, 'mid-long-term/public/javascripts')
const midLongTermJsConfig = Object.assign({}, webpackJsConfigTemplate, {
  entry: {
    'campus': path.join(midLongTermJsSrcRoot, 'campus.js'),
    'draw': path.join(midLongTermJsSrcRoot, 'draw.js'),
    'edit': path.join(midLongTermJsSrcRoot, 'edit.js'),
    'review': path.join(midLongTermJsSrcRoot, 'review.js'),
    'type': path.join(midLongTermJsSrcRoot, 'type.js'),
    'year': path.join(midLongTermJsSrcRoot, 'year.js'),
  },
  output: {
    path: midLongTermJsDistRoot,
    filename: '[name].bundle.js',
  },
})

const shortTermSrcRoot = path.join(config.projectRoot, 'short-term/static/javascripts')
const shortTermDistRoot = path.join(config.projectRoot, 'short-term/public/javascripts')
const shortTermConfig = Object.assign({}, webpackJsConfigTemplate, {
  entry: {
    'year': path.join(shortTermSrcRoot, 'manage/year.js'),
  },
  output: {
    path: shortTermDistRoot,
    filename: '[name].bundle.js',
  },
})

const webpackCssConfigTemplate = {
  devtool: isDevMode ? 'inline-sourcemap' : false,
  mode:    isDevMode ? 'development' : 'production',
  target: 'web',
  module:  {
    rules: [
      {
        // Rules for SCSS files.
        test: /\.scss$/,
        use:  [
          {
            loader:  MiniCssExtractPlugin.loader,
            options: {
              filename: '[name].bundle.css',
            },
          },
          {
            loader:  'css-loader',
            options: {
              sourceMap: isDevMode,
            },
          },
          {
            loader:  'postcss-loader',
            options: {
              sourceMap: isDevMode,
              plugins:   [
                autoprefixer({ browserSupportConditions, }),
                cssnano(),
              ],
            },
          },
          {
            loader:  'sass-loader',
            options: {
              includePaths: [
                config.projectRoot,
              ],
              sourceMap:    isDevMode,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Extract CSS file.
    new MiniCssExtractPlugin({
      // Extract and save as `[name].min.css`,
      // where `[name]` will be replaced with origin SCSS file name.
      filename: '[name].bundle.css',
    }),
  ],
}

const authCssSrcRoot = path.join(config.projectRoot, 'auth/static/stylesheets')
const authCssDistRoot = path.join(config.projectRoot, 'auth/public/stylesheets')
const authCssConfig = Object.assign({}, webpackCssConfigTemplate, {
  entry: {
    'login':   path.join(authCssSrcRoot, 'login.scss'),
    'signup':  path.join(authCssSrcRoot, 'signup.scss'),
    'channel': path.join(authCssSrcRoot, 'channel.scss'),
  },
  output: {
    path: authCssDistRoot,
    filename: '[name].do-not-use.js',
  },
})

const midLongTermCssSrcRoot = path.join(config.projectRoot, 'mid-long-term/static/stylesheets')
const midLongTermCssDisRoot = path.join(config.projectRoot, 'mid-long-term/public/stylesheets')
const midLongTermCssConfig = Object.assign({}, webpackCssConfigTemplate, {
  entry: {
    'box': path.join(midLongTermCssSrcRoot, 'box.scss'),
    'manage': path.join(midLongTermCssSrcRoot, 'manage.scss'),
    'playground' : path.join(midLongTermCssSrcRoot, 'playground.scss'),
    'style': path.join(midLongTermCssSrcRoot, 'style.scss'),
    'yearBox': path.join(midLongTermCssSrcRoot, 'yearBox.scss'),
  },
  output: {
    path: midLongTermCssDisRoot,
    filename: '[name].do-not-use.js',
  },
})


module.exports = [
  authJsConfig,
  authCssConfig,
  midLongTermJsConfig,
  shortTermConfig,
  midLongTermCssConfig,
]