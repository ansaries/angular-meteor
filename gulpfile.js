var gulp = require("gulp");
var webpack = require("gulp-webpack");
var clean = require("gulp-clean");
var runSequence = require("run-sequence");
var gulpTypings = require("gulp-typings");
var exec = require('child_process').exec;
var git = require("gulp-git");
var fs = require("fs");
 
// Install typings.
gulp.task("typings",function(){
  return ! fs.existsSync("./typings") ?
    gulp.src("./typings.json")
      .pipe(gulpTypings()) : null;
});

// Build TypeScript.
gulp.task("tsbuild", function(callback) {
  exec("tsc", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
});

gulp.task("lint", function() {
  var tslint = require("gulp-tslint");
  return gulp.src(["modules/*.ts"])
      .pipe(tslint({
        tslint: require("tslint").default,
        configuration: require("./tslint.json")
      }))
      .pipe(tslint.report("prose", {emitError: true}));
});

gulp.task("git-add", function(){
  return gulp.src("build/*")
    .pipe(git.add());
});

gulp.task("build", function(callback) {
  runSequence("typings", "lint", "tsbuild", "git-add", callback);
});
