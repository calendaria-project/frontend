const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
    target: "web",
    entry: {
        app: "./src/UserAddDrawer.tsx"
    },
    plugins: [
        // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
        new CleanWebpackPlugin(),
        new Dotenv({
            path: `./.${process.env.NODE_ENV}.env` // load this now instead of the ones in '.env'
            // safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
        }),
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"]
        }),
        new webpack.ProvidePlugin({
            process: "process/browser",
            React: "react"
        }),
        new HtmlWebpackPlugin({
            title: "Alageum",
            template: "./template/index.ejs",
            minify: false,
            meta: {
                charset: { charset: "utf-8" },
                viewport: "width=device-width, initial-scale=1"
            },
            favicon: "./src/assets/favicon.ico"
        })
    ],

    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript"
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.s[a|c]ss$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            {
                test: /\.(jpg|jpeg|png|gif|jpeg|woff|woff2|eot|ttf|svg|ico|pdf)$/,
                loader: "url-loader",
                options: {
                    limit: 100000
                }
            }
        ]
    },
    resolve: {
        plugins: [
            new TsconfigPathsPlugin({
                baseUrl: "src"
            })
        ],
        alias: {
            components: path.resolve(__dirname, "components"),
            main: path.resolve(__dirname, "components/main"),
            images: path.resolve(__dirname, "assets/images"),
            icons: path.resolve(__dirname, "assets/icons")
        },
        extensions: ["*", ".js", ".jsx", ".scss", ".ts", ".tsx"],
        fallback: {
            stream: require.resolve("stream-browserify"),
            zlib: require.resolve("browserify-zlib"),
            buffer: require.resolve("buffer")
        }
    }
};
