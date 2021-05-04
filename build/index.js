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
            level = 'beginner';
        } else if (level === '2') {
            level = 'immediate';
        } else if (level === '3') {
            level = 'advanced';
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
        const Xcontent = `
			<div class="gallery_product col-lg-4 col-md-4 col-sm-4 col-xs-6 filter ${project.level}">
				<a href="${project.path}/index.html">
					<img src="${project.img}" class="img-responsive" />

					<div class="card-content">
						<h2>${project.title}</h2>
						<p>${project.challenge} / ${project.level}</p>
					</div>
				</a>
			</div>
		`;

        const content = `
            <div class="project col-md-6 filter ${project.level}">
                <div class="card flex-md-row mb-4 shadow-sm h-md-250">
                <div class="card-body d-flex flex-column align-items-start">
                    <strong class="d-inline-block mb-2 text-primary">${project.title}</strong>
                    <h6 class="mb-0">
                        <a class="text-dark" href="#">${project.challenge}</a>
                    </h6>
                    <div class="mb-1 text-muted small level">${project.level}</div>
                    <p class="card-text mb-auto">&nbsp;</p>
                    <a class="btn btn-outline-primary btn-sm" role="button" href="${project.path}">
                        Read more ... 
                        <!--
                            <i class="fas fa-angle-double-right"></i>
                        -->
                    </a>
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
