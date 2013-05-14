var config = module.exports;

config["OrdnungJS"] = {
    rootPath: "../",
    environment: "browser", // or "node"
    libs: [
        "spec/Libs/*.js",
        "spec/requireConfig.js"
    ],
    sources: [
        "Source/**/*.js",
        "spec/Mocks/*.js"
    ],
    tests: [
        "spec/Modules/**/*.js"
    ],
    extensions: [
      require("buster-amd")
    ]
}