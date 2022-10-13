'use strict';

const { VueLoaderPlugin } = require('vue-loader');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const helpers = require('./helpers');
const TerserPlugin = require('terser-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const GoogleFontsPlugin = require("@beyonk/google-fonts-webpack-plugin")

const webpackConfig = {
	entry: {
		polyfill: '@babel/polyfill',
		main: helpers.root('src', 'main'),
	},
	resolve: {
		extensions: ['.js', '.vue'],
		alias: {
			'vue': '@vue/runtime-dom',
			'@': helpers.root('src')
		}
	},

	module: {
		rules: [{
				test: /\.vue$/,
				loader: 'vue-loader',
				include: [helpers.root('src')]
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [helpers.root('src')]
			},
			{
				test: /\.css$/,
				use: [
					isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: isDev
						}
					},
				]
			},
			{
				test: /\.scss$/,
				use: [
					isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: isDev
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: isDev
						}
					}
				]
			},
			{
				test: /\.sass$/,
				use: [
					isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: isDev
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: isDev
						}
					}
				]
			},
			{
				test: /\.(woff|woff2)$/,
				use: {
				  loader: 'url-loader',
				},
			 },
			{
			  test: /\.(eot|woff|woff2|svg|ttf|gif|png|jpeg|jpg)([\?]?.*)$/,
			  use: {
				  loader: "file-loader",
				  options: {
					  esModule: false
				  	}
			  }
			},
			// { 
			// 	test: /\.(png|woff|woff2|eot|ttf|svg)$/, use: ['url-loader?limit=100000'] 
			// }
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new HtmlPlugin({
			template: 'index.html',
			chunksSortMode: 'dependency'
		}),
		new GoogleFontsPlugin({
			fonts: [{
					family: "Roboto",
					variants: ["300", "400", "500", "bold"],
					"subsets": [
						'latin-ext',
						'cyrillic'
					]
				}
				
			],
			options: {
				name: "fonts",
				filename: "fonts.css",
				formats: ["woff", "woff2", "ttf"],
				path: "fonts/",
				local: true
			}
		})
	]
};

module.exports = webpackConfig;