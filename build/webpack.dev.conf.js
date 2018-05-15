let utils = require('./utils');
let webpack = require('webpack');
let config = require('../config');
let merge = require('webpack-merge');
let baseWebpackConfig = require('./webpack.base.conf');
let HtmlWebpackPlugin = require('html-webpack-plugin');               //打包html
let FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'); //用于更友好地输出webpack的警告、错误等信息

/**
 *@desc entry添加热加载的配置
 */
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
});

/**
 * @desc 合并webpack基础配置和dev配置
 */
module.exports = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap})
    },
    devtool: '#cheap-module-eval-source-map',       //生成 source map 的模式
    plugins: [
        new webpack.DefinePlugin({                  //编译时配置的全局变量
            'process.env': config.dev.env
        }),
        new webpack.HotModuleReplacementPlugin(),   //热更新插件
        new webpack.NoEmitOnErrorsPlugin(),         //不触发错误,即编译后运行的包正常运行
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        new FriendlyErrorsPlugin()                  //友好的错误提示
    ]
});