const parser = require("@babel/parser");
const traverse = require("@babel/traverse");
const generator = require("@babel/generator");

// 源代码
const code = `const HelloWord = () => {};`;
console.log(`输入代码:${code}`)
// 1. 源代码解析成 ast
const ast = parser.parse(code);

// 2. 转换
const visitor = {
  // traverse 会遍历树节点，只要节点的 type 在 visitor 对象中出现，变化调用该方法
  Identifier(path) {
    const { node } = path; //从path中解析出当前 AST 节点
    // 将 name 转成首字母小写
    node.name = `${node.name.slice(0,1).toLocaleLowerCase()}${node.name.slice(1)}`; //找到hello的节点，替换成world
  },
};
traverse.default(ast, visitor);

// 3. 生成
const result = generator.default(ast, {}, code);

console.log(`插件格式化后的代码:${result.code}`); //const helloWorld = () => {};