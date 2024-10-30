import * as React from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

import { Issue as IssueView } from '@neliosoft/inlexa/components';
import { css } from '@neliosoft/inlexa/css';
import type { Issue } from '@neliosoft/inlexa/types';

import { STORE } from '@wpinlexa/gutenberg/data';

import { LanguageSelector } from './language-selector';

type IssuesProps = {
	readonly issues: ReadonlyArray< Issue >;
};

export const Issues = ( { issues }: IssuesProps ) => {
	const dirtyIssues = useDirtyIssues();
	const {
		onIssueFocus,
		onIssueRemove,
		onIssueFix,
		viewRuleDetails,
	} = useDispatch( STORE );

	return (
		<div>
			{ issues.map( ( issue ) => {
				const isDirty = dirtyIssues.includes( issue );
				const className = isDirty ? DISABLED_ISSUE : '';
				return (
					<div key={ issue.id } className={ className }>
						<IssueView
							issue={ issue }
							isLocked={ isDirty }
							onFocus={ () => onIssueFocus( issue ) }
							onRemove={ () => onIssueRemove( issue ) }
							onFix={ ( m, r ) => onIssueFix( issue, m, r ) }
							onRuleView={ viewRuleDetails }
						/>
					</div>
				);
			} ) }
			<LanguageSelector />
		</div>
	);
};

// =======
// HELPERS
// =======

const useDirtyIssues = () =>
	useSelect( ( select ) => select( STORE ).getDirtyIssues() );

// =======
// STYLES
// =======

const DISABLED_ISSUE = css( {
	opacity: 0.5,
	filter: 'saturate(0)',
} );
