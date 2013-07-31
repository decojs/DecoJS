define([

], function(

){
	function TemplateLoader(){

	}

	TemplateLoader.prototype.loadTemplate = TemplateLoader.loadTemplateSpy = sinon.spy();
	TemplateLoader.prototype.abort = TemplateLoader.abortSpy = sinon.spy();


	return TemplateLoader;
});