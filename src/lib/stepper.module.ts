import { ModuleWithProviders, NgModule } from '@angular/core';
import { StepTriggerDirective } from './step-trigger.directive';
import { StepComponent } from './step/step.component';
import { StepperNavDirective } from './stepper-nav.directive';
import { StepperComponent } from './stepper/stepper.component';
import { PreviousButtonDirective } from './previous-button.directive';
import { NextButtonDirective } from './next-button.directive';
import { SubmitButtonDirective } from './submit-button.directive';
import { StepperConfig } from './stepper-config';
import { provideHubStepper } from './stepper.providers';

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
	 * @deprecated Goes with the module in **23.0.0**. Replace it with
	 * `provideHubStepper(config)`, which registers the same dictionaries and the same
	 * `HubTranslationService` without a module. This method now delegates to it, so the swap
	 * changes nothing at runtime.
	 *
	 * @param config Optional language and fallback language override.
	 * @returns Module providers with translation configuration.
	 */
	static forRoot(config?: StepperConfig): ModuleWithProviders<StepperModule> {
		return {
			ngModule: StepperModule,
			providers: [provideHubStepper(config)]
		};
	}
}
