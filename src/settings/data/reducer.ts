import type { State } from './types';
import { Action } from './actions';

type AnyAction = {
	readonly type: string;
};

const INIT_STATE: State = {
	status: 'checking',
};

export function reducer( state: State = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'CANCEL_LOGOUT':
			return 'logout' !== state.status
				? state
				: { ...state, status: 'ready' };

		case 'MARK_AS_LOGGING_IN':
			return 'login' !== state.status
				? state
				: { ...state, isLoggingIn: action.active };

		case 'MARK_AS_LOGGING_OUT':
			return 'logout' !== state.status
				? state
				: { ...state, isLoggingOut: action.active };

		case 'REQUEST_LOGOUT':
			return 'ready' !== state.status
				? state
				: { ...state, status: 'logout', isLoggingOut: false };

		case 'REQUIRE_LOGIN':
			return {
				status: 'login',
				token: '',
				errorMessage: action.errorMessage ?? '',
				isLoggingIn: false,
			};

		case 'SET_CREDENTIALS':
			return 'login' !== state.status && 'checking' !== state.status
				? state
				: { status: 'ready', credentials: action.credentials };

		case 'SET_LOGIN_TOKEN':
			return 'login' !== state.status
				? state
				: { ...state, token: action.token };
	} //end switch
} //end actualReducer()
