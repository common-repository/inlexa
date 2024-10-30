<?php
/**
 * The plugin bootstrap file.
 *
 * Plugin Name:       Inlexa
 * Plugin URI:        https://inlexa.es/
 * Description:       Inlexa is a language assistant that helps you write more inclusive and diverse texts in Spanish and Catalan.
 * Version:           1.0.0
 *
 * Author:            Nelio Software
 * Author URI:        https://neliosoftware.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * Text Domain:       inlexa
 *
 * @package Inlexa
 * @author  David Aguilera <david.aguilera@neliosoftware.com>
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

define( 'INLEXA', true );

function inlexa_path() {
	return untrailingslashit( plugin_dir_path( __FILE__ ) );
}//end inlexa_path()

function inlexa_url() {
	return untrailingslashit( plugin_dir_url( __FILE__ ) );
}//end inlexa_url()

function inlexa_init() {
	require_once inlexa_path() . '/includes/utils.php';
	require_once inlexa_path() . '/includes/gutenberg.php';
	require_once inlexa_path() . '/includes/settings.php';
}//end inlexa_init()
add_action( 'init', 'inlexa_init' );

