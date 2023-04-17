const path =require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');

// CommonJS 的写法
module.exports = {
  mode: 'development', // 开发环境，不压缩代码
  entry: './src/main.js', // 配置入口文件，跟很多后端一样 习惯叫 main
  devtool: 'source-map', // 方便查看打包后的代码
  output: {
    filename: "main.js", //定义打包后的文件名称
    path: path.resolve(__dirname, "./dist"), //必须是绝对路径
  },
  // 配置 html plugin
  plugins:[
    new HtmlWebpackPlugin({
      template:'./src/index.html',
      filename:'index.html'
    })
  ]
}