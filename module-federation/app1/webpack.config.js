const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
module.exports= {
  mode: 'development',
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './'),
    },
    compress: true,
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new ModuleFederationPlugin({
      name: 'romoteApp1',
      filename:"remoteEntry.js",
      exposes: {
        './Header': './header.js'
      }
    })
  ]
}
