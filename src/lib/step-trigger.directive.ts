import { TemplateRef, Directive } from '@angular/core';

/**
 * Marks an `ng-template` as a custom trigger template for an individual step.
 */
@Directive({
	selector: '[hubStepTrigger], [stepTrigger]'
})
export class StepTriggerDirective {
	/** Captured template reference projected into the parent stepper. */
	constructor(public template: TemplateRef<any>) {}
}
