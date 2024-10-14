# ng-hub-ui-stepper

A flexible and customizable stepper component for Angular applications. Perfect for multi-step forms, wizards, and guided user experiences.

## Table of Contents

- [ng-hub-ui-stepper](#ng-hub-ui-stepper)
	- [Table of Contents](#table-of-contents)
	- [Features](#features)
	- [Installation](#installation)
	- [Usage](#usage)
	- [API Reference](#api-reference)
		- [Stepper Component](#stepper-component)
		- [Step Component](#step-component)
	- [Customization](#customization)
		- [CSS Variables](#css-variables)
		- [Programmatic Customization](#programmatic-customization)
		- [Custom Navigation Buttons](#custom-navigation-buttons)
		- [Custom Navigation Template](#custom-navigation-template)
	- [Examples](#examples)
		- [Basic Usage](#basic-usage)
		- [With Custom Navigation](#with-custom-navigation)
	- [Contributing](#contributing)
	- [Support the Project](#support-the-project)
	- [Inspiration](#inspiration)
	- [License](#license)

## Features

- 🚀 Easy to integrate with existing Angular projects
- 🎨 Highly customizable appearance and behavior
- ♿ Accessible by default, following WCAG guidelines
- 📱 Responsive design, works on all screen sizes
- 🔢 Support for linear and non-linear step progression
- 🔄 Built-in animations for smooth transitions
- 🧩 Modular architecture for easy extension

## Installation

Install the package using npm:

```bash
npm install ng-hub-ui-stepper
```

## Usage

1. Import the `StepperModule` in your Angular module:

```typescript
import { StepperModule } from 'ng-hub-ui-stepper';

@NgModule({
  imports: [StepperModule],
  // ...
})
export class YourModule { }
```

2. Use the stepper component in your template:

```html
<hub-stepper>
  <hub-step title="Step 1">
	<h2>Welcome to Step 1</h2>
	<p>This is the content of step 1.</p>
  </hub-step>
  <hub-step title="Step 2">
	<h2>Moving on to Step 2</h2>
	<p>Here's what you need to do in step 2.</p>
  </hub-step>
  <hub-step title="Step 3">
	<h2>Final Step</h2>
	<p>Congratulations! You've reached the last step.</p>
  </hub-step>
</hub-stepper>
```

## API Reference

### Stepper Component

| Input                | Type      | Default | Description                                    |
|----------------------|-----------|---------|------------------------------------------------|
| `backLabel`          | string    | 'Back'  | Label for the back button                      |
| `continueLabel`      | string    | 'Continue' | Label for the continue button               |
| `submitLabel`        | string    | 'Submit'| Label for the submit button                    |

| Output     | Type                | Description                           |
|------------|---------------------|---------------------------------------|
| `completed`| EventEmitter<void>  | Emitted when the stepper is completed |
| `previousStep` | EventEmitter<number> | Emitted when moving to the previous step |
| `nextStep` | EventEmitter<number> | Emitted when moving to the next step |

### Step Component

| Input     | Type    | Default | Description                        |
|-----------|---------|--------|--------------------------------------|
| `index`   | number  | required | The index of this step             |
| `title`   | string  | optional | The title of this step             |
| `disabled`| boolean | false   | Whether this step is disabled       |

## Customization

The stepper component can be customized using CSS variables and by providing custom templates for navigation and buttons.

### CSS Variables

```css
:root {
  --stepper-direction: column;
  --stepper-primary-color: #009ef7;
  --stepper-secondary-color: #b5b5c3;
  --stepper-background-color: #f3f6f9;
  --stepper-text-color: #181c32;
  --stepper-disabled-color: #e1e3ea;
}
```

### Programmatic Customization

You can also customize the stepper appearance programmatically using the `StepperThemeService`:

```typescript
import { StepperThemeService } from '@hub-ui/stepper';

@Component({...})
export class YourComponent implements OnInit {
  constructor(private themeService: StepperThemeService) {}

  ngOnInit() {
    this.themeService.setTheme({
      'primary-color': '#ff4081',
      'background-color': '#f0f0f0'
    });
  }
}
```

This allows you to change the theme dynamically based on user preferences or other conditions in your application.

### Custom Navigation Buttons
You can customize the navigation buttons using the provided directives:

```html
<hub-stepper>
  <!-- Step content -->
  <button previousButton>Custom Back</button>
  <button nextButton>Custom Next</button>
  <button submitButton>Custom Submit</button>
</hub-stepper>
```

These directives (previousButton, nextButton, and submitButton) automatically handle the navigation logic and apply default styling classes.

### Custom Navigation Template

```html
<hub-stepper [stepperNavTpt]="customNavTemplate">
  <!-- step content -->
</hub-stepper>

<ng-template #customNavTemplate let-steps="steps" let-currentIndex="currentIndex">
  <!-- Your custom navigation markup -->
</ng-template>
```

<!-- ## Accessibility

This component is designed with accessibility in mind:

- Proper ARIA attributes are used for navigation and step content
- Keyboard navigation is supported
- Color contrast ratios meet WCAG AA standards -->

## Examples

### Basic Usage

```html
<hub-stepper>
  <hub-step title="Personal Info">
	<!-- Personal info form fields -->
  </hub-step>
  <hub-step title="Address">
	<!-- Address form fields -->
  </hub-step>
  <hub-step title="Confirmation">
	<!-- Confirmation step -->
  </hub-step>
</hub-stepper>
```

### With Custom Navigation

```html
<hub-stepper [stepperNavTpt]="customNav">
  <!-- Steps content -->
</hub-stepper>

<ng-template #customNav let-steps="steps" let-currentIndex="currentIndex">
  <ul class="custom-nav">
	<li *ngFor="let step of steps; let i = index"
		[class.active]="i === currentIndex">
	  {{ step.title }}
	</li>
  </ul>
</ng-template>
```

## Contributing

We welcome contributions to ng-hub-ui-stepper! Here's how you can help:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a pull request

Please make sure to update tests as appropriate and adhere to the [Angular Style Guide](https://angular.io/guide/styleguide).

## Support the Project

If you find this project helpful and would like to support its development, you can buy me a coffee:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/carlosmorcillo)

Your support is greatly appreciated and helps maintain and improve this project!

## Inspiration

This project was inspired by the need for a flexible, customizable, and accessible stepper component in the Angular ecosystem. We drew inspiration from:

- Material Design's Stepper component
- Various multi-step form implementations across the web
- Feedback and feature requests from the Angular community

My goal was to create a component that combined the best features of existing solutions while adding my own improvements and focusing on customization and accessibility.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Carlos Morcillo Fernández]

