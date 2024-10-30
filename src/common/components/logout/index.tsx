import * as React from 'react';
import { noop } from 'lodash';

import { css } from '@neliosoft/inlexa/css';
import { _x } from '@neliosoft/inlexa/i18n';

import { Button, Div } from '../html';

export type LogoutProps = {
	readonly className?: string;
	readonly isLoggingOut: boolean;
	readonly logout: () => void;
	readonly cancelLogout: () => void;
};

const STYLE = css( {
	alignItems: 'center',
	display: 'flex',
	flexDirection: 'column',
} );

const BUTTONS_STYLE = css( {
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'center',
	margin: '1em auto',
} );

const BUTTON_STYLE = css( {
	margin: '0 0.2em',
} );

export const Logout = ( {
	className,
	isLoggingOut,
	logout = noop,
	cancelLogout = noop,
}: LogoutProps ): JSX.Element => (
	<Div className={ className }>
		<Div className={ STYLE }>
			<Div>
				{ _x( 'Do you really want to log out?', 'user', 'inlexa' ) }
			</Div>
			<Div className={ BUTTONS_STYLE }>
				<Button
					className={ BUTTON_STYLE }
					disabled={ isLoggingOut }
					onClick={ cancelLogout }
				>
					{ _x( 'Cancel', 'command', 'inlexa' ) }
				</Button>
				<Button
					isPrimary
					className={ BUTTON_STYLE }
					disabled={ isLoggingOut }
					onClick={ logout }
				>
					{ isLoggingOut
						? _x( 'Logging Out…', 'text', 'inlexa' )
						: _x( 'Logout', 'command', 'inlexa' ) }
				</Button>
			</Div>
		</Div>
	</Div>
);
