const less = require('less');
const path = require('path');

// 参数 source 是 less 文件的内容
function lessLoader(lessSource) {
  let css;
  //这里less.render其实也就是把less解析成AST，然后再生成css
  less.render(lessSource, { filename: this.resource }, (err, output) => {
    css = output.css;
  });
  return css;
}

module.exports = lessLoader;