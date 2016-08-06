'use strict';

var GithubMarkdownFormatter = require('./src/docgen/formatter');
var formatter = new GithubMarkdownFormatter();

module.exports = {
  dir: {
    src: 'src/',
    build: 'dist/',
    docs: 'doc/',
  },

  config: [

    /*
      Gulp configuration files.
     */
    {
      src: [
        'build.config.js',
        'gulpfile.js',
        '.eslintrc',
        '.stylelintrc',
      ],
    },
  ],

  css: [

    /*
      Main styles for slider mechanism.
      `hermes.scss` imports all underscore-prefixed files.
    */
    {
      main: 'src/styles/hermes.scss',
      src: [
        'src/*.scss',
        'src/styles/*.scss',
      ],
    },

    /*
      For each transition there are two files:
       1. main file located in `internal/{transition-name}.scss`
         (each of those get compiled into dest folder),
       2. an underscore-prefixed file with @import to the main file
         (to be Sass-imported into other projects).
    */
    {
      main: 'src/styles/transitions/internal/*.scss',
      src: [
        'src/styles/transitions/**/*.scss',
      ],
      dest: 'transitions/',
    },
  ],

  /*
    Entries with `main` property will be conpiled (browserified and minified) into build folder.
  */
  js: [

    /*
      Slider mechanism script.
    */
    {
      name: 'core',
      main: 'src/browser.js',
      src: [
        'src/core/**/*.js',
        '!src/**/*.spec.js',
        '!src/**/*.spec-helper.js',
      ],
      spec: [
        'src/core/**/*.spec-helper.js',
        'src/core/**/*.spec.js',
      ],
    },

    /*
      Web standard polyfills.
    */
    {
      name: 'polyfill',
      main: 'src/polyfills.js',
      src: [
        'src/polyfills/*.js',
        '!src/**/*.spec.js',
        '!src/**/*.spec-helper.js',
      ],
      spec: [
        'src/polyfills/**/*.spec-heler.js',
        'src/polyfills/**/*.spec.js',
      ],
    },

    /*
      Documentation formatter script.
    */
    {
      name: 'docgen',
      src: [
        'src/docgen/**/*.js',
        '!src/**/*.spec.js',
        '!src/**/*.spec-helper.js',
      ],
      spec: [
        'src/docgen/**/*.spec-helper.js',
        'src/docgen/**/*.spec.js',
      ],
    },
  ],

  /*
    Documentation:
   */
  doc: {

    /*
      Files that will not be overwritten in the build process.
     */
    written: [
      'doc/responsiveness.md',
      'doc/TODO.md',
      'doc/CHANGELOG.md',
    ],

    generated: [

      /*
        CSS Class Names
      */
      {
        src: [
          'src/enums/layout.js',
          'src/enums/option.js',
          'src/enums/time.js',
          'src/enums/phase.js',
          'src/enums/marker.js',
          'src/enums/flag.js',
          'src/enums/pattern.js',
        ],
        options: {
          formatter: formatter.format.bind(formatter),
          template: 'src/docgen/class-names.md.ejs',
          concat: 'class-names.md',
          skipSingleStar: true,
          titleProperty: 'value',
        },
      },

      /*
        Slider JavaScript API
       */
      {
        src: [
          'src/core/slider.js',
          'src/core/phaser.js',
          'src/core/boot.js',
        ],
        options: {
          formatter: formatter.format.bind(formatter),
          template: 'src/docgen/javascript-api.md.ejs',
          concat: 'javascript-api.md',
          skipSingleStar: true,
          titleProperty: 'signature',
        },
      },
    ],

    /*
      Needed to reset the formater during a clean,
      which is needed when working with watch.
      This is ugly...
     */
    formatter: formatter,
  },
};

/*
  eslint-env node
*/

