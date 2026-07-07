import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHubTranslation } from 'ng-hub-ui-utils';
import { StepComponent } from '../step/step.component';
import { StepperComponent } from './stepper.component';

@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent],
	template: `
		<hub-stepper #stepper>
			<hub-step title="Step 1">Content 1</hub-step>
			<hub-step title="Step 2" [disabled]="secondStepDisabled">Content 2</hub-step>
			<hub-step title="Step 3">Content 3</hub-step>
		</hub-stepper>
	`
})
class TestHostComponent {
	readonly stepper = viewChild.required<StepperComponent>('stepper');
	secondStepDisabled = false;
}

describe('StepperComponent', () => {
	let component: TestHostComponent;
	let fixture: ComponentFixture<TestHostComponent>;
	let stepperComponent: StepperComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BrowserAnimationsModule, TestHostComponent],
			providers: [provideHubTranslation()]
		}).compileComponents();

		fixture = TestBed.createComponent(TestHostComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		stepperComponent = component.stepper();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
		expect(stepperComponent).toBeTruthy();
	});

	it('should initialize with the correct number of steps', () => {
		expect(stepperComponent.steps().length).toBe(3);
	});

	it('should start at the first step', () => {
		expect(stepperComponent.currentIndex()).toBe(0);
	});

	it('should navigate to the next step', () => {
		stepperComponent.goToNext();
		expect(stepperComponent.currentIndex()).toBe(1);
	});

	it('should navigate to the previous step', () => {
		stepperComponent.goToNext();
		stepperComponent.goToPrevious();
		expect(stepperComponent.currentIndex()).toBe(0);
	});

	it('should not go below the first step', () => {
		stepperComponent.goToPrevious();
		expect(stepperComponent.currentIndex()).toBe(0);
	});

	it('should not go beyond the last step', () => {
		stepperComponent.goTo(2);
		stepperComponent.goToNext();
		expect(stepperComponent.currentIndex()).toBe(2);
	});

	it('should emit nextStep event when moving to next step', () => {
		const emitted: number[] = [];
		stepperComponent.nextStep.subscribe((index) => emitted.push(index));

		stepperComponent.goToNext();

		expect(emitted).toEqual([1]);
	});

	it('should emit previousStep event when moving to previous step', () => {
		stepperComponent.goToNext();
		const emitted: number[] = [];
		stepperComponent.previousStep.subscribe((index) => emitted.push(index));

		stepperComponent.goToPrevious();

		expect(emitted).toEqual([0]);
	});

	it('should emit completed event when reaching the last step', () => {
		stepperComponent.goTo(2);
		let completedAtIndex: number | null = null;
		stepperComponent.completed.subscribe(() => (completedAtIndex = stepperComponent.currentIndex()));

		stepperComponent.complete();

		expect(completedAtIndex).toBe(2);
	});

	it('should show submit button on last step', () => {
		stepperComponent.goTo(2);
		fixture.detectChanges();

		const submitButton = fixture.debugElement.query(By.css('.stepper__button--submit'));

		expect(submitButton).toBeTruthy();
	});

	it('should apply correct CSS classes to steps', () => {
		let stepElements = fixture.debugElement.queryAll(By.css('.stepper__nav-trigger'));
		expect(stepElements[0].classes['stepper__nav-trigger--current']).toBe(true);
		expect(stepElements[1].classes['stepper__nav-trigger--current']).toBeFalsy();

		stepperComponent.goToNext();
		fixture.detectChanges();
		stepElements = fixture.debugElement.queryAll(By.css('.stepper__nav-trigger'));

		expect(stepElements[0].classes['stepper__nav-trigger--completed']).toBe(true);
		expect(stepElements[1].classes['stepper__nav-trigger--current']).toBe(true);
	});

	it('should not allow navigation to disabled steps', () => {
		// Re-create the host with the second step disabled from the start so the
		// signal input is bound at construction time.
		const disabledFixture = TestBed.createComponent(TestHostComponent);
		disabledFixture.componentInstance.secondStepDisabled = true;
		disabledFixture.detectChanges();
		const disabledStepper = disabledFixture.componentInstance.stepper();

		expect(disabledStepper.steps()[1].disabled()).toBe(true);
		expect(disabledStepper.canNavigateTo(1)).toBe(false);

		const stepTriggers = disabledFixture.debugElement.queryAll(By.css('.stepper__nav-trigger'));
		expect(stepTriggers[1].nativeElement.disabled).toBe(true);

		stepTriggers[1].nativeElement.click();
		disabledFixture.detectChanges();
		expect(disabledStepper.currentIndex()).toBe(0);
	});

	it('resolves a custom semantic variant to the ds token with a raw fallback', () => {
		const accentFixture = TestBed.createComponent(StepperComponent);
		accentFixture.componentRef.setInput('variant', 'secondary');
		accentFixture.detectChanges();

		expect(accentFixture.nativeElement.style.getPropertyValue('--hub-stepper-accent')).toBe(
			'var(--hub-sys-color-secondary, secondary)'
		);
	});

	it('passes a literal colour variant through unchanged', () => {
		const accentFixture = TestBed.createComponent(StepperComponent);
		accentFixture.componentRef.setInput('variant', '#ff0000');
		accentFixture.detectChanges();

		expect(accentFixture.nativeElement.style.getPropertyValue('--hub-stepper-accent')).toBe('#ff0000');
	});
});
