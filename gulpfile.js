const gulp        = require('gulp');
const sass        = require('gulp-sass');
const babel       = require("gulp-babel");
const cleanCSS    = require('gulp-clean-css');
const uglify      = require('gulp-uglify-es').default;
const concat      = require('gulp-concat');
const browserSync = require('browser-sync').create();
const del         = require('del');

// compile sass/scss
gulp.task('compile:sass', () =>
  gulp
    .src('src/scss/index.scss')
    .pipe(sass())
    .pipe(gulp.dest('src/css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream())
);

// delete css folder
gulp.task('clean:sass', () => del(['src/css']));

// compile and minify js
gulp.task('compile:js', () =>
  gulp
    .src('src/js/*.js')
    .pipe(
      babel({
        presets: ['@babel/env'],
        plugins: ['@babel/plugin-proposal-class-properties']
      })
    )
    .pipe(concat('bundle.min.js'))
    .pipe(uglify().on('error', console.error))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream())
);

// compile all together
gulp.task(
  'serve',
  gulp.series('clean:sass', 'compile:sass', 'compile:js', () => {
    browserSync.init({ server: '.', port: 3030 });
    
    gulp.watch('src/index.html').on('change', browserSync.reload);
    gulp.watch('src/scss/*.scss', gulp.parallel('compile:sass'));
    gulp.watch('src/*.js').on('change', browserSync.reload);
  })
)