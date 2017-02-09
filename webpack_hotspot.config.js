const path = require('path');
const webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: './app/index.jsx',
    output: {
      path: './',
      filename: './app/bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: [
          'babel?presets[]=es2015,presets[]=react,plugins[]=transform-object-rest-spread&retainLines=true',
          'ng-annotate-loader'
        ]
        // query: {
        //   presets: ['react', 'es2015'],
        //   plugins: ["transform-object-rest-spread"]
        // }
      },
      {
        test: /.node$/,
        loader: 'node-loader'
      },
      {
        test: [/.css?$/],
        loader: 'style-loader!css-loader'
      }
    ]
  },
	plugins: [
		new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('hotspot'),
      }
    })
	],
  devtool: 'source-maps'
};