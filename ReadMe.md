## Task automation with gulp
To start, install the following
```
$ npm install --save-dev gulp gulp-sass gulp-babel gulp-concat gulp-clean-css browser-sync del

```

### The following is needed to make js work in IE11

```
$ npm install @babel/polyfill @babel/plugin-proposal-class-properties @babel/preset-env @babel-standalone @babel/core whatwg-fetch --save-dev

```
## Make gulpfile.js and place the following, modified depending on your folder architecture
Make gulpfile.js in your directory and require the following:
```
const gulp        = require('gulp');
const sass        = require('gulp-sass');
const babel       = require("gulp-babel");
const browserSync = require('browser-sync').create();
const del         = require('del');
```
### To compile scss files:
```
gulp.task('compile:sass', () =>
  gulp
    .src('src/scss/index.scss')
    .pipe(sass())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream())
);
```
### To delete css folder:
```
gulp.task('clean:sass', () => del(['src/css']));

```
### To compile and minify js files:
```
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
```

### To make one task for all:
 ```
 gulp.task(
  'serve',
  gulp.series('clean:sass', 'compile:sass', 'compile:js', () => {
    browserSync.init({ server: '.', port: 3030 });
    
    gulp.watch('src/index.html').on('change', browserSync.reload);
    gulp.watch('src/scss/*.scss', gulp.parallel('compile:sass'));
    gulp.watch('src/*.js').on('change', browserSync.reload);
  })
)
```
## To start one one command, place the following in your package.json file
```
  "scripts": {
    "start": "gulp serve"
  },
```

### To start
```
npm start

```