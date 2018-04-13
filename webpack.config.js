const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'node',
  entry: './src/main.ts',
  devtool: 'eval-source-map',
  node: {
    __dirname: true
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules|\.spec\.ts$/
    }]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyWebpackPlugin([
      'node_modules/swagger-ui-express/indexTemplate.html'
    ]),
    new NodemonPlugin({
      "watch": [
        "src"
      ],
      "ext": "ts",
      "ignore": [
        "src/**/*.spec.ts"
      ],
    }),
  ]
};
