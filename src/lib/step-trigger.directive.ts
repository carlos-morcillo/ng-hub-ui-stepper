import { TemplateRef, Directive } from '@angular/core';

@Directive({
	selector: '[hubStepTrigger] [stepTrigger]'
})
export class StepTriggerDirective {
	constructor(public template: TemplateRef<any>) {}
}
