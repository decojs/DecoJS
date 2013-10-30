# Ordnung.js Release Notes

## 0.2.11 (2013/10/30)

### Features:
* Exceptions thrown by the server are forwarded to the errorHandler (issue 21)
* Events have a toString method, producing a nice string

### Fixed bugs:
* String interpolation now supports multiple properties in a single error message (issue 10)

## 0.2.10 (2013/10/29)

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

