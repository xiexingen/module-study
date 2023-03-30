/**
 * 实现按需加载插件
*/
// babel核心模块
const core = require("@babel/core");
//用来生成或者判断节点的AST语法树的节点
const types = require('@babel/types');
// 用来生成模板代码
const template = require("@babel/template");

const visitor = {
  ImportDeclaration(path, state) {
    // 通过 state.opts 可以获取到配置项
    const { libraryName, libraryDirectory } = state.opts;
    const { node } = path; //获取节点
    const { specifiers } = node; //获取批量导入声明数组(包括default导入)
    //如果当前的节点的模块名称是我们需要的库的名称，并且导入不是默认导入才会进来,为啥判断 specifiers[0] 就可以知道是不是有 default 导入(你可以试试 default 导入可不可以不是第一个的情况(语法不允许))
    if (
      node.source.value === libraryName && !types.isImportDefaultSpecifier(specifiers[0])
    ) {
      //遍历批量导入声明数组
      const declarations = specifiers.map((specifier) => {
        //返回一个 import Declaration 节点，这里也可以用 template
        return types.importDeclaration(
          //导入声明 import DefaultSpecifier get
          [types.importDefaultSpecifier(specifier.local)],
          //导入模块 source lodash/get(不同的包可能处理不同，有些没有lib目录，有些叫别的名称)
          types.stringLiteral(
            libraryDirectory
              ? `${libraryName}/${libraryDirectory}/${specifier.imported.name}`
              : `${libraryName}/${specifier.imported.name}`)
        );
      });
      path.replaceWithMultiple(declarations); //替换当前节点
    }
  },
}

// 这是插件约定的写法，返回一个函数，函数里面有 visitor 属性
module.exports = function () {
  return {
    visitor
  }
}