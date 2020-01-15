/**
 * Created by Ольга on 28.02.2017.
 */
'use strict';

const gulp = require('gulp');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const rigger = require('gulp-rigger');
const cssmin = require('gulp-clean-css'); // update to gulp-clean-css
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const rimraf = require('rimraf');
const compass = require('gulp-compass');
const browserSync = require("browser-sync");
const svgSprite = require('gulp-svg-sprite');
const pngSprite = require('gulp.spritesmith');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/images/, build/local/images/',
        svg: 'build/images/svg/sprite.svg',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',
        style: 'src/styles/*.scss',
        img: 'src/images/**/*.*, src/local/images/**/*.*',
        png: 'src/png-icon/*.*',
        svg: 'src/svg-icon/**/*.svg',
        svgImages: 'src/svg-images/**/*.svg',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/styles/**/*.scss',
        img: 'src/images/**/*.*, src/local/images/**/*.*',
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

// Clean
gulp.task('clean', function () {
    rimraf(path.clean);
});

gulp.task('html:build', function () {
    return gulp.src(path.src.html)
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

gulp.task('image:optimize', function () {
    return gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream());
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
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
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: '../sprite.svg',
                    render: {
                        scss: {
                            dest:'../../../../src/styles/_sprite.scss',
                            template: 'src/styles/templates/_sprite_template.scss'
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest('build/images/'))
        .pipe(browserSync.stream());
});


gulp.task('pngSprite:build', function() {
    var spriteData =
        gulp.src(path.src.png) // путь, откуда берем картинки для спрайта
            .pipe(pngSprite({
                imgName: '../images/sprite.png',
                cssName: '_spritePng.scss'
            }))

    spriteData.css.pipe(gulp.dest('src/styles/')); // путь, куда сохраняем стили
    return spriteData.img.pipe(gulp.dest('src/images/')); // путь, куда сохраняем картинку
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
  'svgSprite:build',
  'pngSprite:build',
));

gulp.task('image:build', gulp.series(
  'image:sprites',
  'image:optimize',
  'svgImages:build'
));

gulp.task('build', gulp.parallel(
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
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
