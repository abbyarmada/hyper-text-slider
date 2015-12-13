# Screen [Responsiveness](https://en.wikipedia.org/wiki/Responsive_web_design)

**Table of Contents**

 * [Responsive Controls](#responsive-controls)
 * [Responsive Slider Height](#responsive-slider-height)
 * [Responsive Typography](#responsive-typography)

## Responsive Controls

Adding class [hermes-responsive-controls][0] makes layout of slider arrows
dependent on screen resolution.

```html
<div class="hermes-layout--slider
            hermes-create-arrows
            hermes-create-dots
            hermes-responsive-controls">
  ...
</div>
```

By default breakpoints defined in [src/node/sass/\_variables.scss][1] are used
by the slider. Breakpoint values can be changed only when importing css in sass
code (see [CSS Import Options][2]).

```sass
@import 'bower_components/hermes/src/sass/_variables'
$wide-slider-width: 64 * 16px; // must be in px (it's used in calc expressions)
$breakpoint-normal-to-wide: 64em;
$breakpoint-narrow-to-normal: 38em;
@import 'bower_components/hermes/src/sass/_styles'
```

[0]: class-names.md#hermes-responsive-controls
[1]: ../src/sass/_variables.scss
[2]: css-import-options.md

## Responsive Slider Height

## Responsive Typography
