// ==============
//   TYPES
// ==============

type CssColorOptions = {
	readonly tag: string;
	readonly lightClassName?: string;
	readonly darkClassName?: string;
};

// ==============
//   EXPORTS
// ==============

export const generateCssColorVariables = (
	options: CssColorOptions
): string => {
	const { tag, lightClassName = '', darkClassName = '' } = options;
	const light = lightClassName
		? `${ tag }.${ lightClassName } { ${ lightCssVariables } }`
		: '';
	const dark = darkClassName
		? `${ tag }.${ darkClassName } { ${ darkCssVariables } }`
		: '';

	return `
	    ${ tag } { ${ lightCssVariables } }
	    @media (prefers-color-scheme: dark) {
	        ${ tag } { ${ darkCssVariables } }
	    }
	    ${ light }
	    ${ dark }
	`.replace( /\s/g, '' );
};

export const colors = {
	body: {
		foreground: 'var(--wpinlexa-body-foreground)',
		background: 'var(--wpinlexa-body-background)',
	},
	app: {
		foreground: 'var(--wpinlexa-app-foreground)',
		background: 'var(--wpinlexa-app-background)',
		link: {
			base: 'var(--wpinlexa-base-link)',
			hover: 'var(--wpinlexa-hover-link)',
		},
		border: 'var(--wpinlexa-app-border-color)',
		outline: 'var(--wpinlexa-app-outline-color)',
	},
	logo: {
		icon: 'var(--wpinlexa-logo-icon-color)',
		text: 'var(--wpinlexa-logo-text-color)',
	},
	buttons: {
		primary: {
			base: {
				foreground: 'var(--wpinlexa-primary-button-base-foreground)',
				background: 'var(--wpinlexa-primary-button-base-background)',
				border: 'var(--wpinlexa-primary-button-base-border)',
				outline: 'var(--wpinlexa-primary-button-base-outline)',
			},
			hover: {
				foreground: 'var(--wpinlexa-primary-button-hover-foreground)',
				background: 'var(--wpinlexa-primary-button-hover-background)',
				border: 'var(--wpinlexa-primary-button-hover-border)',
			},
			active: {
				foreground: 'var(--wpinlexa-primary-button-active-foreground)',
				background: 'var(--wpinlexa-primary-button-active-background)',
				border: 'var(--wpinlexa-primary-button-active-border)',
			},
			disabled: {
				foreground: 'var(--wpinlexa-primary-button-disabled-foreground)',
				background: 'var(--wpinlexa-primary-button-disabled-background)',
				border: 'var(--wpinlexa-primary-button-disabled-border)',
			},
		},
		secondary: {
			base: {
				foreground: 'var(--wpinlexa-secondary-button-base-foreground)',
				background: 'var(--wpinlexa-secondary-button-base-background)',
				border: 'var(--wpinlexa-secondary-button-base-border)',
				outline: 'var(--wpinlexa-secondary-button-base-outline)',
			},
			hover: {
				foreground: 'var(--wpinlexa-secondary-button-hover-foreground)',
				background: 'var(--wpinlexa-secondary-button-hover-background)',
				border: 'var(--wpinlexa-secondary-button-hover-border)',
			},
			active: {
				foreground: 'var(--wpinlexa-secondary-button-active-foreground)',
				background: 'var(--wpinlexa-secondary-button-active-background)',
				border: 'var(--wpinlexa-secondary-button-active-border)',
			},
			disabled: {
				foreground:
					'var(--wpinlexa-secondary-button-disabled-foreground)',
				background:
					'var(--wpinlexa-secondary-button-disabled-background)',
				border: 'var(--wpinlexa-secondary-button-disabled-border)',
			},
		},
		transparent: {
			base: {
				foreground: 'var(--wpinlexa-transparent-button-base-foreground)',
				background: 'var(--wpinlexa-transparent-button-base-background)',
				border: 'var(--wpinlexa-transparent-button-base-border)',
				outline: 'var(--wpinlexa-transparent-button-base-outline)',
			},
			hover: {
				foreground: 'var(--wpinlexa-transparent-button-hover-foreground)',
				background: 'var(--wpinlexa-transparent-button-hover-background)',
				border: 'var(--wpinlexa-transparent-button-hover-border)',
			},
			active: {
				foreground:
					'var(--wpinlexa-transparent-button-active-foreground)',
				background:
					'var(--wpinlexa-transparent-button-active-background)',
				border: 'var(--wpinlexa-transparent-button-active-border)',
			},
			disabled: {
				foreground:
					'var(--wpinlexa-transparent-button-disabled-foreground)',
				background:
					'var(--wpinlexa-transparent-button-disabled-background)',
				border: 'var(--wpinlexa-transparent-button-disabled-border)',
			},
		},
	},
	toggle: {
		disabled: 'var(--wpinlexa-toggle-disabled)',
		enabled: {
			background: 'var(--wpinlexa-toggle-enabled-background)',
			foreground: 'var(--wpinlexa-toggle-enabled-foreground)',
		},
		outline: 'var(--wpinlexa-toggle-outline)',
	},
	shadows: {
		base: 'var(--wpinlexa-app-base-shadow)',
		hover: 'var(--wpinlexa-app-hovershadow)',
	},
	examples: {
		addition: {
			background: 'var(--wpinlexa-examples-addition-background)',
			foreground: 'var(--wpinlexa-examples-addition-foreground)',
		},
		removal: {
			background: 'var(--wpinlexa-examples-removal-background)',
			foreground: 'var(--wpinlexa-examples-removal-foreground)',
		},
	},
	analysis: {
		fix: {
			foreground: 'var(--wpinlexa-fix-foreground)',
			background: 'var(--wpinlexa-fix-background)',
		},
		checking: {
			foreground: 'var(--wpinlexa-checking-foreground)',
			background: 'var(--wpinlexa-checking-background)',
		},
		good: {
			foreground: 'var(--wpinlexa-good-foreground)',
			background: 'var(--wpinlexa-good-background)',
		},
		suggestion: {
			foreground: 'var(--wpinlexa-suggestion-foreground)',
			background: 'var(--wpinlexa-suggestion-background)',
			highlight: 'var(--wpinlexa-suggestion-highlight)',
			underline: 'var(--wpinlexa-suggestion-underline)',
		},
		error: {
			foreground: 'var(--wpinlexa-error-foreground)',
			background: 'var(--wpinlexa-error-background)',
			highlight: 'var(--wpinlexa-error-highlight)',
			underline: 'var(--wpinlexa-error-underline)',
		},
	},
};

