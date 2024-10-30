import * as React from 'react';

import { css, cx } from '@neliosoft/inlexa/css';
import { _x } from '@neliosoft/inlexa/i18n';
import { colors } from '@neliosoft/inlexa/theme';
import { isValidUuid } from '@neliosoft/inlexa/utils';

import { TextControl } from '../generic';
import { Button, Div } from '../html';

export type LoginProps = {
	readonly className?: string;
	readonly error?: string;
	readonly token: string;
	readonly mode: 'setup' | 'validating' | 'error';
	readonly onTokenChange: ( token: string ) => void;
	readonly onSubmit: () => void;
};

export const Login = ( {
	className,
	mode,
	token,
	error,
	onTokenChange,
	onSubmit,
}: LoginProps ): JSX.Element => (
	<Div className={ cx( WRAPPER_STYLE, className ) }>
		<TextControl
			className={ INPUT_STYLE }
			value={ token }
			onChange={ ( value ) =>
				onTokenChange(
					value.replace( /[^0-9a-f-]/g, '' ).substring( 0, 36 )
				)
			}
			placeholder={ _x( 'Access Key', 'text', 'inlexa' ) }
			disabled={ 'setup' !== mode }
		/>
		<Button
			isPrimary
			disabled={ 'validating' === mode || ! isValidUuid( token ) }
			className={ BUTTON_STYLE }
			onClick={ onSubmit }
		>
			{ 'validating' === mode
				? _x( 'Logging In…', 'text', 'inlexa' )
				: _x( 'Login', 'command', 'inlexa' ) }
		</Button>
		{ !! error ? <Div className={ ERROR_STYLE }>{ error }</Div> : null }
	</Div>
);

// ========
//  STYLES
// ========

const WRAPPER_STYLE = css( {
	textAlign: 'center',
} );

const INPUT_STYLE = css( {
	display: 'block',
	width: '100%',
} );

const BUTTON_STYLE = css( {
	border: 'none',
	margin: '1em auto 0',
} );

const ERROR_STYLE = css( {
	color: colors.analysis.error.underline,
	marginTop: '1em',
} );
