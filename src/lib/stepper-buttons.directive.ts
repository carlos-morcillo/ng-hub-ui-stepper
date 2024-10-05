import { TemplateRef, Directive } from '@angular/core';

@Directive({
	selector: '[hubStepperButtons], [stepperButtons]'
})
export class StepperButtonsDirective {
	constructor(public template: TemplateRef<any>) {}
}
