function quote(t) {
    return "'" + t + "'";
}

function amdWrapper(paths, mapper) {
    var tests = paths.map(mapper).map(quote);
    var identifiers = paths.map(function (t, i) { return "t" + i; });

    tests.unshift("'buster'");
    identifiers.unshift('buster');

    return "define('buster', function(){ return buster; });"+
        "require([" + tests.join(", ") + "], function(" + identifiers.join(", ") +
        ") {\n  buster.run();\n});";
}

module.exports =  {
    name: "buster-amd",

    create: function (options) {
        var ext = Object.create(this);
        var mapper = options && options.pathMapper;
        ext.pathMapper = mapper || function (path) {
            return path.replace(/\.js$/, "").replace(/^\//, "");
        };
        ext.preloadSources = !!options.preloadSources;
        ext.preloadTests = !!options.preloadTests;
        return ext;
    },

    configure: function (conf) {
        conf.options.autoRun = false;

        conf.on("load:tests", function (rs) {
            var paths = rs.loadPath.paths();
            rs.addResource({
                path: "/buster/load-all.js",
                content: amdWrapper(rs.loadPath.paths(), this.pathMapper)
            });
            if (!this.preloadTests) {
                rs.loadPath.clear();
            }
            rs.loadPath.append("/buster/load-all.js");
        }.bind(this));

        if (!this.preloadSources) {
            conf.on("load:sources", function (rs) { rs.loadPath.clear(); });
        }
    }
};
