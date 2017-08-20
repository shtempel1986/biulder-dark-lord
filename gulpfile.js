let gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  rename = require('gulp-rename'),
  del = require('del'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  cache = require('gulp-cache'),
  babel = require('gulp-babel'),
  autoprefixer = require('gulp-autoprefixer'),
  imageminJpegRecompress = require('imagemin-jpeg-recompress');

//==========================================================
//= sass
//==========================================================

gulp.task('sass', function () {
  return gulp.src('src/sass/**/*.sass')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 version', '>1%', 'ie 8', 'ie 7'], {cascade: true}))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({stream: true}))
});

//==========================================================
//=            browser-sync
//==========================================================

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: 'src'
    },
    tunnel: true,
    open:false,
    notify: false
  });
});

//===========================================================
//=   BABEL
//===========================================================

gulp.task("babel", function () {
  return gulp.src("src/js/scripts.ES6.js")
    .pipe(babel())
    .pipe(rename("scripts.js"))
    .pipe(gulp.dest("src/js"))
    .pipe(browserSync.reload({stream: true}));
});

//===========================================================
//=  СЛЕЖЕНИЕ ЗА ИЗМЕНЕНИЕМ ФАЙЛОВ
//===========================================================

gulp.task('watch', ['browser-sync', 'babel'], function () {
  gulp.watch('src/sass/**/*.sass', ['sass',browserSync.reload]);
  gulp.watch('src/js/**/*.js', ['babel',browserSync.reload]);
  gulp.watch('src/*.html', ['',browserSync.reload]);
});

gulp.task('clean', function () {
  return del.sync('dist');
});

//===========================================================
//=  IMAGES
//===========================================================

gulp.task('img', function () {
  return gulp.src('src/img/**/*')
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imageminJpegRecompress({
        loops: 5,
        min: 65,
        max: 70,
        quality:'medium'
      }),
      imagemin.svgo(),
      imagemin.optipng({optimizationLevel: 3}),
      pngquant({quality: '65-70', speed: 5})
    ],{
      verbose: true
    })))
    .pipe(gulp.dest('dist/img'));
});

//===========================================================
//=  BUILD
//===========================================================

gulp.task('build', ['clean', 'img', 'sass', 'babel'], function () {
  let buildCss = gulp.src([
    'src/css/main.min.css',
    'src/css/libs.min.css'
  ]).pipe(gulp.dest('dist/css'));
  let buildFonts = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
  let buildHtml = gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('clear', function () {
  return cache.clearAll();
});

gulp.task('default', ['watch']);