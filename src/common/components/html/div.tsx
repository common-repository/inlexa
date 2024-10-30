import * as React from 'react';

import { cx, css } from '@neliosoft/inlexa/css';
import { colors, fonts } from '@neliosoft/inlexa/theme';

const STYLE = css( {
	boxSizing: 'content-box',
	display: 'block',
	fontFamily: fonts.default.family,
	fontSize: fonts.default.size,
	float: 'none',
	lineHeight: 'normal',
	position: 'static',
	zIndex: 'auto',

	'& a': { color: colors.buttons.primary.base.background },
	'& a:hover': { color: colors.buttons.primary.hover.background },
} );

export type DivProps = React.DetailedHTMLProps<
	React.HTMLAttributes< HTMLDivElement >,
	HTMLDivElement
>;

export const Div = ( {
	children,
	className,
	...props
}: DivProps ): JSX.Element =>
	React.createElement(
		'inlexa-div',
		{ class: cx( STYLE, className ), ...props },
		children
	);
