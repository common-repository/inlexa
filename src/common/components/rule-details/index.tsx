import * as React from 'react';

import { Div } from '@neliosoft/inlexa/components';
import { css } from '@neliosoft/inlexa/css';
import { _x } from '@neliosoft/inlexa/i18n';
import { colors } from '@neliosoft/inlexa/theme';
import type { Rule } from '@neliosoft/inlexa/types';
import { BibItem } from './bib-item';
import { Example } from './example';

// ===============================
//   TYPES
// ===============================

export type RuleDetailsProps = {
	readonly className?: string;
	readonly rule: Rule;
};

// ===============================
//   VIEW
// ===============================

export const RuleDetails = ( {
	className,
	rule,
}: RuleDetailsProps ): JSX.Element => (
	<Div className={ className }>
		<Intro rule={ rule } />
		<Examples rule={ rule } />
		<Bibliography rule={ rule } />
	</Div>
);

// ==============
//  HELPER VIEWS
// ==============

type RuleProp = {
	readonly rule: Rule;
};

const Intro = ( { rule }: RuleProp ) => (
	<>
		<Div className={ RULE_NAME }>{ rule.name }</Div>
		{ rule.description.split( /\n+/ ).map( ( par, index ) => (
			<Div key={ index } className={ PAR_STYLE }>
				{ par }
			</Div>
		) ) }
	</>
);

const Examples = ( { rule }: RuleProp ) => {
	if ( ! rule.examples.length ) {
		return null;
	} //end if

	return (
		<Div>
			<Div className={ TITLE }>
				{ _x( 'Examples', 'text', 'inlexa' ) }
			</Div>
			<Div className={ INDENT }>
				{ rule.examples.map( ( { exclusive, inclusive } ) => (
					<Example exclusive={ exclusive } inclusive={ inclusive } />
				) ) }
			</Div>
		</Div>
	);
};

const Bibliography = ( { rule }: RuleProp ) => {
	if ( ! rule.bibliography.length ) {
		return null;
	} //end if

	return (
		<Div>
			<Div className={ TITLE }>
				{ _x( 'Bibliography', 'text', 'inlexa' ) }
			</Div>
			<Div className={ INDENT }>
				{ rule.bibliography.map( ( bib ) => (
					<BibItem item={ bib } />
				) ) }
			</Div>
		</Div>
	);
};

// ==============
//  STYLES
// ==============

const RULE_NAME = css( {
	fontWeight: 'bold',
	fontSize: '1.1em',
	marginBottom: '0.5em',
} );

const PAR_STYLE = css( {
	marginBottom: '1em',
} );

const TITLE = css( {
	color: colors.app.link.base,
	fontWeight: 'bold',
	marginTop: '1.5em',
	marginBottom: '0.5em',
} );

const INDENT = css( {
	marginLeft: '1em',
} );
