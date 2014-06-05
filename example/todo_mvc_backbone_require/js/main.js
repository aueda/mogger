/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
	// The shim config allows us to configure dependencies for
	// scripts that do not call define() to register a module
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		},
		backboneLocalstorage: {
			deps: ['backbone'],
			exports: 'Store'
		},
		Mogger:{
			deps: [
				'colorful-logger',
				'lodash',
				'meld'
			]
		}
	},
	paths: {
		jquery: '../bower_components/jquery/jquery',
		underscore: '../bower_components/underscore/underscore',
		backbone: '../bower_components/backbone/backbone',
		backboneLocalstorage: '../bower_components/backbone.localStorage/backbone.localStorage',
		text: '../bower_components/requirejs-text/text',

		Mogger: '../bower_components/mogger/src/mogger',
		meld: '../bower_components/meld/meld',
		meldTrace: '../bower_components/meld/aspect/trace',
		lodash: '../bower_components/lodash/dist/lodash',
		'colorful-logger': '../bower_components/colorful-logger/src/colorful-logger'
	}
});

require([
	'backbone',
	'views/app',
	'routers/router',
	'Mogger'
], function (Backbone, AppView, Workspace, Mogger) {
	
	var tracer = new Mogger.Tracer();
	tracer.traceObj(Backbone.View.prototype);

	/*jshint nonew:false*/
	// Initialize routing and start Backbone.history()
	new Workspace();
	Backbone.history.start();


	// Initialize the application view
	new AppView();
});