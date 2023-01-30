# CommonJS 加载 ESModule 原理


针对 src/mian.js 进行解析,编译后的伪代码如下

``` js
// 存储定义的模块，以路径为 key，包装函数为值内部包装了定义的源码
var modules = {
  "./src/user.js": (module,exports,require) => {
    // 给模块设置一个 tag,标识这是一个 ES Module
    require.setEsModuleTag(exports);

    const name = 'xxg';
    const DEFAULT_EXPORT = '1.0.0';
    function say(){
      console.log('hello, my name is xxg')
    }

    //通过代理给exports设置属性值
    require.defineProperty(exports, {
      default:() => DEFAULT_EXPORT,
      name: () => name,
      say: () => say
    });

  },
};

// 定义存储模块映射的对象，以 key 为路径，以模块的内容值
var cache = {};

// require的实现，接受模块的路径为参数 返回具体的模块的内容
function require(modulePath) {
  //获取模块缓存
  var cachedModule = cache[modulePath];
  //如果有缓存则不允许模块内容，直接返回 exports 属性
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  //如果没有缓存，则定义module对象，定义exports属性
  var module = cache[modulePath] = {
    exports: {},
  };
  //运行模块内的代码，在模块代码中会给module.exports对象赋值
  modules[modulePath](module, module.exports, require);

  //返回module.exports对象
  return module.exports;
}

// 标识模块的类型为 ES Module，Symbol的更多信息可以查看 https://blog.xxgtalk.cn/note/core/symbol
require.setEsModuleTag=(exports)=>{
  // 通过 Object.prototype.toString.call(export) 可以得到 [object Module]
  Object.defineProperty(exports, Symbol.toStringTag, {
    value: "Module"
  })

  Object.defineProperty(exports, "__esModule", {
    value: true,
  });
}

// 对exports对象做代理
require.defineProperty=(exports, definition)=>{
  for (var key in definition) {
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: definition[key],
    });
  }
}



// 下面是 main.js 编译后的代码
(() => {
  //拿到模块导出对象exports
  var userModule = require("./src/user.js");
  console.log(`viersion :${userModule["default"]}`);
  console.log(`name:${userModule.name}`);
  userModule.say()
})();
```


最后可以执行 npm run start 查看 dist 目录中生成的文件 比对下