## How to contribute?
Contributors and pull requests are welcome.<br>Feel free to [contact](#questions) us for any questions.

### Get the latest source
```sh
git clone -b next https://github.com/BobKnothe/autoNumeric.git
# or the following if you are authentified on github :
# `git clone -b next git@github.com:BobKnothe/autoNumeric.git`
```

### Make your changes
```sh
cd autoNumeric
```
First things first, in order to be able to compile the ES6 source to something that can be interpreted by the browsers, and get the tools (linter, test runners, etc.) used by the developers, you need to install them by doing :
```sh
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
We strive to keep the tests green at all times. Hence whenever you change the source, be sure to :

1. Write at least 2 tests for each change :
  - One that validate your changes
  - One that invalidate your changes
2. Make sure all tests passes on all supported browsers (PhantomJS, Firefox, and Chrome)
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
# Use the path of the faulty file there :
./node_modules/eslint/bin/eslint.js --fix src/AutoNumeric.js
```

#### How to push?
Every changes that you pushed in its own branch in your personal autoNumeric copy should be based on the latest version of the `next` branch.

When you create a pull request, make sure to push against the `next` branch.

Your commit must not contain any generated files (ie. files in the `/dist/` directory or logs).<br>
*Note: Generated `dist` files (ie. `autoNumeric.js` and `autoNumeric.min.js`) are built and force-added to the git repository only once for each official release on `master`.*
