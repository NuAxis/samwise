var gulp = require('gulp');
var gutil = require('gulp-util');
var jasmine = require('gulp-jasmine');
var eslint = require('gulp-eslint');
var istanbul = require('gulp-istanbul');

gulp.task('lint', () => {
  return gulp.src(['lib/**/*.js', 'spec/**/*.js'])
    .pipe(eslint({
      baseConfig: '.eslintrc.json',
      ignore: false,
      useEslintrc: false
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('pre-test', function () {
  return gulp.src(['lib/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
  return gulp.src(['spec/**/*.js'])
    .pipe(jasmine())
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});


gulp.task('watch', function() {
  gulp.watch(['./spec/*.js'], ['jasmine']);
});

gulp.task('default', ['lint', 'test']);
