import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import rename from 'gulp-rename';

gulp.task('watch', function() {
    gulp.watch('./public/css/*.scss', ['sass']);
    gulp.watch('./public/**/*.js', ['js:client'])
});

gulp.task('develop', ['js:client'], function () {
    // browserSync.init({
    //     server: {
    //         baseDir: './'
    //     }
    // });

    nodemon({
        script: 'bin/www',
        ext: 'js es6',
        ignore: ['public/**/*.js'],
        tasks: ['js:client']
    }).on('restart', function () {
        // setTimeout(browserSync.reload, 500);
    });

    // gulp.watch(['./public/**/*.es6', ], ['js:client'])
    return;
});

gulp.task('js:client', function () {
    // let bundleVote = browserify({
    //     debug: true
    // });
    //
    // bundleVote.transform(babelify);
    // bundleVote.add('./public/components/vs-vote/vs-vote.es6');
    //
    // bundleVote.bundle()
    //     .on('error', console.log)
    //     .pipe(source('vs-vote.es6'))
    //     .pipe(rename({extname : '.js'}))
    //     .pipe(gulp.dest('./public/components/vs-vote/'));

    let bundleWeather = browserify({
        debug: true
    });

    bundleWeather.transform(babelify);
    bundleWeather.add('./public/components/weather-now/weather-now.es6');

    bundleWeather.bundle()
        .on('error', console.log)
        .pipe(source('weather-now.es6'))
        .pipe(rename('weather-now.js'))
        .pipe(gulp.dest('./public/components/weather-now/'));


    let bundleWeatherSansImports = browserify({
        debug: true
    });

    bundleWeatherSansImports.transform(babelify);
    bundleWeatherSansImports.add('./public/components/weather-now/weather-now-sans-imports.es6');

    bundleWeatherSansImports.bundle()
        .on('error', console.log)
        .pipe(source('weather-now-sans-imports.es6'))
        .pipe(rename('weather-now-sans-imports.js'))
        .pipe(gulp.dest('./public/components/weather-now/'));


    let bundleWeatherSansImportsShadowDOM = browserify({
        debug: true
    });

    bundleWeatherSansImportsShadowDOM.transform(babelify);
    bundleWeatherSansImportsShadowDOM.add('./public/components/weather-now/weather-now-sans-imports-shadowDOM.es6');

    bundleWeatherSansImportsShadowDOM.bundle()
        .on('error', console.log)
        .pipe(source('weather-now-sans-imports-shadowDOM.es6'))
        .pipe(rename('weather-now-sans-imports-shadowDOM.js'))
        .pipe(gulp.dest('./public/components/weather-now/'));


    let bundleWeatherSansImportsShadowDOMTemplates = browserify({
        debug: true
    });

    bundleWeatherSansImportsShadowDOMTemplates.transform(babelify);
    bundleWeatherSansImportsShadowDOMTemplates.add('./public/components/weather-now/weather-now-sans-imports-shadowDOM-templates.es6');

    bundleWeatherSansImportsShadowDOMTemplates.bundle()
        .on('error', console.log)
        .pipe(source('weather-now-sans-imports-shadowDOM-templates.es6'))
        .pipe(rename('weather-now-sans-imports-shadowDOM-templates.js'))
        .pipe(gulp.dest('./public/components/weather-now/'));

});

gulp.task('default', [
    'sass',
    'develop',
    'watch'
]);
