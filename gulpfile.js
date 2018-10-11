/*var gulp = require('gulp');

var plugins = require('gulp-load-plugins')()({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});
//below is unnecessary bc of load plugins is universal
//const imagemin = require('gulp-imagemin');

//top level functions for gulp

//gulp.task = defines tasks
//gulp.src = files to use
//gulp.dest = destination folder to put the results of the task
//gulp.watch - watch files and folders for changes


gulp.task('default', function() {
  return console.log('gulp is running, ok');
});

//copy html files from src to dist folder
gulp.task('copyHtml', function() {
  gulp.src('src/*html').pipe(gulp.dest('public'));
});

//compress images from src img folder and put in dist img folder
gulp.task('imageMin', () =>
  gulp
    .src('src/img/*')
    .pipe($.imagemin())
    .pipe(gulp.dest('public/img'))
);
*/

// Include gulp
var gulp = require('gulp');
// Define base folders
var src = 'dist/';
var dest = 'public/';
// Include plugins
var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});
var uglify = require('gulp-uglify-es').default;

var pngquant = require('imagemin-pngquant');

// Set the browser that you want to support
var AUTOPREFIXER_BROWSERS = [
  'ie >= 8',
  'ie_mob >= 8',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 6',
  'android >= 4.4',
  'bb >= 10'
];

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return (
    gulp
      .src(src + 'js/**.js')
      .pipe(plugins.plumber())
      .pipe(plugins.sourcemaps.init())
      //.pipe(plugins.concat('main.js'))
      //.pipe(plugins.rename({ suffix: '.min' }))
      .pipe(uglify())
      //.pipe(  plugins.babel({presets: ['@babel/env']}))
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest(dest + 'js'))
  );
});

//minify html
// Gulp task to minify HTML files
gulp.task('pages', function() {
  return gulp
    .src([src + '*.html'])
    .pipe(plugins.plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(
      plugins.htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(dest));
});

// Compile CSS from Sass files
gulp.task('css', function() {
  return (
    gulp
      .src(src + 'css/*.css')
      .pipe(plugins.plumber())
      .pipe(plugins.sourcemaps.init())
      //.pipe(plugins.concat('main.scss'))
      /*.pipe(
        plugins.sass({
          outputStyle: 'nested',
          precision: 10,
          includePaths: ['.'],
          onError: console.error.bind(console, 'Sass error:')
        })
      )*/
      .pipe(plugins.autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
      .pipe(plugins.cleanCss({ compatibility: 'ie8' }))
      //.pipe(plugins.minifycss({ style: 'compressed' }))
      //.pipe(plugins.rename({ suffix: '.min' }))
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest(dest + 'css'))
  );
});

//image crunch
gulp.task('images', function() {
  return gulp
    .src(src + 'img/**/*')
    .pipe(plugins.plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(
      plugins
        .cache(
          plugins.imagemin([
            plugins.imagemin.gifsicle({ interlaced: true }),
            plugins.imagemin.jpegtran({ progressive: true }),
            pngquant({
              quality: '65-80', // When used more then 70 the image wasn't saved
              speed: 1, // The lowest speed of optimization with the highest quality
              floyd: 1 // Controls level of dithering (0 = none, 1 = full).
            }),
            { verbose: true }
          ])
        )
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(dest + 'img'))
    );
});

// Watch for changes in files
gulp.task('watch', function() {
  //watch html files
  gulp.watch(src + '*.html', ['pages']);
  // Watch .js files
  gulp.watch(src + 'js/*.js', ['scripts']);
  // Watch .scss files
  gulp.watch(src + 'scss/*.scss', ['css']);
  // Watch image files
  gulp.watch(src + 'img/**/*', ['images']);
});
// Default Task
gulp.task('default', ['pages', 'scripts', 'css', 'images', 'watch']);
