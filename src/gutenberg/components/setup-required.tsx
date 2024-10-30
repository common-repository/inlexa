import * as React from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import interpolateComponents from 'interpolate-components';

import { _x } from '@neliosoft/inlexa/i18n';

import { STORE } from '@wpinlexa/gutenberg/data';

export const SetupRequired = () => {
	const isAdminUser = useSelect( ( select ) =>
		select( STORE ).isAdminUser()
	);
	const url = useSelect( ( select ) => select( STORE ).getSettingsUrl() );

	return isAdminUser ? <AdminUser url={ url } /> : <RegularUser />;
};

// =======
// HELPERS
// =======

const AdminUser = ( { url }: { url: string } ) => (
	<div>
		{ interpolateComponents( {
			mixedString: _x(
				'Welcome to Inlexa, an inclusivity analysis plugin for WordPress. In order to use it and improve the quality of your content, you need to {{a}}login first{{/a}} and then reload the editor.',
				'user',
				'inlexa'
			),
			components: { a: <a href={ url } target="_blank" /> },
		} ) }
	</div>
);

const RegularUser = () => (
	<div>
		{ interpolateComponents( {
			mixedString: _x(
				'Welcome to Inlexa, an inclusivity analysis plugin for WordPress. In order to use it and improve the quality of your content, your site administrator has to fully enable it. Please ask them to go to {{em}}Settings » Inlexa Account{{/em}} in the WordPress Dashboard and follow the steps there.',
				'user',
				'inlexa'
			),
			components: { em: <em /> },
		} ) }
	</div>
);
