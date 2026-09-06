import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHubTranslation } from 'ng-hub-ui-utils';
import { StepComponent } from './step/step.component';
import { StepperComponent } from './stepper/stepper.component';
import { SubmitButtonDirective } from './submit-button.directive';

/** Three steps and a projected completion control, only shown once the last step is active. */
@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent, SubmitButtonDirective],
	template: `
		<hub-stepper #stepper (completed)="completions = completions + 1">
			<hub-step title="One">One</hub-step>
			<hub-step title="Two">Two</hub-step>
			<hub-step title="Three">Three</hub-step>
			<button submitButton>Finish</button>
		</hub-stepper>
	`
})
class SubmitButtonHostComponent {
	readonly stepper = viewChild.required<StepperComponent>('stepper');
	readonly submitButton = viewChild.required(SubmitButtonDirective);
	completions = 0;
}

/**
 * A single disabled step: it is both the active and the last one, so the completion
 * control is rendered while the step it would submit cannot be completed.
 */
@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent, SubmitButtonDirective],
	template: `
		<hub-stepper #stepper>
			<hub-step title="Only" [disabled]="true">Only</hub-step>
			<button submitButton>Finish</button>
		</hub-stepper>
	`
})
class DisabledStepSubmitHostComponent {
	readonly submitButton = viewChild.required(SubmitButtonDirective);
}

describe('SubmitButtonDirective', () => {
	let fixture: ComponentFixture<SubmitButtonHostComponent>;
	let host: SubmitButtonHostComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SubmitButtonHostComponent, DisabledStepSubmitHostComponent],
			providers: [provideHubTranslation()]
		}).compileComponents();

		fixture = TestBed.createComponent(SubmitButtonHostComponent);
		fixture.detectChanges();
		host = fixture.componentInstance;
		// The stepper only projects a completion control on the last step.
		host.stepper().goTo(2);
		fixture.detectChanges();
	});

	it('dresses the projected button with the stepper completion-control classes', () => {
		const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[submitButton]');

		expect(button.classList.contains('stepper__button')).toBe(true);
		expect(button.classList.contains('stepper__button--submit')).toBe(true);
	});

	it('replaces the built-in completion control instead of doubling it', () => {
		expect(fixture.nativeElement.querySelectorAll('.stepper__button--submit').length).toBe(1);
	});

	it('stays enabled while the active step is enabled', () => {
		const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[submitButton]');

		expect(host.submitButton().disabled()).toBe(false);
		expect(button.disabled).toBe(false);
	});

	it('completes the stepper on click', () => {
		const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[submitButton]');

		button.click();
		fixture.detectChanges();

		expect(host.completions).toBe(1);
	});

	it('disables itself when the active step is disabled', () => {
		const disabledFixture = TestBed.createComponent(DisabledStepSubmitHostComponent);
		disabledFixture.detectChanges();

		const button: HTMLButtonElement = disabledFixture.nativeElement.querySelector('button[submitButton]');

		expect(disabledFixture.componentInstance.submitButton().disabled()).toBe(true);
		expect(button.disabled).toBe(true);
	});
});
