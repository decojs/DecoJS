({
	baseUrl: "Source",
	out: "Bin/ordnung.js",
	paths: {
		"knockout": "empty:"
	},
	include: [
		"ordnung/qvc",
		"ordnung/utils",
		"ordnung/ajax",
		"ordnung/loader",
		"ordnung/proclaimWhen.js"
	],
	
	
	optimize: "uglify2",
	generateSourceMaps: true,
	preserveLicenseComments: false
})