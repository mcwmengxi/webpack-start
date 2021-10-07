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
  entry: './src/js/index.js',
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
          // use数组中loader执行顺序：从右到左，从下到上 依次执行
          // 创建style标签，将js中的样式资源插入进行，添加到head中
          // 这个loader取代style-loader。作用：提取js中的css成单独文件
          MiniCssExtractPlugin.loader,
          // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
          'css-loader',
          /*
            css兼容性处理：postcss --> postcss-loader postcss-preset-env

            帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式

            "browserslist": {
              // 开发环境 --> 设置node环境变量：process.env.NODE_ENV = development
              "development": [
                "last 1 chrome version",
                "last 1 firefox version",
                "last 1 safari version"
              ],
              // 生产环境：默认是看生产环境
              "production": [
                ">0.2%",
                "not dead",
                "not op_mini all"
              ]
            }
          */
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
          // {
          //   loader:'postcss-loader',
          // 原因是postcss-loader这个版本不支持在webpack.config.js文件中这么写
          // 解决办法：在项目根目录下新建一个postcss.config.js文件
          //   // options:{
          //   //     ident:'postcss',
          //   //     plugins:() => [
          //   //       require('postcss-preset-env')()
          //   //     ]
          //   // }
          // },
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
      /*
        语法检查： eslint-loader  eslint
          注意：只检查自己写的源代码，第三方的库是不用检查的
          设置检查规则：
            package.json中eslintConfig中设置~
              "eslintConfig": {
                "extends": "airbnb-base"
              }
            airbnb --> eslint-config-airbnb-base  eslint-plugin-import eslint
      */
      /*
        js兼容性处理：babel-loader @babel/core 
          1. 基本js兼容性处理 --> @babel/preset-env
            问题：只能转换基本语法，如promise高级语法不能转换
          2. 全部js兼容性处理 --> @babel/polyfill  
            问题：我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了~
          3. 需要做兼容性处理的就做：按需加载  --> core-js
      */
      /*
        正常来讲，一个文件只能被一个loader处理。
        当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序：
          先执行eslint 在执行babel
      */
     {
        test:/\.js$/,
        exclude:/node_modules/,
        loader:'eslint-loader', 
        // 优先执行 
        enforce:'pre',             
        options:{
          fix:true
        }        
     },
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
          // [
          //   '@babel/preset-env',
            // {
            //   useBuiltIns:'usage',
            //   corejs:{
            //     version: 3
            //   },
            //   targets:{
            //     chrome:'60',
            //     firefox:'60',
            //     ie:'9',
            //     safari:'10',
            //     edge:'17'
            //   }
            // }
          // ]
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
    hot: true
  }
}



