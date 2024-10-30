<?php

namespace Inlexa\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if


function add_page() {
	add_options_page(
		'Inlexa',
		_x( 'Inlexa Account', 'text', 'inlexa' ),
		'manage_options',
		'inlexa',
		__NAMESPACE__ . '\render_page'
	);
}//end add_page()
add_action( 'admin_menu', __NAMESPACE__ . '\add_page' );


function render_page() {
	echo '<div class="wrap"><div id="inlexa-container"></div></div>';
}//end render_page()


function enqueue_script() {
	$screen = get_current_screen();
	if ( empty( $screen ) || 'settings_page_inlexa' !== $screen->id ) {
		return;
	}//end if
	inlexa_register_script( 'settings' );
	wp_enqueue_script( 'inlexa-settings' );
}//end enqueue_script()
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_script' );


function register_rest_routes() {
	register_rest_route(
		inlexa_rest_namespace(),
		'/credentials',
		array(
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'permission_callback' => 'inlexa_is_admin_user',
				'callback'            => function( $request ) {
					return new \WP_REST_Response(
						array(
							'token'    => get_option( 'inlexa_token', '' ),
							'clientId' => get_option( 'inlexa_client_id', '' ),
						),
						200
					);
				},
			),
			array(
				'methods'             => \WP_REST_Server::EDITABLE,
				'permission_callback' => 'inlexa_is_admin_user',
				'args'                => array(
					'token'    => [ 'required' => true, 'type' => 'string' ],
					'clientId' => [ 'required' => true, 'type' => 'string' ],
				),
				'callback'            => function( $request ) {
					update_option( 'inlexa_token', $request['token'] );
					update_option( 'inlexa_client_id', $request['clientId'] );
					return new \WP_REST_Response( 'ok', 200 );
				},
			),
			array(
				'methods'             => \WP_REST_Server::DELETABLE,
				'permission_callback' => 'inlexa_is_admin_user',
				'callback'            => function() {
					delete_option( 'inlexa_token' );
					delete_option( 'inlexa_client_id' );
					return new \WP_REST_Response( 'ok', 200 );
				},
			),
		),
	);
}//end register_rest_routes()
add_action( 'rest_api_init', __NAMESPACE__ . '\register_rest_routes' );
