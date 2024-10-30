// ==================
//   DOMAIN TYPES
// ==================

export type AnalysisResponse = ErrorResponse | SuccessfulResponse;

export type ErrorResponse = {
	readonly type: 'error';
	readonly error: string;
};

export type SuccessfulResponse = {
	readonly type: 'success';
	readonly result: ReadonlyArray< Issue >;
};

export type Issue = {
	readonly id: IssueId;
	readonly offset: number;
	readonly length: number;
	readonly context: MatchContext;
	readonly matches: ReadonlyArray< Match >;
	readonly type: Rule[ 'type' ];
};

export type Match = {
	readonly rule: Rule;
	readonly offset: number;
	readonly length: number;
	readonly text: string;
	readonly replacements: ReadonlyArray< string >;
};

// NOTE. Should rule's type and category be enums?
export type Rule = {
	readonly id: RuleId;
	readonly name: string;
	readonly summary: string;
	readonly description: string;
	readonly examples: ReadonlyArray< RuleExample >;
	readonly type: string;
	readonly category: string;
	readonly bibliography: ReadonlyArray< BibDoc >;
};

export type MatchContext = {
	readonly before: string;
	readonly match: string;
	readonly after: string;
};

export type FixedIssueUpdate = {
	readonly issue: Issue;
	readonly previousText: string;
	readonly newText: string;
};

export type RuleExample = {
	readonly exclusive: string;
	readonly inclusive: string;
};

export type BibDoc = {
	readonly title: string;
	readonly authors: ReadonlyArray< string >;
	readonly year?: string;
	readonly editor?: string;
	readonly pages?: string;
};

export type IssueId = string;
export type RuleId = string;

// ==================
//  AWS RESPONSES
// ==================

export type AwsResponse = {
	readonly issues: ReadonlyArray< AwsIssue >;
	readonly rules: ReadonlyArray< Rule >;
};

export type AwsIssue = {
	readonly ruleId: RuleId;
	readonly offset: number;
	readonly length: number;
	readonly replacements: ReadonlyArray< string >;
};

// ==================
//   APP TYPES
// ==================

export type Credentials = {
	readonly clientId: string;
	readonly token: string;
};

export type AppSettings = {
	readonly language: Language;
	readonly usesDarkMode: boolean;
};

export type Language = 'ca' | 'es';

// ==================
//   HELPER TYPES
// ==================

export type RemoveState< R > = OmitFirstArgs< R >;
export type RemoveAction< R > = RemoveReturnTypes< R >;

export type RecursivePartial< T > = {
	[ P in keyof T ]?: T[ P ] extends ( infer U )[]
		? RecursivePartial< U >[]
		: T[ P ] extends object
		? RecursivePartial< T[ P ] >
		: T[ P ];
};

type OmitFirstArg< F > = F extends ( x: any, ...args: infer P ) => infer R
	? ( ...args: P ) => R
	: never;

type OmitFirstArgs< R extends Record< string, any > > = {
	readonly [ K in keyof R ]: OmitFirstArg< R[ K ] >;
};

type RemoveReturnType< F > = F extends ( ...args: infer P ) => any
	? ( ...args: P ) => void
	: never;

type RemoveReturnTypes< R extends Record< string, any > > = {
	readonly [ K in keyof R ]: RemoveReturnType< R[ K ] >;
};
