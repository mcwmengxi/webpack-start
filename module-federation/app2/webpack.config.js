const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

const path = require('path')
// const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
module.exports= {
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devServer: {
    port: 9001,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new ModuleFederationPlugin({
      name: 'romoteApp2',
      remotes: {
        romoteApp1: 'romoteApp1@http://localhost:9000/remoteEntry.js'
      }
    })
  ]
}
