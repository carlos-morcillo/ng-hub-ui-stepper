import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StepTriggerDirective } from './step-trigger.directive';
import { StepComponent } from './step/step.component';
import { StepperNavDirective } from './stepper-nav.directive';
import { StepperComponent } from './stepper/stepper.component';
import { PreviousButtonDirective } from './previous-button.directive';
import { NextButtonDirective } from './next-button.directive';
import { SubmitButtonDirective } from './submit-button.directive';

@NgModule({
	declarations: [
		StepperComponent,
		StepComponent,
		StepTriggerDirective,
		StepperNavDirective
	],
	imports: [
		CommonModule,
		PreviousButtonDirective,
		NextButtonDirective,
		SubmitButtonDirective
	],
	exports: [
		StepperComponent,
		StepComponent,
		StepTriggerDirective,
		StepperNavDirective,
		PreviousButtonDirective,
		NextButtonDirective,
		SubmitButtonDirective
	]
})
export class StepperModule {}
