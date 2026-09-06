import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHubTranslation } from 'ng-hub-ui-utils';
import { StepperComponent } from '../stepper/stepper.component';
import { StepComponent } from './step.component';

/**
 * A step only exists inside a stepper — it injects the parent to read its position —
 * so every assertion goes through a host that projects two steps, the second one
 * switchable to disabled and deliberately untitled.
 */
@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent],
	template: `
		<hub-stepper #stepper>
			<hub-step title="Details">Details content</hub-step>
			<hub-step [disabled]="secondStepDisabled">Second content</hub-step>
		</hub-stepper>
	`
})
class StepHostComponent {
	readonly stepper = viewChild.required<StepperComponent>('stepper');
	secondStepDisabled = false;
}

describe('StepComponent', () => {
	let fixture: ComponentFixture<StepHostComponent>;
	let steps: readonly StepComponent[];

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [StepHostComponent],
			providers: [provideHubTranslation()]
		}).compileComponents();

		fixture = TestBed.createComponent(StepHostComponent);
		fixture.detectChanges();
		steps = fixture.componentInstance.stepper().steps();
	});

	it('receives its zero-based position from the parent stepper', () => {
		expect(steps.map((step) => step.index())).toEqual([0, 1]);
	});

	it('exposes the title input, leaving it undefined when the consumer omits it', () => {
		expect(steps[0].title()).toBe('Details');
		expect(steps[1].title()).toBeUndefined();
	});

	it('is enabled by default and reports itself accessible', () => {
		expect(steps[0].disabled()).toBe(false);
		expect(steps[0].isAccessible()).toBe(true);
	});

	it('reports a disabled step as not accessible', () => {
		const disabledFixture = TestBed.createComponent(StepHostComponent);
		disabledFixture.componentInstance.secondStepDisabled = true;
		disabledFixture.detectChanges();

		const disabledStep = disabledFixture.componentInstance.stepper().steps()[1];

		expect(disabledStep.disabled()).toBe(true);
		expect(disabledStep.isAccessible()).toBe(false);
	});

	it('renders only the active step content, tagged with its own index', () => {
		let contents: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.step__content');
		expect(contents.length).toBe(1);
		expect(contents[0].getAttribute('data-step-index')).toBe('0');
		expect(contents[0].textContent?.trim()).toBe('Details content');

		fixture.componentInstance.stepper().goToNext();
		fixture.detectChanges();

		contents = fixture.nativeElement.querySelectorAll('.step__content');
		expect(contents.length).toBe(1);
		expect(contents[0].getAttribute('data-step-index')).toBe('1');
		expect(contents[0].textContent?.trim()).toBe('Second content');
	});

	it('labels the rendered content with its title and drops the attribute when there is none', () => {
		expect(fixture.nativeElement.querySelector('.step__content').getAttribute('aria-label')).toBe('Details');

		fixture.componentInstance.stepper().goToNext();
		fixture.detectChanges();

		expect(fixture.nativeElement.querySelector('.step__content').hasAttribute('aria-label')).toBe(false);
	});
});
