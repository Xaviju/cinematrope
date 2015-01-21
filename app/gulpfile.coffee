gulp = require('gulp')

# Utilities
plumber = require("gulp-plumber")
size = require("gulp-filesize")
watch = require("gulp-watch")
cache = require("gulp-cached")
concat = require("gulp-concat")
autoprefixer = require('gulp-autoprefixer')

# HTML
jade = require("gulp-jade")
htmlhint = require("gulp-htmlhint")
# CSS
sass = require('gulp-sass')
#sass = require("gulp-ruby-sass")
# Linter
csslint = require("gulp-csslint")
scsslint = require("gulp-scss-lint")
#coffee
coffee = require('gulp-coffee')
coffeelint = require('gulp-coffeelint')
# Optimization
imagemin = require('gulp-imagemin')
pngquant = require('imagemin-pngquant')
# Connect
webserver = require('gulp-webserver')

##############################################################################
# Ordered list of paths
##############################################################################
paths = {}
paths.app = "app"
paths.dist = "dist"
#################
paths.jade = "app/**/*.jade"
paths.html = "dist/views/**/*.html"
#################
paths.scss = "app/**/*.scss"
paths.scssMain = "app/styles/main.scss"
paths.vendor = "bower_components/**/*.scss"
paths.cssDistFold = "dist/styles/"
paths.cssMainDist = "dist/styles/main.css"
#################
paths.scripts = [
    "app/scripts/main.js"
]
#################
paths.imageMain = "app/images/*"
paths.imageDist = "dist/images/"
##################
paths.svgMain = "app/svg/*"
paths.svgDist = "dist/svg/"
##################
paths.fontsMain = "app/fonts/*"
paths.fontsDist = "dist/fonts/"

##############################################################################
# HTML Related tasks
##############################################################################

gulp.task "jade", ->
    gulp.src(paths.jade)
        .pipe(plumber())
        .pipe(jade({pretty: true}))
        .pipe(size())
        .pipe(gulp.dest(paths.dist))

gulp.task "htmlhint", ->
    gulp.src(paths.html)
        .pipe(htmlhint())

##############################################################################
# CSS Related tasks
##############################################################################

gulp.task "scsslint", ->
    gulp.src([paths.scss])
        .pipe(cache("scsslint"))
        .pipe(scsslint(
            {'config': 'scsslint.yml'}
        ))

gulp.task "sass", ->
    gulp.src([paths.scssMain])
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true
        }))
        .pipe(size())
        .pipe(gulp.dest(paths.cssDistFold))

gulp.task "csslint", ->
    gulp.src(paths.cssMainDist)
        .pipe(plumber())
        .pipe(csslint("csslintrc.json"))

##############################################################################
# Script related tasks
##############################################################################

gulp.task "scripts", ->
    gulp.src(paths.scripts)
        .pipe(plumber())
        .pipe(concat("scripts.js"))
        .pipe(gulp.dest(paths.dist + "/scripts"))


##############################################################################
# Image related tasks
##############################################################################


gulp.task 'imagemin', ->
    return gulp.src(paths.imageMain)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(paths.imageDist));

##############################################################################
# Common related tasks
##############################################################################

#Copy Fonts
gulp.task "copy",  ->
    gulp.src(paths.fontsMain)
        .pipe(gulp.dest(paths.fontsDist))
    gulp.src(paths.svgMain)
        .pipe(gulp.dest(paths.svgDist))

##############################################################################
# Server Related tasks
##############################################################################

# Rerun the task when a file changes
gulp.task "watch", ->
    gulp.watch(paths.jade, ["jade", "htmlhint"])
    gulp.watch(paths.scss, ["scsslint", "sass", "csslint"])
    gulp.watch(paths.scripts, ["scripts"])

gulp.task 'webserver', ->
    gulp.src(paths.dist)
        .pipe(webserver({
            livereload: true,
            port: 8080,
            host: "localhost"
        }))

##############################################################################
# manage Tasks
##############################################################################

gulp.task "default", [
    "jade",
    "htmlhint"
    "scsslint",
    "sass",
    "csslint",
    "scripts",
    "imagemin",
    "copy",
    "webserver",
    "watch"
]
