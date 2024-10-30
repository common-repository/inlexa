import * as React from 'react';

import { css, cx } from '@neliosoft/inlexa/css';
import { colors } from '@neliosoft/inlexa/theme';
import type { Language } from '@neliosoft/inlexa/types';

import { FLAGS } from './flags';
import { LABELS } from './labels';
import { Overlay, OverlayProps } from './overlay';

import { Button, Span } from '../html';

export type LanguageSelectorProps = {
	readonly className?: string;
	readonly language: Language;
	readonly position: OverlayProps[ 'position' ];
	readonly onLanguageChange: ( language: Language ) => void;
};

const BUTTON_STYLE = css( {
	alignItems: 'center',
	background: colors.buttons.transparent.base.background,
	borderColor: colors.buttons.transparent.base.border,
	borderRadius: '100%',
	color: colors.buttons.transparent.base.foreground,
	display: 'flex',
	height: '1.6em',
	justifyContent: 'center',
	overflow: 'hidden',
	transition: 'all 150ms ease-in-out',
	padding: 0,
	width: '1.6em',
	'&:hover': {
		background: colors.buttons.transparent.hover.background,
		borderColor: colors.buttons.transparent.hover.border,
		color: colors.buttons.transparent.hover.foreground,
	},
	'&:active': {
		background: colors.buttons.transparent.active.background,
		borderColor: colors.buttons.transparent.active.border,
		color: colors.buttons.transparent.active.foreground,
	},
	'&:hover[aria-disabled],&:active[aria-disabled],&[aria-disabled]': {
		background: colors.buttons.transparent.disabled.background,
		borderColor: colors.buttons.transparent.disabled.border,
		color: colors.buttons.transparent.disabled.foreground,
	},
} );

export const LanguageSelector = ( {
	className,
	language,
	position,
	onLanguageChange,
}: LanguageSelectorProps ): JSX.Element => {
	const [ isVisible, setVisibility ] = React.useState( false );
	const changeLanguage = ( newLanguage: Language ) => {
		setVisibility( false );
		onLanguageChange( newLanguage );
	};

	const Flag = FLAGS[ language ];

	return (
		<Span className={ css( { position: 'relative' } ) }>
			<Button
				title={ LABELS[ language ] }
				className={ cx( BUTTON_STYLE, className ) }
				onClick={ () => setVisibility( true ) }
			>
				<Flag />
			</Button>

			{ isVisible && (
				<Overlay
					position={ position }
					language={ language }
					onLanguageChange={ changeLanguage }
					close={ () => setVisibility( false ) }
				/>
			) }
		</Span>
	);
};
