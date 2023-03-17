## How to contribute?
Contributors and pull requests are welcome.<br>Feel free to [contact](#questions) us for any questions.

### Junior jobs

Every contribution are welcomed, whatever their sizes.<br>
If you want to contribute to a dynamic and welcoming open-source project, be sure to check our *easy-to-start-with* junior jobs, either by checking the issues for the tag [*Junior jobs*](https://github.com/autoNumeric/autoNumeric/issues?q=is%3Aissue+is%3Aopen+label%3A%22Junior+Jobs%22), or by searching for the `//TODO` and `//FIXME` strings directly in the source (there are plenty awaiting for you right now!).

Happy coding :>

### Get the latest source
```sh
git clone -b next https://github.com/autoNumeric/autoNumeric.git
# or the following if you are authentified on github :
# `git clone -b next git@github.com:autoNumeric/autoNumeric.git`
```

### Make your changes
*Note: you can use either `npm` or `yarn` for running the install/build scripts. We'll use `yarn` in the following examples*

First things first, in order to be able to compile the ES6 source to something that can be interpreted by the browsers, and get the tools (linter, test runners, etc.) used by the developers, you need to install them by doing :
```sh
cd autoNumeric
yarn install
```

*Note: you need to have `yarn` installed before executing this command.<br>You can install `yarn` globally by doing `npm install -g yarn` as root.*

Once you made your changes, you can build the library with :
```sh
yarn build
```
This will generate the `autoNumeric.js` and `autoNumeric.min.js` files in the `dist` folder, that you'll then be able to use in the browsers.

If you want to clean the generated `.js` and `.min.js` files as well as development specific ones like coverage and log files, use :
```sh
yarn run clean
```
*Note: do **not** use `yarn clean` as it's a [different command](https://yarnpkg.com/en/docs/cli/clean) entirely.*

### Run the mandatory tools for linting and testing
We strive to keep the tests green at all times. Hence whenever you change the source, be sure to:

1. Write at least 2 tests for each change :
  - One that validate your changes
  - One that invalidate your changes
2. Make sure all tests passes on all supported browsers (Puppeteer, Firefox, and Chrome)
  - Write unit tests *and* end-to-end tests
3. Make sure `eslint` does not return any errors regarding the coding style.

#### How to test?
Tests **must always be green** :white_check_mark: before pushing. Any commit that make the tests fails will be ignored.<br>To run the tests, you have multiple options :
```sh
# Run unit testing as well as end-to-end testing
yarn test

# Run unit testing only
yarn test:unit

# Run end-to-end testing only
yarn test:e2e

# Run unit testing only...
yarn test:unitp   # ...with PhantomJS only
yarn test:unitf   # ...with Firefox only
yarn test:unitc   # ...with Chrome only
```

Behind the scene, all unit and end-to-end tests are written with [Jasmine](https://jasmine.github.io/).<br>[Karma](https://github.com/karma-runner/karma) is used to run the unit tests, while [Webdriver.io](https://github.com/webdriverio/webdriver.io) is used to run end-to-end tests.

#### How to lint?
Linting allow us to keep a coherent code style in all the source files.<br>In order to check that everything is well formatted, run [eslint](http://eslint.org/) with :
```sh
yarn lint
```
If any errors are shown, you can try to automatically correct them by running :
```sh
# Use the path of the faulty file to fix only this particular file :
./node_modules/eslint/bin/eslint.js --fix src/AutoNumeric.js

# Or try to fix all errors in all files once with
yarn lintfix
```

#### How to push?
Every changes that you pushed in its own branch in your personal autoNumeric repository copy should be based on the latest version of the `next` branch *(the development branch)*.

When you create a pull request, make sure to push against the `next` branch.

Please try to break down your pull requests and commits into small and manageable entities, in order:
- to make them easier to process, and more importantly
- to keep each logical set of changes in its own commit.

Additionally, your commits must not contain any generated files (ie. files built in the `/dist/` directory, or logs).

## Important changes regarding the generated `dist` files
Since the version `4.1.3`, the generated `dist` files (ie. `autoNumeric.js` and `autoNumeric.min.js`) are not pushed into the repository anymore.

However, all tagged commits are now automatically built and published on npm.<br>

This means if you want to download the minified library directly, you need to use npm to install it (`yarn add autonumeric` or `npm install autonumeric`).*
