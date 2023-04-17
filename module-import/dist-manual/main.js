//初始化：默认情况下这里放的是同步代码块,这里的 demo 因为没有同步代码,所以是一个空的模块对象
const modules = {};
//已经加载过的模块
const cache = {};
//已经安装好的代码块,main.js就是对应的main代码块,0表示已经加载成功,已经就绪
const installedChunks = {
  main: 0,
};

//相当于在浏览器中用于加载模块的 polyfill
function require(moduleId) {
  const cachedModule = cache[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  const module = cache[moduleId] = {
    exports: {},
  };
  modules[moduleId](module, module.exports, require);
  return module.exports;
}

require.defineProperty = (exports, definition) => {
  for (const key in definition) {
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: definition[key],
    });
  }
};

require.publicPath = ""; //output中的publicPath属性

require.j = function (chunkId, promises) {
  const promise = new Promise((resolve, reject) => {
    installedChunks[chunkId] = [resolve, reject];
  });
  promises.push(promise);
  const url = require.publicPath + chunkId + ".main.js";
  const script = document.createElement("script");
  script.src = url;
  document.head.appendChild(script);
};

function webpackJsonpCallback([chunkIds, moreModules]) {
  const resolves = [];
  for (let i = 0; i < chunkIds.length; i++) {
    const chunkId = chunkIds[i];
    resolves.push(installedChunks[chunkId][0]);
    installedChunks[chunkId] = 0; //标识一下代码已经加载完成了
  }

  for (const moduleId in moreModules) {
    modules[moduleId] = moreModules[moduleId]; //合并modules
  }

  while (resolves.length) {
    resolves.shift()();
  }
}

self.webpackChunkmodule_import = {};
self.webpackChunkmodule_import.push = webpackJsonpCallback;

require.e = function (chunkId) {
  let promises = [];
  require.j(chunkId, promises);
  return Promise.all(promises);
};

const buttonEle = document.getElementById("btnLogger");
buttonEle.onclick = function () {
  require
    .e("src_logger_js")
    .then(require.bind(require, "./src/logger.js"))
    .then((module) => {
      const print = module.default;
      print();
    });
};