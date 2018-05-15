let merge = require('webpack-merge');
let prodEnv = require('./prod.env');

/**
 * webpack-merge: 可以把分开配置的config合并，相当于合并两个对象
 */

/**
 * @desc 开发环境的环境变量
 */
module.exports = merge(prodEnv, {
    NODE_ENV: '"development"'
});