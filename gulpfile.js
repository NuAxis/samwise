const gulp = require('gulp');
const gutil = require('gulp-util');
const jasmine = require('gulp-jasmine');
const eslint = require('gulp-eslint');

gulp.task('lint', () => {
  return gulp.src(['lib//**/*.js', 'spec/**/*.js'])
    .pipe(eslint({
      baseConfig: '.eslintrc.json',
      ignore: false,
      useEslintrc: false
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


gulp.task('jasmine', function () {
  gulp.src('spec/samwise/*.js')
	.pipe(jasmine())
});

gulp.task('watch', function() {
  gulp.watch(['./spec/*.js'], ['jasmine']);
});

gulp.task('default', ['lint', 'jasmine']);
