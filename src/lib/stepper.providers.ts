import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { HUB_TRANSLATION_CONFIG, HubTranslationService } from 'ng-hub-ui-utils';
import { locale as anLocale } from './assets/i18n/an';
import { locale as arLocale } from './assets/i18n/ar';
import { locale as astLocale } from './assets/i18n/ast';
import { locale as caLocale } from './assets/i18n/ca';
import { locale as deLocale } from './assets/i18n/de';
import { locale as enLocale } from './assets/i18n/en';
import { locale as esLocale } from './assets/i18n/es';
import { locale as euLocale } from './assets/i18n/eu';
import { locale as glLocale } from './assets/i18n/gl';
import { locale as zhLocale } from './assets/i18n/zh';
import { StepperConfig } from './stepper-config';

/** Default language used when the caller names none. */
const DEFAULT_LANGUAGE = 'es';

/** Language the lookup falls back to when a key is missing from the active one. */
const DEFAULT_FALLBACK_LANGUAGE = 'en';

/**
 * The three control labels the stepper renders on its own, keyed by language code.
 *
 * Exported so an application can register only the languages it ships, merge them into a
 * dictionary of its own, or translate them further, instead of retyping thirty strings.
 * The keys are flat (`BACK` / `CONTINUE` / `SUBMIT`) because that is what the component
 * resolves after its `HUBUI.STEPPER` namespace misses — nesting them here would silently
 * stop matching.
 *
 * Frozen through: the record is shared by every application on the page, so a consumer that
 * meant to extend it has to spread it rather than write into it.
 */
export const STEPPER_DICTIONARIES: Readonly<Record<string, Readonly<Record<string, string>>>> = Object.freeze({
	[enLocale.lang]: Object.freeze(enLocale.data),
	[esLocale.lang]: Object.freeze(esLocale.data),
	[caLocale.lang]: Object.freeze(caLocale.data),
	[euLocale.lang]: Object.freeze(euLocale.data),
	[glLocale.lang]: Object.freeze(glLocale.data),
	[astLocale.lang]: Object.freeze(astLocale.data),
	[anLocale.lang]: Object.freeze(anLocale.data),
	[deLocale.lang]: Object.freeze(deLocale.data),
	[zhLocale.lang]: Object.freeze(zhLocale.data),
	[arLocale.lang]: Object.freeze(arLocale.data)
});

/**
 * Standalone entry point for the stepper: registers the bundled `en` / `es` / `ca` / `eu` /
 * `gl` / `ast` / `an` / `de` / `zh` / `ar` dictionaries and the `HubTranslationService` that
 * the built-in Back / Continue / Submit controls resolve their text through.
 *
 * ```ts
 * import { provideHubStepper } from 'ng-hub-ui-stepper';
 *
 * bootstrapApplication(AppComponent, {
 * 	providers: [provideHubStepper({ language: 'en' })]
 * });
 * ```
 *
 * It writes `HUB_TRANSLATION_CONFIG`, which is a single application-wide token: an app that
 * also calls `provideHubTranslation()` at the root should register the stepper languages in
 * that call — `STEPPER_DICTIONARIES` is exported for exactly that — or scope this one to the
 * route that owns the wizard, or the later provider wins and the other library loses its
 * dictionaries.
 *
 * @param config Optional language and fallback language override.
 * @returns Environment providers for the stepper library.
 */
export function provideHubStepper(config?: StepperConfig): EnvironmentProviders {
	return makeEnvironmentProviders([
		{
			provide: HUB_TRANSLATION_CONFIG,
			useValue: {
				dictionaries: STEPPER_DICTIONARIES,
				language: config?.language ?? DEFAULT_LANGUAGE,
				fallbackLanguage: config?.fallbackLanguage ?? DEFAULT_FALLBACK_LANGUAGE
			}
		},
		HubTranslationService
	]);
}
