import {
	ChangeDetectionStrategy,
	Component,
	inject,
	Input,
	input,
	OnInit,
	signal,
	TemplateRef,
	viewChild
} from '@angular/core';
import { StepperComponent } from '../stepper/stepper.component';

/** Default animation duration (ms) used by optional step transitions. */
const ANIMATION_DURATION = 256;

/**
 * Defines a single step inside `hub-stepper`.
 * The component exposes metadata (title, disabled state, index) and a projected template as step content.
 */
@Component({
	selector: 'hub-step, hub-ui-step, ng80-step',
	templateUrl: './step.component.html',
	styleUrls: ['./step.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepComponent implements OnInit {
	/** Parent stepper instance injected from the host context. */
	stepper = inject(StepperComponent);

	/** Zero-based position of the step in the parent stepper. */
	readonly index = input.required<number>();

	/** Optional display title rendered in the step navigation. */
	readonly title = input<string>();

	/** Reactive disabled state of this step. */
	disabled$ = signal(false);

	/** Updates the disabled state from template bindings. */
	@Input()
	set disabled(value: boolean) {
		this.disabled$.set(value);
	}

	/** Returns whether the step is disabled. */
	get disabled(): boolean {
		return this.disabled$();
	}

	/** Template reference used by the parent stepper to render step content. */
	readonly innerTemplate = viewChild.required<TemplateRef<any>>('innerTemplate');

	/** Returns the animation state key consumed by content transitions. */
	get animationState() {
		return '*';
	}

	/** Runs initial validation checks for component inputs. */
	ngOnInit(): void {
		this.validateInputs();
	}

	/**
	 * Validates the configured inputs and logs warnings for invalid setups.
	 */
	private validateInputs(): void {
		if (this.index() === undefined) {
			console.warn('StepComponent: index is required');
		}
		if (!this.title()) {
			console.warn('StepComponent: title is recommended for accessibility');
		}
	}

	/**
	 * Returns whether the step can be navigated to.
	 *
	 * @returns `true` when the step is enabled.
	 */
	isAccessible(): boolean {
		return !this.disabled;
	}
}
