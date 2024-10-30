import * as React from '@wordpress/element';

import { StatusGraphic } from '@neliosoft/inlexa/components';
import { css } from '@neliosoft/inlexa/css';
import { _x } from '@neliosoft/inlexa/i18n';

import { LanguageSelector } from './language-selector';

export const Empty = () => (
	<div className={ WRAPPER }>
		<div className={ ICON }>
			<StatusGraphic />
		</div>
		<div className={ TEXT }>
			{ _x( 'Everything looks fine', 'text', 'inlexa' ) }
		</div>
		<LanguageSelector />
	</div>
);

// =======
// STYLES
// =======

const WRAPPER = css( {
	display: 'flex',
	flexDirection: 'column',
	marginTop: '2em',
} );

const ICON = css( {
	opacity: 0.6,
	textAlign: 'center',
} );

const TEXT = css( {
	fontSize: '1.2em',
	opacity: 0.8,
	textAlign: 'center',
} );
