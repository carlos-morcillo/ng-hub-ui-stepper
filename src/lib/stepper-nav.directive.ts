import { TemplateRef, Directive } from '@angular/core';

@Directive({
    selector: '[hubStepperNav], [stepperNav]',
    standalone: false
})
export class StepperNavDirective {
	constructor(public template: TemplateRef<any>) {}
}
