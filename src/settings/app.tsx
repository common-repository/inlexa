import * as React from '@wordpress/element';
import { useSelect } from '@wordpress/data';

import { WrapperWithLogo } from '@neliosoft/inlexa/components';
import { css } from '@neliosoft/inlexa/css';
import { colors, shadows } from '@neliosoft/inlexa/theme';

import { Loading } from './screens/loading';
import { Login } from './screens/login';
import { Logout } from './screens/logout';
import { Ready } from './screens/ready';
import { STORE } from './data';

export const App = () => {
	const Screen = useScreen();
	return (
		<WrapperWithLogo className={ WRAPPER_STYLE }>
			<Screen />
		</WrapperWithLogo>
	);
};

// HELPERS

const useScreen = (): ( () => JSX.Element ) =>
	useSelect( ( select ) => {
		const status = select( STORE ).getStatus();
		switch ( status ) {
			case 'checking':
				return Loading;

			case 'login':
				return Login;

			case 'ready':
				return Ready;

			case 'logout':
				return Logout;
		} //end switch
	} );

// STYLES

const MAX_WIDTH = 36;

const WRAPPER_STYLE = css( {
	background: colors.app.background,
	borderRadius: '2px',
	boxShadow: shadows.regular,
	margin: '2em auto 0',
	maxWidth: `${ MAX_WIDTH }em`,
	padding: '1em 2em 2em',
} );
