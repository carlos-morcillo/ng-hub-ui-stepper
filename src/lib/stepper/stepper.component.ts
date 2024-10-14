import {
	AfterContentInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ContentChild,
	ContentChildren,
	EventEmitter,
	inject,
	Input,
	Output,
	QueryList,
	signal,
	TemplateRef
} from '@angular/core';
import { NextButtonDirective } from '../next-button.directive';
import { PreviousButtonDirective } from '../previous-button.directive';
import { StepComponent } from '../step/step.component';
import { StepperNavDirective } from '../stepper-nav.directive';
import { SubmitButtonDirective } from '../submit-button.directive';

/**
 * StepperComponent is a multi-step interface component for Angular applications.
 * It manages navigation between steps, handles step content, and provides
 * customization options for navigation and controls.
 */
@Component({
	selector: 'hub-stepper, hub-ui-stepper, ng80-stepper',
	templateUrl: './stepper.component.html',
	styleUrls: ['./stepper.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'stepper'
	}
})
export class StepperComponent implements AfterContentInit {
	#cdr = inject(ChangeDetectorRef);

	/** The index of the current active step */
	currentIndex$ = signal(0);

	get currentIndex(): number {
		return this.currentIndex$();
	}

	/** Label for the back button */
	@Input() backLabel: string = 'Back';

	/** Label for the continue button */
	@Input() continueLabel: string = 'Continue';

	/** Label for the submit button */
	@Input() submitLabel: string = 'Submit';

	/** Event emitted when the stepper is completed */
	@Output() completed = new EventEmitter<void>();

	/** Event emitted when moving to the previous step */
	@Output() previousStep = new EventEmitter<number>();

	/** Event emitted when moving to the next step */
	@Output() nextStep = new EventEmitter<number>();

	/** QueryList of all StepComponent children */
	@ContentChildren(StepComponent) steps!: QueryList<StepComponent>;

	/** Custom template for stepper navigation */
	@ContentChild(StepperNavDirective, { read: TemplateRef })
	stepperNavTpt?: TemplateRef<any>;

	@ContentChild(PreviousButtonDirective)
	previousButton?: PreviousButtonDirective;

	@ContentChild(NextButtonDirective)
	nextButton?: NextButtonDirective;

	@ContentChild(SubmitButtonDirective)
	submitButton?: SubmitButtonDirective;

	@Input() animationsEnabled: boolean = true;

	/** Get the current active step */
	get currentStep(): StepComponent | null {
		return this.steps?.toArray()[this.currentIndex] ?? null;
	}

	ngAfterContentInit(): void {
		this.initializeSteps();
	}

	/**
	 * Initialize step indices and set up change detection
	 */
	private initializeSteps(): void {
		this.steps.forEach((step, index) => (step.index = index));
		// Consider using ngZone.runOutsideAngular for better performance
		this.#cdr.detectChanges();
	}

	/**
	 * Navigate to the previous step
	 */
	goToPrevious(): void {
		this.goTo(this.currentIndex - 1);
	}

	/**
	 * Navigate to the next step
	 */
	goToNext(): void {
		this.goTo(this.currentIndex + 1);
	}

	/**
	 * Navigate to a specific step by index
	 * @param index The index of the step to navigate to
	 */
	goTo(index: number): void {
		if (this.isStepIndexInBounds(index)) {
			this.currentIndex$.set(index);
			this.#cdr.detectChanges();
			if (index > this.currentIndex) {
				this.nextStep.emit(index);
			} else {
				this.previousStep.emit(index);
			}
		} else {
			console.error(`Invalid step index: ${index}`);
		}
	}

	/**
	 * Check if it's possible to navigate to a specific step
	 * @param index The index of the step to check
	 */
	canNavigateTo(index: number): boolean {
		return this.isStepIndexInBounds(index) && this.isValidStepIndex(index);
	}

	/**
	 * Complete the stepper process
	 */
	complete(): void {
		this.completed.emit();
	}

	/**
	 * Checks if a step at a given index is not disabled.
	 *
	 * @param {number} index - The `index` parameter is a number representing the index of a step in a collection of steps.
	 *
	 * @returns A boolean value. It checks if the step at the given index is not disabled, and returns `true` if it is a valid step
	 * index, and `false` if it is not a valid step index or if the step at that index is disabled.
	 */
	isValidStepIndex(index: number): boolean {
		return !this.steps.toArray()[index]?.disabled$();
	}

	/**
	 * Checks if a given index is within the bounds of the steps array.
	 *
	 * @param {number} index - The `index` parameter is a number representing the step index that you want to check if it is within
	 * the bounds of the steps array.
	 *
	 * @returns A boolean value indicating whether the given index is within the bounds of the steps array.
	 */
	isStepIndexInBounds(index: number): boolean {
		return index >= 0 && index < this.steps.length;
	}
}
