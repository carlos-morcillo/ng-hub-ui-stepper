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
	selector: 'button[submitButton]',
	standalone: true,
	host: {
		class: 'stepper__button stepper__button--submit'
	}
})
export class SubmitButtonDirective implements AfterContentInit {
	#injector = inject(Injector);
	#stepper = inject(StepperComponent);

	@HostBinding('disabled') disabled = false;

	@HostListener('click') onClick() {
		this.#stepper.complete();
	}

	ngAfterContentInit(): void {
		effect(
			() => {
				this.disabled = this.#stepper.currentStep?.disabled$() ?? false;
			},
			{ injector: this.#injector }
		);
	}
}
