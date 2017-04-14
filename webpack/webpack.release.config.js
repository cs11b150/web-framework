const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// process['traceDeprecation'] = true;

module.exports = {
    entry: {
        index: path.resolve(__dirname, 'src/js/index.js'),
        vendor: [
            'react',
            'react-dom',
        ],
    },
    output: {
        path: path.resolve(__dirname, 'Release'),
        filename: 'js/[name].[hash].js',
    },
    resolve: {
        alias: {
            'img': path.resolve(__dirname, 'src/img'),
            'css': path.resolve(__dirname, 'src/css'),
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: path.resolve(__dirname, 'src'),
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'react'],
                },
            }
        }, {
            test: /\.(less|css)/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                }, {
                    loader: 'postcss-loader',
                }, {
                    loader: 'less-loader',
                }]
            }),
        }, {
            test: /\.(png|jpe?g)/i,
            use: [{
                loader: 'url-loader',
                options: {
                    name: 'img/[name].[hash].[ext]',
                    limit: 8192,
                }
            }]
        }, {
            test: /\.(eot|svg|ttf|woff2?)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    name: 'font/[name].[hash].[ext]',
                    limit: 8192,
                }
            }],
        }]
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
        new ExtractTextPlugin('css/style.[hash].css'),
        new webpack.optimize['CommonsChunkPlugin']({
            name: 'vendor',
        }),
    ]
};