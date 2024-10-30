import { find, flatten, values } from 'lodash';

import type { Issue, Language, Rule } from '@neliosoft/inlexa/types';

import type {
	State,
	BlockId,
	SimpleGutenbergBlock,
	Credentials,
} from './types';

export function getStatus( state: State ): State[ 'status' ] {
	return state.status;
} //end getStatus()

export function getActiveRule( state: State ): Rule | null {
	return 'ready' === state.status ? state.ruleDetails : null;
} //end getActiveRule()

export function getCredentials( state: State ): Credentials {
	return {
		token: state.config.token,
		clientId: state.config.clientId,
	};
} //end getCredentials()

export function getBlockIdForIssue(
	state: State,
	issue: Issue
): BlockId | false {
	if ( 'ready' !== state.status ) {
		return false;
	} //end if

	const blockIds = state.blocks.filter(
		( blockId ) => !! state.blocksById[ blockId ]?.text
	);

	for ( const blockId of blockIds ) {
		const issues = state.analysisByBlock[ blockId ]?.issues.active ?? [];
		const match = find( issues, { id: issue.id } );
		if ( match ) {
			return blockId;
		} //end if
	} //end for

	return false;
} //end getBlockIdForIssue()

export function getErrorMessage( state: State ): string {
	return 'analysis-error' === state.status ? state.errorMessage : '';
} //end getErrorMessage()

export function getIssues( state: State ): ReadonlyArray< Issue > {
	if ( 'ready' !== state.status ) {
		return [];
	} //end if

	const blockIds = state.blocks.filter(
		( blockId ) => !! state.blocksById[ blockId ]?.text
	);
	return flatten(
		blockIds.map(
			( id ) => state.analysisByBlock[ id ]?.issues.active ?? []
		)
	);
} //end getIssues()

export function getDirtyIssues( state: State ): ReadonlyArray< Issue > {
	if ( 'ready' !== state.status ) {
		return [];
	} //end if

	const blocks = state.blocksById;
	const analysis = state.analysisByBlock;
	const blockIds = state.blocks.filter(
		( blockId ) =>
			!! blocks[ blockId ]?.text &&
			blocks[ blockId ]?.text !== analysis[ blockId ]?.analyzedText
	);

	return flatten(
		blockIds.map(
			( id ) => state.analysisByBlock[ id ]?.issues.active ?? []
		)
	);
} //end getDirtyIssues()

export function getLanguage( state: State ): Language {
	return state.config.language;
} //end getLanguage()

export function getSettingsUrl( state: State ): string {
	return state.config.settingsUrl;
} //end getSettingsUrl()

export function getBlocksToAnalyze(
	state: State
): ReadonlyArray< SimpleGutenbergBlock > {
	if ( 'ready' !== state.status ) {
		return [];
	} //end if

	const blocks = values( state.blocksById );
	return blocks.filter(
		( { id, text } ) => state.analysisByBlock[ id ]?.analyzedText !== text
	);
} //end getBlocksToAnalyze()

export function isAdminUser( state: State ): boolean {
	return state.config.isAdmin;
} //end isAdminUser()

export function isAnalyzingText( state: State ): boolean {
	return 'ready' === state.status && !! state.analysisRequests.length;
} //end isAnalyzingText()

export function isLoadingFirstIssues( state: State ): boolean {
	return (
		'ready' === state.status &&
		0 < getBlocksToAnalyze( state ).length &&
		0 === getIssues( state ).length
	);
} //end isLoadingFirstIssues()
