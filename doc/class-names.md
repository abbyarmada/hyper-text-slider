<!--

Copyright 2015 Maciej Chałapuk

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

-->

<!-- Start Template class-names.md.ejs -->

# CSS Class Names

**Table of Contents**

1. [Option Class Names](class-names.md#option-class-names)<ul>
<li>[hermes-autoboot](class-names.md#hermes-autoboot)
<li>[hermes-defaults](class-names.md#hermes-defaults)
<li>[hermes-autoplay](class-names.md#hermes-autoplay)
<li>[hermes-show-arrows](class-names.md#hermes-show-arrows)
<li>[hermes-show-dots](class-names.md#hermes-show-dots)
<li>[hermes-arrow-keys](class-names.md#hermes-arrow-keys)
<li>[hermes-responsive-controls](class-names.md#hermes-responsive-controls)</ul>
2. [Theme Class Names](class-names.md#theme-class-names)<ul>
<li>[hermes-theme--white](class-names.md#hermes-theme--white)
<li>[hermes-theme--black](class-names.md#hermes-theme--black)</ul>
3. [Time Class Names](class-names.md#time-class-names)<ul>
<li>[hermes-slide-time-3sec](class-names.md#hermes-slide-time-3sec)
<li>[hermes-slide-time-7sec](class-names.md#hermes-slide-time-7sec)</ul>
4. [Transition Phase Class Names](class-names.md#transition-phase-class-names)<ul>
<li>[hermes-before-transition](class-names.md#hermes-before-transition)
<li>[hermes-during-transition](class-names.md#hermes-during-transition)
<li>[hermes-after-transition](class-names.md#hermes-after-transition)</ul>
5. [Transition Marker Class Names](class-names.md#transition-marker-class-names)<ul>
<li>[hermes-slide-from](class-names.md#hermes-slide-from)
<li>[hermes-slide-to](class-names.md#hermes-slide-to)</ul>
6. [Layout Class Names](class-names.md#layout-class-names)<ul>
<li>[hermes-layout--controls](class-names.md#hermes-layout--controls)
<li>[hermes-slider](class-names.md#hermes-slider)
<li>[hermes-layout--slider](class-names.md#hermes-layout--slider)
<li>[hermes-layout--slide](class-names.md#hermes-layout--slide)
<li>[hermes-layout--background](class-names.md#hermes-layout--background)
<li>[hermes-layout--content](class-names.md#hermes-layout--content)
<li>[hermes-layout--arrow](class-names.md#hermes-layout--arrow)
<li>[hermes-layout--arrow-left](class-names.md#hermes-layout--arrow-left)
<li>[hermes-layout--arrow-right](class-names.md#hermes-layout--arrow-right)
<li>[hermes-layout--dots](class-names.md#hermes-layout--dots)
<li>[hermes-layout--dot](class-names.md#hermes-layout--dot)</ul>
7. [Flag Class Names](class-names.md#flag-class-names)<ul>
<li>[is-upgraded](class-names.md#is-upgraded)
<li>[is-active](class-names.md#is-active)</ul>
8. [Other Class Names](class-names.md#other-class-names)<ul>
<li>[/hermes-transition--([^\s]+)/g](class-names.md#hermes-transition--\sg)
<li>[/hermes-slide-id-([^\s]+)/](class-names.md#hermes-slide-id-\s)</ul>

<!-- Start lib/enums/option.js -->

## Option Class Names

Option classes enable features of the slider.

Most options are intended to be set on [hermes-layout--slider](class-names.md#hermes-layout--slider) element, but they can also be
set on document's `<body>`. Options set on `<body>` are treated as defaults for each [hermes-layout--slider](class-names.md#hermes-layout--slider) declared on the page.

Two categories:
 1. **single options** - each of which enables one feature,
 2. **option groups** - that adds many option classes to the slider during
   [upgrade](dom-upgrade.md).

Each option class is checked by the slider in one of two ways:
 1. <a href='#once' id='once'>**checked once**</a> - class name should be set
   in client HTML, slider will check for it only once during upgrade, adding/removing class
   after upgrade make no effect,
 2. <a href='#continuously' id='continuously'>**checked continuously**</a> -
   class name may be added/removed at any time, slider will check if it is set every time
   a decission connected with this class is made.

### Summary

Name | Description | Checked | Target Element
--- | --- | --- | ---
[hermes-autoboot](class-names.md#hermes-autoboot) | Automatically creates [Slider](javascript-api.md#slider) objects for all sliders declared on the page and invokes their [Slider.prototype.start(callback)](javascript-api.md#sliderprototypestartcallback) methods. | once | document's `<body>`
[hermes-defaults](class-names.md#hermes-defaults) | Adds [hermes-autoplay](class-names.md#hermes-autoplay), [hermes-show-arrows](class-names.md#hermes-show-arrows), [hermes-show-dots](class-names.md#hermes-show-dots), [hermes-arrow-keys](class-names.md#hermes-arrow-keys), [hermes-responsive-controls](class-names.md#hermes-responsive-controls) classes to the slider. | once | `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)
[hermes-autoplay](class-names.md#hermes-autoplay) | Automatically moves slider to next slide. | continuously | `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)
[hermes-show-arrows](class-names.md#hermes-show-arrows) | Shows side arrow buttons. | continuously | `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)
[hermes-show-dots](class-names.md#hermes-show-dots) | Shows dot button for each slide. | continuously | `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)
[hermes-arrow-keys](class-names.md#hermes-arrow-keys) | Adds keyboard control to slider. | once | `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)
[hermes-responsive-controls](class-names.md#hermes-responsive-controls) | Adds screen responsiveness to slider controls. | once | `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)

### Details

#### hermes-autoboot

Automatically creates [Slider](javascript-api.md#slider) objects for all sliders declared on the page
and invokes their [Slider.prototype.start(callback)](javascript-api.md#sliderprototypestartcallback) methods.

This options can be set only on `<body>` element.
It enabled using Hermes without any JavaScript programming.

> ***WARNING***
>
> When using Hermes via node and broserify, this option is ignored.

*@checked* - [once](#once)

*@target* - document's `<body>`

*@see* - [boot(containerElement)](javascript-api.md#bootcontainerelement)

*@see* - [Slider.prototype.start(callback)](javascript-api.md#sliderprototypestartcallback)

#### hermes-defaults

Adds
[hermes-autoplay](class-names.md#hermes-autoplay),
[hermes-show-arrows](class-names.md#hermes-show-arrows),
[hermes-show-dots](class-names.md#hermes-show-dots),
[hermes-arrow-keys](class-names.md#hermes-arrow-keys),
[hermes-responsive-controls](class-names.md#hermes-responsive-controls)
classes to the slider.

*@checked* - [once](#once)

*@target* - `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)

#### hermes-autoplay

Automatically moves slider to next slide.

Slider is moved to the next after time specified in [time class name](class-names.md#time-class-names).

*@checked* - [continuously](#continuously)

*@target* - `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)

*@see* - [Slider.prototype.moveToNext()](javascript-api.md#sliderprototypemovetonext)

#### hermes-show-arrows

Shows side arrow buttons.

`click` event on dispatched on left arrow moves slider to previous slide.
`click` event on dispatched on right arrow moves slider to next slide.

*@checked* - [continuously](#continuously)

*@target* - `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)

*@see* - [Slider.prototype.moveToPrevious()](javascript-api.md#sliderprototypemovetoprevious)

*@see* - [Slider.prototype.moveToNext()](javascript-api.md#sliderprototypemovetonext)

#### hermes-show-dots

Shows dot button for each slide.

`click` event displatched on dot button moves slider to slide asociated with this dot button.

*@checked* - [continuously](#continuously)

*@target* - `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)

*@see* - [Slider.prototype.currentIndex](javascript-api.md#sliderprototypecurrentindex)

#### hermes-arrow-keys

Adds keyboard control to slider.

`keydown` event displatched on `window` object with `LeftArrow` key moves slider to previous
slide, with `RightArrow` key moves slider to next slide.

*@checked* - [once](#once)

*@target* - `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)

*@see* - [Slider.prototype.currentIndex](javascript-api.md#sliderprototypecurrentindex)

#### hermes-responsive-controls

Adds screen responsiveness to slider controls.

Slider controls come in 3 different layouts. Each for different range of screen width.

*@checked* - [once](#once)

*@target* - `<body` or [hermes-layout--slider](class-names.md#hermes-layout--slider)

*@see* - [Screen Responsiveness](responsiveness.md)

*@see* - Slider.breakpointNarrowToNormal

*@see* - Slider.breakpointNormalToWide

<!-- End lib/enums/option.js -->

<!-- Start lib/enums/theme.js -->

## Theme Class Names

Themes make slide look god without any other styling. It's purpose is to set default color
for background and all foreground elements (text and all controls).

A theme MAY be specified for each slide element ([hermes-layout--slide](class-names.md#hermes-layout--slide)) in client HTML.
During [slider's DOM upgrade procedure](dom-upgrade.md), each slide with no theme specified
receives a theme class which was declared on the slider element ([hermes-layout--slider](class-names.md#hermes-layout--slider)).
If there is no theme specified on the slider, [hermes-theme--white](class-names.md#hermes-theme--white) is used as default.

### Summary

Name | Description
--- | ---
[hermes-theme--white](class-names.md#hermes-theme--white) | White background, dark foreground. This is the default theme if none specified.
[hermes-theme--black](class-names.md#hermes-theme--black) | Black background, white foreground.

### Details

#### hermes-theme--white

White background, dark foreground. This is the default theme if none specified.

#### hermes-theme--black

Black background, white foreground.

<!-- End lib/enums/theme.js -->

<!-- Start lib/enums/time.js -->

## Time Class Names

Time classes configure [hermes-autoplay](class-names.md#hermes-autoplay) option. They control
time duration of one slide being visible before automatic change to the next.

If no slide time is specified, slide is visible for 5 seconds.

### Summary

Name | Description
--- | ---
[hermes-slide-time-3sec](class-names.md#hermes-slide-time-3sec) | Makes slide visible for 3 seconds before moving to next.
[hermes-slide-time-7sec](class-names.md#hermes-slide-time-7sec) | Makes slide visible for 7 seconds before moving to next.

### Details

#### hermes-slide-time-3sec

Makes slide visible for 3 seconds before moving to next.

*@checked* - [continously](#continously)

*@target* - [hermes-layout--slider](class-names.md#hermes-layout--slider)

#### hermes-slide-time-7sec

Makes slide visible for 7 seconds before moving to next.

*@checked* - [continously](#continously)

*@target* - [hermes-layout--slider](class-names.md#hermes-layout--slider)

<!-- End lib/enums/time.js -->

<!-- Start lib/enums/phase.js -->

## Transition Phase Class Names

All phase classes are automatically set on slider element ([hermes-layout--slider](class-names.md#hermes-layout--slider)).
They MUST NOT be manipulated from client HTML or JavaScript. They **should be used only
in definitions of CSS transitions**.

### Summary

Name | Description
--- | ---
[hermes-before-transition](class-names.md#hermes-before-transition) | Set on slider element just before transition starts.
[hermes-during-transition](class-names.md#hermes-during-transition) | Set on slider element while transition of [hermes-layout--content](class-names.md#hermes-layout--content) element is run.
[hermes-after-transition](class-names.md#hermes-after-transition) | Set on slider element after transition of [hermes-layout--content](class-names.md#hermes-layout--content) element ends.

### Details

#### hermes-before-transition

Set on slider element just before transition starts.

This phase lasts for 1 millisecond. It exists just for the purpose of setting CSS properties
to initial values before transition.

#### hermes-during-transition

Set on slider element while transition of [hermes-layout--content](class-names.md#hermes-layout--content) element is run.

#### hermes-after-transition

Set on slider element after transition of [hermes-layout--content](class-names.md#hermes-layout--content) element ends.

<!-- End lib/enums/phase.js -->

<!-- Start lib/enums/marker.js -->

## Transition Marker Class Names

They are automatically set on slide elements ([hermes-layout--slide](class-names.md#hermes-layout--slide)).
Marker class names MUST NOT be manipulated from client HTML or JavaScript
and **SHOULD be used only in definitions of CSS transitions**.

### Summary

Name | Description
--- | ---
[hermes-slide-from](class-names.md#hermes-slide-from) | Automatically set on previously active [hermes-layout--slide](class-names.md#hermes-layout--slide).
[hermes-slide-to](class-names.md#hermes-slide-to) | Automatically set on currently active [hermes-layout--slide](class-names.md#hermes-layout--slide).

### Details

#### hermes-slide-from

Automatically set on previously active [hermes-layout--slide](class-names.md#hermes-layout--slide).

*@invariant* - After starting first transition this class name is set on only one slide.

#### hermes-slide-to

Automatically set on currently active [hermes-layout--slide](class-names.md#hermes-layout--slide).

This class name is set on first slide after starting a slider
and then set on currently active slide each time it changes.

*@invariant* - After starting slider this class name is set on only one slide.

<!-- End lib/enums/marker.js -->

<!-- Start lib/enums/layout.js -->

## Layout Class Names

In most cases, most of layout classes **SHOULD not be used in client HTML**, as they are
automatially applied to apropriate elements during [slider's upgrade procedure](dom-upgrade.md)
([hermes-slider](class-names.md#hermes-slider) is the only layout class name that MUST be applied in client HTML).

Layout classes play following roles in slider's inner-workings.
 1. **role-id** - class names are used to identify element's role during slider upgrade,
 2. **transition** - class names must be used in definitions of CSS transitions,
 3. **styling** - class names are recommended for usage in slide's styling.

### Summary

Name | Description | Usage | Client HTML
--- | --- | --- | ---
[hermes-layout--controls](class-names.md#hermes-layout--controls) | Set during upgrade on all generated controls. | styling | forbidden
[hermes-slider](class-names.md#hermes-slider) | Alias for [hermes-layout--slider](class-names.md#hermes-layout--slider). | role-id styling | mandatory
[hermes-layout--slider](class-names.md#hermes-layout--slider) | Identifies main slider element. | role-id styling | mandatory
[hermes-layout--slide](class-names.md#hermes-layout--slide) | Identifies a slide. | role-id styling | optional
[hermes-layout--background](class-names.md#hermes-layout--background) | Identifies background of a slide. | role-id styling transition | optional
[hermes-layout--content](class-names.md#hermes-layout--content) | Identifies content of a slide. | role-id styling transition | optional
[hermes-layout--arrow](class-names.md#hermes-layout--arrow) | Set during upgrade on generated arrow buttons. | styling | forbidden
[hermes-layout--arrow-left](class-names.md#hermes-layout--arrow-left) | Set during upgrade on generated left arrow button. | styling | forbidden
[hermes-layout--arrow-right](class-names.md#hermes-layout--arrow-right) | Set during upgrade on generated right arrow button. | styling | forbidden
[hermes-layout--dots](class-names.md#hermes-layout--dots) | Set during upgrade on container elements that contains dot buttons. | styling | forbidden
[hermes-layout--dot](class-names.md#hermes-layout--dot) | Set during upgrade on each dot button element. | styling | forbidden

### Details

#### hermes-layout--controls

Set during upgrade on all generated controls.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [hermes-layout--slider](class-names.md#hermes-layout--slider)

#### hermes-slider

Alias for [hermes-layout--slider](class-names.md#hermes-layout--slider).

#### hermes-layout--slider

Identifies main slider element.

This class must be set on all slider elements in client HTML.
It can be used in client CSS code for styling.

#### hermes-layout--slide

Identifies a slide.

At least 2 slides must be defined in each slider.
It can be used in client CSS code for styling.

*@parent-element* - [hermes-layout--slider](class-names.md#hermes-layout--slider)

#### hermes-layout--background

Identifies background of a slide.

For slides in which this element is not present in slider declaration, empty background
element will be generated during slider upgrade. This class name must be used in all
definitions of background transitions.

*@parent-element* - [hermes-layout--slide](class-names.md#hermes-layout--slide)

#### hermes-layout--content

Identifies content of a slide.

For slides in which this element is not present in slider declaration, it will be generated
during slider upgrade. Contents of a slide will be moved inside generated element. If element
is present in slider declaration, it must contain all contents of a slide. This class name
must be used in all definitions of content transitions.

*@parent-element* - [hermes-layout--slide](class-names.md#hermes-layout--slide)

#### hermes-layout--arrow

Set during upgrade on generated arrow buttons.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [hermes-layout--slider](class-names.md#hermes-layout--slider)

#### hermes-layout--arrow-left

Set during upgrade on generated left arrow button.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [hermes-layout--slider](class-names.md#hermes-layout--slider)

#### hermes-layout--arrow-right

Set during upgrade on generated right arrow button.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [hermes-layout--slider](class-names.md#hermes-layout--slider)

#### hermes-layout--dots

Set during upgrade on container elements that contains dot buttons.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [hermes-layout--slider](class-names.md#hermes-layout--slider)

#### hermes-layout--dot

Set during upgrade on each dot button element.

This class name must not be used in client HTML.
It may be used in client CSS for styling.

*@parent-element* - [hermes-layout--dots](class-names.md#hermes-layout--dots)

<!-- End lib/enums/layout.js -->

<!-- Start lib/enums/flag.js -->

## Flag Class Names

They are automatically set by the slider. Flag class names MUST NOT be manipulated from
client HTML or JavaScript and **SHOULD be used only in client CSS**.

### Summary

Name | Description
--- | ---
[is-upgraded](class-names.md#is-upgraded) | Automatically set on slider after its upgrade.
[is-active](class-names.md#is-active) | Automatically set on [hermes-layout--dot](class-names.md#hermes-layout--dot) button connected with currently active slide.

### Details

#### is-upgraded

Automatically set on slider after its upgrade.

#### is-active

Automatically set on [hermes-layout--dot](class-names.md#hermes-layout--dot) button connected with currently active slide.

*@invariant* - This class is set on only one dot button.

<!-- End lib/enums/flag.js -->

<!-- Start lib/enums/pattern.js -->

## Other Class Names

### Summary

Name | Description
--- | ---
[/hermes-transition--([^\s]+)/g](class-names.md#hermes-transition--\sg) | All transitions used by the slider must match this regular expression.
[/hermes-slide-id-([^\s]+)/](class-names.md#hermes-slide-id-\s) | Slider keeps class name with id of current slide on [hermes-layout--slider](class-names.md#hermes-layout--slider) element.

### Details

#### /hermes-transition--([^\s]+)/g

All transitions used by the slider must match this regular expression.

During slider upgrade [hermes-layout--slider](class-names.md#hermes-layout--slider) element is checked for presence of
transition class names. Transitions declared this way will be randomly used by the slider.
After upgrade all declared transitions are removed from slider element.

Transitions may also be declared on [hermes-layout--slide](class-names.md#hermes-layout--slide) elements. Slider will always
use transition declared on slide element when moving to this slide. Transition declarations of
this type are [checked continuously](#continuously), therefore they may be added/removed
on slides at runtime (client JavaScript).

*@invariant* - Class name of currently running transition is set on slider element.

#### /hermes-slide-id-([^\s]+)/

Slider keeps class name with id of current slide on [hermes-layout--slider](class-names.md#hermes-layout--slider) element.

This functionality may be useful if slides other than current are to be partially visible
or if appearence of controls or even whole slider needs to change from one slide to another.

*@invariant* - Class name with id of current slide is set on slider element.

<!-- End lib/enums/pattern.js -->

<!-- End Template class-names.md.ejs -->

