import * as React from 'react';

import { css, cx } from '@neliosoft/inlexa/css';
import { colors, shadows } from '@neliosoft/inlexa/theme';
import type { Language } from '@neliosoft/inlexa/types';

import { LABELS } from './labels';
import { Button, Div } from '../html';

export type OverlayProps = {
	readonly language: Language;
	readonly onLanguageChange: ( language: Language ) => void;
	readonly close: () => void;
	readonly position: VerticalPosition & HorizontalPosition;
};

type VerticalPosition =
	| { readonly bottom: string | number }
	| { readonly top: string | number };

type HorizontalPosition =
	| { readonly left: string | number }
	| { readonly right: string | number };

const OVERLAY_STYLE = css( {
	background: 'transparent',
	boxSizing: 'border-box',
	height: '100vh',
	left: 0,
	position: 'fixed',
	top: 0,
	width: '100vw',
	zIndex: 1,
} );

const FLOATING_MENU_STYLE = css( {
	background: colors.app.background,
	borderRadius: '2px',
	boxShadow: shadows.regular,
	display: 'flex',
	flexDirection: 'column',
	gap: '0.5em',
	justifyContent: 'flex-end',
	padding: '0.5em',
	position: 'absolute',
	zIndex: 2,
} );

const ITEM_STYLE = css( {
	backgroundColor: 'transparent',
	borderColor: 'transparent',
	minWidth: '12em',
	padding: '0.5em 0.8em',
	textAlign: 'left',
	'&[disabled], &:hover[disabled]': {
		backgroundColor: 'transparent',
		borderColor: 'transparent',
	},
	width: '100%',
} );

export const Overlay = ( {
	language,
	onLanguageChange,
	close,
	position,
}: OverlayProps ): JSX.Element => (
	<>
		<Div className={ OVERLAY_STYLE } onClick={ () => close() } />

		<Div className={ cx( FLOATING_MENU_STYLE, css( position ) ) }>
			{ Object.keys( LABELS ).map( ( currentLanguage: Language ) => (
				<Option
					key={ currentLanguage }
					className={ ITEM_STYLE }
					text={ LABELS[ currentLanguage ] }
					isDisabled={ currentLanguage === language }
					onClick={ () => onLanguageChange( currentLanguage ) }
				/>
			) ) }
		</Div>
	</>
);

// ===============
//   HELPERS
// ===============

type OptionProps = {
	readonly className: string;
	readonly text: string;
	readonly onClick: () => void;
	readonly isDisabled?: boolean;
};

const Option = ( {
	className,
	isDisabled,
	text,
	onClick,
}: OptionProps ): JSX.Element => (
	<Button className={ className } disabled={ isDisabled } onClick={ onClick }>
		{ text }
	</Button>
);
