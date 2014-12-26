# [DecoJS](http://decojs.com) [![Build Status](https://travis-ci.org/decojs/DecoJS.svg?branch=release)](https://travis-ci.org/decojs/DecoJS)

> **Scalable frontend architecture**

## Getting Started

This project can be used with bower or npm. This will install both the concatenated and minified files, along with the sourcemap for both of them. It will also install the dependencies needed to run the project

```shell
bower install deco
#or
npm install decojs
```

DecoJS is only dependent on [Require.js](http://requirejs.org) and [Knockout.js](http://knockoutjs.com). For more information on building websites with DecoJS, go to [DecoJS.com](http://decojs.com)!


## Contribution

The rest of this readme is for contributors to this project.

This project requires node.js, grunt and bower. Download and install [node js](http://www.nodejs.org) on your machine. Next install [bower](https://github.com/bower/bower) and [grunt](http://gruntjs.com) from the terminal: 

```shell
npm install -g bower
npm install -g grunt-cli
```

### Installation

This project uses grunt for installation, building and testing. With grunt and bower installed, the `grunt` command can be used to perform any of the other tasks. Before grunt can be used, some node packages must be installed:


```shell
npm install
```


### Fetching Dependencies

Download the dependencies using bower:

```shell
grunt install
```

### Building the project

Grunt can be used to concatenate the AMD modules and minify them:

```shell
grunt build
```

### Running Tests

karma is used for automatic testing. In development a test server can be started, and the tests will be automatically run when a file changes:

```shell
grunt test
```

Connect to the test server by opening one or more browsers and navigating to http://localhost:9876

### Buildserver

On the build server all of these steps (installing dependencies, building the project and running tests) can be done with the default grunt commant:


```shell
grunt
```

### Releasing a new version

Grunt can be used to create a new version. This will commit the latest changes, increment the version and tag the commit with v<MAJOR>.<MINOR>.<PATCH>:

```shell
grunt release
```

When creating a new release, merge master to the release branch, update the releaseNotes.md file and then run the grunt release script. This will create a single commit with all the release info. Push the release branch to the server with tags, then publish the new version on npm, using

```shell
npm publish
```


## License

Copyright ©2013 Marius Gundersen All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.