import * as React from '@wordpress/element';

import { Spinner } from '@neliosoft/inlexa/components';
import { css } from '@neliosoft/inlexa/css';
import { _x } from '@neliosoft/inlexa/i18n';

export const Loading = () => (
	<div className={ WRAPPER }>
		<Spinner className={ SPINNER } active />
		<div>{ _x( 'Loading…', 'text', 'inlexa' ) }</div>
	</div>
);

// STYLES

const WRAPPER = css( {
	alignItems: 'center',
	display: 'flex',
	flexDirection: 'row',
	height: '6em',
	justifyContent: 'center',
	opacity: 0.6,
} );

const SPINNER = css( {
	marginRight: '0.5em',
} );
