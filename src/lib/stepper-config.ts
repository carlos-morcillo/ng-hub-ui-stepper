/**
 * Stepper i18n configuration accepted by `provideHubStepper()` and by the deprecated
 * `StepperModule.forRoot()`.
 */
export interface StepperConfig {
	/**
	 * Active language code (e.g. "en", "es").
	 */
	language?: string;

	/**
	 * Fallback language code when the key is missing.
	 */
	fallbackLanguage?: string;
}
