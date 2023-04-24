/**
 * 定义一个插入logger 信息的 loader
 * @param {*} content 源码文本内容
 * @param {*} map dev map
 * @param {*} meta 自定义信息
 * @returns
 */
function BLoader(content,map,meta){
  console.info('执行了 b-loader 的 normal 阶段');
  return `/*这是由 b-loader 生成的内容*/\r\n${content}`;
}

BLoader.pitch = function () {
  console.log("b-loader 的 pitch 阶段");
  /**
   * 没有返回值的情况下执行顺序为:
   * c patch -> b patch -> a patch -> a normal -> b normal -> c normal
   * c patch -> b patch -> c normal
   */
  // return "test"
};

module.exports = BLoader;