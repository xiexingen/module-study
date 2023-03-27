/**
 * 实现一个简易版的代码压缩插件
*/
// babel核心模块
const core = require("@babel/core");
//用来生成或者判断节点的AST语法树的节点
const types = require('@babel/types');

const uglyPlugin = {
  visitor: {
    // 这是一个别名，用于捕获所有作用域节点(函数、类的方法、函数表达式、语句块、if else、while、for)
    Scopable(path) {
      // path.scope.bindings 可以取出作用域内的所有变量
      //取出后进行重命名
      Object.entries(path.scope.bindings).forEach(([key, binding]) => {
        //在当前作用域内生成一个新的uid，并且不会和任何本地定义的变量冲突的标识符
        const newName = path.scope.generateUid();
        binding.path.scope.rename(key, newName);
      });
    }
  }
}

// 转换前的代码
const sourceCode = `
const print=(text)=>{
  const now=new Date().getTime();
  console.log(now);
  function log(){
    console.log(new Date(now).toString())
  }
}`;

const targetSource = core.transform(sourceCode, {
  //使用插件,可以传入支持的配置项
  plugins: [uglyPlugin]
});

console.log(`输入:\r\n${sourceCode}`)
/**
 * 此处会输出
 */
console.log(`输出:\r\n${targetSource.code}`);