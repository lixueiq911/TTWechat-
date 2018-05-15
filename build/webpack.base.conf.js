let path = require('path');
let utils = require('./utils');
let config = require('../config');
let vueLoaderConfig = require('./vue-loader.conf');
var webpack=require('webpack');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',                              //导出文件的文件名
        publicPath: process.env.NODE_ENV === 'production'   //生产模式或开发模式下html、js等文件内部引用的公共路径
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    plugins: [ 
       new webpack.optimize.CommonsChunkPlugin('common.js'),
       new webpack.ProvidePlugin({ 
             $:"jquery", 
             jQuery:"jquery", 
            "windows.jQuery":"jquery"
    	}) 
   ],
    resolve: {                                              //主要设置模块如何被解析
        extensions: ['.js', '.vue', '.json'],               //自动解析确定的拓展名,使导入模块时不带拓展名
        alias: {                                            //创建import或require的别名
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig                    //options是对vue-loader做的额外选项配置
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]  //处理指定文件夹下的文件
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('images/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    }
};
