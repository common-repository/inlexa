import { textContent } from './strings';

// ==============
//   TYPES
// ==============

type RangeLocation = {
	readonly node: Node;
	readonly index: number;
};

export type ContentEditableElement = HTMLElement & {
	readonly isContentEditable: true;
};

// ==============
//   FUNCTIONS
// ==============

export const isContentEditableElement = (
	el: HTMLElement
): el is ContentEditableElement => true === el.isContentEditable;

export const getTextInContentEditable = (
	el: ContentEditableElement
): string => textContent( el );

export const selectTextInContentEditable = (
	el: ContentEditableElement,
	start: number,
	end: number
): void => {
	const text = getTextInContentEditable( el );

	const numLeftChars = countChars( text.substring( 0, start ) );
	const numRightChars = countChars( text.substring( end, text.length ) );

	const { node: leftNode, index: indexInLeftNode } = getRangeLocation(
		'start',
		el,
		numLeftChars
	);
	const { node: rightNode, index: indexInRightNode } = getRangeLocation(
		'end',
		el,
		numRightChars
	);

	// eslint-disable-next-line @wordpress/no-global-get-selection
	const range = document.createRange();
	range.setStart( leftNode, indexInLeftNode );
	range.setEnd( rightNode, indexInRightNode );
	focus( range );
	select( range );
};

export const replaceTextInContentEditable = (
	el: ContentEditableElement,
	start: number,
	end: number,
	replacement: string
): void => {
	selectTextInContentEditable( el, start, end );

	// eslint-disable-next-line @wordpress/no-global-get-selection
	const selection = window.getSelection();
	if ( ! selection ) {
		return;
	} //end if

	const range = !! selection.rangeCount && selection.getRangeAt( 0 );
	if ( ! range ) {
		return;
	} //end if

	range.deleteContents();
	range.insertNode( document.createTextNode( replacement ) );
	range.collapse();
};

// ==============
//   HELPERS
// ==============

const focus = ( range: Range ): void => {
	window.getSelection()?.removeAllRanges();
	window.getSelection()?.addRange( range );
};

const select = focus;

function countChars( text: string ): number {
	return text.replace( /\s/gi, '' ).length;
} //end countChars()

function getRangeLocation(
	mode: 'start' | 'end',
	el: Node,
	numChars: number
): RangeLocation {
	const children = Array.from( el.childNodes ).filter(
		( c ) => !! countChars( textContent( c ) )
	);
	if ( 'end' === mode ) {
		children.reverse();
	} //end if

	const charCounts = children.map( ( child ) =>
		countChars( textContent( child ) )
	);
	const accumulatedCharCounts = charCounts.reduce(
		( acc, val, i ) => [ ...acc, val + ( acc[ i - 1 ] || 0 ) ],
		[]
	);

	const isSkippable = ( i: number ): boolean =>
		accumulatedCharCounts[ i ] === numChars &&
		i < accumulatedCharCounts.length;

	for ( let i = 0; i < accumulatedCharCounts.length; ++i ) {
		while ( isSkippable( i ) ) {
			++i;
		} //end while

		if ( accumulatedCharCounts[ i ] >= numChars ) {
			return getRangeLocation(
				mode,
				children[ i ],
				numChars - ( accumulatedCharCounts[ i - 1 ] || 0 )
			);
		} //end if
	} //end for

	const text: string = el.textContent || '';
	const regexp =
		'start' === mode
			? new RegExp( `^\\s*(?:[^\\s]\\s*){${ numChars }}` )
			: new RegExp( `(?:\\s*[^\\s]){${ numChars }}\\s*$` );
	const match = ( text.match( regexp ) || [ '' ] )[ 0 ];
	const index = 'start' === mode ? match.length : text.length - match.length;

	return { node: el, index };
} //end getRangeLocation()
