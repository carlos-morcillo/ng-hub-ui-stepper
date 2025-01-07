import { TemplateRef, Directive } from '@angular/core';

@Directive({
    selector: '[hubStepTrigger] [stepTrigger]',
    standalone: false
})
export class StepTriggerDirective {
	constructor(public template: TemplateRef<any>) {}
}
