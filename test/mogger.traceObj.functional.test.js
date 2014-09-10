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


var assert      = require('assert'),
    Mogger      = require('../src/mogger'),
    fakeConsole = require('./fake-console')
;

describe('Mogger.traceObj() functional:', function(){


    it('traceObj() will trace', function () {

        var someObj = {
            addNumbers: function (arg1, arg2) {
                return arg1 + arg2;
            },
            justReturn: function (arg1) {
                return arg1;
            }
        };

        var mogger = new Mogger({
            defaultConsole: fakeConsole,
            surrogateTargets: [{ title: 'SOME_OBJ', target: someObj }]
        });

        mogger.traceObj({ targetTitle: 'SOME_OBJ' });

        someObj.addNumbers(1, 2);

        assert.equal(1, fakeConsole.logRecorder.length);
        //assert.equal('someObj', fakeConsole.logRecorder[0].message);
    });

});