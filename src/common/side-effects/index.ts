import {
	capitalize,
	keyBy,
	map,
	reduce,
	reverse,
	sortBy,
	trim,
	without,
} from 'lodash';
import { v4 as uuid } from 'uuid';

import { _x } from '@neliosoft/inlexa/i18n';
import { updateContext } from '@neliosoft/inlexa/utils';

import type {
	AwsIssue,
	AwsResponse,
	AnalysisResponse,
	BibDoc,
	ErrorResponse,
	Issue,
	Language,
	RecursivePartial,
	Rule,
	RuleExample,
	RuleId,
} from '@neliosoft/inlexa/types';

const AWS_URL = 'https://api.inlexa.es/v2';

export async function login(
	token: string,
	clientId: string,
	clientName: string
) {
	const response = await fetch( `${ AWS_URL }/signin`, {
		method: 'POST',
		body: JSON.stringify( { token } ),
		headers: {
			'Inlexa-Client-Id': clientId,
			'Inlexa-Client-Name': clientName,
		},
	} );
	const json = await response.json();
	return new Promise( ( done, fail ) =>
		response.ok ? done( json ) : fail( failedLoginMessage( json?.message ) )
	);
} //end login()

export async function logout( token: string, clientId: string ) {
	const response = await fetch( `${ AWS_URL }/token/${ token }/client`, {
		method: 'DELETE',
		headers: { 'Inlexa-Client-Id': clientId },
	} );
	const json = await response.json();
	return new Promise( ( done, fail ) =>
		response.ok ? done( json ) : fail( json )
	);
} //end logout()

export async function checkCredentials(
	token: string,
	clientId: string
): Promise< boolean > {
	if ( ! token || ! clientId ) {
		return false;
	} //end if

	const response = await fetch( `${ AWS_URL }/token/${ token }/client` );
	const json = await response.json();
	return map( json.clients, 'id' ).includes( clientId );
} //end checkCredentials()

export async function getIssues(
	token: string,
	clientId: string,
	language: Language,
	text: string
): Promise< AnalysisResponse > {
	try {
		const response = await fetch( `${ AWS_URL }/check?lang=${ language }`, {
			method: 'POST',
			body: text,
			headers: {
				Authorization: token,
				'Inlexa-Client-Id': clientId,
			},
		} );

		if ( ! response.ok ) {
			return getError( `${ response.status }` );
		} //end if

		const json: RecursivePartial< AwsResponse > = await response.json();
		const issues = parseResponse( json );

		return {
			type: 'success',
			result: sortBy(
				merge( issues )
					.filter( isValidIssue )
					.map( ( issue ) => updateContext( text, issue ) ),
				[ 'offset' ]
			),
		};
	} catch ( e ) {
		return getError();
	} //end try
} //end getIssues()

// =========
//  HELPERS
// =========

type AwsIssueWithRule = Omit< AwsIssue, 'ruleId' > & {
	readonly rule: Rule;
};

const failedLoginMessage = ( reason?: unknown ): string => {
	if ( typeof reason !== 'string' || ! trim( reason ) ) {
		return _x( 'Unable to log in.', 'text', 'inlexa' );
	} //end if

	return _x( 'Login Error! %s', 'text', 'inlexa' ).replace(
		'%s',
		capitalize( trim( reason ) )
	);
};

const getError = ( status = '' ): ErrorResponse => {
	const reasons = {
		'401': _x( 'unauthorized access', 'text', 'inlexa' ),
		'429': _x( 'no quota available', 'text', 'inlexa' ),
	};

	const reason =
		reasons[ status ] ?? _x( 'unknown', 'text (reason)', 'inlexa' );

	return {
		type: 'error',
		error: _x(
			'Unable to retrieve issues. Reason: %s.',
			'text',
			'inlexa'
		).replace( '%s', reason ),
	};
};

const DEFAULT_ISSUE: Omit< AwsIssue, 'ruleId' > = {
	length: 0,
	offset: 0,
	replacements: [],
};

const DEFAULT_CONTEXT: Issue[ 'context' ] = {
	before: '',
	match: '',
	after: '',
};

const DEFAULT_RULE: Omit< Rule, 'id' > = {
	name: '',
	category: '',
	summary: '',
	description: '',
	type: '',
	bibliography: [],
	examples: [],
};

