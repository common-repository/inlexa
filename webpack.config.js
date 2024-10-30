const _ = require( 'lodash' );
const path = require( 'path' );

const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const config = {
	...defaultConfig,
	resolve: {
		...defaultConfig.resolve,
		alias: {
			'@neliosoft/inlexa': path.resolve( __dirname, 'src/common' ),
			'@wpinlexa/gutenberg': path.resolve( __dirname, 'src/gutenberg' ),
			'@wpinlexa/settings': path.resolve( __dirname, 'src/settings' ),
		},
		extensions: _.uniq( [
			...( defaultConfig.resolve.extensions ?? [] ),
			'.js',
			'.jsx',
			'.ts',
			'.tsx',
		] ),
	},
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
};

module.exports = {
	...config,
	entry: {
		gutenberg: './src/gutenberg/index.tsx',
		settings: './src/settings/index.tsx',
	},
	output: {
		filename: 'inlexa-[name].js',
		path: path.resolve( __dirname, 'dist' ),
	},
};
