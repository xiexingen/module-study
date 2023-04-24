const less = require('less');
const path = require('path');

// 因为 Webpack 只认识 js 和 json ,因此最左侧的 Loader 必须返回的是 js 代码
// 实现思路:创建一个 style 标签，将 css 代码添加到 head 中去
function styleLoader(cssSource) {
  let script = `
  let style=document.createElement("style");
  style.innerHTML=${JSON.stringify(cssSource)};
  document.head.appendChild(style)
`;
  return script;
}

module.exports = styleLoader;