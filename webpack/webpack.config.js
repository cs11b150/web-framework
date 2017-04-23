const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// process['traceDeprecation'] = true;

const Mode = {
    dir: process.env.NODE_ENV,
    isRelease: 'Release' == process.env.NODE_ENV,
};

const WebpackConfig = {
    entry: {
        index: path.resolve(__dirname, 'src/js/index.js'),
    },
    output: {
        path: path.resolve(__dirname, Mode.dir),
        filename: 'js/[name]' + (Mode.isRelease ? '.[hash].js' : '.js'),
    },
    resolve: {
        alias: {
            css: path.resolve(__dirname, 'src/css'),
        },
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'react'],
                },
            }
        }, {
            test: /\.(less|css)/,
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function () {
                            return [autoprefixer];
                        }
                    },
                }, {
                    loader: 'less-loader',
                }]
            }),
        }, {
            test: /\.(png|jpe?g)/i,
            use: [{
                loader: 'url-loader',
                options: {
                    name: 'img/[name]' + (Mode.isRelease ? '.[hash].[ext]' : '.[ext]'),
                    limit: 8192,
                }
            }]
        }, {
            test: /\.(eot|svg|ttf|woff2?)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    name: 'font/[name]' + (Mode.isRelease ? '.[hash].[ext]' : '.[ext]'),
                    limit: 8192,
                }
            }],
        }]
    },
    plugins: [
        new CleanWebpackPlugin([Mode.dir], {
            verbose: true,
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: 'body',
            mode: Mode,
        }),
        new webpack['ProvidePlugin']({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new ExtractTextPlugin('css/style' + (Mode.isRelease ? '.[hash].css' : '.css')),
    ]
};

if (Mode.isRelease) {
    // Release
    WebpackConfig.plugins = WebpackConfig.plugins.concat([
        new webpack['DefinePlugin']({
            process: {
                env: {
                    'NODE_ENV': JSON.stringify('production')
                }
            }
        }),
        new webpack['optimize']['UglifyJsPlugin']({
            compress: {
                warnings: false,
            }
        }),
    ])
} else {
    // Debug
    WebpackConfig.devServer = {
        contentBase: path.resolve(__dirname, Mode.dir),
        host: '0.0.0.0'
    };

    WebpackConfig.plugins = WebpackConfig.plugins.concat([
        new CopyWebpackPlugin([
            {context: 'src', from: 'ajax/**/*'},
        ]),
    ]);
}

module.exports = WebpackConfig;
