const { src, dest, watch, series } = require('gulp')
const sass = require('gulp-sass')(require('sass'))

const buildDir = './dist'
const srcDir = './sass'
const packageDir = './package'

function buildBundle(cb, outputStyle = 'compressed') {
	src(`./sass/index.scss`)
		.pipe(
			sass({
				outputStyle
			}).on('error', sass.logError)
		)
		.pipe(dest(buildDir))

	src('./sass/fonts/**/**')
		.pipe(dest(buildDir + '/fonts'))
	cb()
}

function dev(cb) {
	watch('sass/**/*.scss', { queue: true }, (cb) => buildBundle(cb, 'expanded'))
	cb()
}

function package(cb) {
	src(buildDir + '/**/*.css').pipe(dest(packageDir + '/dist'))
	src(srcDir + '/**/**.scss').pipe(dest(packageDir + '/sass'))

	src(['README.md', 'package.json']).pipe(dest(packageDir))
	cb()
}

exports.default = buildBundle

exports.dev = dev

exports.package = series(buildBundle, package)
