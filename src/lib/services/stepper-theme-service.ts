import { DOCUMENT } from '@angular/common';
import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';

/**
 * Applies runtime CSS variable overrides for the stepper design tokens.
 */
@Injectable({
	providedIn: 'root'
})
export class StepperThemeService {
	/** Angular renderer used to update root-level CSS variables safely. */
	private renderer: Renderer2;

	/** Injected document token; SSR-safe alternative to the global `document`. */
	private readonly document = inject(DOCUMENT);

	/**
	 * Creates a renderer instance for dynamic style updates.
	 *
	 * @param rendererFactory Angular renderer factory.
	 */
	constructor(rendererFactory: RendererFactory2) {
		this.renderer = rendererFactory.createRenderer(null, null);
	}

	/**
	 * Applies the provided stepper theme map to CSS custom properties.
	 *
	 * @param theme Key-value map of stepper token names and CSS values.
	 */
	setTheme(theme: { [key: string]: string }) {
		Object.keys(theme).forEach((key) => {
			this.renderer.setStyle(this.document.documentElement, `--hub-stepper-${key}`, theme[key]);
		});
	}
}
