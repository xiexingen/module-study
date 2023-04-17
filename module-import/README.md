# 按需加载

## 使用

1. 启动

```js
yarn start
```

2. 查看

打开 dist目录下的 index.html 点击按钮，可以看到点击的时候才会去加载 logger.js 模块

## 说明

dist 为通过 webpack 打包后的文件

dist-manual 文件夹下的为基于 dist 生成的文件手动优化过的(方便阅读),可以跑起来断点调试查看实现过程