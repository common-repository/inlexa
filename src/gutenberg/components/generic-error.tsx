import * as React from '@wordpress/element';
import { useSelect } from '@wordpress/data';

import { StatusGraphic } from '@neliosoft/inlexa/components';
import { css } from '@neliosoft/inlexa/css';

import { STORE } from '@wpinlexa/gutenberg/data';

export const GenericError = () => {
	const errorMessage = useErrorMessage();
	return (
		<div className={ WRAPPER }>
			<StatusGraphic className={ ICON } type="error" />
			<p>{ errorMessage }</p>
		</div>
	);
};

// =======
// HELPERS
// =======

const useErrorMessage = () =>
	useSelect( ( select ) => select( STORE ).getErrorMessage() );

const WRAPPER = css( {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
} );

const ICON = css( { opacity: 0.8 } );
