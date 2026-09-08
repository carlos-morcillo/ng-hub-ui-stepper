import { Component, Type, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideHubTranslation } from 'ng-hub-ui-utils';
import { NextButtonDirective } from '../next-button.directive';
import { StepTriggerDirective } from '../step-trigger.directive';
import { StepComponent } from '../step/step.component';
import { StepperComponent } from './stepper.component';

/**
 * Three defects that all live on the seam between the stepper and the application around it:
 *
 * - the host wore the bare class `.stepper`, a word in the application's namespace;
 * - the control queries reached deeper than content projection can, so a `nextButton` buried
 *   inside a step made the stepper drop its own control and render none;
 * - `hubStepTrigger` was exported and importable but never read, so the template it marked was
 *   never drawn.
 */

@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent],
	template: `
		<hub-stepper #stepper>
			<hub-step title="One">First</hub-step>
			<hub-step title="Two">Second</hub-step>
		</hub-stepper>
	`
})
class PlainHostComponent {
	readonly stepper = viewChild.required<StepperComponent>('stepper');
}

/** A step whose own form carries a button — the case that used to swallow the stepper's control. */
@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent, NextButtonDirective],
	template: `
		<hub-stepper #stepper>
			<hub-step title="One">
				<form>
					<button nextButton type="button">Save and continue</button>
				</form>
			</hub-step>
			<hub-step title="Two">Second</hub-step>
		</hub-stepper>
	`
})
class NestedControlHostComponent {
	readonly stepper = viewChild.required<StepperComponent>('stepper');
}

/** The same button where projection can actually reach it: a direct child of the stepper. */
@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent, NextButtonDirective],
	template: `
		<hub-stepper #stepper>
			<hub-step title="One">First</hub-step>
			<hub-step title="Two">Second</hub-step>
			<button nextButton type="button">Projected next</button>
		</hub-stepper>
	`
})
class ProjectedControlHostComponent {
	readonly stepper = viewChild.required<StepperComponent>('stepper');
}

@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent, StepTriggerDirective],
	template: `
		<hub-stepper #stepper>
			<ng-template hubStepTrigger let-title="title" let-index="index" let-isCurrent="isCurrent" let-disabled="disabled">
				<button
					type="button"
					role="tab"
					class="custom-trigger"
					[attr.aria-selected]="isCurrent"
					[disabled]="disabled"
					(click)="stepper.goTo(index)"
				>
					{{ index + 1 }} · {{ title }}
				</button>
			</ng-template>
			<hub-step title="One">First</hub-step>
			<hub-step title="Two">Second</hub-step>
		</hub-stepper>
	`
})
class CustomTriggerHostComponent {
	readonly stepper = viewChild.required<StepperComponent>('stepper');
}

/** Builds a fixture for one of the hosts above, with the labels the built-in controls resolve. */
async function build<T>(host: Type<T>): Promise<ComponentFixture<T>> {
	await TestBed.configureTestingModule({
		imports: [host],
		providers: [
			provideHubTranslation({
				language: 'en',
				fallbackLanguage: 'en',
				dictionaries: { en: { HUBUI: { STEPPER: { BACK: 'back', CONTINUE: 'continue', SUBMIT: 'submit' } } } }
			})
		]
	}).compileComponents();
	const fixture = TestBed.createComponent(host);
	fixture.detectChanges();
	return fixture;
}

