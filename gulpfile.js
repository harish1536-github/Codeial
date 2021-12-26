const gulp=require('gulp');
//convert sass to css
const sass=require('gulp-sass');
//compresses css to one line css
const cssnano=require('gulp-cssnano');

//rename the files with hash attach to it
const rev=require('gulp-rev');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const del = require('del');

// gulp.task('css',function(){
//     console.log('minifying css');
//     // /sass/** all files under sass
//     gulp.src('/assets/sass/**/*.scss')
//     .pipe(sass())
//     .pipe(cssnano())
//     .pipe(gulp.dest('./assests.css'));

//     return gulp.src('./assets/**/*.css')
//     .pipe(rev())
//     .pipe(gulp.dest('./public/assets'))
//     //manifest store map of  x.css file has been name to x-1y45.css
//     // so manifest store the moa of this 
//     .pipe(rev.manifest({
//         //current working directiory
//         cwd: 'public',
//         //if a name already exits then it will merge with 
//         //orignally existing file
//         merge: true
//     }))
//     //put all of this in putblic/assets
//     .pipe(gulp.dest('./public/assets'));

// })

gulp.task('css', function(done){
    console.log('minifying css...');
    gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'));

     gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});


gulp.task('js', function(done){
    console.log('minifying js...');
     gulp.src('./assets/**/*.js')
     //uglify means minifying the js
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done()
});


gulp.task('images', function(done){
    console.log('compressing images...');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});


// empty the public/assets directory


//whenever we are building the project we have to clear the pteviou build and create it again from scratch
gulp.task('clean:assets', function(done){
    del.sync('./public/assets');
    done();
});

//created task called build and it will run all four of these "clean:assets', 'css', 'js', 'images" and after that done will be called 
gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function(done){
    console.log('Building assets');
    done();
});