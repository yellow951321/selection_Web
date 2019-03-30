const path = require('path')
const nodeExternals = require('webpack-node-externals')
const config = require('./config')

module.exports = {
  mode: process.env.NODE_ENV,
  entry:   [
    'babel-polyfill',
    path.join(config.path, 'app.js'),
  ],
  output: {
    path: path.join(__dirname, 'bin'),
    filename: '[name].bundle.js',
  },
  target: 'node',
  externals: [nodeExternals(), ],
  resolve: {
    alias: {
      models: path.join(config.path, 'models'),
      routes: path.join(config.path, 'routes'),
      apis: path.join(config.path, 'apis'),
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