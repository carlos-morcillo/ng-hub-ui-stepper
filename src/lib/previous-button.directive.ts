import { computed, Directive, inject } from '@angular/core';
import { StepperComponent } from './stepper/stepper.component';

/**
 * Connects a projected button to the stepper "previous" action.
 * It also keeps the button disabled state synchronized with backward navigation availability.
 */
@Directive({
	selector: 'button[previousButton], button[backButton]',
	standalone: true,
	host: {
		class: 'stepper__button stepper__button--back',
		'[disabled]': 'disabled()',
		'(click)': 'stepper.goToPrevious()'
	}
})
export class PreviousButtonDirective {
	readonly stepper = inject(StepperComponent);

	/** Reflects whether the control can trigger backward navigation. */
	readonly disabled = computed(() => {
		const prevIndex = this.stepper.currentIndex() - 1;
		const prevStep = this.stepper.steps()?.[prevIndex];
		return !prevStep || prevStep.disabled;
	});
}
