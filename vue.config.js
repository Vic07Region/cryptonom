const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    open: process.platform === "darwin",
    host: "0.0.0.0",
    port: 8001,
    https: false,
    allowedHosts: "all",
  },
});
