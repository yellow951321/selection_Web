const path = require('path')
const nodeExternals = require('webpack-node-externals')
const config = require('./config')

const isDevMode = process.env.NODE_ENV === 'development'

module.exports = {
  devtool: isDevMode ? 'inline-sourcemap' : false,
  mode:    isDevMode ? 'development' : 'production',
  entry:   [
    'babel-polyfill',
    path.join(config.projectRoot, '/data/operation/csv-to-db/run.js'),
  ],
  output: {
    path:      path.join(config.projectRoot, 'bin'),
    filename: 'upload.bundle.js',
  },
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