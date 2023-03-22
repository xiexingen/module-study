/**
 * 手写监控系统中的日志上传插件
*/
// babel核心模块
const core = require("@babel/core");
// 转换箭头函数插件,我们将之前的插件注释掉，自己实现插件部分

//用来生成或者判断节点的AST语法树的节点
const types = require('@babel/types');
// 用来生成模板代码
const template = require("@babel/template");

/**
 * 思路
 * 1. 先判断源代码中是否引入了 logger 库
 * 2. 如果引入了，就找出导入的变量名，后面直接使用该变量名即可
 * 3. 如果没有引入我们就在源代码的顶部引用一下
 * 4. 在函数中插入引入的函数
 */
const autoImportPlugin = {
  visitor: {
    Program(path,state) {
      let loggerId;
      //遍历子节点
      path.traverse({
        ImportDeclaration(path) {
          const { node } = path;
          // 1. 判断源代码中是否引入了 logger 库
          if (node.source.value === "logger") {
            // 2. 如果引入了，就找出导入的变量名，后面直接使用该变量名即可
            const specifiers = node.specifiers[0];
            loggerId = specifiers.local.name; //取出导入的变量名赋值给loggerId
            //找到了就结束循环
            path.stop();
          }
        },
      });

      //3. 如果没有引入说明源代码中还没有导入此模块，需要我们手动插入一个import语句
      if (!loggerId) {
         //防止变量名之间的冲突,使用提供的方法生成(比如源代码中已经有别的命名叫loggerLib，那它就会变成_loggerLib)
        loggerId = path.scope.generateUid("loggerLib");
        path.node.body.unshift(
          // types.importDeclaration(
          //   [types.importDefaultSpecifier(types.identifier(loggerId))],
          //   types.stringLiteral("logger")
          // )
          // 使用模板写法替换掉上面的写法
          template.statement(`import ${loggerId} from 'logger'`)()
        );
      }

      //在state上面挂在一个节点 => loggerLib()
      // state.loggerNode = types.expressionStatement(
      //   types.callExpression(types.identifier(loggerId), [])
      // );
      state.loggerNode = template.statement(`${loggerId}()`)();
    },
    // 4. 在函数中插入引入的函数
    //四种函数方式，这是插件能够识别的语法，这是四种函数的type
    "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassMethod"(path, state) {
      const { node } = path;
      if (types.isBlockStatement(node.body)) {
        //如果是一个块级语句的话
        node.body.body.unshift(state.loggerNode); //在语句的头部添加logger函数节点
      } else {
        //处理箭头函数，生成一个块级语句，在第一行中插入loggerNode，然后return 之前的内容
        const newBody = types.blockStatement([
          state.loggerNode,
          types.returnStatement(node.body),
        ]);
        //替换老节点
        node.body = newBody;
      }
    },
  }
}

// 转换前的代码，有四种写法
const sourceCode = `
function sum(a, b) {
  return a + b;
}

const multiply = function (a, b) {
  return a * b;
};

const minus = (a, b) => a - b;

class Calculator {
  divide(a, b) {
    return a / b;
  }
}`;

// 通过插件对箭头函数进行转换
const targetSource = core.transform(sourceCode, {
  //使用插件
  plugins: [autoImportPlugin]
});

console.log(`输入:\r\n${sourceCode}`)
/**
 * 此处会输出
 */
console.log(`输出:\r\n${targetSource.code}`);