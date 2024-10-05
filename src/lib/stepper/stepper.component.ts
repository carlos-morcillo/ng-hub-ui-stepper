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
	TemplateRef
} from '@angular/core';
import { StepComponent } from '../step/step.component';
import { StepperButtonsDirective } from '../stepper-buttons.directive';
import { StepperNavDirective } from '../stepper-nav.directive';

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
		class: 'stepper d-flex flex-column overflow-auto'
	}
})
export class StepperComponent implements AfterContentInit {
	#cdr = inject(ChangeDetectorRef);

	/** The index of the current active step */
	currentIndex: number = 0;

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

	/** Custom template for stepper controls */
	@ContentChild(StepperButtonsDirective, { read: TemplateRef })
	stepperControlsTpt?: TemplateRef<any>;

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
		if (this.isValidStepIndex(index)) {
			this.currentIndex = index;
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
	 * Check if it's possible to navigate to the next step
	 */
	canGoNext(): boolean {
		const nextIndex = this.currentIndex + 1;
		return (
			this.isValidStepIndex(nextIndex) &&
			!this.steps.toArray()[nextIndex]?.disabled
		);
	}

	/**
	 * Check if it's possible to navigate to a specific step
	 * @param index The index of the step to check
	 */
	canNavigateTo(index: number): boolean {
		return (
			this.isValidStepIndex(index) &&
			!this.steps.toArray()[index]?.disabled
		);
	}

	/**
	 * Complete the stepper process
	 */
	complete(): void {
		this.completed.emit();
	}

	/**
	 * Check if a given index is valid within the current steps
	 * @param index The index to validate
	 */
	private isValidStepIndex(index: number): boolean {
		return index >= 0 && index < this.steps.length;
	}
}
