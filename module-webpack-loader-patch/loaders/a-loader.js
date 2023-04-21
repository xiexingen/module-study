/**
 * 定义一个插入logger 信息的 loader
 * @param {*} content 源码文本内容
 * @param {*} map dev map
 * @param {*} meta 自定义信息
 * @returns
 */
function ALoader(content,map,meta){
  console.info('执行了 a-loader 的 normal 阶段');
  return `/*这是由 a-loader 生成的内容*/\r\n${content}`;
}

ALoader.pitch = function () {
  console.log("a-loader 的 pitch 阶段");
};

module.exports = ALoader;