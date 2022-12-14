const { src, dest, watch, series } = require('gulp')
const sass = require('gulp-sass')(require('sass'))

const buildDir = './dist'
const srcDir = './sass'
const packageDir = './package'
const isDev = process.env.NODE_ENV === 'development'

function buildBundle(cb) {
	src(`./sass/index.scss`)
		.pipe(
			sass({
				outputStyle: isDev ? 'expanded' : 'compressed'
			}).on('error', sass.logError)
		)
		.pipe(dest(buildDir))
	cb()
}

function copyFonts(cb, dir = buildDir) {
	src('./sass/fonts/**/**')
		.pipe(dest(dir + '/fonts'))
	cb()
}

function devWatch(cb) {
	watch('sass/**/*.scss', { queue: true }, (cb) => buildBundle(cb, 'expanded'))
	cb()
}

function package(cb) {
	src(buildDir + '/**/*.css').pipe(dest(packageDir + '/dist'))
	src(srcDir + '/**/*.scss').pipe(dest(packageDir + '/sass'))

	src(['README.md', 'package.json']).pipe(dest(packageDir))
	cb()
}

function buildLibrary(cb) {
	src('./sass/**/*.scss')
		.pipe(
			sass({
				outputStyle: isDev ? 'expanded' : 'compressed'
			}).on('error', sass.logError)
		)
		.pipe(dest(buildDir))
	cb()
}

exports.default = series(buildLibrary)

exports.dev = series(copyFonts, devWatch)

exports.buildDev = series(buildBundle)

exports.package = series(buildLibrary, package)
