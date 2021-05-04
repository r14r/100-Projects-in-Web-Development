/**
 * Script used to generate the index page where all the projects are
 * displayed with a link to their corresponding website.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const BASE_PATH = './src/projects/';
const ProjectsMetadata = [];

/**
 *
 */
var getProjects = function (pattern, callback) {
	glob(pattern, callback);
};

/**
 *
 */
function collectData(projects) {
	projects.forEach((directory) => {
		const file = directory.replace('./src/', '').replace('\\', '/');
		const path = file.replace('/index.html', '');

		const parts = path.split('/');
		const html = fs.readFileSync(directory, 'utf8');
		const [title] = /(?<=<title>).*(?=<\/title>)/.exec(html);
		const hasJs = /<script.*>.*<\/script>/.exec(html);

		let img = directory.replace('/index.html', '/screenshot.png');

		if (!fs.existsSync(img) === true) {
			img = 'assets/lib/img/screenshot.png';
		} else {
			img = img.replace('./src/', '');
		}

		let level = parts[2];

		if (level === '1') {
			level = 'Beginner';
		} else if (level === '2') {
			level = 'Immediate';
		} else if (level === '3') {
			level = 'Advanced';
		}

		ProjectsMetadata.push({
			title,
			challenge: parts[1].trim(),
			desc: path,
			path: path,
			img: img,
			href: file,
			level: level,
		});
	});
}

/**
 * Using Style from https://codepen.io/Booligoosh/pen/mKPpQp
 */
function createIndexFile() {
	const projectsHTML = ProjectsMetadata.map((project) => {
		const content = `
			<div class="card">
				<a href="${project.path}/index.html">
					<div class="card-img" style="background-image:url(${project.img});">
						<div class="overlay">
							<div class="overlay-content">
								View Project
							</div>
						</div>
					</div>
		
					<div class="card-content">
						<h2>${project.title}</h2>
						<p>${project.challenge} / ${project.level}</p>
					</div>
				</a>
			</div>
		`;

		return content;
	});

	let htmlIndex = fs.readFileSync(path.resolve(__dirname, '../src/index.html.template'), 'utf8');
	htmlIndex = htmlIndex.replace('###CONTENT###', (match) => {
		return `<div class="cards">${projectsHTML.join('')}</div>`;
	});

	fs.writeFileSync(path.resolve(__dirname, '../src/index.html'), htmlIndex, 'utf8');
}

/**
 *
 */
(function main() {
	getProjects(BASE_PATH + '/**/index.html', function (err, res) {
		if (err) {
			console.log('Error', err);
		} else {
			collectData(res);
			createIndexFile();
		}
	});
})();
