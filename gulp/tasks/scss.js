import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import cleanCss from 'gulp-clean-css';
import webpCss from 'gulp-webpcss';
import autoprefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import postcssPresetEnv from 'postcss-preset-env';
import postcssGroupMedia from 'postcss-sort-media-queries';
import sourcemaps from 'gulp-sourcemaps';

import { filePaths } from '../config/paths.js';
import { plugins } from '../config/plugins.js';
import { logger } from '../config/logger.js';

const sass = gulpSass(dartSass);

export const scss = (isBuild, serverInstance) => {
	const webpConfig = {
		webpClass: '.webp',
		noWebpClass: '.no-webp',
	};

	return gulp.src('src/scss/*.scss', { sourcemaps: !isBuild }) // Кожен SCSS окремо
		.pipe(logger.handleError('SCSS'))
		.pipe(plugins.if(!isBuild, sourcemaps.init()))
		.pipe(sass({ outputStyle: 'expanded' }))
		.pipe(plugins.replace(/@img\//g, '../images/'))

		.pipe(plugins.if(isBuild, webpCss(webpConfig)))
		.pipe(plugins.if(isBuild, postcss([
			autoprefixer(),
			postcssPresetEnv(),
			postcssGroupMedia({ sort: 'desktop-first' }),
		])))

		// Зберігаємо неконкатеновані .css файли
		.pipe(gulp.dest(filePaths.build.css))

		.pipe(plugins.if(isBuild, cleanCss()))
		.pipe(rename({ extname: '.min.css' }))
		.pipe(plugins.if(!isBuild, sourcemaps.write('.')))
		.pipe(gulp.dest(filePaths.build.css))
		.pipe(serverInstance.stream());
};
