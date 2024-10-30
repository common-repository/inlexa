import * as React from 'react';
import { reverse, trim } from 'lodash';

import { Div, Span } from '@neliosoft/inlexa/components';
import { css } from '@neliosoft/inlexa/css';
import { _x } from '@neliosoft/inlexa/i18n';
import type { BibDoc } from '@neliosoft/inlexa/types';

export type BibItemProps = {
	readonly item: BibDoc;
};

export const BibItem = ( { item }: BibItemProps ): JSX.Element => (
	<Div className={ css( { marginBottom: '1em' } ) }>
		{ !! item.authors.length && (
			<Span className={ css( { fontVariant: 'small-caps' } ) }>
				{ pointAndSpace( authors( item ) ) }
			</Span>
		) }
		{ pointAndSpace( item.title ) }
		{ pointAndSpace( bibEnd( item ) ) }
	</Div>
);

// =========
//  HELPERS
// =========

const pointAndSpace = ( str: string ) =>
	trim( str ).length ? `${ trim( str ).replace( /\.$/, '' ) }. ` : '';

function authors( { authors: names }: BibDoc ): string {
	if ( 0 === names.length ) {
		return '';
	} //end if

	if ( 1 === names.length ) {
		return names[ 0 ];
	} //end if

	if ( 2 === names.length ) {
		return _x( '%1$s and %2$s.', 'text (two-item list)', 'inlexa' )
			.replace( '%1$s', names[ 0 ] )
			.replace( '%2$s', names[ 1 ] );
	} //end if

	const [ last, prev, ...head ] = reverse( names );
	const tail = _x( '%1$s, and %2$s.', 'text (n-item list)', 'inlexa' )
		.replace( '%1$s', prev )
		.replace( '%2$s', last );

	return [ ...reverse( head ), tail ].join( ', ' );
} //end authors()

const pages = ( numbers = '' ): string => {
	numbers = numbers.replace( /\s/g, '' );
	if ( ! numbers ) {
		return '';
	} //end if

	const pattern = /^[0-9]+$/.test( numbers )
		? _x( 'p. %s', 'text (page number)', 'inlexa' )
		: _x( 'pp. %s', 'text (page numbers)', 'inlexa' );

	return pattern.replace( '%s', numbers ).replace( /,/, ', ' );
}; //end if

const bibEnd = ( { editor, year, pages: pageNumbers }: BibDoc ) =>
	[ editor, year, pages( pageNumbers ) ]
		.map( trim )
		.filter( Boolean )
		.join( ', ' );
