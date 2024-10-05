import { TemplateRef, Directive } from '@angular/core';

@Directive({
	selector: '[hubStepperNav], [stepperNav]'
})
export class StepperNavDirective {
	constructor(public template: TemplateRef<any>) {}
}