const parseResponse = (
	response?: RecursivePartial< AwsResponse >
): ReadonlyArray< AwsIssueWithRule > => {
	if ( ! response || ! response.issues || ! response.rules ) {
		return [];
	} //end if

	if ( ! Array.isArray( response.issues ) ) {
		return [];
	} //end if

	const rules = keyBy(
		response.rules.map( parseAwsRule ).filter( isValidRule ),
		'id'
	);

	const isValidAwsIssue = ( i?: AwsIssueWithRule ): i is AwsIssueWithRule =>
		!! i;
	return response.issues
		.map( ( i ) => parseAwsIssue( rules, i ) )
		.filter( isValidAwsIssue );
};

const parseAwsRule = ( rule: RecursivePartial< Rule > ): Rule | undefined => {
	if ( ! rule.id ) {
		return;
	} //end if

	return {
		...DEFAULT_RULE,
		...rule,
		id: rule.id,
		examples: rule.examples?.filter( isValidExample ) ?? [],
		bibliography: parseBibliography( rule.bibliography ),
	};
};

const parseBibliography = (
	bibliography?: RecursivePartial< ReadonlyArray< BibDoc > >
): ReadonlyArray< BibDoc > => {
	if ( ! bibliography || ! Array.isArray( bibliography ) ) {
		return [];
	} //end if
	return bibliography.filter( isValidBibDoc ).map( ( bib ) => ( {
		...bib,
		authors: Array.isArray( bib.authors ) ? bib.authors : [],
	} ) );
};

const parseAwsIssue = (
	rules: Record< RuleId, Rule >,
	issue: Partial< AwsIssue >
): AwsIssueWithRule | undefined => {
	if ( ! issue.ruleId ) {
		return;
	} //end if

	const rule = rules[ issue.ruleId ];
	if ( ! rule ) {
		return;
	} //end if

	return {
		...DEFAULT_ISSUE,
		...issue,
		rule,
	};
};

const merge = (
	awsIssues: ReadonlyArray< AwsIssueWithRule >
): ReadonlyArray< Issue > => {
	const issues = awsIssues.map( ( issue ) => ( {
		id: uuid(),
		type: issue.rule.type,
		offset: issue.offset,
		length: issue.length,
		context: DEFAULT_CONTEXT,
		matches: [
			{
				rule: issue.rule,
				offset: issue.offset,
				length: issue.length,
				text: '',
				replacements: issue.replacements,
			},
		],
	} ) );

	return reduce(
		reverse( sortBy( issues, 'length' ) ),
		( acc, issue ) => {
			const parent = findParentIssue( acc, issue );
			return parent
				? [ ...without( acc, parent ), add( parent, issue ) ]
				: [ ...acc, issue ];
		},
		[]
	);
};

const findParentIssue = (
	acc: ReadonlyArray< Issue >,
	issue: Issue
): Issue | false => {
	for ( const candidate of acc ) {
		if ( containsIssue( candidate, issue ) ) {
			return candidate;
		} //end if
	} //end for
	return false;
};

const containsIssue = ( parent: Issue, child: Issue ): boolean => {
	const parentStart = parent.offset;
	const parentEnd = parent.offset + parent.length;
	const childStart = child.offset;
	const childEnd = child.offset + child.length;
	return parentStart <= childStart && childEnd <= parentEnd;
};

const add = ( parent: Issue, child: Issue ): Issue => ( {
	...parent,
	matches: [ ...parent.matches, ...child.matches ],
} );

const isValidIssue = ( i?: Partial< Issue > ): i is Issue =>
	!! i && !! i.length;

const isValidRule = ( r?: Partial< Rule > ): r is Rule =>
	!! r &&
	0 < trim( r.id ).length &&
	0 < trim( r.name ).length &&
	typeof r.description === 'string' &&
	Array.isArray( r.examples ) &&
	0 < trim( r.type ).length &&
	0 < trim( r.category ).length &&
	Array.isArray( r.bibliography );

const isValidExample = ( ex?: Partial< RuleExample > ): ex is RuleExample =>
	!! ex && 0 < trim( ex.exclusive ).length && 0 < trim( ex.inclusive ).length;

const isValidBibDoc = ( bd?: Partial< BibDoc > ): bd is BibDoc =>
	!! bd && 0 < trim( bd.title ).length;
