const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// process['traceDeprecation'] = true;

const config = require('./config')({
    Mode: 'Release',
    ExtractTextPlugin: ExtractTextPlugin,
});

let entry = {};
let vendorNames = [];
(function() {
    config.entry_vendors.forEach(function (item, index) {
        let vendorName = 'vendor' + (config.entry_vendors.length - 1 - index);
        entry[vendorName] = item;
        vendorNames.push(vendorName);
    });
    entry.index = path.resolve(__dirname, 'src/js/index.js');
}());

module.exports = {
    entry: entry,
    output: {
        path: path.resolve(__dirname, 'Release'),
        filename: 'js/[name].[hash].js',
    },
    resolve: {
        alias: config.resolve_alias,
    },
    module: {
        rules: config.module_rules
    },
    plugins: [
        new CleanWebpackPlugin(['Release'], {
            verbose: true,
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: 'body',
            mode: "Release",
        }),
        new CopyWebpackPlugin([
            {context: 'src', from: 'lib/html5media-1.2.2/**/*'},
        ]),
        new webpack['DefinePlugin']({
            process: {
                env: {
                    'NODE_ENV': JSON.stringify('production')
                }
            }
        }),
        new webpack.optimize['UglifyJsPlugin']({
            compress: {
                warnings: false,
            }
        }),
        new webpack['ProvidePlugin']({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new ExtractTextPlugin('css/index.[hash].css'),
        new webpack.optimize['CommonsChunkPlugin']({
            name: vendorNames,
        }),
    ]
};