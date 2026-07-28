import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHubTranslation } from 'ng-hub-ui-utils';
import { StepComponent } from '../step/step.component';
import { StepperLayout } from './stepper-options';
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

/**
 * Dispatches a cancelable keydown event with the given key on an element.
 *
 * @param element Target element.
 * @param key `KeyboardEvent.key` value to dispatch.
 */
function pressKey(element: HTMLElement, key: string): void {
	element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
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

	describe('WAI-ARIA tablist semantics', () => {
		it('renders the rail as a horizontal tablist of tabs with a tabpanel', () => {
			const tablist: HTMLElement = fixture.nativeElement.querySelector('.stepper__nav-list');
			expect(tablist.getAttribute('role')).toBe('tablist');
			expect(tablist.getAttribute('aria-orientation')).toBe('horizontal');
			expect(tablist.getAttribute('aria-label')).toBe('Steps');

			const tabs: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.stepper__nav-trigger');
			expect(tabs.length).toBe(3);
			tabs.forEach((tab) => expect(tab.getAttribute('role')).toBe('tab'));

			const panel: HTMLElement = fixture.nativeElement.querySelector('.stepper__content-panel');
			expect(panel.getAttribute('role')).toBe('tabpanel');
		});

		it('reflects the sidebar layout as a vertical tablist orientation', () => {
			const sidebarFixture = TestBed.createComponent(StepperComponent);
			sidebarFixture.componentRef.setInput('options', { layout: StepperLayout.Sidebar });
			sidebarFixture.detectChanges();

			const tablist: HTMLElement = sidebarFixture.nativeElement.querySelector('.stepper__nav-list');
			expect(tablist.getAttribute('aria-orientation')).toBe('vertical');
		});

		it('labels the rail with the railLabel input', () => {
			const labelledFixture = TestBed.createComponent(StepperComponent);
			labelledFixture.componentRef.setInput('railLabel', 'Checkout steps');
			labelledFixture.detectChanges();

			const tablist: HTMLElement = labelledFixture.nativeElement.querySelector('.stepper__nav-list');
			expect(tablist.getAttribute('aria-label')).toBe('Checkout steps');
		});

		it('marks the active step tab with aria-selected and aria-current="step"', () => {
			const tabs: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.stepper__nav-trigger');
			expect(tabs[0].getAttribute('aria-selected')).toBe('true');
			expect(tabs[0].getAttribute('aria-current')).toBe('step');
			expect(tabs[1].getAttribute('aria-selected')).toBe('false');
			expect(tabs[1].hasAttribute('aria-current')).toBe(false);

			stepperComponent.goToNext();
			fixture.detectChanges();

			expect(tabs[1].getAttribute('aria-selected')).toBe('true');
			expect(tabs[1].getAttribute('aria-current')).toBe('step');
			expect(tabs[0].getAttribute('aria-selected')).toBe('false');
			expect(tabs[0].hasAttribute('aria-current')).toBe(false);
		});

		it('wires each tab to its panel with stable generated ids', () => {
			const tabs: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.stepper__nav-trigger');
			const panel: HTMLElement = fixture.nativeElement.querySelector('.stepper__content-panel');

			expect(tabs[0].id).toMatch(/^hub-stepper-\d+-tab-0$/);
			expect(tabs[0].getAttribute('aria-controls')).toBe(panel.id);
			expect(panel.getAttribute('aria-labelledby')).toBe(tabs[0].id);

			stepperComponent.goToNext();
			fixture.detectChanges();

			expect(panel.id).toMatch(/^hub-stepper-\d+-panel-1$/);
			expect(tabs[1].getAttribute('aria-controls')).toBe(panel.id);
			expect(panel.getAttribute('aria-labelledby')).toBe(tabs[1].id);
		});

		it('exposes aria-disabled on non-navigable step tabs', () => {
			const disabledFixture = TestBed.createComponent(TestHostComponent);
			disabledFixture.componentInstance.secondStepDisabled = true;
			disabledFixture.detectChanges();

			const tabs: NodeListOf<HTMLElement> = disabledFixture.nativeElement.querySelectorAll('.stepper__nav-trigger');
			expect(tabs[1].getAttribute('aria-disabled')).toBe('true');
			expect(tabs[0].hasAttribute('aria-disabled')).toBe(false);
			expect(tabs[2].hasAttribute('aria-disabled')).toBe(false);
		});
	});

	describe('rail keyboard navigation', () => {
		it('applies a roving tabindex with the active tab as the single tab stop', () => {
			const tabs: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.stepper__nav-trigger');
			expect(tabs[0].getAttribute('tabindex')).toBe('0');
			expect(tabs[1].getAttribute('tabindex')).toBe('-1');
			expect(tabs[2].getAttribute('tabindex')).toBe('-1');
		});

		it('moves focus (without activating) to the next tab on ArrowRight', () => {
			const tabs: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.stepper__nav-trigger');
			tabs[0].focus();
			pressKey(tabs[0], 'ArrowRight');
			fixture.detectChanges();

			expect(document.activeElement).toBe(tabs[1]);
			expect(tabs[1].getAttribute('tabindex')).toBe('0');
			expect(tabs[0].getAttribute('tabindex')).toBe('-1');
			expect(stepperComponent.currentIndex()).toBe(0);
		});

		it('moves focus back on ArrowLeft', () => {
			const tabs: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.stepper__nav-trigger');
			tabs[0].focus();
			pressKey(tabs[0], 'ArrowRight');
			pressKey(tabs[1], 'ArrowLeft');
			fixture.detectChanges();

			expect(document.activeElement).toBe(tabs[0]);
			expect(stepperComponent.currentIndex()).toBe(0);
		});

		it('skips disabled steps when moving focus with the arrow keys', () => {
			const disabledFixture = TestBed.createComponent(TestHostComponent);
			disabledFixture.componentInstance.secondStepDisabled = true;
			disabledFixture.detectChanges();

			const tabs: NodeListOf<HTMLElement> = disabledFixture.nativeElement.querySelectorAll('.stepper__nav-trigger');
			tabs[0].focus();
			pressKey(tabs[0], 'ArrowRight');
			disabledFixture.detectChanges();

			expect(document.activeElement).toBe(tabs[2]);
		});

		it('jumps focus to the last and first enabled tab on End and Home', () => {
			const tabs: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.stepper__nav-trigger');
			tabs[0].focus();
			pressKey(tabs[0], 'End');
			fixture.detectChanges();
			expect(document.activeElement).toBe(tabs[2]);

			pressKey(tabs[2], 'Home');
			fixture.detectChanges();
			expect(document.activeElement).toBe(tabs[0]);
		});

		it('activates the focused tab on Enter and Space when navigation is permitted', () => {
			const tabs: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.stepper__nav-trigger');
			pressKey(tabs[2], 'Enter');
			fixture.detectChanges();
			expect(stepperComponent.currentIndex()).toBe(2);

			pressKey(tabs[0], ' ');
			fixture.detectChanges();
			expect(stepperComponent.currentIndex()).toBe(0);
		});

		it('does not activate a disabled step on Enter', () => {
			const disabledFixture = TestBed.createComponent(TestHostComponent);
			disabledFixture.componentInstance.secondStepDisabled = true;
			disabledFixture.detectChanges();
			const disabledStepper = disabledFixture.componentInstance.stepper();

			const tabs: NodeListOf<HTMLElement> = disabledFixture.nativeElement.querySelectorAll('.stepper__nav-trigger');
			pressKey(tabs[1], 'Enter');
			disabledFixture.detectChanges();

			expect(disabledStepper.currentIndex()).toBe(0);
		});
	});
});
