import type { Issue, Language, Rule } from '@neliosoft/inlexa/types';

export type State = Initial | Checking | SetupRequired | Ready | AnalysisError;

export type Config = {
	readonly token: string;
	readonly clientId: string;
	readonly isAdmin: boolean;
	readonly settingsUrl: string;
	readonly language: Language;
};

export type Credentials = {
	readonly token: string;
	readonly clientId: string;
};

export type Initial = {
	readonly status: 'initial';
	readonly config: Config;
};

export type Checking = {
	readonly status: 'checking';
	readonly config: Config;
};

export type SetupRequired = {
	readonly status: 'setup-required';
	readonly config: Config;
};

export type Ready = {
	readonly status: 'ready';
	readonly config: Config;
	readonly blocks: ReadonlyArray< BlockId >;
	readonly blocksById: Record< BlockId, SimpleGutenbergBlock >;
	readonly analysisRequests: Record< RequestId, ReadonlyArray< BlockId > >;
	readonly analysisByBlock: Record< BlockId, Analysis >;
	readonly ruleDetails: Rule | null;
};

export type AnalysisError = {
	readonly status: 'analysis-error';
	readonly config: Config;
	readonly errorMessage: string;
};

export type Analysis = {
	readonly analyzedText: string;
	readonly issues: {
		readonly active: ReadonlyArray< Issue >;
		readonly discarded: ReadonlyArray< Issue >;
	};
};

// HELPER TYPES

export type BlockId = string;

export type ActualGutenbergBlock = ParLikeBlock | ListLikeBlock;

type ParLikeBlock = {
	readonly clientId: BlockId;
	readonly name: 'core/paragraph' | 'core/heading';
	readonly attributes: {
		readonly content: string;
	};
};

type ListLikeBlock = {
	readonly clientId: BlockId;
	readonly name: 'core/list';
	readonly attributes: {
		readonly values: string;
	};
};

export type SimpleGutenbergBlock = {
	readonly id: BlockId;
	readonly type: string;
	readonly text: string;
};

export type RequestId = string;

export type TextIssues = [ string, ReadonlyArray< Issue > ];
