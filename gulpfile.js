let gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    browserSync = require('browser-sync'),
    rename = require('gulp-rename'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel');

sass.compiler = require('node-sass');

gulp.task('clean', async function () {
    del.sync('dist')
});

gulp.task('sass', function () {
    //return gulp.src('src/scss/**/*.scss')
    return gulp.src('src/scss/**/*.sass')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('script', function () {
    return gulp.src('src/js/*.js')
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "src/"
        }
    });
});

gulp.task('export', function () {
    let buildHtml = gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'));

    let BuildJs = gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', function () {
    gulp.watch('src/scss/**/*.sass', gulp.parallel('sass'));
    gulp.watch('src/*.html', gulp.parallel('html'));
    gulp.watch('src/js/*.js', gulp.parallel('script'))
});

gulp.task('build', gulp.series('clean', 'sass', 'export'));
gulp.task('default', gulp.parallel('sass', 'browser-sync', 'watch'));