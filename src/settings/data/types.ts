export type State = Checking | Login | Ready | Logout;

type Checking = {
	readonly status: 'checking';
};

type Login = {
	readonly status: 'login';
	readonly token: string;
	readonly isLoggingIn: boolean;
	readonly errorMessage: string;
};

type Ready = {
	readonly status: 'ready';
	readonly credentials: Credentials;
};

type Logout = {
	readonly status: 'logout';
	readonly isLoggingOut: boolean;
	readonly credentials: Credentials;
};

export type Credentials = {
	readonly token: string;
	readonly clientId: string;
};
