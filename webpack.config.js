var webpack = require("webpack");
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require("path");

var plugins = [], outputFile;

if (process.env.NODE_ENV === "production") {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = "react-superform.min.js";
} else {
  outputFile = "react-superform.js";
}

var config = {
  entry: __dirname + "/src/index.js",
  devtool: "source-map",
  output: {
    path: __dirname + "/lib",
    filename: outputFile,
    library: "Superform",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  externals: {
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'lodash': {
      root: '_',
      commonjs2: 'lodash',
      commonjs: 'lodash',
      amd: 'lodash'
    },
    'validator': {
      root: 'validator',
      commonjs2: 'validator',
      commonjs: 'validator',
      amd: 'validator'
    }
  },
  module: {
    loaders: [
      { test: /.js$/, loader: "babel", exclude: /node_modules/ }
      // ,
      // {
      //   test: /(\.jsx|\.js)$/,
      //   loader: "eslint-loader",
      //   exclude: /node_modules/
      // }
    ]
  },
  resolve: {
    root: path.resolve("./src"),
    extensions: ["", ".js"]
  },
  plugins: plugins
};

module.exports = config;
