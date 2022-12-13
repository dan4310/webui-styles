const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))

const buildDir = './dist'
const srcDir = './sass'
const packageDir = './package'

function buildBundle(cb, outputStyle = 'compressed') {
	gulp
		.src(`./sass/index.scss`)
		.pipe(
			sass({
				outputStyle
			}).on('error', sass.logError)
		)
		.pipe(gulp.dest(buildDir))
	cb()
}

function watch(cb) {
	gulp.watch('sass/**/*.scss', { queue: true }, (cb) =>
		buildBundle(cb, 'expanded')
	)
	cb()
}

function package(cb) {
	gulp.src(buildDir + '/**/*.css').pipe(gulp.dest(packageDir + '/dist'))
	gulp.src(srcDir + '/**/**.scss').pipe(gulp.dest(packageDir + '/sass'))

	gulp.src(['README.md', 'package.json']).pipe(gulp.dest(packageDir))
	cb()
}

exports.default = buildBundle

exports.dev = watch

exports.package = gulp.series([buildBundle, package])
