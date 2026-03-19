import {
	AfterContentInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnDestroy,
	effect,
	inject,
	signal,
	TemplateRef,
	input,
	output,
	contentChild,
	contentChildren
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TranslatePipe, UcfirstPipe } from 'ng-hub-ui-utils';
import { NextButtonDirective } from '../next-button.directive';
import { PreviousButtonDirective } from '../previous-button.directive';
import { StepComponent } from '../step/step.component';
import { StepperNavDirective } from '../stepper-nav.directive';
import { SubmitButtonDirective } from '../submit-button.directive';
import { StepperAnimationDirection, StepperLayout, StepperOptions } from './stepper-options';

/**
 * Renders and controls a multi-step workflow.
 * It coordinates navigation, state transitions and projected templates for steps and controls.
 */
@Component({
	selector: 'hub-stepper, hub-ui-stepper, ng80-stepper',
	templateUrl: './stepper.component.html',
	styleUrls: ['./stepper.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet, TranslatePipe, UcfirstPipe],
	host: {
		class: 'stepper',
		'[class.stepper--layout-vertical]': 'layout() === StepperLayout.Vertical',
		'[class.stepper--layout-sidebar]': 'layout() === StepperLayout.Sidebar',
		'[class.stepper--rtl]': 'isRtl()'
	}
})
export class StepperComponent implements AfterContentInit, OnDestroy {
	#cdr = inject(ChangeDetectorRef);
	#hostRef = inject(ElementRef<HTMLElement>);
	#animationFrameId: number | null = null;

	/** Exposes layout enum values to the template. */
	readonly StepperLayout = StepperLayout;

	/** Stores the index of the currently active step. */
	readonly currentIndex = signal(0);

	/** Stores whether content transition animation is currently running. */
	readonly contentAnimating = signal(false);

	/** Stores transition direction used by the CSS animation classes. */
	readonly animationDirection = signal<StepperAnimationDirection>(StepperAnimationDirection.Forward);

	/** Optional custom label for the back button. */
	readonly backLabel = input<string | null>(null);

	/** Optional custom label for the continue button. */
	readonly continueLabel = input<string | null>(null);

	/** Optional custom label for the submit button. */
	readonly submitLabel = input<string | null>(null);

	/** Emits once the user completes the last step. */
	readonly completed = output<void>();

	/** Emits the new index when moving to the previous step. */
	readonly previousStep = output<number>();

	/** Emits the new index when moving to the next step. */
	readonly nextStep = output<number>();

	/** Content-projected step definitions. */
	readonly steps = contentChildren(StepComponent);

	/** Automatically assigns each step its zero-based position when the steps collection changes. */
	protected readonly assignStepIndexes = effect(() => {
		this.steps().forEach((step, i) => step.index.set(i));
	});

	/** Optional content-projected template for custom navigation. */
	readonly stepperNavTpt = contentChild(StepperNavDirective, { read: TemplateRef });

	/** Optional custom projected previous button. */
	readonly previousButton = contentChild(PreviousButtonDirective);

	/** Optional custom projected next button. */
	readonly nextButton = contentChild(NextButtonDirective);

	/** Optional custom projected submit button. */
	readonly submitButton = contentChild(SubmitButtonDirective);

	/**
	 * Optional visual and layout configuration for the stepper container.
	 */
	readonly options = input<StepperOptions>({});

	/**
	 * Returns the active layout mode.
	 *
	 * @returns The configured layout or the vertical default.
	 */
	layout(): StepperLayout {
		return this.options()?.layout ?? StepperLayout.Vertical;
	}

	/**
	 * Returns whether right-to-left mode is enabled.
	 *
	 * @returns `true` when RTL mode is active.
	 */
	isRtl(): boolean {
		return this.options()?.rtl ?? false;
	}

	/** Returns the active step component instance or `null` when unavailable. */
	get currentStep(): StepComponent | null {
		return this.steps()?.[this.currentIndex()] ?? null;
	}

	/** Returns whether host classes enable animated transitions. */
	hasAnimationClass(): boolean {
		return this.#hostRef.nativeElement.classList.contains('stepper--animated');
	}

	/** Returns whether transition direction is forward. */
	isForwardAnimation(): boolean {
		return this.animationDirection() === StepperAnimationDirection.Forward;
	}

	/** Returns whether transition direction is backward. */
	isBackwardAnimation(): boolean {
		return this.animationDirection() === StepperAnimationDirection.Backward;
	}

	/** Initializes projected step metadata after content projection. */
	ngAfterContentInit(): void {
		this.initializeSteps();
	}

	/** Clears pending animation frame callbacks on component destroy. */
	ngOnDestroy(): void {
		this.clearAnimationFrame();
	}

	/**
	 * Triggers initial change detection for projected steps.
	 */
	private initializeSteps(): void {
		this.#cdr.detectChanges();
	}

	/**
	 * Navigates to the previous step index.
	 */
	goToPrevious(): void {
		this.goTo(this.currentIndex() - 1);
	}

	/**
	 * Navigates to the next step index.
	 */
	goToNext(): void {
		this.goTo(this.currentIndex() + 1);
	}

	/**
	 * Navigates to a specific step index when it is valid.
	 *
	 * @param index Target step index.
	 */
	goTo(index: number): void {
		if (this.isStepIndexInBounds(index)) {
			const previousIndex = this.currentIndex();
			if (index === previousIndex) {
				return;
			}
			this.animationDirection.set(index > previousIndex ? StepperAnimationDirection.Forward : StepperAnimationDirection.Backward);
			this.currentIndex.set(index);
			this.playContentTransition();
			this.#cdr.detectChanges();
			if (index > previousIndex) {
				this.nextStep.emit(index);
			} else if (index < previousIndex) {
				this.previousStep.emit(index);
			}
		} else {
			console.error(`Invalid step index: ${index}`);
		}
	}

	/**
	 * Returns whether the target step can be activated.
	 *
	 * @param index Target step index.
	 * @returns `true` when index is in bounds and the step is not disabled.
	 */
	canNavigateTo(index: number): boolean {
		return this.isStepIndexInBounds(index) && this.isValidStepIndex(index);
	}

	/**
	 * Completes the stepper workflow and emits the completion event.
	 */
	complete(): void {
		this.completed.emit();
	}

	/**
	 * Returns whether a step at the provided index is enabled.
	 *
	 * @param index Step index to validate.
	 * @returns `true` when the step exists and is enabled.
	 */
	isValidStepIndex(index: number): boolean {
		return !this.steps()?.[index]?.disabled();
	}

	/**
	 * Returns whether the provided index is within the steps collection bounds.
	 *
	 * @param index Step index to validate.
	 * @returns `true` when the index points to an existing step.
	 */
	isStepIndexInBounds(index: number): boolean {
		return index >= 0 && index < this.steps().length;
	}

	/**
	 * Starts and schedules the content transition animation lifecycle.
	 */
	private playContentTransition(): void {
		this.clearAnimationFrame();
		this.contentAnimating.set(false);
		if (!this.hasAnimationClass()) {
			return;
		}
		this.#animationFrameId = globalThis.requestAnimationFrame(() => {
			this.contentAnimating.set(true);
			this.#cdr.detectChanges();
		});
	}

	/**
	 * Clears the pending animation frame used to trigger content transitions.
	 */
	private clearAnimationFrame(): void {
		if (this.#animationFrameId !== null) {
			globalThis.cancelAnimationFrame(this.#animationFrameId);
			this.#animationFrameId = null;
		}
	}

	/**
	 * Handles animation end events and resets the active transition state.
	 *
	 * @param event DOM animation end event.
	 */
	onContentAnimationEnd(event: AnimationEvent): void {
		if (event.target !== event.currentTarget) {
			return;
		}
		this.contentAnimating.set(false);
		this.#cdr.detectChanges();
	}
}
