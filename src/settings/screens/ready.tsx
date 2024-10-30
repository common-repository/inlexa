import * as React from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

import { Button } from '@neliosoft/inlexa/components';
import { css } from '@neliosoft/inlexa/css';
import { _x } from '@neliosoft/inlexa/i18n';
import { colors } from '@neliosoft/inlexa/theme';

import { STORE } from '@wpinlexa/settings/data';

export const Ready = () => {
	const token = useToken();
	const { requestLogout } = useDispatch( STORE );

	return (
		<>
			<div className={ css( { margin: '1em 0' } ) }>
				{ _x(
					'You’re currently logged in using the following Access Token:',
					'user',
					'inlexa'
				) }
			</div>

			<div className={ TOKEN }>{ token }</div>

			<div className={ css( { margin: '1em 0' } ) }>
				{ _x(
					'If you want to use a different Access Token, please logout first:',
					'user (access token)',
					'inlexa'
				) }
			</div>

			<div className={ css( { textAlign: 'center' } ) }>
				<Button isPrimary onClick={ requestLogout }>
					{ _x( 'Logout', 'command', 'inlexa' ) }
				</Button>
			</div>
		</>
	);
};

// =======
// HELPERS
// =======

const useToken = () => useSelect( ( select ) => select( STORE ).getToken() );

const TOKEN = css( {
	background: colors.body.foreground,
	borderRadius: '4px',
	color: colors.body.background,
	display: 'inline-block',
	fontFamily: 'monospace',
	padding: '5px 8px',
} );
