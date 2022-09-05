const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
    entry: './main.js',
    module: {
        rules: [
            { test: /\.(.js)$/, use: 'babel-loader' }
        ]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index_bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html.template'
        })
    ]
}