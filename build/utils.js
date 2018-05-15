let path = require('path');
let config = require('../config');
let ExtractTextPlugin = require('extract-text-webpack-plugin'); //抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象

/**
 * @desc 拼接资源路径
 * @param _path
 * @returns {*|string}
 */
exports.assetsPath = function (_path) {
    let assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory;

    return path.posix.join(assetsSubDirectory, _path)
};

/**
 * @desc 返回vue css loader的配置
 * @param options {Object}
 * @param options.sourceMap {Boolean} 是否生成source map
 * @param options.extract {Boolean} 是否抽出css放在单独的css文件中，生产环境为true
 * @returns {{css: *, postcss: *, less: *, sass: *, scss: *, stylus: *, styl: *}}
 */
exports.cssLoaders = function (options) {
    options = options || {};

    let cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: process.env.NODE_ENV === 'production',    //如果为生产环境则压缩代码
            sourceMap: options.sourceMap                        //是否生成 source map
        }
    };

    /**
     * @desc 返回vue css loader的配置
     * @param loader {String} 即less、sass等
     * @param loaderOptions
     * @returns {*}
     */
    function generateLoaders(loader, loaderOptions) {
        let loaders = [cssLoader];

        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {     //Object.assign() 通过复制一个或多个对象来创建一个新的对象
                    sourceMap: options.sourceMap
                })
            })
        }

        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader'
            })
        } else {
            return ['vue-style-loader'].concat(loaders)
        }
    }

    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', {indentedSyntax: true}),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    }
};

exports.styleLoaders = function (options) {
    let output = [];
    let loaders = exports.cssLoaders(options);

    for (let extension in loaders) {
        let loader = loaders[extension];

        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }

    return output
};
