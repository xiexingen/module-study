/**
 * 手写将箭头函数转成葡萄函数的插件的案例(支持简单的箭头函数写法:(a,b)=>a+b )
*/

// babel核心模块
const core = require("@babel/core");
// 转换箭头函数插件,我们将之前的插件注释掉，自己实现插件部分
// let arrowFunctionPlugin = require("babel-plugin-transform-es2015-arrow-functions");

//用来生成或者判断节点的AST语法树的节点
const types=require('@babel/types');


const arrowFunctionPlugin={
  visitor:{
    //如果是箭头函数，那么就会进来此函数，参数是箭头函数的节点路径对象
    ArrowFunctionExpression(path){
      const {node}=path;
      node.type="FunctionExpression"
      // 如果函数体不是块语句,生成一个块语句，并将内容return
      if(!types.isBlockStatement(node.body)){
        const statementBody=types.returnStatement(node.body);
        node.body=types.blockStatement([statementBody]);
      }
    }
  }
}

// 转换前的代码,我们换成简写形式
const sourceCode = `const sum=(a,b)=> a*b; `;

// 通过插件对箭头函数进行转换
const targetSource = core.transform(sourceCode, {
  //使用插件
  plugins: [arrowFunctionPlugin],
});

console.log(`输入:${sourceCode}`)
/**
 * 此处会输出
 * const sum = function (a, b) {
 *  return a * b;
 * };
 */
console.log(`输出:${targetSource.code}`);