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

		const levels = ['', 'beginner', 'immediate', 'advanced'];
		const level = ((level) => {
			return ['1', '2', '3'].includes(level) ? levels[level] : level;
		})(parts[2].trim().toLowerCase());

		const challenge = parts[1].trim().toLowerCase();
		const desc = parts[2].trim() + '/' + parts[3].trim();

		ProjectsMetadata.push({
			title,
			challenge: challenge,
			desc: desc,
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
            <div class="project col-md-6 filter filter-${project.challenge} filter-${project.level}">
				<div class="card flex-md-row mb-4 shadow-sm h-md-250">
					<div class="card-body d-flex flex-column align-items-start">
						<strong class="d-inline-block mb-2 text-primary">${project.title}</strong>
						<h6 class="mb-0"><a class="text-dark" href="#">${project.challenge}</a></h6>
						${project.desc}
						<div class="mb-1 text-muted small level">${project.level}</div>
						<p class="card-text mb-auto">&nbsp;</p>
						<a class="btn btn-outline-primary btn-sm" role="button" href="${project.path}">Read more ... </a>
					</div>
					<a href="${project.path}">
						<img class="card-img-right flex-auto d-none d-lg-block" alt="${project.title}" src="${project.img}">
					</a>
				</div>
			</div>
      `;

		return content;
	});

	let htmlIndex = fs.readFileSync(path.resolve(__dirname, '../src/index.template.html'), 'utf8');
	htmlIndex = htmlIndex.replace('###CONTENT###', (match) => {
		return `${projectsHTML.join('')}`;
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
