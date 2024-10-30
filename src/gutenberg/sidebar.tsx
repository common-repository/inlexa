import * as React from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { PluginSidebar } from '@wordpress/edit-post';

import { css } from '@neliosoft/inlexa/css';

import {
	GenericError,
	Loading,
	Main,
	RuleDetails,
	SetupRequired,
} from './components';

import { STORE } from './data';

export const Sidebar = () => {
	const Component = useSidebarComponent();
	return (
		<PluginSidebar name="inlexa-sidebar" title="Inlexa">
			<div id="inlexa-container" className={ css( { padding: '1em' } ) }>
				<Component />
			</div>
		</PluginSidebar>
	);
};

// =======
// HELPERS
// =======

const useSidebarComponent = () => {
	const status = useSelect( ( select ) => select( STORE ).getStatus() );
	const isLoadingFirstIssues = useSelect( ( select ) =>
		select( STORE ).isLoadingFirstIssues()
	);
	const rule = useSelect( ( select ) => select( STORE ).getActiveRule() );

	switch ( status ) {
		case 'initial':
		case 'checking':
			return Loading;

		case 'setup-required':
			return SetupRequired;

		case 'ready':
			if ( isLoadingFirstIssues ) {
				return Loading;
			} //end if

			if ( rule ) {
				return RuleDetails;
			} //end if

			return Main;

		case 'analysis-error':
			return GenericError;
	} //end switch
};
