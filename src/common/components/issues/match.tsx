import * as React from 'react';
import { trim } from 'lodash';

import { css } from '@neliosoft/inlexa/css';
import { colors } from '@neliosoft/inlexa/theme';
import type {
	Match as MatchType,
	Rule as RuleType,
} from '@neliosoft/inlexa/types';

import { Replacement, ReplacementProps } from './replacement';
import { Div, Span } from '../html';
import { _x } from '@neliosoft/inlexa/i18n';

export type MatchProps = {
	readonly match: MatchType;
	readonly isLocked?: boolean;
	readonly onFix?: ReplacementProps[ 'onApply' ];
	readonly onRuleView?: ( rule: RuleType ) => void;
};

const MATCH_STYLE = css( {
	borderTop: `1px solid ${ colors.app.border }`,
	marginTop: '1em',
	paddingTop: '1em',
} );

const REPLACEMENTS_STYLE = css( {
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
} );

const RULE_DESCRIPTION_STYLE = css( {
	fontStyle: 'italic',
	marginBottom: '10px',
} );

const MORE_INFO_LINK = css( {
	color: colors.app.link.base,
	cursor: 'pointer',
	'&:hover': {
		color: colors.app.link.hover,
	},
} );

export const Match = ( {
	match: { rule, replacements },
	isLocked,
	onFix,
	onRuleView,
}: MatchProps ): JSX.Element => (
	<Div className={ MATCH_STYLE }>
		<Div className={ RULE_DESCRIPTION_STYLE }>
			<Span>{ rule.summary + ' ' }</Span>
			{ !! onRuleView && canViewRuleDetails( rule ) && (
				<Span
					className={ MORE_INFO_LINK }
					tabIndex={ 0 }
					onClick={ () => onRuleView( rule ) }
				>
					{ _x( '[more info]', 'text', 'inlexa' ) }
				</Span>
			) }
		</Div>

		<Div className={ REPLACEMENTS_STYLE }>
			{ replacements.map( ( replacement ) => (
				<Replacement
					key={ `replacement-${ replacement
						.toLowerCase()
						.replace( /\s+/, '-' ) }` }
					value={ replacement }
					isLocked={ isLocked }
					onApply={ onFix }
				/>
			) ) }
		</Div>
	</Div>
);

// =========
//  HELPERS
// =========

const canViewRuleDetails = ( rule: RuleType ): boolean =>
	!! trim( rule.name ) && !! trim( rule.description );
