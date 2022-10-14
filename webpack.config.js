const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports = {
    entry: {
        main: "./src/index.js",
    },
    mode: "production",
    output: {
        filename: "[name].min.js",
        path: __dirname + "/dist"
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {loader: "css-loader"},
                    {loader: "postcss-loader"},
                    {loader: "sass-loader"},
                ]
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            },
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"},
            {test: /\.png(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"},
            {
                test: /\.md$/, 
                use: [ 
                    'raw-loader',
                    path.resolve('./md-loader.js')
                ],
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].min.css",
            chunkFilename: "[id].min.css"
        })
    ]
};