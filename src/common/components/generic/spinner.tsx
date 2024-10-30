import * as React from 'react';

import { css, keyframes } from '@neliosoft/inlexa/css';

import { CustomIcon } from './custom-icon';
import { Span } from '../html';

const SPIN_KEYFRAMES = keyframes`
    from { transform: rotate(0deg); }
    to   { transform: rotate(359deg); }
`;
const SPIN_STYLE = css( {
	animation: `${ SPIN_KEYFRAMES } 2s linear infinite`,
} );
const PATH =
	'M456.433 371.72l-27.79-16.045c-7.192-4.152-10.052-13.136-6.487-20.636 25.82-54.328 23.566-118.602-6.768-171.03-30.265-52.529-84.802-86.621-144.76-91.424C262.35 71.922 256 64.953 256 56.649V24.56c0-9.31 7.916-16.609 17.204-15.96 81.795 5.717 156.412 51.902 197.611 123.408 41.301 71.385 43.99 159.096 8.042 232.792-4.082 8.369-14.361 11.575-22.424 6.92z';

type SpinnerProps = {
	readonly className?: string;
	readonly active: boolean;
};

export const Spinner = ( {
	active,
	className,
}: SpinnerProps ): JSX.Element | null =>
	active ? (
		<Span className={ className }>
			<CustomIcon className={ SPIN_STYLE } path={ PATH } />
		</Span>
	) : null;
