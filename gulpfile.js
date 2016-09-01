const gulp = require('gulp');
const gutil = require('gulp-util');
const jasmine = require('gulp-jasmine');

gulp.task('jasmine', function () {
  gulp.src('spec/samwise/*.js')
	.pipe(jasmine())
});

gulp.task('watch', function() {
  gulp.watch(['./spec/*.js'], ['jasmine']);
});

gulp.task('default', ['jasmine']);
