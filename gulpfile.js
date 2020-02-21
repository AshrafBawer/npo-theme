
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');

gulp.task('nodemon', (done) => {
  const stream = nodemon({
    script: 'app.js',
    ext: 'js',
    done,
  });

  stream
    .on('restart', () => {
      console.log('restarted!');
    })
    .on('crash', () => {
      console.error('Application has crashed!\n');
      stream.emit('restart', 10); // restart the server in 10 seconds
    });
});

sass.compiler = require('node-sass');

gulp.task('sass', () => gulp.src('./public/sass/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('styles.css'))
  .pipe(autoprefixer({
    cascade: false,
  }))
  .pipe(cleanCSS({ compatibility: 'ie8' }))
  .pipe(gulp.dest('./public/css')));

gulp.task('scripts', () => gulp.src('./public/js/js_files/*.js')
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('./public/js')));

gulp.task('watch', () => {
  gulp.watch('./public/sass/*.scss', gulp.series('sass'));
  gulp.watch('./public/js/js_files/*.js', gulp.series('scripts'));
});

gulp.task('minimize_images', () => gulp.src('./public/original_images/*')
  .pipe(imagemin({
    interlaced: true,
    progressive: true,
    optimizationLevel: 5,
  }))
  .pipe(gulp.dest('./public/mini_images')));

gulp.task('default', gulp.parallel('watch', 'nodemon'));
