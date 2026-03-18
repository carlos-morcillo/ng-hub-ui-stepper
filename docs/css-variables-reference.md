# ng-hub-ui-stepper - CSS Variables Reference

Complete reference of all CSS custom properties exposed by `ng-hub-ui-stepper`.
Use these variables to customize visual behavior without editing component source code.

---

## Table of Contents

- [How it Works](#how-it-works)
- [Base System Fallbacks](#base-system-fallbacks)
- [Stepper Variables](#stepper-variables)
  - [Core](#core)
  - [Navigation](#navigation)
  - [Controls & Buttons](#controls--buttons)
  - [Layout & Spacing](#layout--spacing)
  - [Animations](#animations)
- [Customization Examples](#customization-examples)

---

## How it Works

The stepper styles are encapsulated within the component using canonical tokens (`--hub-stepper-*`). 

This allows:
- Easy customization via CSS variables on the component's host or parent.
- Runtime theming via CSS custom properties.
- Support for complex layouts like `sidebar` and `rtl` using the same variable set.

---

## Base System Fallbacks

`ng-hub-ui-stepper` consumes these base tokens from the global system:

| Variable | Default |
|---|---|
| `--hub-sys-color-primary` | `#009ef7` |
| `--hub-sys-surface-elevated` | `#f3f6f9` |
| `--hub-sys-surface-page` | `#ffffff` |
| `--hub-sys-text-primary` | `#181c32` |
| `--hub-sys-border-color-default` | `#d8dde6` |
| `--hub-ref-space-3` | `1rem` |
| `--hub-sys-transition-duration-base` | `260ms` |

---

## Stepper Variables

### Core

| Variable | Default | Description |
|---|---|---|
| `--hub-stepper-primary-color` | `var(--hub-sys-color-primary)` | Main theme color used for active steps and primary buttons. |
| `--hub-stepper-background-color` | `var(--hub-sys-surface-elevated)` | Secondary background color for "back" buttons. |
| `--hub-stepper-text-color` | `var(--hub-sys-text-primary)` | Base text color for labels and content. |
| `--hub-stepper-border-color` | `var(--hub-sys-border-color-default)` | Border color for containers and controls. |
| `--hub-stepper-surface-color` | `var(--hub-sys-surface-page)` | Main background color for the content area. |
| `--hub-stepper-disabled-opacity` | `0.5` | Opacity for disabled controls. |

### Navigation

| Variable | Default | Description |
|---|---|---|
| `--hub-stepper-nav-bg` | `transparent` | Background for the navigation container. |
| `--hub-stepper-nav-padding` | `0` | Padding for the navigation container. |
| `--hub-stepper-nav-border-width` | `0` | Border width for the navigation container. |
| `--hub-stepper-nav-link-color` | `#495057` | Text color for pending navigation links. |
| `--hub-stepper-nav-link-active-bg` | `var(--hub-sys-color-primary)` | Background for the currently active nav step. |
| `--hub-stepper-nav-link-active-color` | `#ffffff` | Text color for the currently active nav step. |
| `--hub-stepper-nav-trigger-padding-y` | `0.5rem` | Vertical padding for nav triggers. |
| `--hub-stepper-nav-trigger-padding-x` | `0.75rem` | Horizontal padding for nav triggers. |

### Controls & Buttons

| Variable | Default | Description |
|---|---|---|
| `--hub-stepper-controls-justify` | `flex-end` | Horizontal alignment of action buttons. |
| `--hub-stepper-controls-gap` | `0.5rem` | Spacing between controls. |
| `--hub-stepper-control-padding-y` | `0.375rem` | Vertical padding for action buttons. |
| `--hub-stepper-control-padding-x` | `0.75rem` | Horizontal padding for action buttons. |
| `--hub-stepper-control-font-size` | `0.875rem` | Font size for buttons. |

### Layout & Spacing

| Variable | Default | Description |
|---|---|---|
| `--hub-stepper-gap` | `1rem` | Gap between nav, content, and controls. |
| `--hub-stepper-nav-gap` | `0.25rem` | Gap between individual nav items. |
| `--hub-stepper-sidebar-width` | `clamp(160px, 20vw, 240px)` | Width of the navigation sidebar in `sidebar` layout. |
| `--hub-stepper-content-padding` | `0` | Internal padding for the step content panel. |

### Animations

| Variable | Default | Description |
|---|---|---|
| `--hub-stepper-animation-duration` | `260ms` | Duration of content transition animations. |
| `--hub-stepper-animation-easing` | `ease` | Timing function for transitions. |
| `--hub-stepper-animation-distance` | `18px` | Offset distance for sliding animations. |

---

## Customization Examples

### Clean Horizontal Stepper

```css
hub-stepper {
  --hub-stepper-gap: 2rem;
  --hub-stepper-nav-padding: 1rem;
  --hub-stepper-nav-bg: #f8f9fa;
  --hub-stepper-nav-border-width: 1px;
  --hub-stepper-content-padding: 1.5rem;
}
```

### Modern Dark Vibe

```css
hub-stepper {
  --hub-stepper-primary-color: #7239ea;
  --hub-stepper-surface-color: #1e1e2d;
  --hub-stepper-text-color: #ffffff;
  --hub-stepper-border-color: #323248;
  --hub-stepper-nav-link-color: #a2a5b9;
}
```

### Compact Sidebar

```css
hub-stepper {
  --hub-stepper-sidebar-width: 180px;
  --hub-stepper-nav-trigger-padding-y: 0.25rem;
  --hub-stepper-nav-gap: 0;
}
```
