/*
  使用dll技术，对某些库（第三方库：jquery、react、vue...）进行单独打包
    当你运行 webpack 时，默认查找 webpack.config.js 配置文件
    需求：需要运行 webpack.dll.js 文件
      --> webpack --config webpack.dll.js
*/
const {resolve} = require('path')
const webpack = require("webpack")

module.exports={
  entry:{
    // 最终打包生成的[name] --> jquery
    // ['jquery'] --> 要打包的库是jquery
    jquery:['jQuery']
  },
  output:{
    filename:'[name].js',
    path:resolve(__dirname,'dll'),
    // 打包的库里面向外暴露出去的内容叫什么名字
    library:'[name]_[hash]'
  },
  mode:'production',
  // 打包生成一个 manifest.json --> 提供和jquery映射
  plugins:[
    new webpack.DllPlugin({
      // 映射库的暴露的内容名称
      name:'[name_[hash]',
      path:resolve(__dirname,'dll/manifest.json')
    })
  ]
}

