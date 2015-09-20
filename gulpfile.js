'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var jasmine = require('gulp-jasmine');
var cssmin = require('gulp-cssmin');
var connect = require('gulp-connect');
var rename = require('gulp-rename');
var merge_stream = require('merge-stream');
var del = require('del');

var config = require('./build.config');

function task(name, deps, config, func) {
  gulp.task(name, deps, function () {
    config = (config instanceof Array? config: [ config ]);
    var results = config.map(func.bind(null));
    return merge_stream.apply(null, results);
  });
};

task('sass', [], config.css, function(files) {
  var build_dir = config.dir.build + (files.dest || '');

  return gulp.src(files.main)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(build_dir))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(build_dir))
  ;
});

task('jshint:javascript', [], config.js, function(files) {
  return gulp.src(files.src)
    .pipe(jshint(config.jshint))
    .pipe(jshint.reporter('jshint-stylish'))
  ;
});

task('javascript', [ 'jshint:javascript' ], config.js, function(files) {
  return gulp.src(files.main)
    .pipe(browserify())
    .pipe(gulp.dest(config.dir.build))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.dir.build))
  ;
});

task('jshint:spec', [], config.js, function(files) {
  return gulp.src(files.spec)
    .pipe(jshint(config.jshint))
    .pipe(jshint.reporter('jshint-stylish'))
  ;
});

task('spec', [ 'jshint:spec' ], config.js, function(files) {
  return gulp.src(files.spec)
    .pipe(jasmine({ /* verbose: true, */ includeStackTrace: true }))
  ;
});

gulp.task('clean', function(cb) {
  return del([ '${config.dir.build}**/*', '!${config.dir.build}' ], { force: true }, cb);
});

gulp.task('dist', [ 'clean', 'sass', 'spec', 'javascript' ]);

gulp.task('watch', [ 'dist' ], function() {
  var flatten = function(result, elem) {
    return result.concat(elem[this]);
  };

  gulp.watch(config.css.reduce(flatten.bind('src'), []), [ 'sass' ]);
  gulp.watch(config.js.reduce(flatten.bind('src'), []), [ 'javascript', 'spec' ]);
  gulp.watch(config.js.reduce(flatten.bind('spec'), []), [ 'spec' ]);

  connect.server({
    root: [ 'examples', 'dist' ],
    port: 8889,
    livereload: true
  });
});

gulp.task('default', [ 'dist' ]);

