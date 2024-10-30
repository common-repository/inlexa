<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function inlexa_is_admin_user() {
	return current_user_can( 'manage_options' );
}//end inlexa_is_admin_user()

function inlexa_rest_namespace() {
	return '/inlexa/v1';
}//end inlexa_rest_namespace()

function inlexa_register_script( $name ) {
	$file = inlexa_path() . "/dist/inlexa-{$name}.asset.php";
	if ( ! file_exists( $file ) ) {
		return;
	}//end if

	$asset = include $file;
	// NOTE. Bug fix with @wordpress/core-data package.
	$asset['dependencies'] = array_map(
		function( $dep ) {
			return str_replace( 'wp-coreData', 'wp-core-data', $dep );
		},
		$asset['dependencies']
	);

	wp_enqueue_script(
		"inlexa-{$name}",
		inlexa_url() . "/dist/inlexa-{$name}.js",
		$asset['dependencies'],
		$asset['version'],
		true
	);
}//end inlexa_register_script()

