import * as React from 'react';
import { noop } from 'lodash';

import { css, cx } from '@neliosoft/inlexa/css';
import { colors } from '@neliosoft/inlexa/theme';

import { Button } from '../html';

export type ReplacementProps = {
	readonly value: string;
	readonly isLocked?: boolean;
	readonly onApply?: ( replacement: string ) => void;
};

const STYLE = css( {
	backgroundColor: colors.analysis.fix.background,
	borderColor: colors.analysis.fix.background,
	borderRadius: '0.3em',
	color: colors.analysis.fix.foreground,
	cursor: 'pointer',
	margin: '0.15em',
	padding: '0.2em 0.5em',
	textDecoration: 'none',
	'&:hover, &:active': {
		backgroundColor: colors.analysis.fix.background,
		borderColor: colors.analysis.fix.background,
		color: colors.analysis.fix.foreground,
		filter: 'brightness(1.2)',
	},
	'&:hover[aria-disabled], &:active[aria-disabled], &[aria-disabled]': {
		backgroundColor: colors.analysis.fix.background,
		borderColor: colors.analysis.fix.background,
		color: colors.analysis.fix.foreground,
		cursor: 'default',
		filter: 'none',
	},
} );

const UNAPPLICABLE_STYLE = css( {
	'&, &:hover[aria-disabled], &:active[aria-disabled], &[aria-disabled]': {
		backgroundColor: colors.buttons.secondary.base.background,
		border: 'none',
		color: colors.buttons.secondary.base.foreground,
	},
} );

export const Replacement = ( {
	value,
	isLocked,
	onApply = noop,
}: ReplacementProps ): JSX.Element => (
	<Button
		className={ cx( STYLE, onApply === noop && UNAPPLICABLE_STYLE ) }
		disabled={ isLocked || onApply === noop }
		onClick={ ( ev ) => {
			// NOTE. With stopPropagation, global trackers won't work!
			ev.stopPropagation();
			onApply( value );
		} }
	>
		{ value }
	</Button>
);
