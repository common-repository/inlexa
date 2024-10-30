import type { Initial as InitialState } from './types';

export const STORE = 'inlexa/editor';

export const INIT_STATE: InitialState = {
	status: 'initial',
	config: {
		token: '',
		clientId: '',
		isAdmin: false,
		settingsUrl: '',
		language: 'es',
	},
};
