/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
const isLocal = slsw.lib.webpack.isLocal;

module.exports = {
  entry: slsw.lib.entries,
  devtool: 'inline-source-map',
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '../build'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: [/nodejs/, /node_modules/],
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, '../serverless.env.yml')}],
    }),
  ],
  stats: 'normal',
  mode: isLocal ? 'development' : 'production',
  externals: [nodeExternals()],
};
