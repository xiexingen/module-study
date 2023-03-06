const btnLogger = document.getElementById("btnLogger");

// 点击的时候再去加载日志模块
btnLogger.addEventListener('click',()=>{
  import("./logger").then((module) => {
    const log = module.default;
    log();
  });
})