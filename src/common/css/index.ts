import createEmotion from '@emotion/css/create-instance';
import { isInternetExplorer } from '@neliosoft/inlexa/utils';

import {
	css as ieCss,
	injectGlobal as ieInjectGlobal,
} from './internet-explorer';

const {
	flush,
	hydrate,
	cx,
	merge,
	getRegisteredStyles,
	injectGlobal: originalInjectGlobal,
	keyframes,
	css: originalCss,
	sheet,
	cache,
} = createEmotion( {
	key: 'wpinlexa',
} );

const css: typeof originalCss = isInternetExplorer()
	? ieCss( originalCss )
	: originalCss;

const injectGlobal: ( css: string ) => void = isInternetExplorer()
	? ieInjectGlobal( originalInjectGlobal )
	: originalInjectGlobal;

export {
	flush,
	hydrate,
	cx,
	merge,
	getRegisteredStyles,
	injectGlobal,
	keyframes,
	css,
	sheet,
	cache,
};
