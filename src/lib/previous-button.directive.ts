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
	selector: 'button[previousButton], button[backButton]',
	standalone: true,
	host: {
		class: 'stepper__button stepper__button--back'
	}
})
export class PreviousButtonDirective implements AfterContentInit {
	#injector = inject(Injector);
	#stepper = inject(StepperComponent);

	@HostBinding('disabled') disabled = false;

	@HostListener('click') onClick() {
		this.#stepper.goToPrevious();
	}

	ngAfterContentInit(): void {
		effect(
			() => {
				const nextIndex = this.#stepper.currentIndex - 1;
				const nextStep = this.#stepper.steps.toArray()[nextIndex];
				this.disabled = !nextStep || nextStep.disabled;
			},
			{ injector: this.#injector }
		);
	}
}
