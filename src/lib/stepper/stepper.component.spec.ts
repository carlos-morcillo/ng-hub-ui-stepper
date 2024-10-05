import {
	ComponentFixture,
	TestBed,
	fakeAsync,
	tick
} from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StepperComponent } from './stepper.component';
import { StepComponent } from '../step/step.component';
import { By } from '@angular/platform-browser';

@Component({
	template: `
		<hub-stepper #stepper [animationsEnabled]="animationsEnabled">
			<hub-step title="Step 1">Content 1</hub-step>
			<hub-step title="Step 2">Content 2</hub-step>
			<hub-step title="Step 3">Content 3</hub-step>
		</hub-stepper>
	`
})
class TestHostComponent {
	@ViewChild('stepper') stepper!: StepperComponent;
	animationsEnabled = true;
}

describe('StepperComponent', () => {
	let component: TestHostComponent;
	let fixture: ComponentFixture<TestHostComponent>;
	let stepperComponent: StepperComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [StepperComponent, StepComponent, TestHostComponent],
			imports: [BrowserAnimationsModule]
		}).compileComponents();

		fixture = TestBed.createComponent(TestHostComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		stepperComponent = component.stepper;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
		expect(stepperComponent).toBeTruthy();
	});

	it('should initialize with the correct number of steps', () => {
		expect(stepperComponent.steps.length).toBe(3);
	});

	it('should start at the first step', () => {
		expect(stepperComponent.currentIndex).toBe(0);
	});

	it('should navigate to the next step', () => {
		stepperComponent.goToNext();
		expect(stepperComponent.currentIndex).toBe(1);
	});

	it('should navigate to the previous step', () => {
		stepperComponent.goToNext();
		stepperComponent.goToPrevious();
		expect(stepperComponent.currentIndex).toBe(0);
	});

	it('should not go below the first step', () => {
		stepperComponent.goToPrevious();
		expect(stepperComponent.currentIndex).toBe(0);
	});

	it('should not go beyond the last step', () => {
		stepperComponent.goTo(2);
		stepperComponent.goToNext();
		expect(stepperComponent.currentIndex).toBe(2);
	});

	it('should emit nextStep event when moving to next step', (done) => {
		stepperComponent.nextStep.subscribe((index) => {
			expect(index).toBe(1);
			done();
		});
		stepperComponent.goToNext();
	});

	it('should emit previousStep event when moving to previous step', (done) => {
		stepperComponent.goToNext();
		stepperComponent.previousStep.subscribe((index) => {
			expect(index).toBe(0);
			done();
		});
		stepperComponent.goToPrevious();
	});

	it('should emit completed event when reaching the last step', (done) => {
		stepperComponent.completed.subscribe(() => {
			expect(stepperComponent.currentIndex).toBe(2);
			done();
		});
		stepperComponent.goTo(2);
		stepperComponent.complete();
	});

	it('should disable animations when animationsEnabled is false', () => {
		component.animationsEnabled = false;
		fixture.detectChanges();
		const steps = fixture.debugElement.queryAll(
			By.directive(StepComponent)
		);
		steps.forEach((step) => {
			expect(step.componentInstance.animationsEnabled).toBeFalse();
		});
	});

	it('should use custom labels when provided', () => {
		stepperComponent.backLabel = 'Custom Back';
		stepperComponent.continueLabel = 'Custom Continue';
		stepperComponent.submitLabel = 'Custom Submit';
		fixture.detectChanges();

		const buttons = fixture.debugElement.queryAll(By.css('button'));
		expect(buttons[0].nativeElement.textContent).toContain('Custom Back');
		expect(buttons[1].nativeElement.textContent).toContain(
			'Custom Continue'
		);
	});

	it('should disable the next button when canGoNext returns false', () => {
		spyOn(stepperComponent, 'canGoNext').and.returnValue(false);
		fixture.detectChanges();
		const nextButton = fixture.debugElement.query(
			By.css('.stepper__button--next')
		);
		expect(nextButton.nativeElement.disabled).toBeTrue();
	});

	it('should show submit button on last step', () => {
		stepperComponent.goTo(2);
		fixture.detectChanges();
		const submitButton = fixture.debugElement.query(
			By.css('.stepper__button--submit')
		);
		expect(submitButton).toBeTruthy();
	});

	it('should apply correct CSS classes to steps', () => {
		const stepElements = fixture.debugElement.queryAll(
			By.css('.stepper__nav-trigger')
		);
		expect(
			stepElements[0].classes['stepper__nav-trigger--current']
		).toBeTrue();
		expect(
			stepElements[1].classes['stepper__nav-trigger--current']
		).toBeFalse();

		stepperComponent.goToNext();
		fixture.detectChanges();

		expect(
			stepElements[0].classes['stepper__nav-trigger--completed']
		).toBeTrue();
		expect(
			stepElements[1].classes['stepper__nav-trigger--current']
		).toBeTrue();
	});

	it('should not allow navigation to disabled steps', () => {
		const steps = stepperComponent.steps.toArray();
		steps[1].disabled = true;
		fixture.detectChanges();

		stepperComponent.goTo(1);
		expect(stepperComponent.currentIndex).toBe(0);
	});

	it('should handle dynamic step addition and removal', () => {
		const newStep = new StepComponent();
		newStep.title = 'New Step';
		stepperComponent.steps.reset([
			...stepperComponent.steps.toArray(),
			newStep
		]);
		fixture.detectChanges();

		expect(stepperComponent.steps.length).toBe(4);

		stepperComponent.steps.reset(
			stepperComponent.steps.toArray().slice(0, -1)
		);
		fixture.detectChanges();

		expect(stepperComponent.steps.length).toBe(3);
	});

	//   it('should reset to first step when resetToFirstStep is called', () => {
	//     stepperComponent.goTo(2);
	//     stepperComponent.resetToFirstStep();
	//     expect(stepperComponent.currentIndex).toBe(0);
	//   });
});
