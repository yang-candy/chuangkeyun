var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('jstask', function() {
	gulp.src('src/cgc/js/task/*.js') //多个文件以数组形式传入
    .pipe(concat('task.js'))
    .pipe(gulp.dest('src/cgc/js'))
});


//合并
gulp.task('jsconcat', function() {
  gulp.src(['src/cgc/js/zepto.js', 'src/cgc/js/fastclick.js', 'src/cgc/js/kerkee.js', 'src/cgc/js/unit.js', 'src/cgc/js/task/*.js']) //多个文件以数组形式传入
    .pipe(concat('dist.js'))
    .pipe(gulp.dest('build/cgc/js'))
});

//压缩
gulp.task('jsmin', function() {
  gulp.src('build/cgc/js/dist.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/cgc/js'));
});

gulp.task('watch', function () {
  gulp.watch('src/cgc/js/*.js', function (event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    var exec = require('child_process').exec;    
  	var child = exec('node app.js', function(err, stdout, stderr) {
  	  if (err) throw err;
  	  	console.log("启动");    
  	});
  });
});

gulp.task('build', function () {
  gulp.src(['src/cgc/js/zepto.js', 'src/cgc/js/fastclick.js', 'src/cgc/js/kerkee.js', 'src/cgc/js/unit.js', 'src/cgc/js/task/*.js']) //多个文件以数组形式传入
    .pipe(concat('dist.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/cgc/js'));
});


//压缩
// gulp.task('watch', ['jsconcat'], function() {
//   gulp.src('build/cgc/js/dist.js')
//     .pipe(uglify())
//     .pipe(gulp.dest('build/cgc/js'));
// })

