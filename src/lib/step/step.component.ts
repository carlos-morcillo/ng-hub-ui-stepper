import { animate, style, transition, trigger } from '@angular/animations';
import {
	ChangeDetectionStrategy,
	Component,
	ContentChild,
	ContentChildren,
	inject,
	Input,
	OnInit,
	QueryList,
	TemplateRef,
	ViewChild
} from '@angular/core';
import { NextStepButtonDirective } from '../next-step-button.directive';
import { PrevStepButtonDirective } from '../prev-step-button.directive';
import { StepTriggerDirective } from '../step-trigger.directive';
import { StepperComponent } from '../stepper/stepper.component';

const ANIMATION_DURATION = 256;

@Component({
	selector: 'hub-step, hub-ui-step, ng80-step',
	templateUrl: './step.component.html',
	styleUrls: ['./step.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
	// animations: [
	// 	trigger('slideInOut', [
	// 		transition(':enter', [
	// 			style({ transform: 'translateX(-100%)', opacity: 0 }),
	// 			animate(
	// 				`${ANIMATION_DURATION}ms ${ANIMATION_DURATION}ms`,
	// 				style({ transform: 'translateX(0%)', opacity: 1 })
	// 			)
	// 		]),
	// 		transition(':leave', [
	// 			animate(
	// 				`${ANIMATION_DURATION}ms ease-in`,
	// 				style({ transform: 'translateX(100%)' })
	// 			)
	// 		])
	// 	])
	// ]
})
export class StepComponent implements OnInit {
	stepper = inject(StepperComponent);

	/** The index of this step in the stepper */
	@Input() index!: number;

	/** The title of this step */
	@Input() title?: string;

	/** Whether this step is disabled */
	@Input() disabled: boolean = false;

	/** Template reference for the content of this step */
	@ViewChild('innerTemplate', { static: true })
	innerTemplate!: TemplateRef<any>;

	/** Custom template for the step trigger */
	@ContentChild(StepTriggerDirective, { read: TemplateRef })
	stepTriggerTpt!: TemplateRef<any>;

	/** Collection of previous step button directives */
	@ContentChildren(PrevStepButtonDirective)
	prevStepButtons!: QueryList<PrevStepButtonDirective>;

	/** Collection of next step button directives */
	@ContentChildren(NextStepButtonDirective)
	nextStepButtons!: QueryList<NextStepButtonDirective>;

	get animationState() {
		return this.stepper.animationsEnabled ? '*' : 'void';
	}

	ngOnInit(): void {
		this.validateInputs();
	}

	/**
	 * Validates the inputs to ensure the component is properly configured
	 */
	private validateInputs(): void {
		if (this.index === undefined) {
			console.warn('StepComponent: index is required');
		}
		if (!this.title) {
			console.warn(
				'StepComponent: title is recommended for accessibility'
			);
		}
	}

	/**
	 * Checks if the step can be navigated to
	 * @returns boolean indicating if the step is accessible
	 */
	isAccessible(): boolean {
		return !this.disabled;
	}
}
