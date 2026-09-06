import { computed, Directive, inject } from '@angular/core';
import { StepperComponent } from './stepper/stepper.component';

/**
 * Connects a projected button to the stepper "next" action.
 * It also keeps the button disabled state synchronized with the next step availability.
 */
@Directive({
	selector: 'button[nextButton], button[continueButton]',
	standalone: true,
	host: {
		class: 'stepper__button stepper__button--next',
		'[disabled]': 'disabled()',
		'(click)': 'stepper.goToNext()'
	}
})
export class NextButtonDirective {
	readonly stepper = inject(StepperComponent);

	/** Reflects whether the control can trigger forward navigation. */
	readonly disabled = computed(() => {
		const nextIndex = this.stepper.currentIndex() + 1;
		const nextStep = this.stepper.steps()?.[nextIndex];
		return !nextStep || nextStep.disabled();
	});
}
