import { padStart } from 'lodash';

const RGB_REGEX = /^rgba?\((\d+),(\d+),(\d+)(?:,[^)]+)?\)$/;
const HSL_REGEX = /^hsla?\((\d+),(\d+)%,(\d+)%(?:,[^)]+)?\)$/;

export function isDarkColor( color = '' ): boolean {
	try {
		// NOTE. Test deeply if this can fail (I think it can't).
		color = hexColor( color );
	} catch ( e ) {
		return false;
	} //end try

	if ( ! /^#/.test( color ) ) {
		return false;
	} //end if

	const aux =
		color.length < 5
			? +`0x${ color.slice( 1 ).replace( /./g, '$&$&' ) }`
			: +`0x${ color.slice( 1 ) }`;
	const r = aux >> 16;
	const g = ( aux >> 8 ) & 255;
	const b = aux & 255;

	// HSP equation from http://alienryderflex.com/hsp.html
	const hsp = Math.sqrt(
		0.299 * ( r * r ) + 0.587 * ( g * g ) + 0.114 * ( b * b )
	);
	return hsp <= 127.5;
} //end isDarkColor()

// =========
//  HELPERS
// =========

const hexColor = ( color: string ): string => {
	color = color.replace( /\s*/, '' );
	const hex = ( x: number | string ): string =>
		padStart( Number.parseInt( `${ x }` ).toString( 16 ), 2, '0' );

	const hsl = color.match( HSL_REGEX );
	if ( hsl ) {
		const h = Number.parseInt( hsl[ 1 ] );
		const s = Math.min( Number.parseInt( hsl[ 1 ] ), 100 ) / 100;
		const l = Math.min( Number.parseInt( hsl[ 1 ] ), 100 ) / 100;
		const { r, g, b } = hslToRgb( h, s, l );
		return `#${ hex( r ) }${ hex( g ) }${ hex( b ) }`;
	} //end if

	const rgb = color.match( RGB_REGEX );
	if ( rgb ) {
		const r = rgb[ 1 ];
		const g = rgb[ 2 ];
		const b = rgb[ 3 ];
		return `#${ hex( r ) }${ hex( g ) }${ hex( b ) }`;
	} //end if

	if ( ! /^#/.test( color ) ) {
		return '';
	} //end if

	return color.length < 5
		? '#' + color.slice( 1 ).replace( /./g, '$&$&' )
		: color;
};

const hslToRgb = (
	h: number,
	s: number,
	l: number
): { r: number; g: number; b: number } => {
	const c = ( 1 - Math.abs( 2 * l - 1 ) ) * s;
	const x = c * ( 1 - Math.abs( ( ( h / 60 ) % 2 ) - 1 ) );
	const m = l - c / 2;

	let r = 0;
	let g = 0;
	let b = 0;

	if ( 0 <= h && h < 60 ) {
		r = c;
		g = x;
		b = 0;
	} else if ( 60 <= h && h < 120 ) {
		r = x;
		g = c;
		b = 0;
	} else if ( 120 <= h && h < 180 ) {
		r = 0;
		g = c;
		b = x;
	} else if ( 180 <= h && h < 240 ) {
		r = 0;
		g = x;
		b = c;
	} else if ( 240 <= h && h < 300 ) {
		r = x;
		g = 0;
		b = c;
	} else if ( 300 <= h && h < 360 ) {
		r = c;
		g = 0;
		b = x;
	} //end if

	r = Math.round( ( r + m ) * 255 );
	g = Math.round( ( g + m ) * 255 );
	b = Math.round( ( b + m ) * 255 );

	return { r, g, b };
};
