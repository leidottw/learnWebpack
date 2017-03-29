const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    target: 'web',
    entry: path.resolve(__dirname, 'src/app.js'),
    output: {
        path: (isProduction) ? path.resolve(__dirname, 'prod') : path.resolve(__dirname, 'dev'),
        filename: 'app.bundle.js'
    },
    devtool: (isProduction) ? 'nosources-source-map' : 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['latest', 'react', 'stage-1']
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: !isProduction
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: !isProduction
                        }
                    }
                ]
            }
            // 分離css
            // {
            //     test: /\.scss$/,
            //     use: ExtractTextPlugin.extract({
            //         use: [
            //             {
            //                 loader: 'css-loader',
            //                 options: {
            //                     sourceMap: !isProduction
            //                 }
            //             },
            //             {
            //                 loader: 'sass-loader',
            //                 options: {
            //                     sourceMap: !isProduction
            //                 }
            //             }
            //         ]
            //     })
            // }
        ]
    },
    plugins: [
        // 分離css
        // new ExtractTextPlugin('app.css'),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dev'),
        compress: true,
        historyApiFallback: true,
        port: 8088,
        proxy: {
            '/api': 'http://172.17.20.49:8080/video/'
        }
    }
};
