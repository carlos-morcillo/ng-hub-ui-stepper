/**
 * Available layout modes for the stepper container.
 */
export enum StepperLayout {
	Vertical = 'vertical',
	Sidebar = 'sidebar'
}

/**
 * Optional configuration object for the stepper component.
 */
export interface StepperOptions {
	/**
	 * Controls how nav, content and footer are arranged inside the stepper grid.
	 */
	layout?: StepperLayout;

	/**
	 * Enables right-to-left rendering for nav, content and controls.
	 */
	rtl?: boolean;
}
