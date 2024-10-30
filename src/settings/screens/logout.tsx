import * as React from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

import { Logout as LogoutForm } from '@neliosoft/inlexa/components';

import { STORE } from '@wpinlexa/settings/data';

export const Logout = () => {
	const isLoggingOut = useSelect( ( select ) =>
		select( STORE ).isLoggingOut()
	);
	const { cancelLogout, logout } = useDispatch( STORE );

	return (
		<LogoutForm
			isLoggingOut={ isLoggingOut }
			logout={ logout }
			cancelLogout={ cancelLogout }
		/>
	);
};
