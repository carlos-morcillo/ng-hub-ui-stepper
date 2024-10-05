import { Directive, HostListener, inject } from '@angular/core';
import { StepperComponent } from './stepper/stepper.component';

@Directive({
	selector: '[hubPrevStepButton]'
})
export class PrevStepButtonDirective {
	#stepper = inject(StepperComponent);
	constructor() {}

	@HostListener('click') onClick() {
		this.#stepper.goToPrevious();
	}
}
