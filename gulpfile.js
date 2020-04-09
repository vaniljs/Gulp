var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    browserSync = require('browser-sync'),
    rename = require('gulp-rename'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    htmlmin = require('gulp-htmlmin');
    image = require('gulp-image');

sass.compiler = require('node-sass');

gulp.task('clean', async function (done) {
    del.sync('dist');
    done()
});

gulp.task('html', function (done) {
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.reload({stream: true}));
    done()
});
gulp.task('lib-css', function (done) {
   return gulp.src([
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.css'
        ])
       .pipe(concat('libs.min.css'))
       .pipe(cssnano({
           discardComments: {
               removeAll: true
            }
       }))
       .pipe(gulp.dest('dist/css'))
       .pipe(browserSync.reload({stream: true}));
    done()
});
gulp.task('lib-js', function (done) {
    return gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/bootstrap/dist/js/bootstrap.js',
        'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({stream: true}));
    done()
});

gulp.task('sass', function (done) {
    return gulp.src('src/scss/style.sass')
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}));
    done()
});

gulp.task('javascript', function (done) {
    return gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({stream: true}));
    done()
});
gulp.task('image', function (done) {
    gulp.src('./src/img/**/*')
        .pipe(image())
        .pipe(gulp.dest('./dist/img/'));
    done()
});
gulp.task('imagecopy', function (done) {
    gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./dist/img/'));
    done()
});
gulp.task('fonts', function (done) {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'))
        .pipe(browserSync.reload({stream: true}));
    done()
});
gulp.task('htmlminify', function (done) {
    return gulp.src('./src/**/*.html', {dot: true, ignore: './src/func/**/*'})
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.reload({stream: true}));
    done()
});
gulp.task('sassminify', function () {
    return gulp.src('src/scss/**/*.sass')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('javascriptminify', function (done) {
    return gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        //.pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({stream: true}));
    done()
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "dist/"
        }
    });
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.html', gulp.parallel('html'));
    gulp.watch('src/scss/style.sass', gulp.parallel('sass'));
    gulp.watch('src/js/*.js', gulp.parallel('javascript'))
});

gulp.task('build', gulp.series('clean', 'htmlminify', 'lib-css', 'lib-js', 'sassminify', 'javascriptminify', 'image', 'fonts'));
gulp.task('default', gulp.parallel('html', 'lib-css', 'lib-js', 'sass', 'javascript', 'imagecopy', 'fonts', 'browser-sync', 'watch'));
