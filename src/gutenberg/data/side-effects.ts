import { dispatch, select, subscribe } from '@wordpress/data';
import { debounce, flatten, map, isEqual, throttle } from 'lodash';
import { v4 as uuid } from 'uuid';

import { _x } from '@neliosoft/inlexa/i18n';
import type { Issue, Language, Match } from '@neliosoft/inlexa/types';
import {
	ContentEditableElement,
	getTextInContentEditable,
	replaceTextInContentEditable,
} from '@neliosoft/inlexa/utils';
import * as AWS from '@neliosoft/inlexa/side-effects';

import { STORE } from './config';
import type {
	ActualGutenbergBlock,
	BlockId,
	SimpleGutenbergBlock,
	TextIssues,
} from './types';

const UPDATE_INTERVAL = 2000;
const RELEVANT_BLOCKS = [ 'core/paragraph', 'core/list', 'core/heading' ];
const GUTENBERG_STORE = 'core/block-editor';

export async function check(): Promise< void > {
	const { token, clientId } = select( STORE ).getCredentials();
	if ( ! token || ! clientId ) {
		dispatch( STORE ).requireSetup();
		return;
	} //end if

	if ( 'initial' !== select( STORE ).getStatus() ) {
		return;
	} //end if

	try {
		dispatch( STORE ).markAsChecking();
		const valid = await AWS.checkCredentials( token, clientId );
		if ( valid ) {
			listenToGutenberg();
			dispatch( STORE ).markAsReady();
		} else {
			dispatch( STORE ).requireSetup();
		} //end if
	} catch ( e ) {
		dispatch( STORE ).requireSetup();
	} //end try
} //end check()

export async function analyzeBlocks(): Promise< void > {
	const requestId = uuid();
	const blocks = select( STORE ).getBlocksToAnalyze();
	const blockIds = map( blocks, 'id' );

	dispatch( STORE ).setAnalyzingBlocks( requestId, blockIds );
	try {
		const lang = select( STORE ).getLanguage();
		const { token, clientId } = select( STORE ).getCredentials();
		const text = map( blocks, 'text' ).join( '\n' );

		const response = await AWS.getIssues( token, clientId, lang, text );

		if ( 'error' === response.type ) {
			dispatch( STORE ).showAnalysisError( response.error );
			return;
		} //end if

		const issues = response.result;
		const issuesInText = split( blocks, issues );
		dispatch( STORE ).receiveIssues( issuesInText );
	} catch ( e ) {
		dispatch( STORE ).showAnalysisError( e );
	} //end try
	dispatch( STORE ).clearAnalysisRequest( requestId );
} //end analyzeBlocks()

export async function setLanguage( lang: Language ): Promise< void > {
	if ( select( STORE ).isAnalyzingText() ) {
		return;
	} //end if
	dispatch( STORE ).updateLanguage( lang );
	await analyzeBlocks();
} //end setLanguage()

export async function onIssueFocus( issue: Issue ): Promise< void > {
	const blockId = select( STORE ).getBlockIdForIssue( issue );
	if ( ! blockId ) {
		return;
	} //end if

	// TODO. Implement on issue focus correctly.
	dispatch( GUTENBERG_STORE ).selectBlock( blockId );
} //end onIssueFocus()

export async function onIssueRemove( issue: Issue ): Promise< void > {
	const blockId = select( STORE ).getBlockIdForIssue( issue );
	if ( ! blockId ) {
		return;
	} //end if
	dispatch( STORE ).discardIssue( blockId, issue.id );
} //end onIssueRemove()

export async function onIssueFix(
	issue: Issue,
	match: Match,
	replacement: string
): Promise< void > {
	const blockId = select( STORE ).getBlockIdForIssue( issue );
	if ( ! blockId ) {
		return;
	} //end if

	const block = select( GUTENBERG_STORE ).getBlock(
		blockId
	) as ActualGutenbergBlock | null;
	if ( ! block ) {
		return;
	} //end if

	dispatch( GUTENBERG_STORE ).selectBlock( blockId );
	const div = createContentEditableElement();

	document.body.appendChild( div );
	div.innerHTML = getHtmlInGutenbergBlock( block );
	replaceTextInContentEditable(
		div,
		match.offset,
		match.offset + match.length,
		replacement
	);
	const text = getTextInContentEditable( div );
	const html = div.innerHTML;
	document.body.removeChild( div );

	const { attributes } = updateHtmlInGutenbergBlock( block, html );
	dispatch( GUTENBERG_STORE ).updateBlock( blockId, { attributes } );

	const offset = match.offset;
	const diff = replacement.length - match.length;
	dispatch( STORE ).markIssueAsFixed( blockId, issue.id, {
		offset,
		diff,
		text,
	} );
} //end onIssueFix()

