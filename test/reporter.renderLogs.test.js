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


var assert          = require('assert'),
    sinon           = require('sinon'),
    Reporter        = require('../src/reporter'),
    fakeConsole     = require('./fake-console'),
    helpers         = require('../src/helpers'),
    defaultConfig   = require('../src/default-config'),
    reporter
;

describe('Reporter RenderLogs:', function(){

    var defaultGlobalConfig;
    var fakeInfo;

    beforeEach(function(){
        fakeInfo = sinon.stub({
            method: 'someMethod',
            args: ['arg1', 'arg2']
        });

        fakeConsole.logRecorder = [];
        defaultGlobalConfig = helpers.merge(defaultConfig, { defaultConsole: fakeConsole });
        reporter = new Reporter({
            globalConfig: defaultGlobalConfig
        });

    });

    afterEach(function(){
    });

    describe('_addTitle()', function () {
        it('do not add nothing if no before config is passed', function() {
            reporter = new Reporter({
                globalConfig: {}
            });

            reporter._addTitle();

            assert.deepEqual(0, reporter._logs.length);
        });

        it('adds the first log', function() {
            var beforeConfig = {
                message: 'before message:',
                logType: 'log'
            };

            reporter = new Reporter({
                globalConfig: {
                    before: beforeConfig
                }
            });

            reporter._addTitle();

            assert.deepEqual(beforeConfig, reporter._logs[0]);
        });
    });


    describe('_applyInterceptors()', function () {
        it('can receive global and local interceptors', function() {
            var interceptorsHelpersSpy = {};
            interceptorsHelpersSpy.checkAndApplyInterceptor = sinon.spy();

            var interceptorA = {
                filterRegex: /^__a.*/i,
                callback: function(fakeInfo) {
                    return '__a:' + info.method;
                }
            };

            defaultGlobalConfig.globalInterceptors = interceptorA;
            defaultGlobalConfig.localInterceptors = interceptorA;

            var interceptorsObjStub = {
                globalInterceptors: interceptorA,
                localInterceptors: interceptorA,
                info: fakeInfo
            };

            reporter = new Reporter({
                globalConfig: defaultGlobalConfig,
                localConfig: null,
                interceptorsHelpers: interceptorsHelpersSpy
            });

            reporter._applyInterceptors(fakeInfo);

            //console.log(interceptorsHelpersSpy.checkAndApplyInterceptor.getCall(0).args);
            assert.equal(true, interceptorsHelpersSpy.checkAndApplyInterceptor.calledWith(interceptorsObjStub));
        });
    });

    describe('_addMainLog()', function () {
        it('if does not have a target configuration creates a simple message log', function () {

            var LOG_MESSAGE = 'LOG_MESSAGE';

            reporter._addMainLog(LOG_MESSAGE);

            assert.equal(1, reporter._logs.length);
            assert.equal(LOG_MESSAGE, reporter._logs[0].message);
        });

        it('global target configuration only', function () {

            var LOG_MESSAGE = 'LOG_MESSAGE';
            var TARGET_CONFIGURATION = {
                css: 'color: red',
                size: 15
            };

            reporter.globalTargetConfig = TARGET_CONFIGURATION;

            reporter._addMainLog(LOG_MESSAGE);

            assert.equal(1, reporter._logs.length);
            assert.equal(LOG_MESSAGE, reporter._logs[0].message);
            assert.equal('color: red', reporter._logs[0].css);
            assert.equal(15, reporter._logs[0].size);
        });

        it('local target configuration only', function () {

            var LOG_MESSAGE = 'LOG_MESSAGE';
            var TARGET_CONFIGURATION = {
                css: 'color: red',
                size: 15
            };

            reporter.localTargetConfig = TARGET_CONFIGURATION;

            reporter._addMainLog(LOG_MESSAGE);

            assert.equal(1, reporter._logs.length);
            assert.equal(LOG_MESSAGE, reporter._logs[0].message);
            assert.equal('color: red', reporter._logs[0].css);
            assert.equal(15, reporter._logs[0].size);
        });

        it('global and local target configuration, local must win', function () {

            var LOG_MESSAGE = 'LOG_MESSAGE';

            reporter.globalTargetConfig = {
                css: 'color: blue',
                size: 10
            };

            reporter.localTargetConfig = {
                css: 'color: red',
                size: 15
            };

            reporter._addMainLog(LOG_MESSAGE);

            assert.equal(1, reporter._logs.length);
            assert.equal(LOG_MESSAGE, reporter._logs[0].message);

            // locals wins
            assert.equal('color: red', reporter._logs[0].css);
            assert.equal(15, reporter._logs[0].size);
        });
    });

    describe('_renderToConsole()', function () {
        it('send mainMessage to console', function () {

            reporter._logs = [{ message: fakeInfo.method }];
            reporter._renderToConsole(fakeInfo, fakeInfo.method);

            assert.equal(1, fakeConsole.logRecorder.length);
            assert.equal(fakeInfo.method, fakeConsole.logRecorder[0].message);
        });

        it('will log arguments in a groupCollapsed', function () {

            reporter.showArguments = true;
            reporter._logs = [{
                message: fakeInfo.method,
                css: 'color: blue',
                size: 10
            }];


            reporter._renderToConsole(fakeInfo, fakeInfo.method);

            assert.equal(3, fakeConsole.logRecorder.length);

            // 0 = groupCollapsed
            assert.equal('groupCollapsed', fakeConsole.logRecorder[0].methodName);
            assert.equal('%c' + fakeInfo.method, fakeConsole.logRecorder[0].message);
            assert.equal('color: blue', fakeConsole.logRecorder[0].cssList[0]);

            // 1 = log arguments
            assert.equal('log', fakeConsole.logRecorder[1].methodName);
            assert.equal(fakeInfo.args, fakeConsole.logRecorder[1].message);

            // 2 = log arguments
            assert.equal('groupEnd', fakeConsole.logRecorder[2].methodName);
        });
    });

    describe('renderLogs()', function () {
        it('should be calling all "internal" methods', function () {

            reporter._addTitle = sinon.spy();
            reporter._applyInterceptors = sinon.spy();
            reporter._addMainLog = sinon.spy();
            reporter._renderToConsole = sinon.spy();

            reporter.renderLogs(fakeInfo);

            assert.equal(true, reporter._addTitle.called);
            assert.equal(true, reporter._applyInterceptors.called);
            assert.equal(true, reporter._addMainLog.called);
            assert.equal(true, reporter._renderToConsole.called);

        });
    });



});