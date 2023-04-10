/**
 * 手写阉割版的 ts-lint 插件 - 先定义再赋值场景
*/
// babel核心模块
const core = require("@babel/core");

// 定义类型映射表
function transformType(type) {
  switch (type) {
    case "TSNumberKeyword":
    case "NumberTypeAnnotation":
      return "number";
    case "TSStringKeyword":
    case "StringTypeAnnotation":
      return "string";
  }
}

const tsLintPlugin = {
  // 遍历前
  pre(state) {
    state.set('errors', []);
  },
  visitor: {
    AssignmentExpression(path, state) {
      const errors = state.file.get("errors");
      //第一步：先获取左侧变量的定义（age）
      const variable = path.scope.getBinding(path.get("left"));
      //第二步：再获取左侧变量定义的类型（number）
      const variableAnnotation = variable.path.get("id").getTypeAnnotation();
      const variableType = transformType(variableAnnotation.type);
      //第三步：获取右侧的值的类型（“12”）
      const valueType = transformType(
        path.get("right").getTypeAnnotation().type
      );
      //第四步：判断变量的左侧变量的类型和右侧的值的类型是否相同
      if (variableType !== valueType) {
        Error.stackTraceLimit = 0;
        errors.push(
          path.get("right")
            .buildCodeFrameError(
              `无法把 ${valueType} 赋值给 ${variableType} `,
              Error
            )
        );
      }
    },

  },
  // 遍历后
  post(state) {
    console.log(...state.get("errors"));
  }
}

const sourceCode = `
  let age:number;
  age='100';
`;

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