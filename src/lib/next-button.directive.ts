import {
	AfterContentInit,
	Directive,
	effect,
	HostBinding,
	HostListener,
	inject,
	Injector
} from '@angular/core';
import { StepperComponent } from './stepper/stepper.component';

@Directive({
	selector: 'button[nextButton], button[continueButton]',
	standalone: true,
	host: {
		class: 'stepper__button stepper__button--next'
	}
})
export class NextButtonDirective implements AfterContentInit {
	#injector = inject(Injector);
	#stepper = inject(StepperComponent);

	@HostBinding('disabled') disabled = false;

	@HostListener('click') onClick() {
		this.#stepper.goToNext();
	}

	ngAfterContentInit(): void {
		effect(
			() => {
				const nextIndex = this.#stepper.currentIndex + 1;
				const nextStep = this.#stepper.steps.toArray()[nextIndex];
				this.disabled = !nextStep || nextStep.disabled;
			},
			{ injector: this.#injector }
		);
	}
}
