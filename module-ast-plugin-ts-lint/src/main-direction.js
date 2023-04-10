/**
 * 手写阉割版的 ts-lint 插件 - 直接赋值场景
*/
// babel核心模块
const core = require("@babel/core");

// 定义类型映射表
const TypeAnnotationMap = {
  TSNumberKeyword: "NumericLiteral",
};

const tsLintPlugin = {
  // 遍历前
  pre(state) {
    state.set('errors', []);
  },
  visitor: {
    VariableDeclarator(path, state) {
      const errors = state.file.get("errors");
      const { node } = path;
      //第一步: 获取拿到声明的类型（number）
      const declareType = TypeAnnotationMap[node.id.typeAnnotation.typeAnnotation.type]; //拿到声明的类型 NumberTypeAnnotation
      //第二步: 获取真实值的类型（"100"的类型）
      const initType = node.init.type; // 这里拿到的是真实值的类型 StringLiteral
      //第三步: 比较声明的类型和值的类型是否相同
      if (declareType !== initType) {
        //拿到子路径init
        errors.push(
          path.get("init").buildCodeFrameError(`无法把${initType}类型赋值给${declareType}类型`, Error)
        );
      }
    }
  },
  // 遍历后
  post(state) {
    console.log(...state.get("errors"));
  }
}

const sourceCode = `const age:number='100';`;

// 通过插件对箭头函数进行转换
const targetSource = core.transform(sourceCode, {
  // 解析插件切换微 Typescript，这样才能识别 ts 语法
  parserOpts: {
    plugins: ["typescript"]
  },
  //使用插件
  plugins: [tsLintPlugin],
  filename: 'main.js'
});