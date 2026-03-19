# Breaking Changes - ng-hub-ui-stepper

This document tracks all breaking changes in the `ng-hub-ui-stepper` library.

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
