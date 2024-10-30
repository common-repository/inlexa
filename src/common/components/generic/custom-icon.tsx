import React from 'react';
import { css, cx } from '@neliosoft/inlexa/css';

export type CustomIconProps = {
	readonly className?: string;
	readonly path: string;
};

const DEFAULT_SIZE = css( { width: '1em', height: '1em' } );

export const CustomIcon = ( {
	className,
	path,
}: CustomIconProps ): JSX.Element => (
	<svg
		className={ cx( className, DEFAULT_SIZE ) }
		aria-hidden="true"
		focusable="false"
		role="img"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
	>
		<path fill="currentColor" d={ path } />
	</svg>
);
