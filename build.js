({
	baseUrl: "Source",
	out: "Bin/ordnung.js",
	paths: {
		"knockout": "empty:",
		"when": "empty:"
	},
	include: [
		"ordnung/qvc",
		"ordnung/spa",
		"ordnung/proclaimWhen.js",
		"ordnung/utils",
		"ordnung/ajax"
	],
	
	
	optimize: "uglify2",
	generateSourceMaps: true,
	preserveLicenseComments: false
})