import { TemplateRef, Directive } from '@angular/core';

/**
 * Marks an `ng-template` as a custom navigation template for `hub-stepper`.
 */
@Directive({
    selector: '[hubStepperNav], [stepperNav]'
})
export class StepperNavDirective {
	/** Captured template reference projected into the parent stepper. */
	constructor(public template: TemplateRef<any>) {}
}
