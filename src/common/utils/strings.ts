import { reduce, trim } from 'lodash';

const BLOCK_NODES = [
	'ARTICLE',
	'ASIDE',
	'BLOCKQUOTE',
	'DIV',
	'H1',
	'H2',
	'H3',
	'H4',
	'H5',
	'LI',
	'OL',
	'P',
	'UL',
];

export function textContent( el: Node ): string {
	return textContentRec( el )
		.split( '\n' )
		.map( ( x ) => trim( x.replace( /\s+/g, ' ' ) ) )
		.filter( ( x ) => !! x )
		.join( '\n' );
} //end textContent()

function textContentRec( node: Node ): string {
	if ( ! node || 'PRE' === nodeName( node ) ) {
		return '';
	} //end if

	if ( 'BR' === nodeName( node ) ) {
		return '\n';
	} //end if

	const children = Array.from( node.childNodes );
	if ( ! children.length ) {
		const text = node.textContent || '';
		return text.replace( /\r/g, '' ).replace( /\n/g, ' ' );
	} //end if

	return reduce(
		children,
		( memo, child ) =>
			BLOCK_NODES.includes( nodeName( child ) )
				? `${ memo }\n${ textContentRec( child ) }\n`
				: `${ memo }${ textContentRec( child ) }`,
		''
	);
} //end textContentRec()

function nodeName( node: Node ): string {
	return ! node ? '' : node.nodeName;
} //end nodeName()
