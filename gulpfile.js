/**
 * Created by Ольга on 28.02.2017.
 */
'use strict';

const gulp = require('gulp');
const watch = require('gulp-watch');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const rigger = require('gulp-rigger');
const cssmin = require('gulp-minify-css');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const rimraf = require('rimraf');
const compass = require('gulp-compass');
const browserSync = require("browser-sync");
const reload = browserSync.reload;
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
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

const config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 3000,
    logPrefix: "olga_yuzich"
};

// BrowserSync Reload
function webserver() {
    browserSync(config);
}

//gulp.task('webserver', function () {
//    browserSync(config);
//});

// Clean
function webserver() {
    rimraf(path.clean, cb);
}
//gulp.task('clean', function (cb) {
//    rimraf(path.clean, cb);
//});

function htmlBuild() {
    return gulp
                .src(path.src.html)
                .pipe(rigger())
                .pipe(gulp.dest(path.build.html))
                .pipe(reload({stream: true}));
}

// gulp.task('html:build', function () {
//     gulp.src(path.src.html)
//         .pipe(rigger())
//         .pipe(gulp.dest(path.build.html))
//         .pipe(reload({stream: true}));
// });

function jsBuild() {
    return gulp
        .src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
}
// gulp.task('js:build', function () {
//     gulp.src(path.src.js)
//         .pipe(rigger())
//         .pipe(sourcemaps.init())
//         .pipe(uglify())
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest(path.build.js))
//         .pipe(reload({stream: true}));
// });

function styleBuild() {
    return gulp
                .src(path.src.style)
                //.pipe(sourcemaps.init())
                .pipe(compass({
                    config_file: 'config.rb',
                    css: 'build/styles/',
                    sass: 'src/styles/',
                    image: 'src/images/'
                }))
                .pipe(cssmin())
                //.pipe(sourcemaps.write())
                .pipe(gulp.dest(path.build.css))
                .pipe(reload({stream: true}));
}

// gulp.task('style:build', function() {
//     gulp.src(path.src.style)
//         //.pipe(sourcemaps.init())
//         .pipe(compass({
//             config_file: 'config.rb',
//             css: 'build/styles/',
//             sass: 'src/styles/',
//             image: 'src/images/'
//         }))
//         .pipe(cssmin())
//         //.pipe(sourcemaps.write())
//         .pipe(gulp.dest(path.build.css))
//         .pipe(reload({stream: true}));
// });

function imageBuild () {
    return gulp
                .src(path.src.img)
                .pipe(imagemin({
                    progressive: true,
                    svgoPlugins: [{removeViewBox: false}],
                    use: [pngquant()],
                    interlaced: true
                }))
                .pipe(gulp.dest(path.build.img))
                .pipe(reload({stream: true}));

}
// gulp.task('image:build', function () {
//     gulp.src(path.src.img)
//         .pipe(imagemin({
//             progressive: true,
//             svgoPlugins: [{removeViewBox: false}],
//             use: [pngquant()],
//             interlaced: true
//         }))
//         .pipe(gulp.dest(path.build.img))
//         .pipe(reload({stream: true}));
// });

function fontBuild() {
    return gulp
        .src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
}
// gulp.task('fonts:build', function() {
//     gulp.src(path.src.fonts)
//         .pipe(gulp.dest(path.build.fonts))
// });

// gulp.task('svgSprite:build', function () {
//     return gulp.src(path.src.svg)
//     // minify svg
//         .pipe(svgmin({
//             js2svg: {
//                 pretty: true
//             }
//         }))
//         // remove all fill, style and stroke declarations in out shapes
//         .pipe(cheerio({
//             run: function ($) {
//                 $('[fill]').removeAttr('fill');
//                 $('[stroke]').removeAttr('stroke');
//                 $('[style]').removeAttr('style');
//             },
//             parserOptions: {xmlMode: true}
//         }))
//         // cheerio plugin create unnecessary string '&gt;', so replace it.
//         .pipe(replace('&gt;', '>'))
//         // build svg sprite
//         .pipe(svgSprite({
//             mode: {
//                 symbol: {
//                     sprite: '../sprite.svg',
//                     render: {
//                         scss: {
//                             dest:'../../../../src/styles/_sprite.scss',
//                             template: 'src/styles/templates/_sprite_template.scss'
//                         }
//                     }
//                 }
//             }
//         }))
//         .pipe(gulp.dest('build/images/'));
// });

function svgSpriteBuild (){
    {
        return gulp
            .src(path.src.svg)
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
            .pipe(gulp.dest('build/images/'));
    }
}

// gulp.task('pngSprite:build', function() {
//     var spriteData =
//         gulp.src(path.src.png) // путь, откуда берем картинки для спрайта
//             .pipe(pngSprite({
//                 imgName: '../images/sprite.png',
//                 cssName: '_spritePng.scss'
//             }));
//
//     spriteData.img.pipe(gulp.dest('src/images/')); // путь, куда сохраняем картинку
//     spriteData.css.pipe(gulp.dest('src/styles/')); // путь, куда сохраняем стили
// });

function pngSpriteBuild() {
    var spriteData =
        gulp.src(path.src.png) // путь, откуда берем картинки для спрайта
            .pipe(pngSprite({
                imgName: '../images/sprite.png',
                cssName: '_spritePng.scss'
            }));

    spriteData.img.pipe(gulp.dest('src/images/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('src/styles/')); // путь, куда сохраняем стили
}

// gulp.task('svgImages:build', function () {
//     return gulp.src(path.src.svgImages)
//         // build svg sprite
//         .pipe(svgSprite({
//             mode: {
//                 symbol: {
//                     sprite: '../svg-images.svg'
//                 }
//             }
//         }))
//         .pipe(gulp.dest('build/images/'));
// });

function svgImagesBuild() {
return gulp.src(path.src.svgImages)
// build svg sprite
    .pipe(svgSprite({
        mode: {
            symbol: {
                sprite: '../svg-images.svg'
            }
        }
    }))
    .pipe(gulp.dest('build/images/'));
}
function build(){

}
gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
   'svgSprite:build',
    'pngSprite:build',
    'svgImages:build'
]);

function watchFiles() {
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    })
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('svgSprite:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('svgImages:build');
    });
}


gulp.task('default', [build, webserver, watchFiles]);
