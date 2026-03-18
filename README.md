# ng-hub-ui-stepper

[![npm version](https://img.shields.io/npm/v/ng-hub-ui-stepper.svg)](https://www.npmjs.com/package/ng-hub-ui-stepper)
[![license](https://img.shields.io/npm/l/ng-hub-ui-stepper.svg)](https://github.com/carlos-morcillo/ng-hub-ui-stepper/blob/main/LICENSE)

A flexible, customizable, and accessible stepper component for Angular 21+. Perfect for multi-step forms, wizards, and guided user experiences with a focus on developer experience and modern standards.

> [!IMPORTANT]
> This version (21.1.0) is built for **Angular 21** and uses the new **Signals** architecture.

## 🧩 Library Family `ng-hub-ui`

This library is part of the **ng-hub-ui** ecosystem:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage (Quick Start)](#usage-quick-start)
- [Examples](#examples)
	- [Linear Stepper](#linear-stepper)
	- [Custom Navigation](#custom-navigation)
	- [Custom Buttons](#custom-buttons)
- [API Reference](#api-reference)
	- [StepperComponent](#steppercomponent)
	- [StepComponent](#stepcomponent)
	- [Directives](#directives)
	- [Interfaces](#interfaces)
- [Styling](#styling)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🚀 **Angular 21+ Built-in**: Uses Signals and new control flow syntax.
- 🎨 **Highly Customizable**: Easy to theme via CSS variables and custom templates.
- ♿ **Accessible**: Proper ARIA roles and keyboard navigation.
- 🔢 **Multi-layout**: Supports Vertical, Sidebar, and RTL modes.
- 🔄 **Smooth Transitions**: Built-in CSS animations.
- 🧩 **Flexible Controls**: Use default buttons or project your own.

## Installation

```bash
npm install ng-hub-ui-stepper
```

## Usage (Quick Start)

Import the `StepperModule` in your module/component:

```typescript
import { StepperModule } from 'ng-hub-ui-stepper';

@Component({
  standalone: true,
  imports: [StepperModule],
  // ...
})
export class YourComponent { }
```

In your template:

```html
<hub-stepper>
  <hub-step [index]="0" title="Account Setup">
    <h3>Welcome!</h3>
    <p>Setup your account details here.</p>
  </hub-step>
  
  <hub-step [index]="1" title="Personal Info">
    <h3>Profile Data</h3>
    <p>Tell us more about yourself.</p>
  </hub-step>

  <hub-step [index]="2" title="Review">
    <h3>Save & Finalize</h3>
    <p>Ready to go?</p>
  </hub-step>
</hub-stepper>
```

## Examples

### Linear Stepper

Control navigation by enabling/disabling steps programmatically.

```html
<hub-stepper (completed)="onFinish()">
  <hub-step [index]="0" title="Step 1">
     <!-- Step 1 Content -->
  </hub-step>
  
  <hub-step [index]="1" title="Step 2" [disabled]="!isStep1Valid()">
     <!-- Step 2 Content -->
  </hub-step>
</hub-stepper>
```

### Custom Navigation

Provide your own navigation template using the `stepperNavTpt` property.

```html
<hub-stepper>
  <nav *stepperNav="let steps = steps; let currentIndex = currentIndex" class="my-custom-nav">
     @for (step of steps; track step; let i = $index) {
       <button 
         [class.active]="i === currentIndex" 
         (click)="goTo(i)">
         {{ step.title() }}
       </button>
     }
  </nav>

  <hub-step [index]="0" title="A">...</hub-step>
  <hub-step [index]="1" title="B">...</hub-step>
</hub-stepper>
```

### Custom Buttons

Project your own buttons to override the default footer.

```html
<hub-stepper>
  <hub-step [index]="0">...</hub-step>
  
  <button previousButton class="btn-back">Go back</button>
  <button nextButton class="btn-next">Next step</button>
  <button submitButton class="btn-done">Complete</button>
</hub-stepper>
```

## API Reference

### StepperComponent (`hub-stepper`)

| Input | Type | Default | Description |
|---|---|---|---|
| `backLabel` | `string` | `'Back'` | Label for the back button. |
| `continueLabel` | `string` | `'Continue'` | Label for the continue button. |
| `submitLabel` | `string` | `'Submit'` | Label for the submit button. |
| `options` | `StepperOptions` | `{}` | Visual and layout configuration. |

| Output | Type | Description |
|---|---|---|
| `completed` | `EventEmitter<void>` | Emitted when the last step is completed. |
| `previousStep` | `EventEmitter<number>` | Emitted when moving back. Passes the new index. |
| `nextStep` | `EventEmitter<number>` | Emitted when moving forward. Passes the new index. |

### StepComponent (`hub-step`)

| Input | Type | Default | Description |
|---|---|---|---|
| `index` | `number` | `required` | Position of the step (0-indexed). |
| `title` | `string` | `optional` | Text displayed in navigation. |
| `disabled` | `boolean` | `false` | Prevents navigation to this step. |

### Directives

- `nextButton`: Apply to any button to use it as the "next" control.
- `previousButton`: Apply to any button to use it as the "back" control.
- `submitButton`: Apply to any button to use it as the "submit" control.
- `stepperNav`: Mark a template to be used as custom navigation.

### Interfaces

#### `StepperOptions`
```typescript
interface StepperOptions {
  layout?: 'vertical' | 'sidebar';
  rtl?: boolean;
}
```

## Styling

Customize the component using CSS variables. For a complete list of available tokens, see the [CSS Variables Reference](docs/css-variables-reference.md).

```css
.my-stepper {
  --hub-stepper-primary-color: #009ef7;
  --hub-stepper-surface-color: #ffffff;
  --hub-stepper-gap: 1.5rem;
}
```

## Contributing

We welcome contributions! Please follow our [Commit Guidelines](https://github.com/carlos-morcillo/ng-hub-ui/blob/main/CONTRIBUTING.md).

1. Fork the repo.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes.
4. Push to the branch.
5. Create a Pull Request.

## Support

If you find this project helpful, consider supporting its development:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/carlosmorcillo)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

