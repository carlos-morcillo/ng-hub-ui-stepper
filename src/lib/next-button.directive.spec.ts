import { Component, ElementRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHubTranslation } from 'ng-hub-ui-utils';
import { NextButtonDirective } from './next-button.directive';
import { StepComponent } from './step/step.component';
import { StepperComponent } from './stepper/stepper.component';

/** Three steps and a projected forward control, with the middle step switchable to disabled. */
@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent, NextButtonDirective],
	template: `
		<hub-stepper #stepper>
			<hub-step title="One">One</hub-step>
			<hub-step title="Two" [disabled]="secondStepDisabled">Two</hub-step>
			<hub-step title="Three">Three</hub-step>
			<button nextButton>Next</button>
		</hub-stepper>
	`
})
class NextButtonHostComponent {
	readonly stepper = viewChild.required<StepperComponent>('stepper');
	readonly nextButton = viewChild.required(NextButtonDirective);
	secondStepDisabled = false;
}

/**
 * The same wiring reached through the `continueButton` half of the directive selector.
 * The button is read by template reference rather than from the rendered stepper because
 * the stepper's content slot selects `button[nextButton]` only, so an aliased control is
 * never placed in the controls row — a projection gap that belongs to the stepper, not here.
 */
@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent, NextButtonDirective],
	template: `
		<hub-stepper #stepper>
			<hub-step title="One">One</hub-step>
			<hub-step title="Two">Two</hub-step>
			<button #aliasButton continueButton>Continue</button>
		</hub-stepper>
	`
})
class ContinueButtonHostComponent {
	readonly stepper = viewChild.required<StepperComponent>('stepper');
	readonly aliasButton = viewChild.required<ElementRef<HTMLButtonElement>>('aliasButton');
}

describe('NextButtonDirective', () => {
	let fixture: ComponentFixture<NextButtonHostComponent>;
	let host: NextButtonHostComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NextButtonHostComponent, ContinueButtonHostComponent],
			providers: [provideHubTranslation()]
		}).compileComponents();

		fixture = TestBed.createComponent(NextButtonHostComponent);
		fixture.detectChanges();
		host = fixture.componentInstance;
	});

	it('dresses the projected button with the stepper forward-control classes', () => {
		const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[nextButton]');

		expect(button.classList.contains('stepper__button')).toBe(true);
		expect(button.classList.contains('stepper__button--next')).toBe(true);
	});

	it('replaces the built-in forward control instead of doubling it', () => {
		expect(fixture.nativeElement.querySelectorAll('.stepper__button--next').length).toBe(1);
	});

	it('stays enabled while the following step is enabled', () => {
		const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[nextButton]');

		expect(host.nextButton().disabled()).toBe(false);
		expect(button.disabled).toBe(false);
	});

	it('advances the stepper on click', () => {
		const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[nextButton]');

		button.click();
		fixture.detectChanges();

		expect(host.stepper().currentIndex()).toBe(1);
	});

	it('disables itself when the following step is disabled', () => {
		const disabledFixture = TestBed.createComponent(NextButtonHostComponent);
		disabledFixture.componentInstance.secondStepDisabled = true;
		disabledFixture.detectChanges();

		const button: HTMLButtonElement = disabledFixture.nativeElement.querySelector('button[nextButton]');

		expect(disabledFixture.componentInstance.nextButton().disabled()).toBe(true);
		expect(button.disabled).toBe(true);
	});

	it('disables itself on the last step, where there is no following step', () => {
		host.stepper().goTo(2);
		fixture.detectChanges();

		expect(host.nextButton().disabled()).toBe(true);
	});

	it('answers to the continueButton alias', () => {
		const aliasFixture = TestBed.createComponent(ContinueButtonHostComponent);
		aliasFixture.detectChanges();

		const button = aliasFixture.componentInstance.aliasButton().nativeElement;
		expect(button.classList.contains('stepper__button--next')).toBe(true);
		expect(button.disabled).toBe(false);

		button.click();
		aliasFixture.detectChanges();

		expect(aliasFixture.componentInstance.stepper().currentIndex()).toBe(1);
	});
});
