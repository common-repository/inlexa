import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

import { cx, css } from '@neliosoft/inlexa/css';
import { colors } from '@neliosoft/inlexa/theme';

import { CustomIcon } from './custom-icon';
import { Button, ButtonProps } from '../html';

export type IconButtonProps = {
	readonly className?: string;
	readonly icon: IconProp | string;
	readonly disabled?: boolean;
	readonly title?: string;
	readonly onClick: ButtonProps[ 'onClick' ];
};

const DEFAULT_STYLE = css( {
	alignItems: 'center',
	background: colors.buttons.transparent.base.background,
	borderColor: colors.buttons.transparent.base.border,
	color: colors.buttons.transparent.base.foreground,
	display: 'inline-flex',
	height: '2em',
	justifyContent: 'center',
	transition: 'all 150ms ease-in-out',
	padding: 0,
	width: '2em',
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

export const IconButton = ( {
	className,
	disabled,
	icon,
	title,
	onClick,
}: IconButtonProps ): JSX.Element => (
	<Button
		title={ title }
		disabled={ disabled }
		className={ cx( DEFAULT_STYLE, className ) }
		onClick={ onClick }
	>
		{ 'string' === typeof icon ? (
			<CustomIcon path={ icon } />
		) : (
			<FontAwesomeIcon icon={ icon } />
		) }
	</Button>
);
