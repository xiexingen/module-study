const babel = require('@babel/core');
const path = require('path');

function miniBabelLoader(source) {
  // loade 里面的 this=loaderContext 是一个唯一的对象，不管在哪个loader或方法里，它的this都是同一个对象，称为loaderContext
  const options = this.getOptions(); //拿到在 webpack 中传递给该loader的参数，也就是presets: ["@babel/preset-env"],
  console.log("自己写的 mini-babel-loader");
  const { code } = babel.transformSync(source, options); //交给 babel 库去解析
  return code;
}

module.exports = miniBabelLoader;