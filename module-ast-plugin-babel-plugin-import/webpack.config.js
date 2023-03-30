const path = require('path');

// CommonJS 的写法
module.exports = {
  mode: 'development', // 开发环境，不压缩代码
  entry: './src/main.js', // 配置入口文件，跟很多后端一样 习惯叫 main
  output: {
    path: path.resolve("dist"),
    filename: "bundle.js",
  },
  devtool: 'source-map', // 方便查看打包后的代码
  // 想查看没有使用按需引入插件的时候的效果可以注释下面整个 module，然后查看 dist 目录下的代码
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              //我们自己手写的babel-plugin-import插件(数组中的第一个参数为我们的插件地址，第二个参数为我们的配置)
              [
                path.resolve(__dirname, "plugins/babel-plugin-import.js"),
                {
                  libraryName: "lodash",
                  // libraryDirectory: 'lib', // 我们所使用的的版本不在 lib 中
                },
              ],
            ],
          },
        },
      },
    ],
  },
}