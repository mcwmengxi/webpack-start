/*
  loader: 1. 下载   2. 使用（配置loader）
  plugins: 1. 下载  2. 引入  3. 使用
*/

/*
  webpack.config.js  webpack的配置文件
    作用: 指示 webpack 干哪些活（当你运行 webpack 指令时，会加载里面的配置）

    所有构建工具都是基于nodejs平台运行的~模块化默认采用commonjs。
*/

// resolve用来拼接绝对路径的方法
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  // webpack配置
  // 入口起点
  entry:'./src/index.js',
  // 输出
  output:{
    // 输出文件名
    filename:'bundle.js',
    // 输出路径
    // __dirname nodejs的变量，代表当前文件的目录绝对路径
    path:resolve(__dirname,'build'),

  },
  // loader的配置
  module:{
    rules:[
      {
        test:/\.(css|less)$/,
        use:[
          // use数组中loader执行顺序：从右到左，从下到上 依次执行
          // 创建style标签，将js中的样式资源插入进行，添加到head中生
          'style-loader',
          // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
          'css-loader',
          // 将less文件编译成css文件
          // 需要下载 less-loader和less
          'less-loader'
        ]
      },
      // webpack4 代码
      // {
      //   // 问题：默认处理不了html中img图片
      //   // 处理图片资源
      //   test: /\.(jpg|png|gif)$/,
      //   // 使用一个loader
      //   // 下载 url-loader file-loader
      //   loader: 'url-loader',
      //   options: {
      //     // 图片大小小于8kb，就会被base64处理
      //     // 优点: 减少请求数量（减轻服务器压力）
      //     // 缺点：图片体积会更大（文件请求速度更慢）
      //     limit: 8 * 1024,
      //     // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
      //     // 解析时会出问题：[object Module]
      //     // 解决：关闭url-loader的es6模块化，使用commonjs解析
      //     esModule: false,
      //     // 给图片进行重命名
      //     // [hash:10]取图片的hash的前10位
      //     // [ext]取文件原来扩展名
      //     name: '[hash:10].[ext]'
      //   },
      //   //当在 webpack 5 中使用旧的 assets loader（如 file-loader/url-loader/raw-loader 等）和 asset 模块时，这可能会导致 asset 重复，所以你可能想阻止 webpack 5 内置的 asset 模块的处理，你可以通过将 asset 模块的类型设置为 ‘javascript/auto’ 来解决。
      //   type:'javascript/auto'
      // },
      //webpack5 代码
      {
        test:/\.(png|jpg|gif)$/,
        type:'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8kb
          }
        },
        generator:{
          filename:'static/[hash:10].[ext]'
        }
      },
      {
        test: /\.html$/,
        // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
        loader: 'html-loader'
      }
    ]
  },
  // plugins的配置
  plugins:[
    // html-webpack-plugin
    // 功能：默认会创建一个空的HTML，自动引入打包输出的所有资源（JS/CSS）
    // 需求：需要有结构的HTML文件
    new HtmlWebpackPlugin({
    // 复制 './src/index.html' 文件，并自动引入打包输出的所有资源（JS/CSS）
      template:'./src/index.html'
    })
  ],
  mode:'development', // 开发模式
  // mode: 'production'
}


