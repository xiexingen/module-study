const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// CommonJS 的写法
module.exports = {
  mode: 'development', // 开发环境，不压缩代码
  entry: './src/index.js', // 配置入口文件，跟很多后端一样 习惯叫 main
  devtool: 'source-map', // 方便查看打包后的代码
  output: {
    filename: "main.js", //定义打包后的文件名称
    path: path.resolve(__dirname, "./dist"), //必须是绝对路径
  },
  resolveLoader: {
    // 找 loader 的时候，先去 loaders 目录下找，找不到再去 node_modules 下面找
    modules: ['loaders', 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // 多个的情况，从右(下)往左(上)执行
        use: [
          'c-loader', // 也可以这样写:{loader:'a-loader',options:{name:'a-loader'}},
          'b-loader',
          'a-loader',
        ]
      }
    ]
  },
  // 配置 html plugin
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    })
  ]
}