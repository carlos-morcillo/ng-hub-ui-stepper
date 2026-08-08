# ng-hub-ui-stepper

[Español](./README.es.md) | **English**

[![npm version](https://img.shields.io/npm/v/ng-hub-ui-stepper.svg)](https://www.npmjs.com/package/ng-hub-ui-stepper)
[![license](https://img.shields.io/npm/l/ng-hub-ui-stepper.svg)](https://github.com/carlos-morcillo/ng-hub-ui-stepper/blob/main/LICENSE)

A flexible, customizable, and accessible stepper component for Angular 21+. Perfect for multi-step forms, wizards, and guided user experiences with a focus on developer experience and modern standards.

> [!IMPORTANT]
> This version (21.2.1) is built for **Angular 21** and uses the new **Signals** architecture.

## Documentation and Live Examples

This package is part of [Hub UI](https://hubui.dev/en/), a collection of Angular component libraries for standalone apps.

- Docs: https://hubui.dev/en/stepper/overview/
- Live examples: https://hubui.dev/en/stepper/examples/
- Hub UI: https://hubui.dev/en/

## 🧩 Library Family `ng-hub-ui`

This library is part of the **ng-hub-ui** ecosystem:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) (deprecated — use ng-hub-ui-panels)
- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-dropdown**](https://www.npmjs.com/package/ng-hub-ui-dropdown)
- [**ng-hub-ui-ds**](https://www.npmjs.com/package/ng-hub-ui-ds)
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-milestones**](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper) ← You are here
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
- ♿ **Accessible**: WAI-ARIA tablist rail with full keyboard navigation.
- 🔢 **Multi-layout**: Supports Vertical, Sidebar, and RTL modes.
- 🔄 **Smooth Transitions**: Built-in CSS animations.
- 🧩 **Flexible Controls**: Use default buttons or project your own.
- ✂️ **Opt-in title truncation + tooltip**: set `truncateTitles` to clip long nav titles (bounded by `--hub-stepper-nav-title-max-width`) and reveal the full text on hover — hub-ui tooltip by default, swappable with `provideHubTooltip`. Requires `ng-hub-ui-utils >= 22.6.0` + `@use 'ng-hub-ui-utils/styles/tooltip';`.

> ♿ **Accessibility model**: the step rail is a WAI-ARIA `tablist` (each trigger a `tab`, each step content a `tabpanel`) with a roving tabindex, so it is a single Tab stop. Arrow keys move focus between enabled steps (skipping disabled ones, wrapping), `Home`/`End` jump to the first/last enabled step, and `Enter`/`Space` activates the focused step under the same rules as clicking it. The rail's accessible name comes from the `railLabel` input (default `'Steps'`).

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
  <hub-step title="Account Setup">
    <h3>Welcome!</h3>
    <p>Setup your account details here.</p>
  </hub-step>

  <hub-step title="Personal Info">
    <h3>Profile Data</h3>
    <p>Tell us more about yourself.</p>
  </hub-step>

  <hub-step title="Review">
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
  <hub-step title="Step 1">
    <!-- Step 1 Content -->
  </hub-step>

  <hub-step title="Step 2" [disabled]="!isStep1Valid()">
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

  <hub-step title="A">...</hub-step>
  <hub-step title="B">...</hub-step>
</hub-stepper>
```

### Custom Buttons

Project your own buttons to override the default footer.

```html
<hub-stepper>
  <hub-step>...</hub-step>

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
| `railLabel` | `string` | `'Steps'` | Accessible name of the step rail tablist. |
| `variant` | `string` | `'primary'` | Semantic accent for the active step pill and the next / submit controls. Built-in values: `primary`, `success`, `danger`, `warning`, `info`. Any other string is also accepted and resolves through `--hub-sys-color-<variant>`. |
| `options` | `StepperOptions` | `{}` | Visual and layout configuration. |

| Output | Type | Description |
|---|---|---|
| `completed` | `EventEmitter<void>` | Emitted when the last step is completed. |
| `previousStep` | `EventEmitter<number>` | Emitted when moving back. Passes the new index. |
| `nextStep` | `EventEmitter<number>` | Emitted when moving forward. Passes the new index. |

### StepComponent (`hub-step`)

| Input | Type | Default | Description |
|---|---|---|---|
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
  --hub-stepper-primary-color: #0d6efd;
  --hub-stepper-surface-color: #ffffff;
  --hub-stepper-gap: 1.5rem;
}
```

### Semantic accent

The `--hub-stepper-accent` token drives the active step pill and the next / submit controls. It defaults to `var(--hub-sys-color-primary)`. The easiest way to set it is the `variant` input (see [API Reference](#steppercomponent)), but you can also override the token directly:

```css
.my-stepper {
  --hub-stepper-accent: var(--hub-sys-color-success);
}
```

### Sass mixin

For full theming in a single call, the package ships a `hub-stepper-theme()` Sass mixin. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted as `--hub-stepper-*` overrides:

```scss
@use 'ng-hub-ui-stepper/styles/mixins/stepper-theme' as *;

.checkout-stepper {
  @include hub-stepper-theme(
    $accent: var(--hub-sys-color-success),
    $gap: 1.5rem,
    $nav-link-active-color: #fff,
    $sidebar-width: 220px
  );
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
