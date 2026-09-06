import { Component, TemplateRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StepTriggerDirective } from './step-trigger.directive';

/**
 * The directive is a template marker: it captures the `ng-template` it sits on so a
 * host can render it with its own context. The stepper does not render these trigger
 * templates yet (see CHANGELOG 22.5.1), so the contract under test is the capture
 * itself — which is what regressed when the selector used a descendant combinator and
 * the directive was never instantiated at all.
 */
@Component({
	standalone: true,
	imports: [StepTriggerDirective],
	template: `
		<ng-template hubStepTrigger let-label="label">
			<span class="trigger-content">{{ label }}</span>
		</ng-template>
	`
})
class StepTriggerHostComponent {
	readonly trigger = viewChild.required(StepTriggerDirective);
}

/** The same marker reached through the `stepTrigger` half of the selector. */
@Component({
	standalone: true,
	imports: [StepTriggerDirective],
	template: `
		<ng-template stepTrigger>
			<span class="trigger-content">Alias</span>
		</ng-template>
	`
})
class AliasStepTriggerHostComponent {
	readonly trigger = viewChild.required(StepTriggerDirective);
}

describe('StepTriggerDirective', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [StepTriggerHostComponent, AliasStepTriggerHostComponent]
		}).compileComponents();
	});

	it('is instantiated on an ng-template marked with hubStepTrigger', () => {
		const fixture = TestBed.createComponent(StepTriggerHostComponent);
		fixture.detectChanges();

		expect(fixture.componentInstance.trigger()).toBeInstanceOf(StepTriggerDirective);
	});

	it('captures the template it marks', () => {
		const fixture = TestBed.createComponent(StepTriggerHostComponent);
		fixture.detectChanges();

		expect(fixture.componentInstance.trigger().template).toBeInstanceOf(TemplateRef);
	});

	it('exposes a template a host can render with its own context', () => {
		const fixture = TestBed.createComponent(StepTriggerHostComponent);
		fixture.detectChanges();

		const view = fixture.componentInstance.trigger().template.createEmbeddedView({ label: 'Step one' });
		view.detectChanges();

		expect((view.rootNodes[0] as HTMLElement).textContent?.trim()).toBe('Step one');

		view.destroy();
	});

	it('answers to the stepTrigger alias', () => {
		const aliasFixture = TestBed.createComponent(AliasStepTriggerHostComponent);
		aliasFixture.detectChanges();

		expect(aliasFixture.componentInstance.trigger().template).toBeInstanceOf(TemplateRef);
	});
});
