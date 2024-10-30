import * as React from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import interpolateComponents from 'interpolate-components';

import { Login as LoginForm } from '@neliosoft/inlexa/components';
import { css } from '@neliosoft/inlexa/css';
import { _x } from '@neliosoft/inlexa/i18n';

import { STORE } from '@wpinlexa/settings/data';

export const Login = () => {
	const token = useToken();
	const isLoggingIn = useIsLoggingIn();
	const errorMessage = useErrorMessage();
	const { login, setLoginToken } = useDispatch( STORE );

	return (
		<>
			<div className={ css( { marginBottom: '1em' } ) }>
				{ _x(
					'In order to use Inlexa in Gutenberg, please login using the Access Key you received after subscribing:',
					'user',
					'inlexa'
				) }
			</div>

			<LoginForm
				mode={ isLoggingIn ? 'validating' : 'setup' }
				token={ token }
				error={ errorMessage }
				onTokenChange={ setLoginToken }
				onSubmit={ () => login( token ) }
			/>

			<div className={ css( { margin: '1em 0' } ) }>
				{ interpolateComponents( {
					mixedString: _x(
						'or {{a}}subscribe now{{/a}} to get one first.',
						'user [access key]',
						'inlexa'
					),
					components: {
						a: (
							<a
								href={ _x(
									'https://inlexa.es/planes/',
									'text',
									'inlexa'
								) }
								target="_blank"
							/>
						),
					},
				} ) }
			</div>
			<div className={ css( { fontStyle: 'italic' } ) }>
				{ interpolateComponents( {
					mixedString: _x(
						'In order to analyze and help you improve your documents, Inlexa sends your text to our cloud through a secure connection. None of it will be stored or shared. For more details, please see our {{a}}terms and conditions{{/a}}.',
						'text',
						'inlexa'
					),
					components: {
						a: (
							<a
								href={ _x(
									'https://inlexa.es/terminos-condiciones-inlexa/',
									'text',
									'inlexa'
								) }
								target="_blank"
							/>
						),
					},
				} ) }
			</div>
		</>
	);
};

// HELPERS

const useToken = () => useSelect( ( select ) => select( STORE ).getToken() );

const useIsLoggingIn = () =>
	useSelect( ( select ) => select( STORE ).isLoggingIn() );

const useErrorMessage = () =>
	useSelect( ( select ) => select( STORE ).getLoginErrorMessage() );
