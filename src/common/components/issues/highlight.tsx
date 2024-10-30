import * as React from 'react';

import { css, cx } from '@neliosoft/inlexa/css';
import type { Issue as IssueType } from '@neliosoft/inlexa/types';
import { colors } from '@neliosoft/inlexa/theme';

import { Div, Span } from '../html';

export type HighlightProps = {
	readonly context: IssueType[ 'context' ];
	readonly isError?: boolean;
};

const BLOCK_STYLE = css( {
	marginBottom: '1em',
	userSelect: 'none',
} );

const ISSUE_STYLE = css( {
	background: colors.analysis.suggestion.highlight,
	borderBottom: `2px solid ${ colors.analysis.suggestion.underline }`,
	fontWeight: 'bold',
} );

const ERROR_STYLE = css( {
	background: colors.analysis.error.highlight,
	borderBottom: `2px solid ${ colors.analysis.error.underline }`,
} );

export const Highlight = ( {
	context,
	isError,
}: HighlightProps ): JSX.Element => (
	<Div className={ BLOCK_STYLE }>
		{ context.before }
		<Span className={ cx( ISSUE_STYLE, isError ? ERROR_STYLE : '' ) }>
			{ context.match }
		</Span>
		{ context.after }
	</Div>
);
