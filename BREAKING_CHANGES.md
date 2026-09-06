# Breaking Changes - ng-hub-ui-stepper

This document tracks all breaking changes in the `ng-hub-ui-stepper` library.

## [22.8.2] - 2026-09-06

### Announced: `StepperModule` and `StepperModule.forRoot()` are removed in 23.0.0

- **Change**: both are now marked `@deprecated`. Nothing is removed here and nothing changes at runtime — this release is the notice, and the removal lands in 23.0.0, the next version that tracks a new Angular major.
- **Impact**: from 23.0.0 the symbol is gone from the entry point, so `import { StepperModule }`, `imports: [StepperModule]` and `StepperModule.forRoot({ … })` stop compiling. `forRoot()` costs more than the rest: it is the only thing that provides `HubTranslationService`, which the stepper's `translate` pipe injects and which is not `providedIn: 'root'`. An application that drops it without putting something in its place fails at runtime with `NullInjectorError: No provider for HubTranslationService`.
- **Migration**: import the seven standalone building blocks directly, and replace `forRoot()` with one of the two paths that do not go through a module.

**The building blocks:**

```ts
// Before
@NgModule({ imports: [StepperModule] })
export class AppModule {}

// After
@Component({
	imports: [
		StepperComponent,
		StepComponent,
		StepTriggerDirective,
		StepperNavDirective,
		PreviousButtonDirective,
		NextButtonDirective,
		SubmitButtonDirective
	]
})
export class CheckoutComponent {}
```

**The labels.** `forRoot()` bundles dictionaries for `en`, `es`, `ca`, `eu`, `gl`, `ast`, `an`, `de`, `zh` and `ar`, and those dictionaries are not exported — so they cannot be handed to a provider function, and they go with the module. The three built-in controls are the only strings the library renders on its own, and there are two ways to name them.

Pass them straight to the component:

```html
<hub-stepper backLabel="Atrás" continueLabel="Continuar" submitLabel="Enviar">
	<hub-step title="Datos">…</hub-step>
</hub-stepper>
```

Or register your own dictionary, which also provides the `HubTranslationService` the pipe needs:

```ts
import { provideHubTranslation } from 'ng-hub-ui-utils';

bootstrapApplication(AppComponent, {
	providers: [
		provideHubTranslation({
			language: 'es',
			fallbackLanguage: 'en',
			dictionaries: {
				es: { HUBUI: { STEPPER: { BACK: 'atrás', CONTINUE: 'continuar', SUBMIT: 'enviar' } } },
				en: { HUBUI: { STEPPER: { BACK: 'back', CONTINUE: 'continue', SUBMIT: 'submit' } } }
			}
		})
	]
});
```

An application already bridging its own translation source with `provideHubTranslationAdapter()` needs nothing further: that provider supplies `HubTranslationService` too.

## [22.5.0] - 2026-07-07

### SCSS ships at `ng-hub-ui-stepper/styles` (packaging path)

- **Change**: the theming mixin now builds to `dist/stepper/styles/...` instead of `dist/stepper/src/lib/styles/...`, and a `styles/index.scss` root entry forwards it.
- **Impact**: a `@use` that reached into the old `src/lib/styles/...` path no longer resolves.
- **Migration**: `@use 'ng-hub-ui-stepper/styles' as *;`

## [22.4.0] - 2026-07-06

### Legacy `ng80-stepper` / `ng80-step` element selectors removed

- **Change**: the components match only `hub-stepper` / `hub-ui-stepper` and `hub-step` / `hub-ui-step`. The `ng80-*` selectors, kept from before the rename to the `hub-` prefix, are gone.
- **Impact**: `<ng80-stepper>` and `<ng80-step>` markup no longer instantiates anything. Angular treats an unmatched element as an unknown one, so the wizard silently disappears from the page instead of failing loudly.
- **Migration**: rename the elements.

**Before:**
```html
<ng80-stepper>
  <ng80-step title="Account">…</ng80-step>
</ng80-stepper>
```

**After:**
```html
<hub-stepper>
  <hub-step title="Account">…</hub-step>
</hub-stepper>
```

> The major stays at `22` because it tracks the supported Angular major, not the shape of the API. That is why a removal like this one ships as a minor and is announced here.

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
