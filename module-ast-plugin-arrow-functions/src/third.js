// babel核心模块
const core = require("@babel/core");
// 转换箭头函数插件
let arrowFunctionPlugin = require("babel-plugin-transform-es2015-arrow-functions");

// 转换前的代码
const sourceCode = `const sum=(a,b)=>{ return a*b; }`;
// 通过插件对箭头函数进行转换
const targetSource = core.transform(sourceCode, {
  //使用插件
  plugins: [arrowFunctionPlugin],
});

console.log(`输入:${sourceCode}`)
/**
 * 此处会输出
 * const sum = function (a, b) {
  return a * b;
};
 */
console.log(`输出:${targetSource.code}`);