module.exports = {
  dir: {
    build: './dist/',
  },

  css: [

    /*
      Main styles for slider mechanism.
      `hermes.scss` imports all underscore-prefixed files.
    */
    {
      main: [
        './src/sass/hermes.scss',
      ],
      src: [
        './src/*.scss',
        './src/sass/*.scss',
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
      main: [
        './src/sass/transitions/internal/*.scss',
      ],
      src: [
        './src/sass/transitions/**/*.scss',
      ],
      dest: 'transitions/'
    },
  ],

  js: [

    /*
      Slider mechanism script.
    */
    {
      main: [
        './src/hermes.js',
      ],
      src: [
        './src/*.js',
        './src/node/**/*.js',
        '!./src/node/**/*.spec.js'
      ],
      spec: [
        './src/node/**/*.spec-helper.js',
        './src/node/**/*.spec.js',
      ]
    }
  ],

  jshint: {
    globals: {
      /* DOM  */
      'Node': {},
      'Element': {},
      'DOMTokenList': {},
      'TransitionEndEvent': {},
      'KeyDownEvent': {},
      'ClickEvent': {},
      'Document': {},
      'Window': {},

      /* Browser */
      'window': {},
      'document': {},

      /* Jasmine */
      'describe': {},
      'it': {},
      'expect': {},
      'beforeEach': {},
      'afterEach': {},
    },
  },
};

