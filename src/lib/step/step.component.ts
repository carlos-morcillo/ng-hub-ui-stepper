import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
	input,
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
	selector: 'hub-step, hub-ui-step',
	templateUrl: './step.component.html',
	styleUrls: ['./step.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepComponent implements OnInit {
	/** Parent stepper instance injected from the host context. */
	stepper = inject(StepperComponent);

	/**
	 * Zero-based position of this step within the parent stepper.
	 * Assigned automatically by `StepperComponent` — do not set this manually.
	 */
	readonly index = signal<number>(0);

	/** Optional display title rendered in the step navigation. */
	readonly title = input<string>();

	/** Whether the step is disabled and cannot be navigated to. */
	readonly disabled = input(false);

	/** Template reference used by the parent stepper to render step content. */
	readonly innerTemplate = viewChild.required<TemplateRef<any>>('innerTemplate');

	/** Returns the animation state key consumed by content transitions. */
	get animationState() {
		return '*';
	}

	/** Runs initial validation checks for component inputs. */
	ngOnInit(): void {
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