// =======
// HELPERS
// =======

const listenToGutenberg = () => {
	const runAnalysis = debounce(
		() => dispatch( STORE ).analyzeBlocks(),
		Math.floor( UPDATE_INTERVAL * 2.1 )
	);

	let prevBlocks;
	const listen = throttle( () => {
		const blocks = getBlocks();
		if ( isEqual( blocks, prevBlocks ) ) {
			prevBlocks = blocks;
			return;
		} //end if

		prevBlocks = blocks;
		dispatch( STORE ).setGutenbergBlocks( blocks );
		runAnalysis();
	}, UPDATE_INTERVAL );

	subscribe( listen );
};

const getBlocks = (): ReadonlyArray< SimpleGutenbergBlock > => {
	const getInnerBlocks = ( b ) =>
		b.innerBlocks.length
			? [
					...b.innerBlocks,
					...flatten( b.innerBlocks.map( getInnerBlocks ) ),
			  ]
			: [];

	return ( select( GUTENBERG_STORE ) as any )
		.getBlocks()
		.map( ( b ) => [ b, ...getInnerBlocks( b ) ] )
		.reduce( ( r, b ) => [ ...r, ...b ], [] )
		.map( makeGutenbergBlock )
		.filter( ( { type } ) => RELEVANT_BLOCKS.includes( type ) );
}; //end getBlocks()

const makeGutenbergBlock = (
	block: ActualGutenbergBlock
): SimpleGutenbergBlock => ( {
	id: block.clientId as string,
	type: block.name as string,
	text: RELEVANT_BLOCKS.includes( block.name )
		? getTextInGutenbergBlock( block )
		: '',
} );

const getTextInGutenbergBlock = ( block: ActualGutenbergBlock ): string => {
	const div = createContentEditableElement();
	document.body.appendChild( div );
	div.innerHTML = getHtmlInGutenbergBlock( block );
	const text = getTextInContentEditable( div );
	document.body.removeChild( div );
	return text;
}; //end getTextInGutenbergBlock()

const getHtmlInGutenbergBlock = ( block: ActualGutenbergBlock ): string => {
	return 'core/list' === block.name
		? block.attributes.values
		: block.attributes.content;
}; //end getHtmlInGutenbergBlock()

const updateHtmlInGutenbergBlock = (
	block: ActualGutenbergBlock,
	html: string
): ActualGutenbergBlock => {
	return 'core/list' === block.name
		? { ...block, attributes: { values: html } }
		: { ...block, attributes: { content: html } };
};

const split = (
	blocks: ReadonlyArray< SimpleGutenbergBlock >,
	issues: ReadonlyArray< Issue >
): Record< BlockId, TextIssues > => {
	type Split = {
		readonly start: number;
		readonly end: number;
		readonly block: SimpleGutenbergBlock;
	};

	const getIssuesInSplit = ( { start, end }: Split ) =>
		issues
			.filter( ( { offset } ) => start <= offset && offset < end )
			.map( ( issue ) => ( { ...issue, offset: issue.offset - start } ) );

	const init: [ Omit< Split, 'block' > ] = [ { start: 0, end: 0 } ];
	const valid = ( s: Partial< Split > ): s is Split => !! s.block;
	const make = ( offset: number, block: SimpleGutenbergBlock ): Split => ( {
		block,
		start: offset,
		end: offset + block.text.length + 1,
	} );

	const splits = blocks
		.reduce( ( [ h, ...t ], b ) => [ make( h.end, b ), h, ...t ], init )
		.filter( valid )
		.reduce( ( a, v ) => [ v, ...a ], [] );

	return splits.reduce(
		( r, split ) => ( {
			...r,
			[ split.block.id ]: [ split.block.text, getIssuesInSplit( split ) ],
		} ),
		{}
	);
};

const createContentEditableElement = (): ContentEditableElement => {
	const aux = document.createElement( 'div' );
	aux.innerHTML = '<div contentEditable></div>';
	return aux.firstChild as ContentEditableElement;
};
