# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [22.5.1] - 2026-07-26

### Fixed

- **`StepTriggerDirective` never instantiated.** Its selector used a descendant combinator (`'[hubStepTrigger] [stepTrigger]'`) instead of a comma, so neither attribute alone ever matched. The selector is now `'[hubStepTrigger], [stepTrigger]'` and the directive captures its `TemplateRef` when applied. Note: the stepper does not yet render these trigger templates anywhere — this is groundwork that makes the directive instantiable and queryable; wiring it into the step rail is tracked as follow-up work.

### Changed

- Declared the real `ng-hub-ui-utils` peer range: `>=22.7.0`. The library imports `resolveHubAccent`, introduced in utils 22.7.0; the previous `>=1.2.0` floor allowed installs that compile but fail at runtime.

## [22.5.0] - 2026-07-07

### Changed

- **BREAKING (packaging) — SCSS ships at `ng-hub-ui-stepper/styles`.** The theme mixin now builds to `dist/stepper/styles/...` (was `dist/stepper/src/lib/styles/...`), so `@use 'ng-hub-ui-stepper/styles'` resolves. Update any `@use` that reached into `src/lib/styles`.

- **`<hub-stepper>` `variant` accepts ANY colour.** On top of the built-in semantic accents, the input now also accepts a **registered custom accent** and a **literal colour** (`#ff0000`, `rgb(...)`, `oklch(...)`, a CSS named colour), resolved through the shared `resolveHubAccent` helper (imported from `ng-hub-ui-utils`): a bareword becomes `var(--hub-sys-color-<name>, <name>)`; a literal is used as-is. The single `--hub-<comp>-accent` slot derives the rest of the family, so built-in colours are unchanged.
- **Internal — host bindings moved to the `host` metadata object.** `@HostBinding` / `@HostListener` decorators were replaced by the `host` object in the component/directive metadata (Angular style guide). No public API or behaviour change.

## [22.4.0] - 2026-07-06

### Removed

- **BREAKING — legacy `ng80-stepper` / `ng80-step` element selectors removed.** The components now match only `hub-stepper` / `hub-ui-stepper` and `hub-step` / `hub-ui-step`, aligning with the rest of the ng-hub-ui ecosystem (the `hub-ui-*` compatibility alias stays). Replace any `<ng80-stepper>` / `<ng80-step>` markup with `<hub-stepper>` / `<hub-step>`. (Major stays at `22` to track the supported Angular major; this breaking removal ships as a minor bump per the ecosystem's Angular-aligned versioning.)

### Fixed

- CSS variable fallbacks realigned to the ds light defaults (`--hub-sys-color-primary`: `#009ef7` → `#0d6efd`); fallbacks only apply when ng-hub-ui-ds is not loaded. The `transparent` fallback of `--hub-sys-surface-page` on the nav background is intentional degradation and stays unchanged.
- Docs: `docs/css-variables-reference.md` default values resynchronized with the actual code declarations (now guarded by the repo-level `tokens-parity` check F).
- Docs: the README theming example now uses the ds accent (`#0d6efd`) instead of the old-palette blue (`#009ef7`).

## [22.3.0] - 2026-06-30

### Added

- **Opt-in nav title truncation + tooltip.** New `truncateTitles` input on `hub-stepper`: when enabled, each nav step title is clipped to the new `--hub-stepper-nav-title-max-width` CSS variable (default `12rem`) with an ellipsis, and reveals its full text on hover when it overflows. The tooltip is **agnostic** — it defaults to the hub-ui tooltip (via `ng-hub-ui-utils`' `[hubOverflowTooltip]`) but is swappable with `provideHubTooltip(...)`. Off by default, so the standard nav layout is unchanged. Requires `ng-hub-ui-utils >= 22.6.0` and the tooltip styles (`@use 'ng-hub-ui-utils/styles/tooltip';`).

## [22.2.0] - 2026-06-26

### Added

- **Open-set accent variants.** `<hub-stepper variant="…">` now accepts the full open accent set out of the box — `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `neutral`, `light`, `dark` (previously only the first five chromatic ones re-based the accent). Any other variant works at runtime with no recompile: define a single `--hub-sys-color-<name>` (e.g. `:root { --hub-sys-color-brand: #ff6b00; }`) and `<hub-stepper variant="brand">` derives the active-pill / controls treatment from it, via the new open-set `[data-variant]` rule.
- New derived accent roles `--hub-stepper-accent-emphasis`, `--hub-stepper-accent-subtle` and `--hub-stepper-accent-on`, mixed locally from the single `--hub-stepper-accent` slot. The active step pill and the next/submit controls now take their text colour from `--hub-stepper-accent-on` instead of a hardcoded white, so a light custom accent stays legible.
- The `hub-stepper-theme()` mixin now re-derives the accent role family whenever its `$accent` parameter is passed, so a brand accent applied on a custom selector recomputes `-emphasis` / `-subtle` / `-on` (the slot stays the single source of truth — no duplication).

### Changed

- The accent role family is now mixed in the **OKLCH** colour space (`color-mix(in oklch, …)`) for perceptually even tints across every accent.

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
