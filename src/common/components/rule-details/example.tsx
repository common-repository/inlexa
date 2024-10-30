import * as React from 'react';
import { diffWords } from 'diff';
import { trim } from 'lodash';

import { Div, Span } from '@neliosoft/inlexa/components';
import { css } from '@neliosoft/inlexa/css';
import { colors } from '@neliosoft/inlexa/theme';

export type ExampleProps = {
	readonly exclusive: string;
	readonly inclusive: string;
};

export const Example = ( {
	exclusive,
	inclusive,
}: ExampleProps ): JSX.Element => (
	<Div className={ EXAMPLE }>
		{ diffExample( exclusive, inclusive ).map( ( { mode, value }, key ) => (
			<Span key={ key }>
				<Span className={ getStyle( mode ) }>{ value }</Span>{ ' ' }
			</Span>
		) ) }
	</Div>
);

// =========
//  STYLES
// =========

const EXAMPLE = css( {
	marginBottom: '1em',
	lineHeight: '1.5em',
} );

const BOX = {
	borderRadius: '2px',
	padding: '0 0.2em',
};

const ADDITION = css( {
	...BOX,
	backgroundColor: colors.examples.addition.background,
	color: colors.examples.addition.foreground,
} );

const REMOVAL = css( {
	...BOX,
	backgroundColor: colors.examples.removal.background,
	color: colors.examples.removal.foreground,
	textDecoration: 'line-through',
} );

// =========
//  HELPERS
// =========

type Diff = {
	readonly value: string;
	readonly mode: 'normal' | 'add' | 'remove';
};

const getStyle = ( mode: Diff[ 'mode' ] ): string => {
	switch ( mode ) {
		case 'add':
			return ADDITION;

		case 'remove':
			return REMOVAL;

		case 'normal':
			return '';
	} //end switch
};

function diffExample(
	exclusive: string,
	inclusive: string
): ReadonlyArray< Diff > {
	const clearExample = ( text = '' ) =>
		text.replace( /\s/g, ' ' ).trim().replace( /\.+/g, '.' );

	exclusive = clearExample( exclusive );
	inclusive = clearExample( inclusive );

	const result = diffWords( exclusive, inclusive )
		.map( ( diff ) => ( {
			...diff,
			value: trim( diff.value ),
		} ) )
		.filter( ( { value } ) => !! value )
		.map(
			( diff ): Diff => ( {
				value: diff.value,
				mode: 'normal',
				...( diff.added && { mode: 'add' } ),
				...( diff.removed && { mode: 'remove' } ),
			} )
		)
		.reduce( ( array, current ) => {
			const [ last, prev, ...rest ] = array;
			if ( last?.mode === current.mode ) {
				return [ combine( last, current ), prev, ...rest ];
			} //end if
			if ( 'normal' === current.mode || 'normal' === last?.mode ) {
				return [ current, last, prev, ...rest ];
			} //end if
			if ( prev?.mode === current.mode ) {
				return [ last, combine( prev, current ), ...rest ];
			} //end if
			return [ current, last, prev, ...rest ];
		}, [] as ReadonlyArray< Diff | undefined > )
		.filter( isDiff );

	return reverse( result );
} //end diffExample()

const combine = ( prev: Diff, curr: Diff ): Diff => ( {
	...prev,
	value: `${ prev.value } ${ curr.value }`,
} );

const isDiff = ( diff?: Diff ): diff is Diff => !! diff;

const reverse = < T extends any >(
	arr: ReadonlyArray< T >
): ReadonlyArray< T > =>
	arr.reduce( ( r, c ) => [ c, ...r ], [] as ReadonlyArray< T > );
