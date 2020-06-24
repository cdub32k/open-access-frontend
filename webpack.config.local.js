const webpack = require("webpack");
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => ({
  entry: ["babel-polyfill", "./javascript/index.js"],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_module)/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
            },
          },
        ],
      },
      {
        test: /\.(|png|jpe?g|gif|svg|ttf|woff2)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      favicon: "./javascript/images/favicon.ico",
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: "bundle.css",
    }),
    new webpack.DefinePlugin({
      "process.env.MODE": JSON.stringify(env.MODE),
      "process.env.API_URL": JSON.stringify(env.API_URL),
    }),
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].[hash].bundle.js",
    chunkFilename: "[name].[chunkhash].bundle.js",
  },
  devServer: {
    contentBase: path.join(__dirname, "."),
    compress: true,
    port: 7510,
    hot: true,
    historyApiFallback: true,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      minChunks: 2,
    },
  },
  mode: "development",
  devtool: "source-map",
});
