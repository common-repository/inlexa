import apiFetch from '@wordpress/api-fetch';
import { dispatch, select } from '@wordpress/data';
import { v4 as uuid } from 'uuid';
import { trim } from 'lodash';

import { _x } from '@neliosoft/inlexa/i18n';
import * as AWS from '@neliosoft/inlexa/side-effects';

import { STORE } from './config';
const INLEXA_PATH = '/inlexa/v1';

export async function check(): Promise< void > {
	try {
		const { token, clientId } = await apiFetch( {
			method: 'GET',
			path: `${ INLEXA_PATH }/credentials`,
		} );
		const valid = await AWS.checkCredentials( token, clientId );
		if ( valid ) {
			dispatch( STORE ).setCredentials( { token, clientId } );
		} else {
			dispatch( STORE ).requireLogin();
		} //end if
	} catch ( e ) {
		dispatch( STORE ).requireLogin();
	} //end try
} //end check()

export async function login( token: string ): Promise< void > {
	if ( ! trim( token ) ) {
		return;
	} //end if

	if ( select( STORE ).isLoggingIn() ) {
		return;
	} //end if
	dispatch( STORE ).markAsLoggingIn( true );

	const clientId = uuid();
	/* translators: site domain */
	const clientName = _x(
		'Inlexa for WordPress (%s)',
		'text',
		'inlexa'
	).replace( '%s', document.location.hostname );

	try {
		await AWS.login( token, clientId, clientName );
		await apiFetch( {
			path: `${ INLEXA_PATH }/credentials`,
			method: 'POST',
			data: { token, clientId },
		} );
		dispatch( STORE ).setCredentials( { token, clientId } );
	} catch ( errorMessage ) {
		dispatch( STORE ).requireLogin( errorMessage );
	} //end try
} //end login()

export async function logout(): Promise< void > {
	if ( 'logout' !== select( STORE ).getStatus() ) {
		return;
	} //end if

	if ( select( STORE ).isLoggingOut() ) {
		return;
	} //end if

	dispatch( STORE ).markAsLoggingOut( true );
	try {
		const token = select( STORE ).getToken();
		const clientId = select( STORE ).getClientId();
		await AWS.logout( token, clientId );
		await apiFetch( {
			path: `${ INLEXA_PATH }/credentials`,
			method: 'DELETE',
		} );
		dispatch( STORE ).requireLogin();
	} catch ( e ) {
		// TODO. Do something on error in settings?
		dispatch( STORE ).markAsLoggingOut( false );
	} //end try
} //end logout()
