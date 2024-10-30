import * as React from 'react';

import { css, cx } from '@neliosoft/inlexa/css';

import { FullLogo } from '../generic';
import { Div } from '../html';

export type WrapperWithLogoProps = {
	readonly className?: string;
	readonly children?: JSX.Element | ReadonlyArray< JSX.Element >;
	readonly hideLogo?: boolean;
};

const STYLE = css( {
	padding: '1em',
} );

const LOGO_STYLE = css( {
	display: 'block',
	margin: '0 auto 1em',
	maxWidth: '16em',
	width: '100%',
} );

export const WrapperWithLogo = ( {
	className,
	children,
	hideLogo,
}: WrapperWithLogoProps ): JSX.Element => (
	<Div className={ cx( STYLE, className ) }>
		{ ! hideLogo && <FullLogo className={ LOGO_STYLE } /> }
		{ !! children && <Div>{ children }</Div> }
	</Div>
);
