import * as React from 'react';
import { noop } from 'lodash';

import { cx, css } from '@neliosoft/inlexa/css';
import { colors, fonts } from '@neliosoft/inlexa/theme';

const STYLE = css( {
	background: colors.app.background,
	border: `1px solid ${ colors.app.border }`,
	borderRadius: '3px',
	boxSizing: 'border-box',
	color: colors.app.foreground,
	cursor: 'default',
	display: 'inline-block',
	float: 'none',
	fontFamily: fonts.default.family,
	fontSize: fonts.default.size,
	padding: '0.5em 0.8em',
	lineHeight: 'normal',
	position: 'static',
	zIndex: 'auto',

	'&:focus': {
		outline: 'none',
		boxShadow: `0 0 0 2px ${ colors.app.outline }`,
	},

	'&[disabled]': {
		background: colors.buttons.secondary.disabled.background,
		borderColor: colors.buttons.secondary.disabled.border,
		color: colors.buttons.secondary.disabled.foreground,
	},
} );

type TextControlProps = {
	readonly className?: string;
	readonly value?: string;
	readonly disabled?: boolean;
	readonly placeholder?: string;
	readonly onChange?: ( text: string ) => void;
};

export const TextControl = ( {
	className,
	value,
	disabled,
	placeholder,
	onChange = noop,
}: TextControlProps ): JSX.Element => (
	/* eslint-disable-next-line react/forbid-elements */
	<input
		className={ cx( STYLE, className ) }
		value={ value }
		disabled={ disabled }
		placeholder={ placeholder }
		onChange={ ( ev ) => onChange( ev.target.value ) }
	/>
);
