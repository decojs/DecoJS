({
	baseUrl: ".",
	out: "Bin/ordnung.js",
	paths: {
		"knockout": "empty:",
		"ordnung": "Source"
	},
	include: [,
		"ordnung/qvc",
		"ordnung/ajax",
		"ordnung/utils",
		"ordnung/loader",
		"ordnung/proclaimWhen"
	],
	
	
	optimize: "uglify2",
	generateSourceMaps: true,
	preserveLicenseComments: false
})