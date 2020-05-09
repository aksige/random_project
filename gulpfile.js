const { src, dest, series, watch } = require('gulp'),
	sass = require('gulp-sass'),
	csso = require('gulp-csso'),
	include = require('gulp-file-include'),
	htmlmin = require('gulp-htmlmin'),
	uglify = require('gulp-uglify'),
	babel = require('gulp-babel'),
	del = require('del'),
	concat = require('gulp-concat'),
	autoprefixer = require('gulp-autoprefixer'),
	image = require('gulp-image'),
	sync = require('browser-sync').create()

function html() {
	return src('src/**.html')
		.pipe(include({
			prefix: '@@'
		}))
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(dest('dist'))
}

function scss() {
	return src('src/scss/**.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(csso())
		.pipe(concat('style.min.css'))
		.pipe(dest('dist'))
}

function js() {
	return src('src/js/**.js')
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(concat('script.min.js'))
		.pipe(dest('dist'))
}

function picture() {
	return src('src/img/*')
		.pipe(image())
		.pipe(dest('dist/img'));
}

function clear() {
	return del('dist')
}

function serve() {
	sync.init({
		server: './dist'
	})
	watch('src/**.html', series(html)).on('change', sync.reload)
	watch('src/js/**.js', series(js)).on('change', sync.reload)
	watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
	watch('src/img/*', series(picture)).on('change', sync.reload)
}
exports.serve = series(clear, picture, js, scss, html, serve)