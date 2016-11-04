const gulp = require("gulp");
const tslint = require("gulp-tslint");
const clean = require("gulp-clean");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const gulpFilter = require('gulp-filter');
const filter = gulpFilter(['**/*.ts', '!**/*d.ts']);

gulp.task("lint", function() {
    return gulp.src("src/**/*.ts")
        .pipe(filter)
        .pipe(tslint({}))
        .pipe(tslint.report({
            summarizeFailureOutput: true
        }))
        //.pipe(filter.restore()) // clear filter
       ;
});
gulp.task('clean', function() {
    return gulp.src('build/*', {
            read: false
        })
        .pipe(clean());
});

gulp.task('js-helpers',['clean'], function() {
    return gulp.src('src/helpers/*.js')
        .pipe(gulp.dest("build/helpers"));
});
gulp.task('build',['clean', 'js-helpers'], function() {
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest("build"));
});
