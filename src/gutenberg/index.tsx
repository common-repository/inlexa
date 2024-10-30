import * as React from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';

import { InlexaIcon } from '@neliosoft/inlexa/components';
import { css, injectGlobal } from '@neliosoft/inlexa/css';
import { colors, generateCssColorVariables } from '@neliosoft/inlexa/theme';

import { STORE } from './data';
import { Sidebar } from './sidebar';

import type { Config } from './data/types';

function init( args: Partial< Config > ) {
	const cssColorVariables = generateCssColorVariables( {
		tag: 'body',
		lightClassName: 'wpinlexa-light-theme',
		darkClassName: 'wpinlexa-dark-theme',
	} );

	injectGlobal( cssColorVariables );
	injectGlobal( `body { color: ${ colors.body.foreground };` );
	document.body.classList.add( 'wpinlexa-light-theme' );
	document.body.dataset.disableInlexaChecker = 'true';

	dispatch( STORE ).init( args );
	dispatch( STORE ).check();

	registerPlugin( 'inlexa', {
		icon: <InlexaIcon className={ css( { fontSize: '24px' } ) } />,
		render: Sidebar,
	} );
} //end init()
( window as any ).inlexaInit = init;
