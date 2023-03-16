/**
 * 手写 console.log 增强插件，打印 log 的同时还能打印出当前文件名和代码的行列信息
*/

// babel核心模块
const core = require("@babel/core");
// 转换箭头函数插件,我们将之前的插件注释掉，自己实现插件部分
// let arrowFunctionPlugin = require("babel-plugin-transform-es2015-arrow-functions");

//用来生成或者判断节点的AST语法树的节点
const types = require('@babel/types');
const pathLibrary = require("path");

/**
 * 思路
 * 1. 先找出console节点的部分
 * 2. 判断是否是这几个方法名中的某一个："log"、"info"、"warn"、"error"
 * 3. 往节点的arguments中添加参数
 */
const logPlusPlugin = {
  visitor: {
    CallExpression(path,state) {
      const { node } = path;
      // 1. 先找出console节点的部分
      if (types.isMemberExpression(node.callee)) {
        // 确定是 console
        if (node.callee.object.name === "console") {
          // 2. 判断是否是这几个方法名中的某一个："log"、"info"、"warn"、"error"
          if (["log", "info", "warn", "error"].includes(node.callee.property.name)) {
            // 3. 往节点的arguments中添加参数
            const { line, column } = node.loc.start; //找到所处位置的行和列
            node.arguments.push(types.stringLiteral(`${line}:${column}`)); //向右边添加我们的行和列信息
            //找到文件名
            const filename = state.file.opts.filename;
            //输出文件的相对路径
            const relativeName = pathLibrary.relative(__dirname, filename).replace(/\\/g, "/"); //兼容window
            node.arguments.push(types.stringLiteral(relativeName)); //向右边添加我们的行和列信息
          }
        }
      }
    }
  }
}

// 转换前的代码,我们换成简写形式
const sourceCode = `const logPlus=(log)=>{
  console.log(log);
} `;

// 通过插件对箭头函数进行转换
const targetSource = core.transform(sourceCode, {
  //使用插件
  plugins: [logPlusPlugin],
  filename: 'main.js'
});

console.log(`输入:\r\n${sourceCode}`)
/**
 * 此处会输出
 */
console.log(`输出:\r\n${targetSource.code}`);