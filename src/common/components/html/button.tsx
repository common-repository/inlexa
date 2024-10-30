import * as React from 'react';
import { noop } from 'lodash';

import { cx, css } from '@neliosoft/inlexa/css';
import { colors, fonts } from '@neliosoft/inlexa/theme';

const STYLE = css( {
	border: '1px solid transparent',
	borderRadius: '3px',
	boxSizing: 'border-box',
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

const PRIMARY_STYLE = generateButtonColors( colors.buttons.primary );
const SECONDARY_STYLE = generateButtonColors( colors.buttons.secondary );

export type ButtonProps = SpanProps & {
	readonly isPrimary?: boolean;
	readonly disabled?: boolean;
	readonly onClick: ( ev: ClickEvent ) => void;
};

type ClickEvent =
	| React.MouseEvent< HTMLSpanElement, ClickEvent >
	| React.KeyboardEvent< HTMLSpanElement >;

type SpanProps = Omit<
	React.DetailedHTMLProps<
		React.HTMLAttributes< HTMLSpanElement >,
		HTMLSpanElement
	>,
	| 'onKeyDown'
	| 'onKeyUp'
	| 'onKeyPressCapture'
	| 'onKeyDownCapture'
	| 'onKeyUpCapture'
	| 'onClick'
>;

// NOTE. Simulate click event on key press using useRef?
export const Button = ( {
	children,
	className,
	title,
	isPrimary,
	disabled,
	onClick,
	...props
}: ButtonProps ): JSX.Element => {
	return React.createElement(
		'inlexa-button',
		{
			...props,
			class: cx(
				STYLE,
				isPrimary ? PRIMARY_STYLE : SECONDARY_STYLE,
				className
			),
			title,
			onClick: disabled ? noop : onClick,
			onKeyUp: disabled ? noop : makeKeyListener( onClick ),
			tabIndex: disabled ? undefined : 0,
			'aria-disabled': disabled ? true : undefined,
		},
		children
	);
};

// ===============
//   HELPERS
// ===============

const makeKeyListener = ( onClick: ButtonProps[ 'onClick' ] ) => (
	ev: React.KeyboardEvent< HTMLSpanElement >
): void => {
	if ( ev.key === 'Enter' || ev.key === ' ' ) {
		ev.preventDefault();
		onClick( ev );
	} //end if
};

function generateButtonColors(
	palette: typeof colors.buttons.primary
): string {
	return css( {
		background: palette.base.background,
		borderColor: palette.base.border,
		color: palette.base.foreground,

		'&:hover': {
			background: palette.hover.background,
			borderColor: palette.hover.border,
			color: palette.hover.foreground,
		},

		'&:active': {
			background: palette.active.background,
			borderColor: palette.active.border,
			color: palette.active.foreground,
		},

		'&:focus': {
			outline: 'none',
			boxShadow: `0 0 0 2px ${ palette.base.outline }`,
		},

		'&:hover[aria-disabled], &:active[aria-disabled], &[aria-disabled]': {
			background: palette.disabled.background,
			borderColor: palette.disabled.border,
			color: palette.disabled.foreground,
		},
	} );
} // end generateButtonColors()
