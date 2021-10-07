/*
  HMR: hot module replacement 热模块替换 / 模块热替换
    作用：一个模块发生变化，只会重新打包这一个模块（而不是打包所有模块） 
      极大提升构建速度
      
      样式文件：可以使用HMR功能：因为style-loader内部实现了~
      js文件：默认不能使用HMR功能 --> 需要修改js代码，添加支持HMR功能的代码
        注意：HMR功能对js的处理，只能处理非入口js文件的其他文件。
      html文件: 默认不能使用HMR功能.同时会导致问题：html文件不能热更新了~ （不用做HMR功能）
        解决：修改entry入口，将html文件引入
*/

const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const path = require('path');

// 定义nodejs环境变量：决定使用browserslist的哪个环境
process.env.NODE_ENV = 'production';
module.exports = {
  // webpack配置
  // 入口起点
  entry: ['./src/js/index.js','./src/index.html'],
  // entry:'./src/js/index.js',
  // 输出
  output: {
    // 输出文件名
    filename: 'js/bundle.js',
    // 输出路径
    // __dirname nodejs的变量，代表当前文件的目录绝对路径
    path: resolve(__dirname, 'dist'),
  },
  // loader的配置
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
          'css-loader',    
          // webpack5 
          {
            loader: 'postcss-loader',
            options: { 
              postcssOptions: { 
                plugins: [
                  require('postcss-preset-env')()
                ],
              }, 
            } 
          },
          'less-loader'
        ]
      },
  
      //webpack5 代码
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8kb
          }
        },
        generator: {
          filename: 'images/[hash:10].[ext]'
        }
      },
      {
        test: /\.html$/,
        // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
        loader: 'html-loader'
      },
      // 打包其他资源(除了html/js/css资源以外的资源)
      {
        // 排除css/js/html资源
        exclude: /\.(css|html|js|less|png|jpg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/[hash:10].[ext]'
        }
      },
    //  {
    //     test:/\.js$/,
    //     exclude:/node_modules/,
    //     loader:'eslint-loader', 
    //     // 优先执行 
    //     enforce:'pre',             
    //     options:{
    //       fix:true
    //     }        
    //  },
     {
      test:/\.js$/,
      exclude:/node_modules/,
      loader:'babel-loader',               
      options:{
        presets:[
          [
            '@babel/preset-env',
            {
              // 按需加载
              useBuiltIns: 'usage',
              // 指定core-js版本
              corejs: {
                version: 3
              },
              // 指定兼容性做到哪个版本浏览器
              targets: {
                chrome: '60',
                firefox: '60',
                ie: '9',
                safari: '10',
                edge: '17'
              }
            }
          ]
  
        ]
      }
      
     },
    ]
  },
  // plugins的配置
  plugins: [
    // html-webpack-plugin
    // 功能：默认会创建一个空的HTML，自动引入打包输出的所有资源（JS/CSS）
    // 需求：需要有结构的HTML文件
    new HtmlWebpackPlugin({
      // 复制 './src/index.html' 文件，并自动引入打包输出的所有资源（JS/CSS）
      template: './src/index.html',
      // 压缩html代码
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: './css/bundle.css'
    }),
    // new OptimizeCssAssetsPlugin()
  ],
  //配置在「plugins」中，webpack就会在启动时使用这个插件。
  // 而配置在 「optimization.minimizer」 中，就只会在「optimization.minimize」这个特性开启时使用。
  // 所以webpack推荐，像压缩类的插件，应该配置在「optimization.minimizer」数组中。
  // 以便于通过「optimization.minimize」统一控制。（生产环境会默认开启minimize）
  optimization:{
    minimizer:[
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      // `...`,
      new CssMinimizerPlugin(),
      // new OptimizeCssAssetsPlugin()
    ]
  },
  // mode: 'development', // 开发模式
  // 生产环境下会自动压缩js代码
  mode: 'production',
  // 开发服务器 devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器~~）
  // 特点：只会在内存中编译打包，不会有任何输出
  // 启动devServer指令为：npx webpack-dev-server
  devServer: {
    // 项目构建后路径
    // contentBase:resolve(__dirname,'dist'),
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    open: true,
   
    // 开启HMR功能
    hot: true
  },
  //入口点大小超过了建议的限制（244kB）
  performance: { hints: false }
}
