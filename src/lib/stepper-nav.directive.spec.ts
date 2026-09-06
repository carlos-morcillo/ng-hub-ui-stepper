import { Component, TemplateRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHubTranslation } from 'ng-hub-ui-utils';
import { StepComponent } from './step/step.component';
import { StepperNavDirective } from './stepper-nav.directive';
import { StepperComponent } from './stepper/stepper.component';

/** A stepper whose rail is supplied by the consumer through `hubStepperNav`. */
@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent, StepperNavDirective],
	template: `
		<hub-stepper #stepper>
			<ng-template hubStepperNav let-steps="steps" let-currentIndex="currentIndex">
				<ul class="custom-nav" [attr.data-current-index]="currentIndex">
					@for (step of steps; track $index) {
						<li class="custom-nav__item">{{ step.title() }}</li>
					}
				</ul>
			</ng-template>
			<hub-step title="One">One</hub-step>
			<hub-step title="Two">Two</hub-step>
		</hub-stepper>
	`
})
class CustomNavHostComponent {
	readonly stepper = viewChild.required<StepperComponent>('stepper');
	readonly nav = viewChild.required(StepperNavDirective);
}

/** The same wiring reached through the `stepperNav` half of the directive selector. */
@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent, StepperNavDirective],
	template: `
		<hub-stepper #stepper>
			<ng-template stepperNav>
				<ul class="alias-nav"></ul>
			</ng-template>
			<hub-step title="One">One</hub-step>
		</hub-stepper>
	`
})
class AliasNavHostComponent {}

describe('StepperNavDirective', () => {
	let fixture: ComponentFixture<CustomNavHostComponent>;
	let host: CustomNavHostComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CustomNavHostComponent, AliasNavHostComponent],
			providers: [provideHubTranslation()]
		}).compileComponents();

		fixture = TestBed.createComponent(CustomNavHostComponent);
		fixture.detectChanges();
		host = fixture.componentInstance;
	});

	it('captures the template it marks', () => {
		expect(host.nav().template).toBeInstanceOf(TemplateRef);
	});

	it('replaces the built-in step rail', () => {
		expect(fixture.nativeElement.querySelector('.stepper__nav-list')).toBeNull();
		expect(fixture.nativeElement.querySelector('.custom-nav')).toBeTruthy();
	});

	it('hands the projected steps to the custom rail', () => {
		const items: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.custom-nav__item');

		expect(Array.from(items).map((item) => item.textContent?.trim())).toEqual(['One', 'Two']);
	});

	it('keeps the active index in the custom rail context up to date', () => {
		expect(fixture.nativeElement.querySelector('.custom-nav').getAttribute('data-current-index')).toBe('0');

		host.stepper().goToNext();
		fixture.detectChanges();

		expect(fixture.nativeElement.querySelector('.custom-nav').getAttribute('data-current-index')).toBe('1');
	});

	it('answers to the stepperNav alias', () => {
		const aliasFixture = TestBed.createComponent(AliasNavHostComponent);
		aliasFixture.detectChanges();

		expect(aliasFixture.nativeElement.querySelector('.stepper__nav-list')).toBeNull();
		expect(aliasFixture.nativeElement.querySelector('.alias-nav')).toBeTruthy();
	});
});
