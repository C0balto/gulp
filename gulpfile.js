const { series, parallel, src, dest } = require('gulp');
var sass = require('gulp-sass');
var uglyfly = require('gulp-uglyfly');
let cleanCSS = require('gulp-clean-css');
var ts = require("gulp-typescript");
const zip = require('gulp-zip');
var publish = require('gulp-publish');
sass.compiler = require('node-sass');
var clean = require('gulp-clean');

function daolimpa(cb) {
    src('./saida/*.*', {read: false})
    .pipe(clean());
  cb();
}
 
function cssTranspile(cb) {
    src('./*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./saida'));
    cb();
}


function cssMinify(cb) {
     src('./saida/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(dest('./saida/feio'));
    cb();
}

function jsTranspile(cb) {
    src('./*.ts')
    .pipe(ts({
        noImplicitAny: true,
        outFile: 'output.js'
        }))
   .pipe(dest('./saida'));
    cb();
}


function jsBundle(cb) {
    src('./saida/*.css' , './saida/*.js ')
    .pipe(zip('./tudojunto.zip'))
    .pipe(dest('./zipado'))
  cb();
}

function jsMinify(cb) {
    src('./saida/*.js')
    .pipe(uglyfly())
    .pipe(dest('./saida/feio'))
    cb();
}

function publicar(cb) {
    src('./zipado/*.zip').
    pipe(publish(cb))
    .pipe(dest('./publica'))
  cb();
}

exports.build = series(
  daolimpa,
  parallel(
    cssTranspile,
    series(jsTranspile, jsBundle)
  ),
  parallel(cssMinify, jsMinify),
  publicar
);

exports.compila = daolimpa;