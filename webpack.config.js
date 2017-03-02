const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    target: 'async-node',
    entry: './foo.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['latest', 'react', 'stage-3']
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
        new ExtractTextPlugin('app.css'),
        new webpack.SourceMapDevToolPlugin()
    ]
};