export const fonts = {
	default: {
		family:
			'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Helvetica Neue, sans-serif, Arial',
		size: '14px',
	},
};

export const shadows = {
	regular: `0 1px 10px 0 ${ colors.shadows.base }`,
	hover: `1px 2px 20px 0 ${ colors.shadows.hover }`,
};

// ==============
//   HELPERS
// ==============

const PINK = '#f25d9c';

const cbp = colors.buttons.primary;
const cbs = colors.buttons.secondary;
const cbt = colors.buttons.transparent;

export const lightCssVariables = `
	${ n( colors.body.foreground ) }: #333;
	${ n( colors.body.background ) }: #f6fafd;

	${ n( colors.app.foreground ) }: ${ colors.body.foreground };
	${ n( colors.app.background ) }: white;
	${ n( colors.app.border ) }: #d8e2e8;
	${ n( colors.app.outline ) }: ${ PINK };
	${ n( colors.app.link.base ) }: ${ PINK };
	${ n( colors.app.link.hover ) }: ${ cbp.hover.background };

	${ n( colors.logo.icon ) }: ${ PINK };
	${ n( colors.logo.text ) }: #590d82;

	${ n( cbp.base.background ) }: ${ PINK };
	${ n( cbp.base.foreground ) }: white;
	${ n( cbp.base.border ) }: ${ cbp.base.background };
	${ n( cbp.base.outline ) }: #fba0c6;
	${ n( cbp.hover.background ) }: #f47db0;
	${ n( cbp.hover.foreground ) }: ${ cbp.base.foreground };
	${ n( cbp.hover.border ) }: ${ cbp.hover.background };
	${ n( cbp.active.background ) }: #dd347c;
	${ n( cbp.active.foreground ) }: ${ cbp.base.foreground };
	${ n( cbp.active.border ) }: ${ cbp.active.background };
	${ n( cbp.disabled.background ) }: #e6a0bd;
	${ n( cbp.disabled.foreground ) }: #f2c3d7;
	${ n( cbp.disabled.border ) }: ${ cbp.disabled.background };

	${ n( cbs.base.background ) }: #e9e9ed;
	${ n( cbs.base.foreground ) }: ${ colors.app.foreground };
	${ n( cbs.base.border ) }: #8f8f9d;
	${ n( cbs.base.outline ) }: ${ cbp.base.background };
	${ n( cbs.hover.background ) }: #cdcdd0;
	${ n( cbs.hover.foreground ) }: ${ colors.app.foreground };
	${ n( cbs.hover.border ) }: #777782;
	${ n( cbs.active.background ) }: #acacae;
	${ n( cbs.active.foreground ) }: ${ colors.app.foreground };
	${ n( cbs.active.border ) }: #65656f;
	${ n( cbs.disabled.background ) }: #f4f4f6;
	${ n( cbs.disabled.foreground ) }: #999;
	${ n( cbs.disabled.border ) }: #c5c5cc;

	${ n( cbt.base.background ) }: none;
	${ n( cbt.base.foreground ) }: #3349;
	${ n( cbt.base.border ) }: transparent;
	${ n( cbt.base.outline ) }: ${ cbp.base.background };
	${ n( cbt.hover.background ) }: #c0c7cc54;
	${ n( cbt.hover.foreground ) }: ${ cbt.base.foreground };
	${ n( cbt.hover.border ) }: ${ cbt.base.border };
	${ n( cbt.active.background ) }: #c0c7cc88;
	${ n( cbt.active.foreground ) }: ${ cbt.base.foreground };
	${ n( cbt.active.border ) }: ${ cbt.base.border };
	${ n( cbt.disabled.background ) }: ${ cbt.base.background };
	${ n( cbt.disabled.foreground ) }: #3345;
	${ n( cbt.disabled.border ) }: ${ cbt.base.border };
	
	${ n( colors.toggle.disabled ) }: #abb1b4;
	${ n( colors.toggle.enabled.background ) }: ${ cbp.base.background };
	${ n( colors.toggle.enabled.foreground ) }: ${ cbp.base.foreground };
	${ n( colors.toggle.outline ) }: ${ cbp.base.outline };

	${ n( colors.shadows.base ) }: rgba(35,57,70,0.2);
	${ n( colors.shadows.hover ) }: rgba(35,57,70,0.4);

	${ n( colors.analysis.fix.foreground ) }: white;
	${ n( colors.analysis.fix.background ) }: #11a683;

	${ n( colors.analysis.checking.foreground ) }: #5d82bb;
	${ n( colors.analysis.checking.background ) }: ${ colors.app.background };

	${ n( colors.analysis.good.foreground ) }: #11a683;
	${ n( colors.analysis.good.background ) }: ${ colors.app.background };

	${ n( colors.analysis.suggestion.foreground ) }: #ff9e20;
	${ n( colors.analysis.suggestion.background ) }: ${ colors.app.background };
	${ n( colors.analysis.suggestion.highlight ) }: #ff9e2022;
	${ n( colors.analysis.suggestion.underline ) }: #ff9e20;

	${ n( colors.analysis.error.foreground ) }: #f23452;
	${ n( colors.analysis.error.background ) }: ${ colors.app.background };
	${ n( colors.analysis.error.highlight ) }: #f2345222;
	${ n( colors.analysis.error.underline ) }: #f23452;
	
	${ n( colors.examples.addition.foreground ) }: #1d5933;
	${ n( colors.examples.addition.background ) }: #bae1c8;
	${ n( colors.examples.removal.foreground ) }: #b7001d;
	${ n( colors.examples.removal.background ) }: #ffdfe4;
`;

