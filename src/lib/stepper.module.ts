import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NextStepButtonDirective } from './next-step-button.directive';
import { PrevStepButtonDirective } from './prev-step-button.directive';
import { StepTriggerDirective } from './step-trigger.directive';
import { StepComponent } from './step/step.component';
import { StepperNavDirective } from './stepper-nav.directive';
import { StepperComponent } from './stepper/stepper.component';

@NgModule({
	declarations: [
		StepperComponent,
		StepComponent,
		StepTriggerDirective,
		StepperNavDirective,
		PrevStepButtonDirective,
		NextStepButtonDirective
	],
	imports: [CommonModule, TranslateModule.forChild()],
	exports: [
		StepperComponent,
		StepComponent,
		StepTriggerDirective,
		StepperNavDirective,
		PrevStepButtonDirective,
		NextStepButtonDirective
	]
})
export class StepperModule {}
