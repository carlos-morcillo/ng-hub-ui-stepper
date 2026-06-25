# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [22.1.1] - 2026-06-25

### Fixed

- Design-token consistency pass: aligned inline fallback defaults with the canonical `ng-hub-ui-ds` values and routed hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) through their `--hub-sys-*` / `--hub-ref-*` tokens, so they follow the active theme. No visual change when the ds tokens are loaded.

## [22.1.0] - 2026-06-24

### Added

- New **`variant` input** on `<hub-stepper>` selecting a **semantic accent**: `<hub-stepper variant="success">` recolours the active step pill and the next / submit controls. The built-in values (`primary` / `success` / `danger` / `warning` / `info`) map to the design-system families via a Sass `@each` loop; **any other string is also accepted** — the accent reads `--hub-sys-color-<variant>`. Defaults to primary (no visual change). New token `--hub-stepper-accent` (the `--hub-stepper-primary-color` and active-pill tokens now follow it).
- New **`hub-stepper-theme()` Sass mixin** (`styles/mixins/stepper-theme`) — theme a stepper in one call: accent, surfaces, nav pills, controls, spacing and the sidebar width. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted as `--hub-stepper-*` overrides. Token-based, no Bootstrap dependency. (Complements the existing `StepperThemeService` for runtime overrides.)
- The `styles/` folder is now shipped inside the package, so the mixin can be consumed directly via `@use 'ng-hub-ui-stepper/styles/mixins/stepper-theme'`.

### Changed

- Replaced the `--hub-stepper-content-padding` and `--hub-stepper-nav-padding` shorthands with the canonical directional `-padding-x` / `-padding-y` tokens. No visual change. **BREAKING**: set the `-x`/`-y` tokens instead of the removed shorthands.

## [22.0.0] - 2026-06-17

### Changed

- Aligned with Angular 22.
- README documentation standardized.


## [21.2.1] - 2026-06-13

### Fixed
- `StepperThemeService.setTheme` no longer references the global `document`, which threw `ReferenceError: document is not defined` during server-side rendering. It now injects the `DOCUMENT` token, making runtime theming SSR-safe.

## [21.2.0] - 2026-03-19

### Added
- `StepperAnimationDirection` enum exported from `stepper-options.ts` for typed animation direction values (`Forward`, `Backward`).
- Step indexes are now automatically assigned by `StepperComponent` via a reactive `effect()` — no manual `[index]` binding required.

### Changed
- `StepComponent.index` is now an internal writable signal managed by the parent stepper. Remove all `[index]="N"` bindings from `hub-step` templates.
- `StepComponent.disabled` simplified from a getter/setter with a backing `disabled$` signal to a direct signal input (`input(false)`).
- `StepperComponent.currentIndex` is now a public writable signal (`signal<number>`) — call as `currentIndex()` instead of the previous getter.
- Renamed internal signals: `currentIndex$` → `currentIndex`, `contentAnimating$` → `contentAnimating`, `animationDirection$` → `animationDirection` (removed `$` suffix convention).
- Animation direction internally uses `StepperAnimationDirection` enum values instead of raw string literals.

### Removed
- `StepComponent.disabled$` backing signal removed — use the `disabled` signal input directly.
- `[index]` template binding removed from `StepComponent` — indexes are managed internally by the stepper.

## [21.1.0] - 2026-03-18

### Added
- Integrated **Angular 21** support.
- Implemented **Signals-based** architecture for internal state management.
- Added modern **Input/Output** signal interfaces.
- Added `contentChild` and `contentChildren` for step and directive discovery.

### Changed
- Improved component performance using `ChangeDetectionStrategy.OnPush`.
- Enhanced accessibility with proper ARIA attributes and keyboard support.
- Simplified navigation logic with a more robust step transition system.
- Converted all components and directives to standalone (Angular 20+ default, no `standalone: false`).
- Refactored `StepperModule` to a convenience re-export wrapper with no `declarations`.
- Refactored `NextButtonDirective`, `PreviousButtonDirective`, and `SubmitButtonDirective` to use `computed` signals with `host` bindings, replacing `effect` + `@HostBinding`.

### Fixed
- Fixed issues with step indices and validation during dynamic step additions.
- Fixed `steps` template variable incorrectly invoked as a signal inside `ng-template` context (`steps()` → `steps`).
- Fixed `ExpressionChangedAfterItHasBeenCheckedError` (NG0100) in button directives caused by mutating host bindings inside `effect()`.
- Fixed `tsconfig.lib.json`: added `paths` mapping for `ng-hub-ui-utils` to resolve build compilation error.
