const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const Mode = {
    dir: process.env.NODE_ENV,
    isRelease: 'Release' == process.env.NODE_ENV,
};

const WebpackDllConfig = {
    entry: {
        vendors: [
            'react',
            'react-dom'
        ],
    },
    output: {
        path: path.resolve(__dirname, 'src/js/vendors'),
        filename: '[name]' + (Mode.isRelease ? '.[hash].min.js' : '.js'),
        library: '[name]'
    },
    plugins: [
        new webpack['DllPlugin']({
            path: path.resolve(__dirname, 'src/js/vendors/manifest' + (Mode.isRelease ? '.min.json' : '.json')),
            name: '[name]',
            context: __dirname
        })
    ]
};

if (Mode.isRelease) {
    // Release
    WebpackDllConfig.plugins = WebpackDllConfig.plugins.concat([
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
    WebpackDllConfig.plugins = WebpackDllConfig.plugins.concat([
        new CleanWebpackPlugin(['src/js/vendors'], {
            verbose: true,
        }),
    ])
}

module.exports = WebpackDllConfig;