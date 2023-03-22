/**
 * 实现一个简易版的eslint插件
*/
// babel核心模块
const core = require("@babel/core");
//用来生成或者判断节点的AST语法树的节点
const types = require('@babel/types');

// fix=true：自动修复
const noConsoleLogPlugin = ({ fix = false }) => ({
  //遍历前
  pre(file) {
    file.set("errors", []);
  },
  visitor: {
    CallExpression(path,state) {
      const errors = state.file.get("errors");
      const { node } = path;
      if (node.callee.object && node.callee.object.name === "console") {
        //抛出一个语法错误
        errors.push(path.buildCodeFrameError(`代码中不能出现console语句`, Error));
        //如果启动了fix，就删掉该节点
        if (fix) {
          path.parentPath.remove();
        }
      }
    }
  },
  //遍历后
  post(file) {
    console.log(...file.get("errors"));
  },
})

// 转换前的代码
const sourceCode = `
const print=(text)=>{
  console.log(text);
  alert(text)
}`;

const targetSource = core.transform(sourceCode, {
  //使用插件,可以传入支持的配置项
  plugins: [noConsoleLogPlugin({ fix: true })]
});

console.log(`输入:\r\n${sourceCode}`)
/**
 * 此处会输出
 */
console.log(`输出:\r\n${targetSource.code}`);