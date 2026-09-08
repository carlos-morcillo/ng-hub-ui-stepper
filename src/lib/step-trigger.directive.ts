import { TemplateRef, Directive } from '@angular/core';

/**
 * Marks an `ng-template` as the trigger the default rail renders for each step, in place of the
 * built-in pill button.
 *
 * It is the counterpart of `hubStepperNav`, one level down: that one replaces the whole rail,
 * this one keeps the rail — its list, its `role="tablist"`, its orientation and its label — and
 * only swaps the control inside each item. A stepper that declares both uses the nav template and
 * ignores this one, because a custom rail draws its own triggers.
 *
 * The template context carries the step as `$implicit` and as `step`, plus `title`, `index`,
 * `isCurrent`, `isCompleted` and `disabled`. Activating a step stays with the consumer, through a
 * template reference on the host:
 *
 * @example
 * ```html
 * <hub-stepper #wizard>
 * 	<ng-template hubStepTrigger let-title="title" let-index="index" let-isCurrent="isCurrent" let-disabled="disabled">
 * 		<button type="button" role="tab" [attr.aria-selected]="isCurrent" [disabled]="disabled" (click)="wizard.goTo(index)">
 * 			{{ index + 1 }}. {{ title }}
 * 		</button>
 * 	</ng-template>
 * 	<hub-step title="Account">…</hub-step>
 * </hub-stepper>
 * ```
 */
@Directive({
	selector: '[hubStepTrigger], [stepTrigger]'
})
export class StepTriggerDirective {
	/** Captured template reference projected into the parent stepper. */
	constructor(public template: TemplateRef<any>) {}
}
