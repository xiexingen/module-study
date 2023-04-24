const path = require('path');

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
        test: /\.less$/,
        use: [
          "my-style-loader", //将 css 内容变成 style 标签插入到 html 中去
          "my-css-loader", //一般会解析url合 @import 等语法
          "my-less-loader", //将 less => css
        ]
      }
    ]
  },
}