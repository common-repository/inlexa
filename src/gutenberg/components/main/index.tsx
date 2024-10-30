import * as React from '@wordpress/element';
import { useSelect } from '@wordpress/data';

import { STORE } from '@wpinlexa/gutenberg/data';

import { Empty } from './empty';
import { Issues } from './issues';

export const Main = () => {
	const issues = useIssues();
	return issues.length ? <Issues issues={ issues } /> : <Empty />;
};

// =======
// HELPERS
// =======

const useIssues = () => useSelect( ( select ) => select( STORE ).getIssues() );
