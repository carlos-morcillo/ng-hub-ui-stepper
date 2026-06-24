# Breaking Changes - ng-hub-ui-stepper

This document tracks all breaking changes in the `ng-hub-ui-stepper` library.

## Version 22.1.0

### Removed shorthand padding tokens

The shorthand CSS custom properties `--hub-stepper-nav-padding` and `--hub-stepper-content-padding` have been **removed** in favour of the canonical directional `-padding-x` / `-padding-y` pairs. This produces no visual change, but any custom CSS that set the shorthands must be migrated.

**Before:**
```css
hub-stepper {
  --hub-stepper-nav-padding: 1rem;
  --hub-stepper-content-padding: 1.5rem;
}
```

**After (use the directional pairs):**
```css
hub-stepper {
  --hub-stepper-nav-padding-x: 1rem;
  --hub-stepper-nav-padding-y: 1rem;
  --hub-stepper-content-padding-x: 1.5rem;
  --hub-stepper-content-padding-y: 1.5rem;
}
```

| Removed | Replace with |
|---|---|
| `--hub-stepper-nav-padding` | `--hub-stepper-nav-padding-x` + `--hub-stepper-nav-padding-y` |
| `--hub-stepper-content-padding` | `--hub-stepper-content-padding-x` + `--hub-stepper-content-padding-y` |

## Version 21.2.0

### Removed `[index]` input from `StepComponent`

**Before:**
```html
<hub-step [index]="0" title="Step 1">...</hub-step>
<hub-step [index]="1" title="Step 2">...</hub-step>
```

**After (remove `[index]` entirely):**
```html
<hub-step title="Step 1">...</hub-step>
<hub-step title="Step 2">...</hub-step>
```

Indexes are now automatically assigned by the parent `StepperComponent`.

### `StepComponent.disabled$` backing signal removed

**Before:** `step.disabled$()` (writable signal)
**After:** `step.disabled()` (read-only signal input)

### `StepperComponent` signal renames

| Before | After |
|---|---|
| `stepper.currentIndex` (getter → `number`) | `stepper.currentIndex()` (signal) |
| `stepper.currentIndex$()` | `stepper.currentIndex()` |
| `stepper.contentAnimating$()` | `stepper.contentAnimating()` |
| `stepper.animationDirection$()` | `stepper.animationDirection()` |

## Version 21.x.x

### Major Version Jump (1.x -> 21.x)
- **Reason**: Alignment with the global repository versioning and Angular 21 major release.
- **Migration**: Update your project to Angular 21 to use this version.

### API Changes
- Internal state management has been migrated to **Signals**. While most public APIs remain compatible, custom extensions relying on internal observables might need updates.
- Improved typing for `StepperOptions`.

### Minimum Requirements
- **Angular**: >= 21.0.0
- **Node.js**: >= 18.0.0 (Recommended for Angular 21)
