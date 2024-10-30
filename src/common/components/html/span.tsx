import * as React from 'react';

import { cx, css } from '@neliosoft/inlexa/css';
import { fonts } from '@neliosoft/inlexa/theme';

const STYLE = css( {
	boxSizing: 'content-box',
	display: 'inline',
	float: 'none',
	fontFamily: fonts.default.family,
	fontSize: fonts.default.size,
	lineHeight: 'normal',
	position: 'static',
	zIndex: 'auto',
} );

export type SpanProps = React.DetailedHTMLProps<
	React.HTMLAttributes< HTMLSpanElement >,
	HTMLSpanElement
>;

export const Span = ( {
	children,
	className,
	...props
}: SpanProps ): JSX.Element =>
	React.createElement(
		'inlexa-span',
		{ class: cx( STYLE, className ), ...props },
		children
	);
