var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var js_folder = 'js/Development/';

gulp.task('build-js', function (){
	var js_files = [
		js_folder+'jquery.min.js',
		js_folder+'bootstrap.min.js',
		js_folder+'job_data.js',
		js_folder+'resource_data.js',
		js_folder+'upgrade_data.js',
		js_folder+'common.js',
		js_folder+'map_block.js',
		js_folder+'*.js'
	];
	
	gulp.src(js_files)
	//.pipe(uglify())
	.pipe(concat('app.js'))
	.pipe(gulp.dest('js/'));
});

gulp.task('watch-js', function (){
	gulp.watch(js_folder+'*.js', ['build-js']);
});