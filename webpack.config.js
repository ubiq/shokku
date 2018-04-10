const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
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
      '@': "src/"
  }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: []
};
