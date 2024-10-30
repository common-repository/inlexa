import { difference, find, keys, keyBy, map, omit, without } from 'lodash';

import { updateContext as updateIssueContext } from '@neliosoft/inlexa/utils';
import type { Issue, Language } from '@neliosoft/inlexa/types';

import { INIT_STATE } from './config';
import type { State, BlockId, Ready } from './types';
import type {
	Action,
	DiscardIssue,
	MarkIssueAsFixed,
	ReceiveIssues,
} from './actions';

type AnyAction = {
	readonly type: string;
};

export function reducer( state: State = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'CLEAR_ANALYSIS_REQUEST':
			return 'ready' !== state.status
				? state
				: {
						...state,
						analysisRequests: omit(
							state.analysisRequests,
							action.requestId
						),
				  };

		case 'CLOSE_RULE_DETAILS':
			return 'ready' !== state.status
				? state
				: { ...state, ruleDetails: null };

		case 'DISCARD_ISSUE':
			return 'ready' !== state.status
				? state
				: discardIssue( state, action );

		case 'INIT':
			return 'initial' !== state.status
				? state
				: { ...state, config: { ...state.config, ...action.config } };

		case 'MARK_AS_CHECKING':
			return 'initial' !== state.status
				? state
				: { ...state, status: 'checking' };

		case 'MARK_AS_READY':
			return {
				status: 'ready',
				config: state.config,
				blocks: [],
				blocksById: {},
				analysisByBlock: {},
				analysisRequests: {},
				ruleDetails: null,
			};

		case 'MARK_ISSUE_AS_FIXED':
			return 'ready' !== state.status ? state : fixIssue( state, action );

		case 'RECEIVE_ISSUES':
			return 'ready' !== state.status
				? state
				: receiveIssues( state, action );

		case 'REQUIRE_SETUP':
			return {
				status: 'setup-required',
				config: state.config,
			};

		case 'SET_ANALYZING_BLOCKS':
			return 'ready' !== state.status
				? state
				: {
						...state,
						analysisRequests: {
							...state.analysisRequests,
							[ action.requestId ]: action.blocks,
						},
				  };

		case 'SET_GUTENBERG_BLOCKS':
			return 'ready' !== state.status
				? state
				: {
						...state,
						blocks: map( action.blocks, 'id' ),
						blocksById: keyBy( action.blocks, 'id' ),
						analysisByBlock: omit(
							state.analysisByBlock,
							difference(
								keys( state.analysisByBlock ),
								map( action.blocks, 'id' )
							)
						),
				  };

		case 'SHOW_ANALYSIS_ERROR':
			return {
				status: 'analysis-error',
				config: state.config,
				errorMessage: action.errorMessage,
			};

		case 'UPDATE_LANGUAGE':
			return updateLanguage( state, action.language );

		case 'VIEW_RULE_DETAILS':
			return 'ready' !== state.status
				? state
				: { ...state, ruleDetails: action.rule };
	} //end switch
} //end actualReducer()

// =======
// HELPERS
// =======

function receiveIssues( state: Ready, action: ReceiveIssues ): Ready {
	const blockIds = keys( action.issuesInTextByBlock );
	return blockIds.reduce(
		( state, blockId ) => updateIssues( state, blockId, action ),
		state
	);
} //end receiveIssues()

function updateIssues(
	state: Ready,
	blockId: BlockId,
	action: ReceiveIssues
): Ready {
	const block = state.blocksById[ blockId ];
	if ( ! block ) {
		return state;
	} //end if

	const [ text, issues ] = action.issuesInTextByBlock[ blockId ] ?? [
		'',
		[],
	];
	if ( block.text !== text ) {
		return state;
	} //end if

	const prevAnalysis = state.analysisByBlock[ blockId ] ?? {
		analyzedText: '',
		issues: { active: [], discarded: [] },
	};
	const discarded = prevAnalysis.issues.discarded;

	return {
		...state,
		analysisByBlock: {
			...state.analysisByBlock,
			[ blockId ]: {
				...prevAnalysis,
				analyzedText: text,
				issues: {
					active: issues.filter(
						( issue ) => ! isDiscarded( discarded, issue )
					),
					discarded,
				},
			},
		},
	};
} //end updateIssues()

function isDiscarded(
	discarded: ReadonlyArray< Issue >,
	issue: Issue
): boolean {
	return discarded.some(
		( dis ) =>
			dis.offset === issue.offset &&
			dis.context.match === issue.context.match
	);
} //end isDiscarded()

function discardIssue( state: Ready, action: DiscardIssue ): Ready {
	const analysis = state.analysisByBlock[ action.blockId ];
	if ( ! analysis ) {
		return state;
	} //end if

	const issue = find( analysis.issues.active, { id: action.issueId } );
	if ( ! issue ) {
		return state;
	} //end if

	return {
		...state,
		analysisByBlock: {
			...state.analysisByBlock,
			[ action.blockId ]: {
				...analysis,
				issues: {
					active: without( analysis.issues.active, issue ),
					discarded: [ ...analysis.issues.discarded, issue ],
				},
			},
		},
	};
} //end discardIssue()

function fixIssue( state: Ready, action: MarkIssueAsFixed ): Ready {
	const block = state.blocksById[ action.blockId ];
	if ( ! block ) {
		return state;
	} //end if

	const analysis = state.analysisByBlock[ action.blockId ];
	if ( ! analysis ) {
		return state;
	} //end if

	const { active, discarded } = analysis.issues;
	const issue = find( analysis.issues.active, { id: action.issueId } );
	if ( ! issue ) {
		return state;
	} //end if

	const { offset, diff, text } = action.fix;
	const updateOffset = ( prevOffset ) =>
		prevOffset > offset ? prevOffset + diff : prevOffset;
	const updateIssueOffsets = ( i: Issue ): Issue => ( {
		...i,
		offset: updateOffset( i.offset ),
		matches: i.matches.map( ( match ) => ( {
			...match,
			offset: updateOffset( match.offset ),
		} ) ),
	} );
	const updateContext = ( i: Issue ): Issue => updateIssueContext( text, i );

	return {
		...state,
		blocksById: {
			...state.blocksById,
			[ action.blockId ]: {
				...block,
				text,
			},
		},
		analysisByBlock: {
			...state.analysisByBlock,
			[ action.blockId ]: {
				...analysis,
				analyzedText: text,
				issues: {
					active: without( active, issue )
						.map( updateIssueOffsets )
						.map( updateContext ),
					discarded: discarded
						.map( updateIssueOffsets )
						.map( updateContext ),
				},
			},
		},
	};
} //end fixIssue()

function updateLanguage< T extends State >( state: T, lang: Language ): T {
	state = {
		...state,
		config: {
			...state.config,
			language: lang,
		},
	};

	if ( 'ready' !== state.status ) {
		return state;
	} //end if

	return {
		...state,
		analysisRequests: [],
		analysisByBlock: {},
	};
} //end updateLanguage()
