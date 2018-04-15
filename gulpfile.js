var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),               //开热点
 	SSI = require('browsersync-ssi'),
 	notify = require('gulp-notify'),                              //提示语
	plumber = require('gulp-plumber'),                			  //自动处理全部错误信息防止因为错误而导致 watch 不正常工作
	clean = require('gulp-clean'),                                //清空文件夹
	less = require('gulp-less'),                                  //编译less文件
	autoprefixer = require('gulp-autoprefixer'),                 //自动补全css3前缀
	cssmin = require('gulp-minify-css'),                          //压缩css文件插件
	spritesmith = require('gulp.spritesmith-multi'),			  //合并雪碧图
	imagemin = require('gulp-imagemin'),                          //压缩图片
	pngquant = require('imagemin-pngquant'),                      //深度压缩 
	changed = require('gulp-changed'),                  		  //只操作有过修改的文件 
	merge = require('merge-stream'),      
	jshint = require('gulp-jshint'),                  			  //js校验
	uglify = require('gulp-uglify'),                  			  //压缩js文件插件
	rev = require('gulp-rev-append');                			  //给页面引用url添加版本号，以清除页面缓存

//网页自动刷新
gulp.task('webserver', function() {
	browserSync.init({
		server: {
			baseDir:['src/'],
			middleware:SSI({
				baseDir:'src/',
				ext:'.shtml',
				version:'2.10.0'
			}),
			directory: true
		}
	});
	gulp.watch('src/less/**/*.less', ['less']);
	gulp.watch('src/slice/**/*.{jpg,png}', ['sprite']);
	gulp.watch(['src/**/*.html','src/css/**/*.css','src/js/**/*.js','src/images/**/*.{png,jpg,gif,ico}']).on("change",browserSync.reload);
});

//清空目标文件夹
gulp.task('clean', function(){
	return gulp.src('dest/',{read: false})
			   .pipe(clean());
});

//编译less文件
gulp.task('less', function(){
	return gulp.src('src/less/*.less')
			   .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
			   .pipe(changed('src/css/',{extension: '.css'}))    //只编译修改过的文件
			   .pipe(less())
			   .pipe(autoprefixer({
			   		browsers: ['last 2 version'],
					cascade: true,       //是否美化属性值
					remove: true         //是否去掉不必要的前缀
			   }))
			   .pipe(gulp.dest('src/css/'))
			   .pipe(notify({message: 'less task complete'}))   //提醒任务完成
			   .pipe(browserSync.stream());
});

//压缩css文件
gulp.task('cssmin', function(){
	return gulp.src(['src/css/**/*.css','!src/css/**/*.min.css','!src/css/sprites/*.css'])
			   .pipe(plumber())
		       .pipe(cssmin({
		       		compatibility: 'ie7'            //兼容IE7及以下需设置compatibility属性
		       }))
		       //.pipe(gulp.dest('dest/css'))
		       .pipe(gulp.dest('dest/styles'))
		       .pipe(notify({message: 'cssmin task complete'}));   //提醒任务完成
});

//压缩图片
gulp.task('imagemin', function(){
	return gulp.src('src/images/**/*.{png,jpg,gif,ico}')
			   .pipe(plumber())
			   .pipe(changed('dest/images'))  // 对比文件是否有过改动（此处填写的路径和输出路径保持一致）
			   .pipe(imagemin({
					optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
		            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
		            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
		            //multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
		            //svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
		            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
			   }))
			   .pipe(gulp.dest('dest/images'))
			   .pipe(notify({message: 'imagemin task complete'}))   //提醒任务完成
			   .pipe(browserSync.stream());
});

//合并雪碧图并生成css文件
gulp.task('sprite', function(){
	var spriteData = gulp.src('src/slice/**/*.{jpg,png}')
		//.pipe(plumber())
		.pipe(spritesmith({
			spritesmith: function (options) {
				options.imgPath = '../images/sprites/' + options.imgName
			}
		}))
	 
	var imgStream = spriteData.img
	.pipe(gulp.dest('src/images/sprites/'))
	var cssStream = spriteData.css
	.pipe(gulp.dest('src/css/sprites/'))

	return merge(imgStream, cssStream)
	.pipe(notify({message: 'sprite task complete'}));   //提醒任务完成
});

//压缩js文件
gulp.task('jsmin', function(){
	return gulp.src(['src/js/**/*.js','!src/js/**/*.min.js'])
		.pipe(plumber())
		.pipe(jshint())                  //js代码校验
		.pipe(jshint.reporter('default'))
		// .pipe(rename({
		// 	suffix: '.min'               //文件重命名
		// }))                      
		.pipe(uglify({
			//mangle: {except: ['require','exports','module','$']},        //排除混淆关键字
			mangle: false,               //是否修改变量名
			compress: true,              //是否完全压缩
			preserveComments: 'some'     //保留部分注释
		}))
		//.pipe(gulp.dest('dest/js'))
		.pipe(gulp.dest('dest/scripts'))
		.pipe(notify({message: 'jsmin task complete'}))   //提醒任务完成
		.pipe(browserSync.stream());
});

//给页面引用url添加版本号，以清除页面缓存，在url后面需要加上'?rev=@@hash'
gulp.task('urlrev', function(){
	gulp.src('src/**/*.html')
		.pipe(rev())
		.pipe(gulp.dest('dest/'));
});

//将第三方文件拷贝到dest中
gulp.task('build', function(){
	//gulp.src('src/js/**/*.min.js').pipe(gulp.dest('dest/js'));
	//gulp.src('src/css/**/*.min.css').pipe(gulp.dest('dest/css'));
	gulp.src('src/js/**/*.min.js').pipe(gulp.dest('dest/scripts'));
	gulp.src('src/css/**/*.min.css').pipe(gulp.dest('dest/styles'));
});

//压缩任务
gulp.task('release', ['clean'], function(){
	gulp.start('cssmin','jsmin','imagemin','urlrev','build');
	browserSync.init({
		server: {
			baseDir:['dest/'],
			middleware:SSI({
				baseDir:'dest/',
				ext:'.shtml',
				version:'2.10.0'
			}),
			directory: true
		}
	});
});

//默认任务
gulp.task('default', ['less', 'sprite'], function(){
	gulp.start('webserver');
});