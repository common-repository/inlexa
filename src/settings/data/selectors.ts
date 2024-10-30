import type { State } from './types';

export function getStatus( state: State ): State[ 'status' ] {
	return state.status;
} //end getStatus()

export function isLoggingIn( state: State ): boolean {
	return state.status === 'login' && state.isLoggingIn;
} //end isLoggingIn()

export function isLoggingOut( state: State ): boolean {
	return state.status === 'logout' && state.isLoggingOut;
} //end isLoggingOut()

export function getToken( state: State ): string {
	switch ( state.status ) {
		case 'login':
			return state.token;

		case 'ready':
		case 'logout':
			return state.credentials.token;

		default:
			return '';
	} //end switch
} //end getToken()

export function getClientId( state: State ): string {
	const { status } = state;
	return 'ready' === status || 'logout' === status
		? state.credentials.clientId
		: '';
} //end getClientId()

export function getLoginErrorMessage( state: State ): string {
	const { status } = state;
	return 'login' === status ? state.errorMessage : '';
} //end getLoginErrorMessage()
