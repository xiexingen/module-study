# CommonJS  模块化原理

针对 src/mian.js 进行解析,编译后的伪代码如下

``` js
// 存储定义的模块，以路径为 key，包装函数为值内部包装了定义的源码
var modules = {
  "./src/user.js": (module) => {
    module.exports = {
      name: 'xxg',
      say() {
        console.log('hello, my name is xxg')
      }
    }
  },
};

// 定义存储模块映射的对象，以 key 为路径，以模块的内容值
var cache = {};

//require的实现，接受模块的路径为参数 返回具体的模块的内容
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

// main里面的实现
(() => {
  let user = require("./src/user.js");
  console.log(user.name)
})();
```

最后可以执行 npm run start 查看dist目录中生成的文件 比对下