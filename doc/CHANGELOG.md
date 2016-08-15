[gulp-eslint]: https://github.com/adametry/gulp-eslint
[gulp-sass]: https://github.com/dlmanning/gulp-sass
[gulp-uglify]: https://github.com/terinjokes/gulp-uglify
[stylelint]: https://github.com/stylelint/stylelint

[hermes-autoboot]: class-names.md#hermes-autoboot
[hermes-defaults]: class-names.md#hermes-defaults
[hermes-responsive-controls]: class-names.md#hermes-responsive-controls
[layout-controls]: class-names.md#hermes-layout--controls

[hermes-boot]: javascript-api.md#bootcontainerelement
[slider-start]: javascript-api.md#sliderstartcallback

[time-class-names]: class-names.md#time-class-names
[option-class-names]: class-names.md#option-class-names
[slide-id]: class-names.md#hermes-slide-id-s

# v0.3.0
 
 * Fixed DOM upgrade procedure.
 * Removed `hermes-layout--inner` CSS class.
 * Added [boot(containerElement)][hermes-boot] procedure.
 * Replaced `hermes-autostart` option with [hermes-autoboot][hermes-autoboot].
 * Made [`Slider.start(callback)` ][slider-start] method asynchronouse
 * Added [hermes-responsive-controls][hermes-responsive-controls] option to
  [hermes-defaults][hermes-defaults].
 * Added [hermes-layout--controls][layout-controls] class name.
 * Added default slide time of 5 sec.
 * Documented [Time Class Names][time-class-names].
 * Added possibility of setting all [options][option-class-names]
  on document's `<body>`.
 * Documented [Slide ID Class Name][slide-id].
 * [gulpfile.js][v0.2.5_1] and [build.config.js][v0.2.5_2] are now linted.
 * Sass sources are now linted with [stylelint][stylelint].
 * Added missing unit tests.

[v0.2.5_1]: gulpfile.js
[v0.2.5_2]: build.config.js

# v0.2.4

 * Added [hermes-responsive-controls][hermes-responsive-controls] class.
 * Documented [Screen Responsiveness][v0.2.4_2].
 * Created [CHANGELOG][v0.2.4_3].

[v0.2.4_2]: doc/responsiveness.md
[v0.2.4_3]: CHANGELOG.md

# v0.2.3

 * Fixed arrow callback bindings.
 * Fixed IllegalCharacterError at slider startup.

# v0.2.2

 * Moved [TODO][v0.2.2_1] to separate file.
 * Added npm and browserify info to [README][v0.2.2_2].

[v0.2.2_1]: TODO.md
[v0.2.2_2]: README.md

# v0.2.1

 * Added keywords to [package.json][v0.2.1_1].
 * Published in [NPM][v0.2.1_2].

[v0.2.1_1]: package.json
[v0.2.1_2]: https://www.npmjs.com/package/hermes-slider

# v0.2.0

 * Set up [Travis CI][v0.2.0_1] for the project.
 * Written documentation for [Declarative API][v0.2.0_2].
 * Written documentation for [JavaScript API][v0.2.0_3].

[v0.2.0_1]: https://travis-ci.org/webfront-toolkit/hermes
[v0.2.0_2]: doc/class-names.md
[v0.2.0_3]: doc/javascript-api.md

# v0.1.0

 * Implementation of slider mechanism.

