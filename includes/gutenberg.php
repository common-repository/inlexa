<?php

namespace Inlexa\Gutenberg;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function enqueue_assets() {
	inlexa_register_script( 'gutenberg' );
	wp_enqueue_script( 'inlexa-gutenberg' );
	wp_add_inline_script(
		'inlexa-gutenberg',
		sprintf(
			'inlexaInit( %s );',
			wp_json_encode(
				array(
					'token'       => get_option( 'inlexa_token', '' ),
					'clientId'    => get_option( 'inlexa_client_id', '' ),
					'isAdmin'     => current_user_can( 'manage_options' ),
					'settingsUrl' => admin_url( 'options-general.php?page=inlexa' ),
					'language'    => get_language(),
				)
			)
		)
	);
}//end enqueue_assets()
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_assets' );

function get_language() {
	$languages = [ 'ca', 'es' ];

	/**
	 * Filters the language in which Inlexa will run the analysis by default.
	 *
	 * @since 1.0.0
	 */
	$locale = apply_filters( 'inlexa_language', get_locale() );
	$locale = substr( strtolower( $locale ), 0, 2 );

	return in_array( $locale, $languages, true ) ? $locale : 'es';
}//end get_language()
