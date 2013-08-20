({
	baseUrl: ".",
	out: "Bin/ordnung.js",
	paths: {
		"knockout": "empty:",
		"ordnung": "Source",
		"when": "empty:"
	},
	include: [
		"ordnung/qvc",
		"ordnung/spa",
		"ordnung/proclaimWhen",
		"ordnung/utils",
		"ordnung/ajax"
	],
	
	
	optimize: "uglify2",
	generateSourceMaps: true,
	preserveLicenseComments: false
})