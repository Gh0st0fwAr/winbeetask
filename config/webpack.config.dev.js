'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const helpers = require('./helpers');
const commonConfig = require('./webpack.config.common');
const environment = require('./env/dev.env');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');

const webpackConfig = merge(commonConfig, {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	output: {
		path: helpers.root('dist'),
		publicPath: '/',
		filename: 'js/[name].bundle.js',
		chunkFilename: 'js/[id].chunk.js'
	},
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all'
		},
		
	},
	plugins: [
		new webpack.EnvironmentPlugin(environment),
		new webpack.HotModuleReplacementPlugin(),
		// new BundleAnalyzerPlugin(),
	],
	devServer: {
		compress: true,
		hot: true,
		historyApiFallback: true,
		open: true,
		overlay: true,
		host: 'localhost',
		port: 8000,
		quiet: true,
		clientLogLevel: 'error',
		stats: {
			normal: true
		},
	},
	watchOptions: {
		aggregateTimeout: 200,
		poll: 1000,
		ignored: ['node_modules/**']
	}
});

module.exports = webpackConfig;