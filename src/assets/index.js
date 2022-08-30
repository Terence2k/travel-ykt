const modulesFiles = import.meta.globEager('./svg/*.svg');

const svgList = [];

for (const path in modulesFiles) {
	svgList.push(path);
}

const svgs = svgList.reduce((modules, modulePath) => {
	const moduleName = modulePath.replace(/^\.\/svg\/(.*)\.\w+$/, '$1');
	const value = modulesFiles[modulePath];
	modules[moduleName] = value.default;
	return modules;
}, {});

export const useSvgs = () => svgs;

export default svgs;
