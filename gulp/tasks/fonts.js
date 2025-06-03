import gulp from 'gulp';
import { existsSync, promises } from 'node:fs';


import { filePaths } from '../config/paths.js';
import { logger } from '../config/logger.js';

const { fontFacesFile } = filePaths.src;
const italicRegex = /italic/i;
const cleanSeparator = /(?:_|__|-|\s)?(italic)/i;

const fontWeights = {
	thin: 100,
	hairline: 100,
	extralight: 200,
	ultralight: 200,
	light: 300,
	regular: 400,
	medium: 500,
	semibold: 600,
	demibold: 600,
	bold: 700,
	extrabold: 800,
	ultrabold: 800,
	black: 900,
	heavy: 900,
	extrablack: 950,
	ultrablack: 950,
};

const fontFaceTemplate = (name, file) => `@font-face {
	font-family: '${name}';
	font-display: swap;
	src: url("../fonts/${file}.woff2") format("woff2");
	font-style: normal;
}\n\n`;


export const copyFonts = () => {
	return gulp.src(`${filePaths.src.fonts}/*.woff2`, {}) // buffer: true - обов’язково!
		.pipe(gulp.dest(filePaths.build.fonts));
};



export const fontStyle = async () => {
	try {
		if (existsSync(fontFacesFile)) {
			logger.warning('Файл scss/config/fonts.scss уже существует.\nДля обновления файла его нужно удалить!');
			return;
		}

		const fontFiles = await promises.readdir(filePaths.build.fonts);

		if (!fontFiles) {
			logger.error('Нет сконвертированных шрифтов');
			return;
		}

		await promises.writeFile(fontFacesFile, '');
		let newFileOnly;

		for (const file of fontFiles) {
			const [fileName] = file.split('.');

			if (newFileOnly !== fileName) {
				const [name, weight = 'regular'] = fileName.split('-');
				const weightString = fontWeights[weight.replace(cleanSeparator, '').toLowerCase()];
				const fontStyle = italicRegex.test(fileName) ? 'italic' : 'normal';

				await promises.appendFile(fontFacesFile, fontFaceTemplate(name, fileName));
				newFileOnly = fileName;
			}
		}
	}
	catch (err) {
		logger.error('Ошибка при обработке шрифтов:\n', err);
	}
};
