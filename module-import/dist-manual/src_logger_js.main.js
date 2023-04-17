self["webpackChunkmodule_import"].push([
  ["src_logger_js"],
  {
    "./src/logger.js": (modules, exports, require) => {
      require.defineProperty(exports, {
        default: () => WEBPACK_DEFAULT_EXPORT,
      });
      const WEBPACK_DEFAULT_EXPORT = () => {
        console.log('日志模块执行了...')
      };
    },
  },
]);