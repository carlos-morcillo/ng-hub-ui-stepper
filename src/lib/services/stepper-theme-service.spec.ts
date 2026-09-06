import { RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StepperThemeService } from './stepper-theme-service';

describe('StepperThemeService', () => {
	let setStyle: ReturnType<typeof vi.fn>;
	let service: StepperThemeService;

	beforeEach(() => {
		setStyle = vi.fn();
		TestBed.configureTestingModule({
			providers: [
				{
					provide: RendererFactory2,
					useValue: { createRenderer: () => ({ setStyle }) }
				}
			]
		});

		service = TestBed.inject(StepperThemeService);
	});

	it('namespaces every token under --hub-stepper- on the document element', () => {
		service.setTheme({ accent: 'rebeccapurple', 'nav-gap': '1.5rem' });

		expect(setStyle).toHaveBeenCalledTimes(2);
		expect(setStyle).toHaveBeenCalledWith(document.documentElement, '--hub-stepper-accent', 'rebeccapurple');
		expect(setStyle).toHaveBeenCalledWith(document.documentElement, '--hub-stepper-nav-gap', '1.5rem');
	});

	it('writes nothing when the theme map is empty', () => {
		service.setTheme({});

		expect(setStyle).not.toHaveBeenCalled();
	});
});
