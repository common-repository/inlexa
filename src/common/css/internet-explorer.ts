import { lightCssVariables } from '@neliosoft/inlexa/theme';

type ColorPair = [ string, string ];
type ColorFixPair = [ RegExp, string ];
type TempColorMapping = { done: ColorPair[]; pending: ColorPair[] };

const lightColors = lightCssVariables
	.replace( /\s/g, '' )
	.split( ';' )
	.filter( ( x ) => x.includes( ':' ) )
	.map( ( color ) => color.split( ':' ) )
	.map( ( [ key, val ] ) => [ key, val.replace( /var\(([^)]+)\)/g, '$1' ) ] )
	.reduce(
		( { done, pending }, [ key, value ] ): TempColorMapping => {
			if ( value.includes( '--' ) ) {
				pending = [ ...pending, [ key, value ] ];
			} else {
				done = [ ...done, [ key, value ] ];
			} //end if

			pending = pending.filter( ( [ k, v ] ) => {
				const color = done.filter( ( c ) => c[ 0 ] === v )[ 0 ];
				if ( color ) {
					done = [ ...done, [ k, color[ 1 ] ] ];
					return false;
				} //end if
				return true;
			} );

			return { done, pending };
		},
		{ done: [], pending: [] } as TempColorMapping
	)
	.done.map(
		( [ key, value ] ): ColorFixPair => [
			new RegExp( `var\\(${ key }\\)`, 'gi' ),
			value,
		]
	);

export const css = ( inlexaCss ) => ( style ) => {
	if ( 'string' === typeof style ) {
		return inlexaCss( fixColors( style ) );
	} //end if

	style = JSON.stringify( style );
	style = fixColors( style );
	style = JSON.parse( style );
	return inlexaCss( style );
};

export const injectGlobal = ( inlexaInjectGlobal ) => ( css ) =>
	inlexaInjectGlobal( fixColors( css ) );

// HELPERS

const fixColors = ( string: string ): string =>
	lightColors.reduce(
		( result, [ re, val ] ) => result.replace( re, val ),
		string.replace( /var\(\s*([^)\s]+)\s*\)/g, 'var($1)' )
	);
