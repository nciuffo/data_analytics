var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch('source/scss/**/*.scss', ['sass']);
  gulp.watch('source/*.html', browserSync.reload);
  gulp.watch('source/js/**/*.js', browserSync.reload);
  // Other watchers
})
gulp.task('sass', function(){
  return gulp.src('source/scss/**/*.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('source/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'source'
    },
  })
})
gulp.task('useref', function(){
  return gulp.src('source/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});
gulp.task('useref', function(){
  return gulp.src('source/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
});
gulp.task('images', function(){
  return gulp.src('source/images/**/*.+(png|jpg|gif|svg)')
  .pipe(imagemin({
    // Interlaced GIF
    interlaced: true
  }))
  .pipe(gulp.dest('dist/images'))
});
gulp.task('fonts', function() {
  return gulp.src('source/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})
gulp.task('clean:dist', function() {
  return del.sync('dist');
})
gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})
gulp.task('build', function(callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'fonts'],
    callback
  )
});
