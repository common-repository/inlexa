import { Credentials } from './types';

export type Action =
	| CancelLogout
	| MarkAsLoggingIn
	| MarkAsLoggingOut
	| RequestLogout
	| RequireLogin
	| SetCredentials
	| SetLoginToken;

type CancelLogout = {
	readonly type: 'CANCEL_LOGOUT';
};

type MarkAsLoggingIn = {
	readonly type: 'MARK_AS_LOGGING_IN';
	readonly active: boolean;
};

type MarkAsLoggingOut = {
	readonly type: 'MARK_AS_LOGGING_OUT';
	readonly active: boolean;
};

type RequestLogout = {
	readonly type: 'REQUEST_LOGOUT';
};

type RequireLogin = {
	readonly type: 'REQUIRE_LOGIN';
	readonly errorMessage?: string;
};

type SetCredentials = {
	readonly type: 'SET_CREDENTIALS';
	readonly credentials: Credentials;
};

type SetLoginToken = {
	readonly type: 'SET_LOGIN_TOKEN';
	readonly token: string;
};

export function cancelLogout(): CancelLogout {
	return {
		type: 'CANCEL_LOGOUT',
	};
} //end cancelLogout()

export function markAsLoggingIn( active: boolean ): MarkAsLoggingIn {
	return {
		type: 'MARK_AS_LOGGING_IN',
		active,
	};
} //end ()

export function markAsLoggingOut( active: boolean ): MarkAsLoggingOut {
	return {
		type: 'MARK_AS_LOGGING_OUT',
		active,
	};
} //end markAsLoggingIn()

export function requestLogout(): RequestLogout {
	return {
		type: 'REQUEST_LOGOUT',
	};
} //end ()

export function requireLogin( errorMessage?: string ): RequireLogin {
	return {
		type: 'REQUIRE_LOGIN',
		errorMessage,
	};
} //end requireLogin()

export function setCredentials( credentials: Credentials ): SetCredentials {
	return {
		type: 'SET_CREDENTIALS',
		credentials,
	};
} //end setCredentials()

export function setLoginToken( token: string ): SetLoginToken {
	return {
		type: 'SET_LOGIN_TOKEN',
		token,
	};
} //end setLoginToken()
