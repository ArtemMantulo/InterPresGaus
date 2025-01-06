const gulp = require('gulp');
const replace = require('gulp-replace');
const path = require("path");

const version = Date.now();

gulp.task('add-version-to-links', function () {
  return gulp.src(path.resolve(__dirname, './**/*.html'))
    .pipe(replace(/(href="[^"]+)/g, function(match) {
      if (match.includes('?')) {
        return match + '&v=' + version;
      } else {
        return match + '?v=' + version;
      }
    }))
    .pipe(replace(/(src="[^"]+)/g, function(match) {
      if (match.includes('?')) {
        return match + '&v=' + version;
      } else {
        return match + '?v=' + version;
      }
    }))
    .pipe(gulp.dest(function (file) {
        return file.base;
    }));
});

gulp.task('default', gulp.series('add-version-to-links'));
