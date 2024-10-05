import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class StepperThemeService {
	private renderer: Renderer2;

	constructor(rendererFactory: RendererFactory2) {
		this.renderer = rendererFactory.createRenderer(null, null);
	}

	setTheme(theme: { [key: string]: string }) {
		Object.keys(theme).forEach((key) => {
			this.renderer.setStyle(
				document.documentElement,
				`--stepper-${key}`,
				theme[key]
			);
		});
	}
}

// Usage in a component:
// constructor(private themeService: StepperThemeService) {}
//
// ngOnInit() {
//   this.themeService.setTheme({
//     'primary-color': '#ff4081',
//     'background-color': '#f0f0f0'
//   });
// }
