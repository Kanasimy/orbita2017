/**
 * Created by Ольга on 28.02.2017.
 */
'use strict';

const gulp = require('gulp');
const plumber = require("gulp-plumber");
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const rigger = require('gulp-rigger');
const cssmin = require('gulp-clean-css');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');
const pngquant = require('imagemin-pngquant');
const compass = require('gulp-compass');
const browserSync = require("browser-sync");
const svgSprite = require('gulp-svg-sprite');
const pngSprite = require('gulp.spritesmith');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const remove = require('gulp-clean');

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/local/images/',
        svg: 'build/local/images/svg/sprite.svg',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',
        style: 'src/styles/*.scss',
        img: 'src/local/images/**/*.*',
        imgToWebp: 'src/local/images/**/*.{png,jpg,jpeg}',
        svg: 'src/svg-icon/**/*.svg',
        svgImages: 'src/svg-images/**/*.svg',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/styles/**/*.scss',
        img: 'src/images/**/*.*',
        svg: 'src/svg-icon/**/*.svg',
        svgImages: 'src/svg-images/**/*.svg',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

const config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 3000,
    logPrefix: "olga_yuzich"
};

gulp.task('html:build', function () {
    return gulp.src(path.src.html)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream());
});

gulp.task('js:build', function () {
    return gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
});

gulp.task('style:build', function() {
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(compass({
            config_file: 'config.rb',
            css: 'build/styles/',
            sass: 'src/styles/',
            image: 'src/images/'
        }))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream());
});

gulp.task('image:webp', function () {
    return gulp.src(path.src.img)
        .pipe(webp({
            quality: 80
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream());
});

gulp.task('image:optimize', function () {
    return gulp.src(path.src.img)
        .pipe(plumber())
        .pipe(imagemin([
            imageminJpegRecompress({
                progressive: true,
                max: 85,
                min: 75
            }),
            imageminPngquant({quality: '80'})
        ]))
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream());
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

// Clean
gulp.task('remove', function() {
    return gulp.src(path.clean)
        .pipe(remove());
});

gulp.task('svgSprite:build', function () {
    return gulp.src(path.src.svg)
    // minify svg
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill, style and stroke declarations in out shapes
        .pipe(cheerio({
            run: function ($) {
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"  //sprite file name
                }
            },
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream());
});

gulp.task('svgImages:build', function () {
    return gulp.src(path.src.svgImages)
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: '../svg-images.svg'
                }
            }
        }))
        .pipe(gulp.dest('build/images/'))
        .pipe(browserSync.stream());
});


gulp.task('image:sprites', gulp.parallel(
  'svgSprite:build'
));

gulp.task('image:build', gulp.series(
  'remove',
  'image:sprites',
  'image:webp',
  'image:optimize',
  'svgImages:build'
));

gulp.task('build', gulp.parallel(
    'html:build',
    'js:build',
    'style:build',
    'fonts:build'
));

gulp.task('watchFiles', function () {
    browserSync.init(config);
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.style, gulp.series('style:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.svg, gulp.series('svgSprite:build'));
    gulp.watch(path.watch.svgImages, gulp.series('svgImages:build'));
});

gulp.task('default', gulp.series('build', 'watchFiles'));
