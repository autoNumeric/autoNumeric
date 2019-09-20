// eslint-disable-next-line
/* global exports, require, browser */

exports.config = {
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    specs: [
        './test/e2e/specs/**/*.js',
    ],

    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],

    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.

    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    maxInstances: 10,

    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://docs.saucelabs.com/reference/platforms-configurator
    capabilities: [
        {
            // maxInstances can get overwritten per capability. So if you have an in-house Selenium
            // grid with only 5 firefox instances available you can make sure that not more than
            // 5 instances get started at a time.
            maxInstances: 5,
            browserName : 'firefox',
        },
        {
            browserName : 'chrome',
        },
        /*
        {
            browserName   : 'firefox', // developer version
            firefox_binary: '/home/user/.local/share/umake/web/firefox-dev/firefox', // Path to the executable
        },
        */
    ],


    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here

    // By default WebdriverIO commands are executed in a synchronous way using
    // the wdio-sync package. If you still want to run your tests in an async way
    // e.g. using promises you can set the sync option to false.
    sync: true,

    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'silent',

    // Enables colors for log output.
    coloredLogs: true,

    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,

    // Saves a screenshot to a given path if a command fails.
    screenshotPath: './test/e2e/screenshots/',

    // Set a base URL in order to shorten url command calls. If your url parameter starts
    // with "/", then the base url gets prepended.
    baseUrl: 'http://localhost:2202',

    // Default timeout for all waitFor* commands.
    waitforTimeout: 10000,

    // Default timeout in milliseconds for request
    // if Selenium Grid doesn't send response
    connectionRetryTimeout: 90000,

    // Default request retries count
    connectionRetryCount: 3,

    // Initialize the browser instance with a WebdriverIO plugin. The object should have the
    // plugin name as key and the desired plugin options as properties. Make sure you have
    // the plugin installed before running any tests. The following plugins are currently
    // available:
    // WebdriverCSS: https://github.com/webdriverio/webdrivercss
    // WebdriverRTC: https://github.com/webdriverio/webdriverrtc
    // Browserevent: https://github.com/webdriverio/browserevent
    // plugins: {
    //     webdrivercss: {
    //         screenshotRoot: 'my-shots',
    //         failedComparisonsRoot: 'diffs',
    //         misMatchTolerance: 0.05,
    //         screenWidth: [320,480,640,1024]
    //     },
    //     webdriverrtc: {},
    //     browserevent: {}
    // },

    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    // services: [],

    services           : [
        // This is used to create a static server to serve the static end-to-end test page
        'static-server',
        // This is used to launch the selenium server automatically when calling `yarn test:e2e`
        'selenium-standalone',
    ],

    staticServerFolders: [
        {
            mount: '/e2e',
            path: './test/e2e/index.html',
        },
        // Libraries
        {
            mount: '/autonumeric',
            path: './dist/autoNumeric.min.js',
        },
    ],
    staticServerPort : 2202,
    staticServerLog: false,


    seleniumLogs       : 'test/e2e/selenium.log',
    //XXX Using the latest v3.0.1 make the tests crash under Firefox. This is tracked here : https://github.com/SeleniumHQ/selenium/issues/2285
    seleniumInstallArgs: {
        version: '3.141.5',
    },
    seleniumArgs       : {
        version: '3.141.5',
    },

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: http://webdriver.io/guide/testrunner/frameworks.html
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'jasmine',

    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: http://webdriver.io/guide/testrunner/reporters.html
    reporters: [
        'spec',
        // 'dot', // Install `wdio-dot-reporter` to activate that reporter
    ],

    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        // Jasmine default timeout
        defaultTimeoutInterval: 15000,

        // The Jasmine framework allows interception of each assertion in order to log the state of the application
        // or website depending on the result. For example, it is pretty handy to take a screenshot every time
        // an assertion fails.
        /*
        expectationResultHandler: function(passed, assertion) {
            // do something
        },
        */
        // Make use of Jasmine-specific grep functionality
        grep: null,
        invertGrep: null,
    },
    
    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.

    // Gets executed once before all workers get launched.
    // onPrepare: function (config, capabilities) {
    // },

    // Gets executed just before initialising the webdriver session and test framework. It allows you
    // to manipulate configurations depending on the capability or spec.
    // beforeSession: function (config, capabilities, specs) {
    // },

    // Gets executed before test execution begins. At this point you can access all global
    // variables, such as `browser`. It is the perfect place to define custom commands.
    // before: function (capabilities, specs) {
    // },
    before() {
        // This allows to run babel before running the tests
        require('@babel/register');
    },

    // Hook that gets executed before the suite starts
    // beforeSuite: function (suite) {
    // },

    // Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
    // beforeEach in Mocha)
    // beforeHook: function () {
    // },

    // Add the 'getCaretPosition()' function to `browser`
    /*
    beforeHook() {
        //TODO Find a way to access the DOM element (`this` here does not work)
        browser.addCommand('getCaretPosition', function() {
            return this.selectionStart;
        });
    },
    */

    // Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
    // afterEach in Mocha)
    // afterHook: function () {
    // },

    // Function to be executed before a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
    // beforeTest: function (test) {
    // },

    // Runs before a WebdriverIO command gets executed.
    // beforeCommand: function (commandName, args) {
    // },

    // Runs after a WebdriverIO command gets executed
    // afterCommand: function (commandName, args, result, error) {
    // },

    // Function to be executed after a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
    // afterTest: function (test) {
    // },

    // Hook that gets executed after the suite has ended
    // afterSuite: function (suite) {
    // },

    // Gets executed after all tests are done. You still have access to all global variables from
    // the test.
    // after: function (result, capabilities, specs) {
    // },

    // Gets executed right after terminating the webdriver session.
    // afterSession: function (config, capabilities, specs) {
    // },

    // Gets executed after all workers got shut down and the process is about to exit. It is not
    // possible to defer the end of the process using a promise.
    // onComplete: function(exitCode) {
    // }
};