describe('stepper class namespacing', () => {
	let fixture: ComponentFixture<PlainHostComponent>;
	let hostElement: HTMLElement;

	beforeEach(async () => {
		fixture = await build(PlainHostComponent);
		hostElement = fixture.debugElement.query(By.directive(StepperComponent)).nativeElement;
	});

	it('wears the prefixed block class', () => {
		expect(hostElement.classList.contains('hub-stepper')).toBe(true);
	});

	it('still wears the unprefixed one it replaces, which goes in 23.0.0', () => {
		expect(hostElement.classList.contains('stepper')).toBe(true);
	});

	it('writes both spellings of every host modifier it controls', () => {
		expect(hostElement.classList.contains('hub-stepper--layout-vertical')).toBe(true);
		expect(hostElement.classList.contains('stepper--layout-vertical')).toBe(true);
	});

	it('names its internal parts under the prefixed block, keeping the old names beside them', () => {
		for (const part of ['nav', 'content', 'content-panel', 'controls', 'nav-list', 'nav-item', 'nav-trigger']) {
			const element = hostElement.querySelector(`.hub-stepper__${part}`);
			expect(element, `an element carrying .hub-stepper__${part}`).not.toBeNull();
			expect(element!.classList.contains(`stepper__${part}`), `.stepper__${part} kept on the same element`).toBe(true);
		}
	});

	it('reads the animation opt-in under either spelling', () => {
		const stepper = fixture.componentInstance.stepper();

		expect(stepper.hasAnimationClass()).toBe(false);

		hostElement.classList.add('stepper--animated');
		expect(stepper.hasAnimationClass()).toBe(true);

		hostElement.classList.remove('stepper--animated');
		hostElement.classList.add('hub-stepper--animated');
		expect(stepper.hasAnimationClass()).toBe(true);
	});
});

describe('stepper control queries', () => {
	it('keeps its own next control when a button sits inside a step, where projection cannot reach it', async () => {
		const fixture = await build(NestedControlHostComponent);
		const stepper = fixture.componentInstance.stepper();

		expect(stepper.nextButton()).toBeUndefined();

		const controls = fixture.nativeElement.querySelector('.hub-stepper__controls') as HTMLElement;
		const rendered = Array.from(controls.querySelectorAll('button')).map((button) => button.textContent!.trim());
		expect(rendered).toEqual(['Continue →']);
	});

	it('still yields to a next control projected where the controls row can render it', async () => {
		const fixture = await build(ProjectedControlHostComponent);
		const stepper = fixture.componentInstance.stepper();

		expect(stepper.nextButton()).toBeTruthy();

		const controls = fixture.nativeElement.querySelector('.hub-stepper__controls') as HTMLElement;
		const rendered = Array.from(controls.querySelectorAll('button')).map((button) => button.textContent!.trim());
		expect(rendered).toEqual(['Projected next']);
	});

	it('leaves the buried button working as a next control, since it is still a stepper control', async () => {
		const fixture = await build(NestedControlHostComponent);
		const stepper = fixture.componentInstance.stepper();

		const buried = fixture.nativeElement.querySelector('form button') as HTMLButtonElement;
		buried.click();
		fixture.detectChanges();

		expect(stepper.currentIndex()).toBe(1);
	});
});

describe('hubStepTrigger', () => {
	it('replaces the built-in rail trigger, once per step', async () => {
		const fixture = await build(CustomTriggerHostComponent);

		const custom = fixture.nativeElement.querySelectorAll('.custom-trigger');
		expect(custom.length).toBe(2);
		expect(custom[0].textContent.trim()).toBe('1 · One');
		expect(custom[1].textContent.trim()).toBe('2 · Two');
		expect(fixture.nativeElement.querySelector('.hub-stepper__nav-trigger')).toBeNull();
	});

	it('keeps the rail around the custom trigger — the list, the roles and the label', async () => {
		const fixture = await build(CustomTriggerHostComponent);

		const list = fixture.nativeElement.querySelector('.hub-stepper__nav-list') as HTMLElement;
		expect(list.getAttribute('role')).toBe('tablist');
		expect(list.querySelectorAll('.hub-stepper__nav-item').length).toBe(2);
	});

	it('hands the trigger the state it needs to draw itself', async () => {
		const fixture = await build(CustomTriggerHostComponent);
		const triggers = fixture.nativeElement.querySelectorAll('.custom-trigger') as NodeListOf<HTMLButtonElement>;

		expect(triggers[0].getAttribute('aria-selected')).toBe('true');
		expect(triggers[1].getAttribute('aria-selected')).toBe('false');

		triggers[1].click();
		fixture.detectChanges();

		expect(fixture.componentInstance.stepper().currentIndex()).toBe(1);
	});
});
