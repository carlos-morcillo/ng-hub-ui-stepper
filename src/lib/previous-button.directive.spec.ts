import { Component, ElementRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHubTranslation } from 'ng-hub-ui-utils';
import { PreviousButtonDirective } from './previous-button.directive';
import { StepComponent } from './step/step.component';
import { StepperComponent } from './stepper/stepper.component';

/** Three steps and a projected backward control, with the middle step switchable to disabled. */
@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent, PreviousButtonDirective],
	template: `
		<hub-stepper #stepper>
			<hub-step title="One">One</hub-step>
			<hub-step title="Two" [disabled]="secondStepDisabled">Two</hub-step>
			<hub-step title="Three">Three</hub-step>
			<button previousButton>Back</button>
		</hub-stepper>
	`
})
class PreviousButtonHostComponent {
	readonly stepper = viewChild.required<StepperComponent>('stepper');
	readonly previousButton = viewChild.required(PreviousButtonDirective);
	secondStepDisabled = false;
}

/**
 * The same wiring reached through the `backButton` half of the directive selector.
 * The button is read by template reference rather than from the rendered stepper because
 * the stepper's content slot selects `button[previousButton]` only, so an aliased control
 * is never placed in the controls row — a projection gap that belongs to the stepper, not here.
 */
@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent, PreviousButtonDirective],
	template: `
		<hub-stepper #stepper>
			<hub-step title="One">One</hub-step>
			<hub-step title="Two">Two</hub-step>
			<button #aliasButton backButton>Back</button>
		</hub-stepper>
	`
})
class BackButtonHostComponent {
	readonly stepper = viewChild.required<StepperComponent>('stepper');
	readonly aliasButton = viewChild.required<ElementRef<HTMLButtonElement>>('aliasButton');
}

describe('PreviousButtonDirective', () => {
	let fixture: ComponentFixture<PreviousButtonHostComponent>;
	let host: PreviousButtonHostComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PreviousButtonHostComponent, BackButtonHostComponent],
			providers: [provideHubTranslation()]
		}).compileComponents();

		fixture = TestBed.createComponent(PreviousButtonHostComponent);
		fixture.detectChanges();
		host = fixture.componentInstance;
		// The stepper only projects a backward control once there is somewhere to go back to.
		host.stepper().goTo(1);
		fixture.detectChanges();
	});

	it('dresses the projected button with the stepper backward-control classes', () => {
		const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[previousButton]');

		expect(button.classList.contains('stepper__button')).toBe(true);
		expect(button.classList.contains('stepper__button--back')).toBe(true);
	});

	it('replaces the built-in backward control instead of doubling it', () => {
		expect(fixture.nativeElement.querySelectorAll('.stepper__button--back').length).toBe(1);
	});

	it('stays enabled while the preceding step is enabled', () => {
		const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[previousButton]');

		expect(host.previousButton().disabled()).toBe(false);
		expect(button.disabled).toBe(false);
	});

	it('steps the stepper back on click', () => {
		const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[previousButton]');

		button.click();
		fixture.detectChanges();

		expect(host.stepper().currentIndex()).toBe(0);
	});

	it('disables itself when the preceding step is disabled', () => {
		const disabledFixture = TestBed.createComponent(PreviousButtonHostComponent);
		disabledFixture.componentInstance.secondStepDisabled = true;
		disabledFixture.detectChanges();
		disabledFixture.componentInstance.stepper().goTo(2);
		disabledFixture.detectChanges();

		const button: HTMLButtonElement = disabledFixture.nativeElement.querySelector('button[previousButton]');

		expect(disabledFixture.componentInstance.previousButton().disabled()).toBe(true);
		expect(button.disabled).toBe(true);
	});

	it('disables itself on the first step, where there is no preceding step', () => {
		host.stepper().goTo(0);
		fixture.detectChanges();

		expect(host.previousButton().disabled()).toBe(true);
	});

	it('answers to the backButton alias', () => {
		const aliasFixture = TestBed.createComponent(BackButtonHostComponent);
		aliasFixture.detectChanges();
		aliasFixture.componentInstance.stepper().goTo(1);
		aliasFixture.detectChanges();

		const button = aliasFixture.componentInstance.aliasButton().nativeElement;
		expect(button.classList.contains('stepper__button--back')).toBe(true);
		expect(button.disabled).toBe(false);

		button.click();
		aliasFixture.detectChanges();

		expect(aliasFixture.componentInstance.stepper().currentIndex()).toBe(0);
	});
});
