# Ordnung.js

A framework for building maintainable frontend applications

## Dependencies

This project requires node.js, grunt and bower. Download and install [node js](http://www.nodejs.org) on your machine. Next install [bower](https://github.com/bower/bower) and [grunt](http://gruntjs.com) from the terminal: 

```shell
npm install -g bower
npm install -g grunt-cli
```

## Installation

This project uses grunt for installation, building and testing. With grunt and bower installed, the `grunt` command can be used to perform any of the other tasks. 

### Fetching Dependencies

Download the dependencies using bower:

```shell
grunt install
```

### Installing Dev Tools

Download the dependencies using npm:

```shell
npm install
```

This should download and intsall the development dependencies automatically

## Running Tests

karma is used for automatic testing. Run the karma_runner.cmd file to start a test runner. 

## Building 

The source files can be built into a single file (which ends up in Bin) using the require optimizer. Run the build.cmd to build this project

## License

Copyright ©2013 Marius Gundersen All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.