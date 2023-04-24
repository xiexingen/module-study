/**
 * 定义一个插入logger 信息的 loader
 * @param {*} content 源码文本内容
 * @param {*} map dev map
 * @param {*} meta 自定义信息
 * @returns
 */
function CLoader(content,map,meta){
  console.info('执行了 c-loader 的 normal 阶段');
  return `/*这是由 c-loader 生成的内容*/\r\n${content}`;
}

CLoader.pitch = function () {
  console.log("c-loader 的 pitch 阶段");
};

module.exports = CLoader;