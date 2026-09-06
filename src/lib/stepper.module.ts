import { ModuleWithProviders, NgModule } from '@angular/core';
import { HUB_TRANSLATION_CONFIG, HubTranslationService } from 'ng-hub-ui-utils';
import { locale as enLocale } from './assets/i18n/en';
import { locale as esLocale } from './assets/i18n/es';
import { locale as caLocale } from './assets/i18n/ca';
import { locale as euLocale } from './assets/i18n/eu';
import { locale as glLocale } from './assets/i18n/gl';
import { locale as astLocale } from './assets/i18n/ast';
import { locale as anLocale } from './assets/i18n/an';
import { locale as deLocale } from './assets/i18n/de';
import { locale as zhLocale } from './assets/i18n/zh';
import { locale as arLocale } from './assets/i18n/ar';
import { StepTriggerDirective } from './step-trigger.directive';
import { StepComponent } from './step/step.component';
import { StepperNavDirective } from './stepper-nav.directive';
import { StepperComponent } from './stepper/stepper.component';
import { PreviousButtonDirective } from './previous-button.directive';
import { NextButtonDirective } from './next-button.directive';
import { SubmitButtonDirective } from './submit-button.directive';
import { StepperConfig } from './stepper-config';

/** Default language used when no explicit language is provided. */
const DEFAULT_LANGUAGE = 'es';

/** Built-in dictionaries shipped with the stepper library. */
const STEPPER_DICTIONARIES = {
	[enLocale.lang]: enLocale.data,
	[esLocale.lang]: esLocale.data,
	[caLocale.lang]: caLocale.data,
	[euLocale.lang]: euLocale.data,
	[glLocale.lang]: glLocale.data,
	[astLocale.lang]: astLocale.data,
	[anLocale.lang]: anLocale.data,
	[deLocale.lang]: deLocale.data,
	[zhLocale.lang]: zhLocale.data,
	[arLocale.lang]: arLocale.data
};

/** All stepper building blocks as a convenience array. */
const STEPPER_STANDALONE = [
	StepperComponent,
	StepComponent,
	StepTriggerDirective,
	StepperNavDirective,
	PreviousButtonDirective,
	NextButtonDirective,
	SubmitButtonDirective
] as const;

/**
 * Backward-compatibility module that re-exports all stepper standalone building blocks.
 *
 * @deprecated Import the building blocks directly — `StepperComponent`, `StepComponent`,
 * `StepTriggerDirective`, `StepperNavDirective`, `PreviousButtonDirective`,
 * `NextButtonDirective` and `SubmitButtonDirective` are all standalone. Scheduled for
 * removal in **23.0.0**, `forRoot()` included: see its own note for what replaces it.
 */
@NgModule({
	imports: [...STEPPER_STANDALONE],
	exports: [...STEPPER_STANDALONE]
})
export class StepperModule {
	/**
	 * Registers built-in dictionaries and resolves the active translation language.
	 *
	 * @deprecated Goes with the module in **23.0.0**. The bundled dictionaries are not part
	 * of the public API, so a standalone application names the three built-in controls
	 * either through the `backLabel` / `continueLabel` / `submitLabel` inputs of
	 * `<hub-stepper>`, or by registering its own dictionary with `provideHubTranslation()`
	 * from `ng-hub-ui-utils` under the `HUBUI.STEPPER` namespace. `provideHubTranslation()`
	 * is also what supplies `HubTranslationService`, which the stepper's `translate` pipe
	 * requires; without it the pipe has nothing to inject.
	 *
	 * @param config Optional language and fallback language override.
	 * @returns Module providers with translation configuration.
	 */
	static forRoot(config?: StepperConfig): ModuleWithProviders<StepperModule> {
		return {
			ngModule: StepperModule,
			providers: [
				{
					provide: HUB_TRANSLATION_CONFIG,
					useValue: {
						dictionaries: STEPPER_DICTIONARIES,
						language: config?.language ?? DEFAULT_LANGUAGE,
						fallbackLanguage: config?.fallbackLanguage ?? 'en'
					}
				},
				HubTranslationService
			]
		};
	}
}
