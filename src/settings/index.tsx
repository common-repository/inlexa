import * as React from '@wordpress/element';
import { dispatch } from '@wordpress/data';

import { injectGlobal } from '@neliosoft/inlexa/css';
import { colors, generateCssColorVariables } from '@neliosoft/inlexa/theme';

import { App } from './app';
import { STORE } from './data';

const { render } = React;

const cssColorVariables = generateCssColorVariables( {
	tag: 'div#inlexa-container',
	lightClassName: 'wpinlexa-light-theme',
	darkClassName: 'wpinlexa-dark-theme',
} );

injectGlobal( cssColorVariables );
injectGlobal( `div#inlexa-container { color: ${ colors.body.foreground };` );
document
	.getElementById( 'inlexa-container' )
	?.classList.add( 'wpinlexa-light-theme' );

render( <App />, document.getElementById( 'inlexa-container' ) );

dispatch( STORE ).check();
