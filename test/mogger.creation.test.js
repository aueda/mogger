/** @license MIT License (c) Copyright (c) 2014 Julio Makdisse Saito */

/**
 * Mogger
 * Meld + Trace + Colorful logger
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author Julio Makdisse Saito (saitodisse@gmail.com)
 * @version 0.5.0
 */


var assert = require('assert');
var Mogger = require('../src/mogger');

describe('Mogger.Creation:', function(){

    // beforeEach(function(){
    // });

    it('\'Mogger\' is a function', function() {
        assert.equal('function', typeof Mogger);
    });

    it('default defaultConsole is console.log', function() {
        var mogger = new Mogger({
            surrogateTargets: []
        });

        assert.equal(console, mogger.defaultConsole);
    });

    it('defaultConsole is interchangeable', function() {
        var otherLoggerOutputFunction = function() {};
        var mogger = new Mogger({
            defaultConsole: otherLoggerOutputFunction
        });
        assert.notEqual(console, mogger.defaultConsole);
    });

    it('creating again get the same instance', function() {
        var mogger = new Mogger({
            surrogateTargets: [],
            globalBeforeConfig: {css: 123}
        });

        assert.deepEqual({css: 123}, mogger.globalBeforeConfig);
        mogger = new Mogger({
            surrogateTargets: []
        });
        assert.deepEqual(null, mogger.globalBeforeConfig);
    });

});
