# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
