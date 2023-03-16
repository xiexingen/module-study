/**
 * 手写将箭头函数转成葡萄函数的插件的案例(不支持简单的箭头函数写法:(a,b)=>a+b )
*/

// babel核心模块
const core = require("@babel/core");
// 转换箭头函数插件,我们将之前的插件注释掉，自己实现插件部分
// let arrowFunctionPlugin = require("babel-plugin-transform-es2015-arrow-functions");

const arrowFunctionPlugin={
  visitor:{
    //如果是箭头函数，那么就会进来此函数，参数是箭头函数的节点路径对象
    ArrowFunctionExpression(path){
      const {node}=path;
      node.type="FunctionExpression"
    }
  }
}

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