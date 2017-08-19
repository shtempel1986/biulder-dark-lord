let gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

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
        notify: false
    });
});

//===========================================================
//=  СЛЕЖЕНИЕ ЗА ИЗМЕНЕНИЕМ ФАЙЛОВ
//===========================================================

gulp.task('watch', ['browser-sync', 'scripts', "pug"], function () {
    gulp.watch('src/sass/**/*.sass', ["css-nano", browserSync.reload]);
    gulp.watch('src/*.pug', ["pug", browserSync.reload]);
});

gulp.task('clean', function () {
    return del.sync('dist');
});

gulp.task('img', function () {
    return gulp.src('src/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'img', 'sass', "pug"], function () {
    let buildCss = gulp.src([
        'src/css/main.min.css',
        'src/css/libs.min.css'
    ]).pipe(gulp.dest('dist/css'));
    let buildFonts = gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
    let buildHtml = gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('clear', function (callback) {
    return cache.clearAll();
});

gulp.task('default', ['watch']);