const webpack = require('webpack')
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
      entry: [
         'babel-polyfill',
	'./app/javascripts/app.js'
      ],
      output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.js',
      },
      plugins: [
        // Copy our app's index.html to the build folder.
        new CopyWebpackPlugin([
          { from: './app/index.html', to: "index.html" },
          { from: './app/pas212.html', to: "pas212.html" }
        ]),
        //new webpack.HotModuleReplacementPlugin(),
      
      ],
	  node: {
		    fs: 'empty'
	  },
      module: {
        rules: [
          {
           test: /\.css$/,
           use: [ 'style-loader', 'css-loader' ]
          },
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
		      presets: ['@babel/preset-env','@babel/preset-react'],
		      plugins: [
			      "@babel/transform-arrow-functions",
			      "@babel/transform-classes",
		      ],
		      "compact": true

              }
            }
          }
        ],
        loaders: [
          { test: /\.json$/, use: 'json-loader' }
        ]
       }
 }
