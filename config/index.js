let path = require('path');

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../wx/index.html'),   //index文件的路径
        assetsRoot: path.resolve(__dirname, '../wx'),       //根目录
        assetsSubDirectory: 'static',                       //静态资源目录
        assetsPublicPath: '/budtt/wx/',
        productionSourceMap: true,                          //是否生成source map
        productionGzip: false,                              //默认关闭，如果要使用确保安装了compression-webpack-plugin
        productionGzipExtensions: ['js', 'css'],            //扩展压缩内容
        bundleAnalyzerReport: process.env.npm_config_report //是否显示打包的报告，读取环境变量的值
    },
    dev: {
        env: require('./dev.env'),
        port: 4200,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',   //静态资源目录
        assetsPublicPath: '/',
        proxyTable: {},                 //代理
        // proxyUrl: "http://stage.budsupreme.com",
        proxyUrl: "http://192.168.1.2:4800",
        proxyHeader: "/budtt",
        cssSourceMap: false             //相对路径目前有bug，所以cssSourceMap设为false，但是并不影响功能
    }
};
