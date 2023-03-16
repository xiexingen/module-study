/**
 * 手写完整版的箭头函数转换成普通函数的插件(支持简写、this等)
*/

// babel核心模块
const core = require("@babel/core");
// 转换箭头函数插件,我们将之前的插件注释掉，自己实现插件部分
// let arrowFunctionPlugin = require("babel-plugin-transform-es2015-arrow-functions");

//用来生成或者判断节点的AST语法树的节点
const types=require('@babel/types');

// 处理 this 作用域
function hoistFunctionEnvironment(path){
  // 1.找到当前箭头函数要使用哪个作用域内的this
  // 确定当前箭头函数要使用哪个地方的this,要求父节点是函数且不是箭头函数，找不到就返回根节点
  const thisScope=path.findParent(parent=>{
    return (parent.isFunction()&&parent.isArrowFunctionExpression()===false) || parent.isProgram();
  })

  // 2. 向父作用域内放入一个_this变量
  // 在作用域中加一个_this变量，其实就是对AST树中的（scope）新增一个节点即可
  thisScope.scope.push({
    id: types.identifier("_this"), //生成标识符节点,也就是变量名
    init: types.thisExpression(), //生成this节点 也就是变量值
  })

  // 3. 找出当前箭头函数内所有用到this的地方
  // 遍历当前节点的子节点，如果有this变量，就收集起来
  const thisScopePaths = []; //获取当前节点this的路径
  //遍历当前节点的子节点
  path.traverse({
    // 跟前面一样，如果是 ThisExpress 类型就收集起来
    ThisExpression(thisPath) {
      thisScopePaths.push(thisPath);
    },
  });

  // 4.将当前箭头函数中的this，统一替换成_this
  thisScopePaths.forEach((thisPath) => {
    thisPath.replaceWith(types.identifier("_this")); // 将this改成_this
  });
}

const arrowFunctionPlugin={
  visitor:{
    //如果是箭头函数，那么就会进来此函数，参数是箭头函数的节点路径对象
    ArrowFunctionExpression(path){
      const { node }=path;
      node.type="FunctionExpression"

      //提升函数环境，解决this作用域问题
      hoistFunctionEnvironment(path);

      // 如果函数体不是块语句,生成一个块语句，并将内容return
      if(!types.isBlockStatement(node.body)){
        const statementBody=types.returnStatement(node.body);
        node.body=types.blockStatement([statementBody]);
      }
    }
  }
}

// 转换前的代码,我们换成简写形式
const sourceCode = `const sum=(a,b)=>{
  console.log(this);
  return a*b;
} `;

// 通过插件对箭头函数进行转换
const targetSource = core.transform(sourceCode, {
  //使用插件
  plugins: [arrowFunctionPlugin],
});

console.log(`输入:${sourceCode}`)
/**
 * 此处会输出
 * var _this = this;
 * const sum = function (a, b) {
 *  console.log(_this);
 *  return a * b;
 *};
 */
console.log(`输出:${targetSource.code}`);