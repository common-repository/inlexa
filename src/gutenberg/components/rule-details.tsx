import * as React from '@wordpress/element';
import { Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';

import { RuleDetails as View } from '@neliosoft/inlexa/components';
import { _x } from '@neliosoft/inlexa/i18n';
import { css } from '@neliosoft/inlexa/css';

import { STORE } from '@wpinlexa/gutenberg/data';

export const RuleDetails = () => {
	const rule = useSelect( ( select ) => select( STORE ).getActiveRule() );
	const { closeRuleDetails } = useDispatch( STORE );

	if ( ! rule ) {
		return null;
	} //end if

	return (
		<div>
			<div className={ BUTTON_WRAPPER }>
				<Button isTertiary onClick={ closeRuleDetails }>
					{ _x( 'Back to Issues', 'command', 'inlexa' ) }
				</Button>
			</div>
			<View rule={ rule } />
		</div>
	);
};

const BUTTON_WRAPPER = css( {
	marginBottom: '1em',
	textAlign: 'right',
} );
