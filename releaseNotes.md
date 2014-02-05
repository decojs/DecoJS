# DecoJS Release Notes

## 0.3.1 (2013-02-05)
* Updated to latest version of RequireJS, since the previous version seems to have disapeared from the internet (issue 8)
* Fixed bad JSON in package.json

## 0.3.0 (2013-12-24)
* Changed the name of project to DecoJS and moved it to [decojs.com](http://decojs.com)

## 0.2.13 (2013-11-29)

### Fixed bugs:
* Pages can now contain templates inside script tags (without Deco trying to execute the template) (issue 40)
* The list of modules which Require was unable to load is now spread across multiple lines (issue 39)
* When the server returns an empty list of constraints for a field, it ignores that field (issue 38)

## 0.2.12 (2013-11-15)

### Features:
* Depends on Knockout 3.0 (issue 29)
* A better packaged and distributed project (issue 4)

### Fixed bugs:
* Url decoding did not work on safari (issue 34)

## 0.2.11 (2013-10-30)

### Features:
* Exceptions thrown by the server are forwarded to the errorHandler (issue 21)
* Events have a toString method, producing a nice string

### Fixed bugs:
* String interpolation now supports multiple properties in a single error message (issue 10)

## 0.2.10 (2013-10-29)

### Features:
* validation messages support string interpolation (issue 10)

### Fixed bugs:
* command/query is missing Validator (issue 27)
* when the result has violations, but it is not an array, it should not fail (issue 25)
* Error messages are not nice in Firefox (issue 28)
* validationMessageFor must fail nicely if it fails (issue 26)

### Technical:
* Test results produce warnings (issue 30)
* Added jasmine-sinon test matchers (issue 23)

