import { difference, take, takeRight } from 'lodash';

import type {
	AnalysisResponse,
	FixedIssueUpdate,
	Issue,
	Match,
} from '@neliosoft/inlexa/types';

const CONTEXT_SIZE = 5;

export function updateContext( text: string, issue: Issue ): Issue {
	const start = issue.offset;
	const end = issue.offset + issue.length;

	const ignoreBefore = Math.max(
		0,
		text.substring( 0, start ).lastIndexOf( '\n' )
	);
	const ignoreAfter = text.substring( end ).includes( '\n' )
		? text.indexOf( '\n', end )
		: text.length;

	const beforeBlocks = trimSplit( text.substring( ignoreBefore, start ) );
	const matchBlocks = trimSplit( text.substring( start, end ) );
	const afterBlocks = trimSplit( text.substring( end, ignoreAfter ) );

	const ellipsis = ( a: ReadonlyArray< string > ): string =>
		a.length > CONTEXT_SIZE ? '…' : '';

	const before =
		ellipsis( beforeBlocks ) +
		joinUntrim( takeRight( beforeBlocks, CONTEXT_SIZE ) );
	const match = joinUntrim( matchBlocks );
	const after =
		joinUntrim( take( afterBlocks, CONTEXT_SIZE ) ) +
		ellipsis( afterBlocks );

	return {
		...issue,
		context: { before, match, after },
		matches: issue.matches.map( ( m ) => updateMatch( text, m ) ),
	};
} //end updateContext()

export function updateIssuesAfterFix(
	response: AnalysisResponse,
	update: FixedIssueUpdate
): AnalysisResponse {
	if ( 'error' === response.type ) {
		return response;
	} //end if

	let issues = response.result;

	const fixedIssue = update.issue;
	const overlappingIssues = issues.filter( ( m ) =>
		overlap( fixedIssue, m )
	);
	issues = difference( issues, overlappingIssues );

	const delta = getIssueFixDelta( update.previousText, update.newText );
	issues = issues.map( ( issue ) => {
		if ( ! comesAfter( fixedIssue, issue ) ) {
			return issue;
		} //end if

		return updateContext( update.newText, {
			...issue,
			offset: issue.offset + delta,
			matches: issue.matches.map( ( match ) => ( {
				...match,
				offset: match.offset + delta,
			} ) ),
		} );
	} );

	return {
		type: 'success',
		result: issues,
	};
} //end updateIssuesAfterFix()

// =========
//  HELPERS
// =========

function updateMatch( text: string, match: Match ): Match {
	return {
		...match,
		text: text.substring( match.offset, match.offset + match.length ),
	};
} //end updateMatch()

function overlap( one: Issue, other: Issue ): boolean {
	return ! comesAfter( one, other ) && ! comesAfter( other, one );
} //end overlap()

function comesAfter( point: Issue, candidate: Issue ): boolean {
	return point.offset + point.length < candidate.offset;
} //end comesAfter()

function getIssueFixDelta( previousText: string, newText: string ): number {
	const cls = commonLongestEnding( previousText, newText );
	const previousStart = previousText.length - cls.length;
	const newStart = newText.length - cls.length;
	return newStart - previousStart;
} //end getIssueFixDelta()

function commonLongestEnding( a: string, b: string ): string {
	const count = Math.min( a.length, b.length );
	let res = '';
	for ( let i = 0; i < count; ++i ) {
		if ( a[ a.length - i ] !== b[ b.length - i ] ) {
			break;
		} //end if
		res = a[ a.length - i ] + res;
	} //end for
	return res;
} //end commonLongestEnding()

const trimSplit = ( text: string ): ReadonlyArray< string > =>
	text.replace( /\s+/, ' ' ).split( ' ' );

const joinUntrim = ( text: ReadonlyArray< string > ): string =>
	text.join( ' ' );
