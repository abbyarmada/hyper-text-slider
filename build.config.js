'use strict';

var Formatter = require('./src/docs/formatter');

module.exports = {
  dir: {
    build: 'dist/',
    docs: 'doc/',
  },

  css: [

    /*
      Main styles for slider mechanism.
      `hermes.scss` imports all underscore-prefixed files.
    */
    {
      main: [
        'src/sass/hermes.scss',
      ],
      src: [
        'src/*.scss',
        'src/sass/*.scss',
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
        'src/sass/transitions/internal/*.scss',
      ],
      src: [
        'src/sass/transitions/**/*.scss',
      ],
      dest: 'transitions/'
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
      main: [
        'src/hermes.js',
      ],
      src: [
        'src/*.js',
        'src/node/**/*.js',
        '!src/node/**/*.spec.js',
        '!src/node/**/*.spec-helper.js',
      ],
      spec: [
        'src/node/**/*.spec-helper.js',
        'src/node/**/*.spec.js',
      ],
    },

    /*
      Documentation formatter script.
    */
    {
      src: [
        'src/docs/**/*.js',
      ],
    },
  ],

  /*
    Documentation:
   */
  doc: [

    /*
      CSS Class Names
    */
    {
      src: [
        'src/node/classnames/_layout.js',
        'src/node/classnames/_options.js',
        'src/node/classnames/_phases.js',
        'src/node/classnames/_markers.js',
        'src/node/classnames/_flags.js',
        'src/node/classnames/_regexps.js',
      ],
      options: {
        formatter: function(docfile) { return module.exports.doc.formatter.format(docfile); },
        template: 'src/docs/class-names.md.ejs',
        concat: 'class-names.md',
        skipSingleStar: true,
      }
    },

    /*
      Slider JavaScript API
    */
    {
      src: [
        'src/node/slider.js',
      ],
      options: {
        formatter: function(docfile) { return module.exports.doc.formatter.format(docfile); },
        template: 'src/docs/javascript-api.md.ejs',
        concat: 'javascript-api.md',
        skipSingleStar: true,
      }
    },
  ],
};

var formatterConfig = (function() {
  var path__src2doc = {};
  module.exports.doc.forEach(function(files) {
    files.src.forEach(function(src) {
      path__src2doc[src] = files.options.concat;
    });
  });

  return {
    getUrlBase: function(context) {
      var retVal =  path__src2doc[context.raw.filename];
      if (!retVal) {
        throw new Error('no base found for '+ context.raw.filename);
      }
      return retVal;
    },
  }
}());

module.exports.doc.formatter = Formatter(formatterConfig);

