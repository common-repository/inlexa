import * as React from '@wordpress/element';
import { SelectControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { sortBy } from 'lodash';

import { css } from '@neliosoft/inlexa/css';
import { _x } from '@neliosoft/inlexa/i18n';
import type { Language } from '@neliosoft/inlexa/types';

import { STORE } from '@wpinlexa/gutenberg/data';

// TODO.
export const LanguageSelector = () => {
	const { language, setLanguage } = useLanguage();
	const options = sortBy(
		Object.keys( LANGUAGES ).map( ( code: Language ) => ( {
			value: code,
			label: LANGUAGES[ code ](),
		} ) ),
		'label'
	);

	return (
		<div className={ WRAPPER }>
			<span>{ _x( 'Analysis Language:', 'text', 'inlexa' ) }</span>
			<SelectControl
				className={ SELECT }
				value={ language }
				onChange={ setLanguage }
				options={ options }
			/>
		</div>
	);
};

// =======
// HELPERS
// =======

const useLanguage = () => {
	const language = useSelect( ( select ) => select( STORE ).getLanguage() );
	const { setLanguage } = useDispatch( STORE );

	return {
		language,
		setLanguage,
	};
};

const LANGUAGES: Record< Language, () => string > = {
	ca: () => _x( 'Catalan', 'text (lang)', 'inlexa' ),
	es: () => _x( 'Spanish', 'text (lang)', 'inlexa' ),
};

// =======
// STYLES
// =======

const WRAPPER = css( {
	alignItems: 'center',
	display: 'flex',
	flexDirection: 'column',
	marginTop: '2em',
} );

const SELECT = css( {
	'& select': {
		display: 'inline-block',
		width: 'auto',
	},
	'& .components-input-control__backdrop': {
		border: 'none !important',
	},
} );
