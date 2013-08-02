# Ordnung.js

A framework for building maintainable frontend applications

## Dependencies

This project requires node.js and bower. Download and install [node js](http://www.nodejs.org) on your machine. Next install [bower](https://github.com/bower/bower) from the terminal: 

```shell
npm install -g bower
```

## Installation

This project can be installed for use or for development. For use you need to dowload all the dependencies using bower. For development you need to additionally install the build and test tools using npm. This will install karma for running tests and require for concatenating and minifying the source files.

### Fetching Dependencies

Download the dependencies using bower:

```shell
bower install
```

This should download and install the dependencies automatically

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