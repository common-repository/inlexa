import * as React from 'react';
import { noop } from 'lodash';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import { css } from '@neliosoft/inlexa/css';
import { colors, shadows } from '@neliosoft/inlexa/theme';
import {
	Issue as IssueType,
	Match as MatchType,
	Rule as RuleType,
} from '@neliosoft/inlexa/types';

import { Highlight } from './highlight';
import { Match } from './match';
import { IconButton } from '../generic';
import { Div } from '../html';

export type IssueProps = {
	readonly issue: IssueType;
	readonly isLocked?: boolean;
	readonly onFocus?: () => void;
	readonly onFix?: ( match: MatchType, replacement: string ) => void;
	readonly onRemove: () => void;
	readonly onRuleView?: ( rule: RuleType ) => void;
};

const STYLE = css( {
	color: colors.app.foreground,
	backgroundColor: colors.app.background,
	border: 'none',
	borderRadius: '3px',
	boxShadow: shadows.regular,
	marginBottom: '1em',
	padding: '1em',
	transition: 'box-shadow 200ms ease-in-out',
	'&:hover': {
		boxShadow: shadows.hover,
	},
} );

const CLOSE_BUTTON_STYLE = css( {
	float: 'right',
	margin: '-5px -5px 5px 5px',
} );

export const Issue = ( {
	issue: { context, matches },
	isLocked,
	onFocus = noop,
	onFix,
	onRemove,
	onRuleView,
}: IssueProps ): JSX.Element => (
	<Div className={ STYLE } onClick={ () => ! isLocked && onFocus() }>
		<IconButton
			className={ CLOSE_BUTTON_STYLE }
			icon={ faTrashAlt }
			disabled={ isLocked }
			onClick={ ( ev ) => {
				// NOTE. With stopPropagation, global trackers won't work!
				ev.stopPropagation();
				onRemove();
			} }
		/>

		<Highlight context={ context } />

		{ matches.map( ( match ) => (
			<Match
				key={ `match-${ match.rule.id }-${ match.offset }-${ match.length }` }
				match={ match }
				onFix={
					onFix
						? ( replacement: string ) => onFix( match, replacement )
						: undefined
				}
				isLocked={ isLocked }
				onRuleView={ onRuleView }
			/>
		) ) }
	</Div>
);
