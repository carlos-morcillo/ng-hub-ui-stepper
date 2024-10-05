import { Directive, HostListener, inject } from '@angular/core';
import { StepperComponent } from './stepper/stepper.component';

@Directive({
	selector: '[hubNextStepButton] [nextStepButton]'
})
export class NextStepButtonDirective {
	#stepper = inject(StepperComponent);
	constructor() {}

	@HostListener('click') onClick() {
		this.#stepper.goToNext();
	}
}
