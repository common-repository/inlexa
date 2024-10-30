import { version as uuidVersion, validate as uuidValidate } from 'uuid';

export function isValidUuid( uuid: string ): boolean {
	return uuidValidate( uuid ) && uuidVersion( uuid ) === 4;
} //end isValidUuid()

export const isInternetExplorer = (): boolean =>
	navigator?.userAgent?.indexOf( 'MSIE' ) > -1 ||
	navigator?.userAgent?.indexOf( 'Trident' ) > -1;
