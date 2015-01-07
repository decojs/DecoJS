# DecoJS Release Notes

## 0.6.1 (2015-01-07)
* Fixed executing command/query returns true, which knockout submit/click bindings interpret as "don't preventDefault".

## 0.6.0 (2014-12-26)
* Implemented hashbang urls to improve crawlability by Goolge and other search engines. (issue 21)

## 0.5.4 (2014-12-22)
* Improved the way QVC errors and invalid parameter responses are handled

## 0.5.3 (2014-12-13)
* Fixed a bug where nested viewmodels weren't cleaned up correctly, which could break the application (issue 19)
* Made it possible to pass data into nested viewmodels using data-params
* Made sure an error is thrown if the same observable is used in multiple executables (issue 2)
* Exposed isValid directly on the observables that are used as parameters to executabse

## 0.5.2 (2014-12-09)
* Fixed an issue where relative paths in the url fragment could cause an infinite JS loop

## 0.5.1 (2014-11-16)
* Fixed nested data-viewmodel could not be used inside foreach (issue 15)

## 0.5.0 (2014-11-16)
* Updated to use Knockout 3.2.0
* Got rid of when.js in favor of native promises (ES6 Promise polyfill is available)
* Added support for nested viewmodels

## 0.4.0 (2014-08-20)
* Cleaned up the QVC code
* Made the parameters to a command/query accessible
* Added ability to manually validate a command/query
* Improved error message when creating a command/query without a name
* Added callback when a command/query has invalid parameters when it is executed

## 0.3.2 (2014-05-03)
* Upgraded to latest version of dependencies
* Fixed a memory leak caused by executables sticking around for too long (issue 14)

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

