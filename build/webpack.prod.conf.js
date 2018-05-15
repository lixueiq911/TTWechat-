let path = require('path');
let utils = require('./utils');
let webpack = require('webpack');
let config = require('../config');
let merge = require('webpack-merge');
let baseWebpackConfig = require('./webpack.base.conf');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

let env = config.build.env;

let webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({                                         //主要是针对css的处理
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')           //非入口文件的文件名，而又需要被打包出来的文件命名配置,如按需加载的模块
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': env
        }),

        //js文件压缩插件
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),

        //将js中引入的css分离的插件
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css')
        }),

        //压缩提取出的css，并解决ExtractTextPlugin分离出的js重复问题(多个文件引入同一css文件)
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),

        new HtmlWebpackPlugin({
            filename: config.build.index,       //生成的html的文件名
            template: 'index.html',
            inject: true,                       //注入的js文件将会被放在body标签中,当值为'head'时，将被放在head标签中
            minify: {
                removeComments: true,           //删除html中的注释代码
                collapseWhitespace: true,       //删除html中的空白符
                removeAttributeQuotes: true     //删除html元素中属性的引号
            },
            chunksSortMode: 'dependency'        //按dependency的顺序引入
        }),

        //分离公共js到vendor中
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),

        /*上面虽然已经分离了第三方库,每次修改编译都会改变vendor的hash值，导致浏览器缓存失效。原因是vendor包含了webpack
         在打包过程中会产生一些运行时代码，运行时代码中实际上保存了打包后的文件名。当修改业务代码时,业务代码的js文件的
         hash值必然会改变。一旦改变必然会导致vendor变化。vendor变化会导致其hash值变化*/

        //下面主要是将运行时代码提取到单独的manifest文件中，防止其影响vendor.js
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),

        //复制静态资源,将static文件内的内容复制到指定文件夹
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            }
        ])
    ]
});

//配置文件开启了gzip压缩
if (config.build.productionGzip) {

    //引入压缩文件的组件,该插件会对生成的文件进行压缩，生成一个.gz文件
    let CompressionWebpackPlugin = require('compression-webpack-plugin');

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',          //使用gzip压缩
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,           //资源文件大于10240B=10kB时会被压缩
            minRatio: 0.8               //最小压缩比达到0.8时才会被压缩
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig;