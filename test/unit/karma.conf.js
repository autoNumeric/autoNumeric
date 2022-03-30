// Karma configuration

const webpackConfig = require('../../config/webpack.config.test');

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        // basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            'jasmine',
        ],

        // list of files / patterns to load in the browser
        files: [
            '../../node_modules/@babel/polyfill/dist/polyfill.js',
            './tests.webpack.js',
        ],

        // list of files to exclude
        exclude: [
            '**/*.swp',
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            './tests.webpack.js': [
                'webpack',
                'sourcemap',
                'coverage',
            ],
        },

        // Compile the source before running the tests
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true,
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [
            // 'spec', // Uncomment if you want the full detail of all the tests
            'mocha', // Display a clean explanation of the test failures, and the list of the successful tests
            // 'progress', // Display the number of tests run/skipped/passed/failed
            'coverage',
        ],

        coverageReporter: {
            dir      : './coverage',
            reporters: [
                {
                    type  : 'html',
                    subdir: 'html',
                },
                {
                    type  : 'lcov',
                    subdir: '.',
                },
                {
                    type: 'text-summary',
                },
            ],
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Enable or prevent any logs to be written to the console. This is allowed by default using `true`.
        client: {
            captureConsole: true,
        },

        // enable / disable watching file and executing tests whenever any file changes
        // autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'Chrome',
            'ChromeHeadless',
            'Firefox',
            'FirefoxDeveloperHeadless',
            'PhantomJS',
        ],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        // singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,
    });
};
