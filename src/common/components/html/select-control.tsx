import * as React from 'react';

import { cx, css } from '@neliosoft/inlexa/css';
import { colors, fonts } from '@neliosoft/inlexa/theme';

const STYLE = css( {
	background: colors.buttons.secondary.base.background,
	border: '1px solid transparent',
	borderRadius: '3px',
	boxSizing: 'border-box',
	color: colors.buttons.secondary.base.foreground,
	cursor: 'default',
	display: 'inline-block',
	float: 'none',
	fontFamily: fonts.default.family,
	fontSize: fonts.default.size,
	inlineSize: 'max-content',
	lineHeight: 'normal',
	padding: '0.5em 0.8em',
	position: 'static',
	userSelect: 'none',
	zIndex: 'auto',
} );

// TODO. Improve typing.
export type SelectControlProps = {
	readonly className?: string;
	readonly placeholder?: string;
	readonly options: Record< string, string >;
	readonly value?: string;
	readonly disabled?: boolean;
	readonly onChange: ( value: string ) => void;
	readonly children?: never;
};

// NOTE. Simulate click event on key press using useRef?
export const SelectControl = ( {
	className,
	placeholder,
	options,
	disabled,
	value,
	onChange,
}: SelectControlProps ): JSX.Element => (
	<select
		className={ cx( STYLE, className ) }
		disabled={ disabled }
		value={ value }
		onChange={ ( ev ) => onChange( ev.target.value ) }
	>
		{ !! placeholder && (
			<option
				hidden
				disabled
				selected={ ! Object.keys( options ).includes( value ?? '' ) }
				value="__no-option__"
			>
				{ placeholder }
			</option>
		) }
		{ Object.keys( options ).map( ( key ) => (
			<option key={ key } value={ key } selected={ key === value }>
				{ options[ key ] }
			</option>
		) ) }
	</select>
);
