import { computed, Directive, inject } from '@angular/core';
import { StepperComponent } from './stepper/stepper.component';

/**
 * Connects a projected button to the stepper completion action.
 * It disables the host button when the current step is disabled.
 */
@Directive({
	selector: 'button[submitButton]',
	standalone: true,
	host: {
		class: 'stepper__button stepper__button--submit',
		'[disabled]': 'disabled()',
		'(click)': 'stepper.complete()'
	}
})
export class SubmitButtonDirective {
	readonly stepper = inject(StepperComponent);

	/** Reflects whether completion is currently allowed. */
	readonly disabled = computed(() => this.stepper.currentStep?.disabled$() ?? false);
}
