var config = module.exports;
config["web-module"] = {
    environment: "browser",
    rootPath: "js",
    sources: ["testModule.js"],
    tests: ["test/*test.js"],
    libs: ["require-jquery.js"],
    extensions: [require("buster-amd")]
};
