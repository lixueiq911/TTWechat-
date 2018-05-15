let utils = require('./utils');
let config = require('../config');
let isProduction = process.env.NODE_ENV === 'production';

/**
 * @desc vue-loader的额外配置，编译样式
 * @type {{loaders: {css: *, postcss: *, less: *, sass: *, scss: *, stylus: *, styl: *}}}
 */
module.exports = {
    loaders: utils.cssLoaders({
        sourceMap: isProduction
            ? config.build.productionSourceMap
            : config.dev.cssSourceMap,
        extract: isProduction
    })
};