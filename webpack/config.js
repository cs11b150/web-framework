const path = require('path');

const postcss_options = {
    plugins: function() {
        return [
            require('autoprefixer')
        ];
    }
};

module.exports = function (options) {

    let isRelease = 'Release' == options.Mode;

    return {

        entry_vendors: [
            [
                'react',
            ],
            [
                'react-dom',
            ]
        ],

        resolve_alias: {
            'css': path.resolve(__dirname, 'src/css'),
            'img': path.resolve(__dirname, 'src/img'),
        },

        module_rules: [{
            test: /\.js$/,
            include: path.resolve(__dirname, 'src/js'),
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'react'],
                },
            }
        }, {
            test: /\.css$/,
            include: path.resolve(__dirname, 'src/css'),
            exclude: /node_modules/,
            use: options.ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                }, {
                    loader: 'postcss-loader',
                    options: postcss_options,
                }]
            }),
        }, {
            test: /\.less$/,
            include: path.resolve(__dirname, 'src/css'),
            exclude: /node_modules/,
            use: [{
                loader: 'style-loader',
            }, {
                loader: 'css-loader',
            }, {
                loader: 'postcss-loader',
                options: postcss_options,
            }, {
                loader: 'less-loader',
            }]
        }, {
            test: /\.scss$/,
            include: path.resolve(__dirname, 'src/css'),
            exclude: /node_modules/,
            use: [{
                loader: 'style-loader',
            }, {
                loader: 'css-loader',
            }, {
                loader: 'postcss-loader',
                options: postcss_options,
            }, {
                loader: 'sass-loader',
            }]
        }, {
            test: /\.(png|jpe?g)$/i,
            use: [{
                loader: 'url-loader',
                options: {
                    name: isRelease ? 'img/[name].[hash].[ext]' : 'img/[name].[ext]',
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
    }
};
