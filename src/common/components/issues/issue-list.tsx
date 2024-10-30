import * as React from 'react';

import { css } from '@neliosoft/inlexa/css';
import { _x } from '@neliosoft/inlexa/i18n';
import type {
	AnalysisResponse,
	Issue,
	Match,
	Rule,
} from '@neliosoft/inlexa/types';

import { Issue as IssueView } from './issue';
import { StatusGraphic } from '../generic';
import { Div } from '../html';

export type IssueListProps = {
	readonly className?: string;
	readonly response: AnalysisResponse;
	readonly isLocked?: boolean;
	readonly noIssuesLabel?: string;
	readonly rerunButton?: () => JSX.Element;
	readonly onIssueFocus?: ( issue: Issue ) => void;
	readonly onIssueFix?: (
		issue: Issue,
		match: Match,
		replacement: string
	) => void;
	readonly onIssueRemove: ( issue: Issue ) => void;
	readonly onRuleView?: ( rule: Rule ) => void;
};

export const IssueList = ( {
	className,
	response,
	isLocked,
	noIssuesLabel,
	rerunButton,
	onIssueFocus,
	onIssueFix,
	onIssueRemove,
	onRuleView,
}: IssueListProps ): JSX.Element => {
	if ( 'error' === response.type ) {
		return (
			<Div className={ className }>
				<Div className={ NO_ISSUES_STYLE }>
					<Div className={ NO_ISSUES_ICON_STYLE }>
						<StatusGraphic
							type="error"
							className={ css( { opacity: 0.6 } ) }
						/>
					</Div>
					<Div className={ NO_ISSUES_TEXT_STYLE }>
						{ response.error }
					</Div>
				</Div>
			</Div>
		);
	} //end if

	const issues = response.result;
	const RerunButton = rerunButton;
	return (
		<Div className={ className }>
			{ issues.map( ( issue ) => (
				<IssueView
					key={ `issue-${ issue.id }` }
					issue={ issue }
					isLocked={ isLocked }
					onFocus={
						onIssueFocus ? () => onIssueFocus( issue ) : undefined
					}
					onRemove={ () => onIssueRemove( issue ) }
					onFix={
						onIssueFix
							? ( match: Match, replacement: string ) =>
									onIssueFix( issue, match, replacement )
							: undefined
					}
					onRuleView={ onRuleView }
				/>
			) ) }
			{ ! issues.length && (
				<Div className={ NO_ISSUES_STYLE }>
					<Div className={ NO_ISSUES_ICON_STYLE }>
						<StatusGraphic />
					</Div>
					<Div className={ NO_ISSUES_TEXT_STYLE }>
						{ noIssuesLabel ||
							_x( 'Everything looks fine', 'text', 'inlexa' ) }
					</Div>
					{ !! RerunButton ? (
						<Div className={ RERUN_BUTTON_WRAPPER_STYLE }>
							<RerunButton />
						</Div>
					) : null }
				</Div>
			) }
		</Div>
	);
};

const NO_ISSUES_STYLE = css( {
	display: 'flex',
	flexDirection: 'column',
	marginTop: '2em',
} );

const NO_ISSUES_ICON_STYLE = css( {
	opacity: 0.6,
	textAlign: 'center',
} );

const NO_ISSUES_TEXT_STYLE = css( {
	fontSize: '1.2em',
	opacity: 0.8,
	textAlign: 'center',
} );

const RERUN_BUTTON_WRAPPER_STYLE = css( {
	textAlign: 'center',
} );
