const less = require('less');
const path = require('path');

// 这里我们啥也没干直接返回
function cssLoader(cssSource) {
  return cssSource;
}

module.exports = cssLoader;