var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",

  output: {
    path: path.join(__dirname, "./dist/"),
    filename: "index.js",
    library: "react-service-store",
    libraryTarget: "umd"
  },

  externals: {
    "react": "react",
  },

  plugins: [
    new webpack.DefinePlugin({
      // To force React into knowing this is a production build.
      "process.env": { NODE_ENV: JSON.stringify("production") }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel",
        exclude: /node_modules/,
        query: {
          cacheDirectory: true
        }
      }
    ]
  }
};
