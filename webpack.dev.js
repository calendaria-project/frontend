const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require('webpack');
const path = require("path");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        devMiddleware: {
            stats: 'minimal',
        },
        port: 3000,
        /**
         * use locol? init host
         */
        // host: ipAddresses,
        //disableHostCheck: true,
        //Be possible go back pressing the "back" button at chrome
        historyApiFallback: true,
        static: './public',
        //hotmodulereplacementeplugin
        hot: true,
        https: true
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    plugins:
        [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.ProvidePlugin({
                "React": "react",
            }),
        ]
});