var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

//合并
gulp.task('jsconcat', function() {
  gulp.src(['src/cgc/js/zepto.js', 'src/cgc/js/fastclick.js', 'src/cgc/js/kerkee.js', 'src/cgc/js/unit.js']) //多个文件以数组形式传入
    .pipe(concat('dist.js'))
    .pipe(gulp.dest('build/cgc/js'))
});

//压缩
gulp.task('jsmin', function() {
  gulp.src('build/cgc/js/dist.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/cgc/js'));
})