const darkCssVariables = `
	${ n( colors.body.foreground ) }: white;
	${ n( colors.body.background ) }: #081017;

	${ n( colors.app.foreground ) }: ${ colors.body.foreground };
	${ n( colors.app.background ) }: #15202b;
	${ n( colors.app.border ) }: #38444d;

	${ n( colors.logo.text ) }: white;

	${ n( cbp.disabled.background ) }: #7b4a5f;
	${ n( cbp.disabled.foreground ) }: #917983;

	${ n( cbs.base.background ) }: #8d9cac44;
	${ n( cbs.base.border ) }: #24282d44;
	${ n( cbs.hover.background ) }: #8d9cac66;
	${ n( cbs.hover.border ) }: #24282d66;
	${ n( cbs.active.background ) }: #8d9cac22;
	${ n( cbs.active.border ) }: #24282d22;
	${ n( cbs.disabled.background ) }: #8d9cac11;
	${ n( cbs.disabled.foreground ) }: #647a8c;
	${ n( cbs.disabled.border ) }: #24282d11;

	${ n( cbt.base.foreground ) }: #dde9;
	${ n( cbt.hover.background ) }: #4f4f535c;
	${ n( cbt.active.background ) }: #4f4f5322;
	${ n( cbt.disabled.foreground ) }: #dde5;

	${ n( colors.toggle.disabled ) }: #7d8488;

	${ n( colors.shadows.base ) }: #020212;
	${ n( colors.shadows.hover ) }: #020212;

	${ n( colors.analysis.fix.background ) }: #006f55;

	${ n( colors.analysis.checking.foreground ) }: #1da1f2;
	${ n( colors.analysis.checking.background ) }: ${ colors.body.background };
	${ n( colors.analysis.good.background ) }: ${ colors.body.background };
	${ n( colors.analysis.suggestion.background ) }: ${ colors.body.background };
	${ n( colors.analysis.error.background ) }: ${ colors.body.background };
	
	${ n( colors.examples.addition.foreground ) }: #fff;
	${ n( colors.examples.addition.background ) }: #275136;
	${ n( colors.examples.removal.foreground ) }: #fff;
	${ n( colors.examples.removal.background ) }: #60000f;
`;

function n( string: string ): string {
	return string.replace( 'var(', '' ).replace( ')', '' );
}
