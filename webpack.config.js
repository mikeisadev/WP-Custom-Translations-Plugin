const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require('path');

module.exports = {
	...defaultConfig,
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /\.(ts|tsx)?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		...defaultConfig.resolve,
		extensions: ['.tsx', '.ts', '.js', '.jsx'],
	},
};