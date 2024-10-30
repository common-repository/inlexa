import * as React from 'react';
import { noop } from 'lodash';

import { cx, css } from '@neliosoft/inlexa/css';
import { colors } from '@neliosoft/inlexa/theme';

import { Span } from '../html';

type ToggleControlProps = {
	readonly className?: string;
	readonly label?: string;
	readonly checked?: boolean;
	readonly disabled?: boolean;
	readonly onChange?: ( checked: boolean ) => void;
};

// Sizes

const TOGGLE_HEIGHT = 18;
const TOGGLE_WIDTH = 32;
const TOGGLE_BORDER = 2;
const THUMB_SIZE = TOGGLE_HEIGHT - TOGGLE_BORDER * 6;

export const ToggleControl = ( {
	className,
	checked,
	disabled,
	label = '',
	onChange = noop,
}: ToggleControlProps ): JSX.Element => (
	<Span className={ cx( WRAPPER_STYLE, className ) }>
		<Span>
			<Span className={ INPUT_WRAPPER_STYLE }>
				{ /* eslint-disable-next-line react/forbid-elements */ }
				<input
					type="checkbox"
					className={ INPUT_STYLE }
					checked={ checked }
					disabled={ disabled }
					onChange={ ( ev ) => onChange( ev.target.checked ) }
				/>
				<Span
					className={ cx(
						TRACK_STYLE,
						checked && CHECKED_TRACK_STYLE,
						disabled && DISABLED_OPACITY
					) }
				/>
				<Span
					className={ cx(
						THUMB_STYLE,
						checked && CHECKED_THUMB_STYLE,
						disabled && DISABLED_OPACITY
					) }
				/>
			</Span>
		</Span>
		{ !! label && (
			<Span className={ cx( LABEL_STYLE, disabled && DISABLED_OPACITY ) }>
				{ label }
			</Span>
		) }
	</Span>
);

// ========
//  STYLES
// ========

const WRAPPER_STYLE = css( {
	display: 'flex',
	flexDirection: 'row',
} );

const INPUT_WRAPPER_STYLE = css( {
	display: 'inline-block',
	marginTop: '0.1em',
	position: 'relative',
} );

const INPUT_STYLE = css( {
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	opacity: 0,
	margin: 0,
	padding: 0,
} );

const TRACK_STYLE = css( {
	backgroundColor: 'transparent',
	border: `${ TOGGLE_BORDER }px solid ${ colors.toggle.disabled }`,
	borderRadius: `${ TOGGLE_HEIGHT * 0.5 }px`,
	boxSizing: 'border-box',
	content: '""',
	display: 'inline-block',
	height: `${ TOGGLE_HEIGHT }px`,
	transition: '200ms background ease, 200ms border ease',
	verticalAlign: 'top',
	width: `${ TOGGLE_WIDTH }px`,

	'input:focus + &': {
		boxShadow: `0 0 0 2px ${ colors.toggle.outline }`,
	},
} );

const CHECKED_TRACK_STYLE = css( {
	backgroundColor: colors.toggle.enabled.background,
	borderColor: colors.toggle.enabled.background,
} );

const THUMB_STYLE = css( {
	backgroundColor: colors.toggle.disabled,
	border: `5px solid ${ colors.toggle.disabled }`,
	borderRadius: '50%',
	boxSizing: 'border-box',
	display: 'block',
	height: `${ THUMB_SIZE }px`,
	left: `${ TOGGLE_BORDER * 2 }px`,
	pointerEvents: 'none',
	position: 'absolute',
	top: `${ TOGGLE_BORDER * 2 }px`,
	transition: '100ms all ease',
	width: `${ THUMB_SIZE }px`,
} );

const CHECKED_THUMB_STYLE = css( {
	backgroundColor: colors.toggle.enabled.foreground,
	borderColor: colors.toggle.enabled.foreground,
	left: `${ TOGGLE_WIDTH - TOGGLE_BORDER * 4 - THUMB_SIZE }px`,
} );

const LABEL_STYLE = css( {
	marginLeft: '0.5em',
} );

const DISABLED_OPACITY = css( {
	opacity: 0.7,
} );
