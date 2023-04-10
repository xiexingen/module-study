/**
 * 手写阉割版的 ts-lint 插件 - 泛型场景
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
    CallExpression(path, state) {
      const errors = state.file.get("errors");
      //第一步：先获取实参类型数组（1,'2'的类型数组：[number,string]）
      const args = path.get("arguments");
      const argTypes=args.map(arg=>transformType(arg.getTypeAnnotation().type));
      // 第二步：获取函数调用时传递的泛型类型数组（[number, string]）
      const params = path.get("typeParameters").get("params");
      // 第三步：拿到函数定义时的泛型 [ T1 , T2 ]，然后结合第二步将 T1 赋值为 number，T2 赋值为 string，得到数组 [T1=number,T2=string]
      const paramTypes = params.map(item => transformType(item.type));
      // 第四步：计算函数定义时的形参类型数组：此时 a:number，b:string => [number,string]
      // 第五步：a 的形参类型跟 a 的实参类型进行比较，b 的形参类型跟 b 的实参类型进行比较
      // 可以试着自己处理其他情况(如: 参数个数不一致。。。)
      argTypes.map((sourceType,index)=>{
        if (sourceType !== paramTypes[index]) {
          Error.stackTraceLimit = 0;
          errors.push(
            path.get(`arguments.${index}`).buildCodeFrameError(
                `无法把 ${sourceType} 赋值给 ${paramTypes[index]} `,
                Error
              )
          );
        }
      })
    }
  },
  // 遍历后
  post(state) {
    console.log(...state.get("errors"));
  }
}

const sourceCode = `
function join<T1, T2>(a: T1, b: T2) {}
join < number, number > (1, "2");
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