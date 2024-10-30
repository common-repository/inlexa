import type { IssueId, Language, Rule } from '@neliosoft/inlexa/types';
import type {
	BlockId,
	Config,
	SimpleGutenbergBlock,
	RequestId,
	TextIssues,
} from './types';

export type Action =
	| ClearAnalysisRequest
	| CloseRuleDetails
	| DiscardIssue
	| Init
	| MarkAsChecking
	| MarkAsReady
	| MarkIssueAsFixed
	| ReceiveIssues
	| RequireSetup
	| SetAnalyzingBlocks
	| SetGutenbergBlocks
	| ShowAnalysisError
	| UpdateLanguage
	| ViewRuleDetails;

export type ClearAnalysisRequest = {
	readonly type: 'CLEAR_ANALYSIS_REQUEST';
	readonly requestId: RequestId;
};

export type CloseRuleDetails = {
	readonly type: 'CLOSE_RULE_DETAILS';
};

export type DiscardIssue = {
	readonly type: 'DISCARD_ISSUE';
	readonly blockId: BlockId;
	readonly issueId: IssueId;
};

export type Init = {
	readonly type: 'INIT';
	readonly config: Partial< Config >;
};

export type MarkAsChecking = {
	readonly type: 'MARK_AS_CHECKING';
};

export type MarkAsReady = {
	readonly type: 'MARK_AS_READY';
};

export type MarkIssueAsFixed = {
	readonly type: 'MARK_ISSUE_AS_FIXED';
	readonly blockId: BlockId;
	readonly issueId: IssueId;
	readonly fix: {
		readonly offset: number;
		readonly diff: number;
		readonly text: string;
	};
};

export type ReceiveIssues = {
	readonly type: 'RECEIVE_ISSUES';
	readonly issuesInTextByBlock: Record< BlockId, TextIssues >;
};

export type RequireSetup = {
	readonly type: 'REQUIRE_SETUP';
};

export type SetAnalyzingBlocks = {
	readonly type: 'SET_ANALYZING_BLOCKS';
	readonly requestId: RequestId;
	readonly blocks: ReadonlyArray< BlockId >;
};

export type SetGutenbergBlocks = {
	readonly type: 'SET_GUTENBERG_BLOCKS';
	readonly blocks: ReadonlyArray< SimpleGutenbergBlock >;
};

export type ShowAnalysisError = {
	readonly type: 'SHOW_ANALYSIS_ERROR';
	readonly errorMessage: string;
};

export type UpdateLanguage = {
	readonly type: 'UPDATE_LANGUAGE';
	readonly language: Language;
};

export type ViewRuleDetails = {
	readonly type: 'VIEW_RULE_DETAILS';
	readonly rule: Rule;
};

export function clearAnalysisRequest(
	requestId: RequestId
): ClearAnalysisRequest {
	return {
		type: 'CLEAR_ANALYSIS_REQUEST',
		requestId,
	};
} //end clearAnalysisRequest()

export function closeRuleDetails(): CloseRuleDetails {
	return {
		type: 'CLOSE_RULE_DETAILS',
	};
} //end closeRuleDetails()

export function discardIssue(
	blockId: BlockId,
	issueId: IssueId
): DiscardIssue {
	return {
		type: 'DISCARD_ISSUE',
		blockId,
		issueId,
	};
} //end discardIssue()

export function init( config: Partial< Config > ): Init {
	return {
		type: 'INIT',
		config,
	};
} //end init()

export function markAsChecking(): MarkAsChecking {
	return {
		type: 'MARK_AS_CHECKING',
	};
} //end markAsChecking()

export function markAsReady(): MarkAsReady {
	return {
		type: 'MARK_AS_READY',
	};
} //end markAsReady()

export function markIssueAsFixed(
	blockId: BlockId,
	issueId: IssueId,
	fix: MarkIssueAsFixed[ 'fix' ]
): MarkIssueAsFixed {
	return {
		type: 'MARK_ISSUE_AS_FIXED',
		blockId,
		issueId,
		fix,
	};
} //end markIssueAsFixed()

export function receiveIssues(
	issuesInTextByBlock: Record< BlockId, TextIssues >
): ReceiveIssues {
	return {
		type: 'RECEIVE_ISSUES',
		issuesInTextByBlock,
	};
} //end receiveIssues()

export function requireSetup(): RequireSetup {
	return {
		type: 'REQUIRE_SETUP',
	};
} //end requireSetup()

export function setAnalyzingBlocks(
	requestId: RequestId,
	blocks: ReadonlyArray< BlockId >
): SetAnalyzingBlocks {
	return {
		type: 'SET_ANALYZING_BLOCKS',
		requestId,
		blocks,
	};
} //end setAnalyzingBlocks()

export function setGutenbergBlocks(
	blocks: ReadonlyArray< SimpleGutenbergBlock >
): SetGutenbergBlocks {
	return {
		type: 'SET_GUTENBERG_BLOCKS',
		blocks,
	};
} //end setGutenbergBlocks()

export function showAnalysisError( errorMessage: string ): ShowAnalysisError {
	return {
		type: 'SHOW_ANALYSIS_ERROR',
		errorMessage,
	};
} //end showAnalysisError()

export function updateLanguage( language: Language ): UpdateLanguage {
	return {
		type: 'UPDATE_LANGUAGE',
		language,
	};
} //end updateLanguage()

export function viewRuleDetails( rule: Rule ): ViewRuleDetails {
	return {
		type: 'VIEW_RULE_DETAILS',
		rule,
	};
} //end viewRuleDetails()
