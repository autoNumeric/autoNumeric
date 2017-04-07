## What is [autoNumeric](http://www.decorplanit.com/plugin/)?

autoNumeric is a library that provides live *as-you-type* formatting for international numbers and currencies.

[![NPM][nodei-image]][nodei-url]
<br>
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![Coverage Status][coveralls-image]][coveralls-url]
<br>
[![Gitter chat][gitter-image]][gitter-url]

The latest stable branch is [2.*](https://github.com/autoNumeric/autoNumeric/tree/master).<br>For older stable versions, please take a look [here](#older-versions), while for the latest development version, check the `next` [branch](https://github.com/autoNumeric/autoNumeric/tree/next).<br><br>
Moreover, you can take a look at what could be the next features coming to autoNumeric on our [project](https://github.com/autoNumeric/autoNumeric/projects) page *(feel free to participate!)*.

#### Highlights
autoNumeric main features are :
- Easy to use and configure
```js
// Initialization
$('.myInput').autoNumeric('init', { currencySymbol : '$' });
```
- Very high configurability (more than 30 [options](#options) available)
```js
// The options are...optional :)
const autoNumericOptionsEuro = {
    digitGroupSeparator        : '.',
    decimalCharacter           : ',',
    decimalCharacterAlternative: '.',
    currencySymbol             : '\u202f€',
    currencySymbolPlacement    : 's',
    roundingMethod             : 'U',
};

// Initialization
$('.myInput').autoNumeric('init', autoNumericOptionsEuro);
```
- User experience oriented ; using autoNumeric just feels right and natural
- Supports most international numeric formats and currencies<br>*(If the one you use is not supported yet, open an [issue](https://github.com/autoNumeric/autoNumeric/issues/new) and we'll add it as soon as possible!)*
- The mobile Android Chrome browser is now partially supported!

*And also:*
- Any number of different formats can be used at the same time on the same page.<br>Each input can be configured by either setting the options as HTML5 data attributes, or directly passed as an argument in the Javascript code
- The settings can easily be changed at *any* time using the `update` method or via a callback
- autoNumeric supports most text elements, allowing you to place formatted numbers and currency on just about any part of the page
- Pre-defined [currency options](#predefined-language-options) allows you to directly use autoNumeric by skipping the option configuration step
- 18 built-in [methods](#methods) gives you the flexibility needed to use autoNumeric to its maximum potential
- More than 30 [options](#options) allows you to customize the output format

With that said, autoNumeric supports most International numeric formats and currencies including those used in Europe, Asia, and North and South America.

****

## Getting started

### Installation
You can install autoNumeric with your preferred dependency manager:
```bash
# with `yarn` :
yarn add autonumeric
# or with `npm` :
npm install autonumeric
```

### How to use?
Simply include jQuery and autoNumeric (in that order) in your html `<header>` tag.<br>No other file or library are required.

```html
<script src="jquery.min.js" type="text/javascript"></script>
<script src="autoNumeric.min.js" type="text/javascript"></script>
<!-- You may also directly use a CDN :-->
<script src="https://cdn.jsdelivr.net/autonumeric/2.0.0/autoNumeric.min.js"></script>
```

Initialize autoNumeric with or without options :

```js
// autoNumeric with the defaults options
$(selector).autoNumeric('init');

// autoNumeric with specific options being passed
$(selector).autoNumeric('init', { options }); 

// autoNumeric with pre-defined language options being passed
$(selector).autoNumeric('init', $.fn.autoNumeric.lang.French);
```
*(See the available language list [here](#predefined-language-options))*

You're done!

### On which elements can it be used?
Here are the following supported input types:
- `text`,
- `tel`,
- `hidden`, or
- no type specified at all

```html
<input type='text' value="1234.56">
<input type='tel' value="1234.56">
<input type='hidden' value="1234.56">
<input value="1234.56">
```

Note : the `number` type is **not** supported simply because autoNumeric formats numbers as strings (ie. `'123.456.789,00 &#8364;'`) that this input type does not allow.

## Options
Multiple options allow you to customize precisely how a form input will format your inputs as you type :

| Option           | Description | Default Value |
| :---------------- | :-----------:  | :-----------:  |
| `allowDecimalPadding`| Allow padding the decimal places with zeros | `true` |
| `currencySymbol` | Currency symbol | `''` |
| `currencySymbolPlacement` | Placement of the currency sign, relative to the number (as a prefix or a suffix) | `'p'` |
| `decimalCharacter` | Decimal separator character | `'.'` |
| `decimalCharacterAlternative` | Allow to declare alternative decimal separator which is automatically replaced by the *real* decimal character (useful in countries where the keyboard numeric pad have a period as the decimal character) | `null` |
| `decimalPlacesOverride` | Maximum number of decimal places (used to override decimal places set by the minimumValue & maximumValue values) | `null` |
| `decimalPlacesShownOnFocus`| Expanded decimal places visible when input has focus | `null` |
| `defaultValueOverride`| Helper option for the ASP.NET-specific postback issue | `null` |
| `digitalGroupSpacing` | Digital grouping for the thousand separator | `'3'` |
| `digitGroupSeparator` | Thousand separator character  | `','` |
| `emptyInputBehavior`| Define what to display when the input value is empty (possible options are `focus`, `press`, `always` and `zero`) | `'focus'` |
| `failOnUnknownOption `| This option is the 'strict mode' (aka 'debug' mode), which allows autoNumeric to strictly analyse the options passed, and fails if an unknown options is used in the settings object. | `false` |
| `formatOnPageLoad`| Determine if the default value will be formatted on initialization | `true` |
| `leadingZero`| Controls the leading zero behavior (possible options are `allow`, `deny` and `keep`) | `'deny'` |
| `maximumValue` | Maximum possible value | `'9999999999999.99'` |
| `minimumValue` | Minimum possible value | `'-9999999999999.99'` |
| `negativeBracketsTypeOnBlur`| Adds brackets `[]`, parenthesis `()`, curly braces `{}` or `<>` on negative values when unfocused | `null` |
| `negativePositiveSignPlacement` | Placement of negative/positive sign relative to the currency symbol (possible options are `l` (left), `r` (right), `p` (prefix) and `s` (suffix)) | `null` |
| `noSeparatorOnFocus` | Remove the thousand separator, currency symbol and suffix on focus | `false` |
| `onInvalidPaste`| Manage how autoNumeric react when the user tries to paste an invalid number (possible options are `error`, `ignore`, `clamp`, `truncate` or `replace`) | `'error'` |
| `outputFormat`| Defines the localized output format of the `get`, `getString` & `getArray` methods | `null` |
| `overrideMinMaxLimits` | Override minimum and maximum limits (possible options are `ceiling`, `floor` and `ignore`) | `null` |
| `roundingMethod`| Method used for rounding (possible options are `S`, `A`, `s`, `a`, `B`, `U`, `D`, `C`, `F`, `N05`, `U05` or `D05`) | `'S'` |
| `saveValueToSessionStorage`| Allow the `decimalPlacesShownOnFocus` value to be saved into session storage | `false` |
| `scaleDecimalPlaces`| The number of decimal places when unfocused | `null` |
| `scaleDivisor`| This option decides the onfocus value and places the result in the input on focusout | `null` |
| `scaleSymbol`| Symbol placed as a suffix when unfocused | `null` |
| `selectNumberOnly`| Determine if the select all keyboard command will select the complete input text, or only the input numeric value | `false` |
| `showPositiveSign` | Allow the positive sign symbol `+` to be displayed for positive numbers | `false` |
| `showWarnings`| Defines if warnings should be shown | `true` |
| `suffixText` | Additional text suffix that is added after the number | `''` |
| `unformatOnSubmit`| Removes formatting on submit event | `false` |


For more detail on how to use each options, please take a look at the detailed comments in the source code for the `defaultSettings` object.

#### Predefined language options
Sometime you do not want to have to configure every single aspect of your format, specially if it's a common one.<br>Hence, we provide multiple default options for the most common currencies.

You can use those pre-defined language option like so :
```js
// ES6 way
$(selector).autoNumeric('init', an.getLanguages().French);

// jQuery way
$(selector).autoNumeric('init', $.fn.autoNumeric.lang.French);
```

Currently, the predefined options are :

| | Option name |
| :---------------- | :---------------- |
| :fr: | `French` |
| :es: | `Spanish` |
| :us: | `NorthAmerican` |
| :uk: | `British` |
| <span>&#x1f1e8;&#x1f1ed;</span> | `Swiss` |
| :jp: | `Japanese` |
| :cn: | `Chinese` |

If you feel a common currency option is missing, please create a pull request and we'll add it!

## Methods
autoNumeric provides numerous methods to access and modify the input value, formatted or unformatted, at any point in time.
<br>It does so by either providing access to those methods via the jQuery [wrapper](#jquery-plugin-calls), or directly via the autoNumeric [ES6 module](#es6-module-calls).

#### jQuery plugin calls
| Method           | Description | Call example |
| :----------------: | :-----------:  | :-----------:  |
| `init` | Initialize autoNumeric and attach the settings (options can be passed as a parameter). **This must be run before other methods can be called.**  | `$(someSelector).autoNumeric('init', {options});` |
| `autoFormat` | cf. ES6 Module calls | `$(someSelector).autoFormat('1234.56', {options});` |
| `autoUnFormat` | cf. ES6 Module calls | `$(someSelector).autoUnFormat('1.234,56 €', {options});` |
| `autoValidate` | cf. ES6 Module calls | `$(someSelector).autoValidate({options});` |
| `defaults` | Return the default autoNumeric settings | `$.fn.autoNumeric.defaults` |
| `destroy` | Stop and remove autoNumeric for the current element | `$(someSelector).autoNumeric("destroy");` |
| `get` | Return the unformatted value as a string | `$(someSelector).autoNumeric('get');` |
| `getArray` | Serialize the whole form input array into an Array | `$(someSelector).autoNumeric('getArray');` |
| `getFormatted` | Return the current formatted value | `$(someSelector).autoNumeric('getFormatted');` |
| `getLocalized` | Returns the unformatted value, but following the `outputFormat` setting | `$(someSelector).autoNumeric('getLocalized');`  |
| `getNumber` | Return the input unformatted value as a real Javascript number | `$(someSelector).autoNumeric('getNumber');` |
| `getString` | Serialize the whole form input array into a String | `$(someSelector).autoNumeric('getString');` |
| `lang` | Return all the predefined language options in one object | `$.fn.autoNumeric.lang` |
| `reSet` | Re-format inputs (handy right after form submission) | `$(someSelector).autoNumeric('reSet');` |
| `set` | Set the value given as a parameter, and formats it | `$(someSelector).autoNumeric('set', '12345.67');` |
| `unSet` | Unformat inputs (handy right before form submission) | `$(someSelector).autoNumeric('unSet');` |
| `update` | Updates the autoNumeric settings, which reformat the input on-the-fly | `$(someSelector).autoNumeric("update", {options});` |
| `wipe` | Clear the value from sessionStorage (or cookie, depending on browser supports) | `$(someSelector).autoNumeric("wipe");` |

#### ES6 Module calls
First you need to get a reference to the autoNumeric object that you need to import:
```js
import an from 'lib/autoNumeric.js';
```
Then you'll be able to use that object static methods:

| Method           | Description | Call example |
| :---------------- | :-----------:  | :-----------:  |
| `areSettingsValid` | Return true in the settings are valid | `an.areSettingsValid({options})` |
| `format` | Format the given value without needing to initialize an autoNumeric input first | `an.format('1234.56', {options})` |
| `getDefaultConfig` | Return the default autoNumeric settings | `an.getDefaultConfig()` |
| `getLanguages` | Return all the predefined language options in one object | `an.getLanguages()` |
| `unFormat` | Unformat the given value without needing to initialize an autoNumeric input first | `an.unFormat('1.234,56 €', {options})` |
| `validate` | Check if the given option object is valid, and that each option is valid as well. This throws an error if it's not. | `an.validate({options})` |

*Work is ongoing to export all the current jQuery-only methods into the ES6 module.*

## Questions
For questions and support please use the [Gitter chat room](https://gitter.im/autoNumeric/Lobby) or IRC on Freenode #autoNumeric.<br>The issue list of this repository is **exclusively** for bug reports and feature requests.

****

## How to contribute?
Contributors and pull requests are welcome.<br>Feel free to [contact](#questions) us for any questions.

### Get the latest source
```sh
git clone -b next https://github.com/autoNumeric/autoNumeric.git
# or the following if you are authentified on github :
# `git clone -b next git@github.com:autoNumeric/autoNumeric.git`
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

##### How to test?
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

##### How to lint?
Linting allow us to keep a coherent code style in all the source files.<br>In order to check that everything is well formatted, run [eslint](http://eslint.org/) with :
```sh
yarn lint
```
If any errors are shown, you can try to automatically correct them by running :
```sh
# Use the path of the faulty file there :
./node_modules/eslint/bin/eslint.js --fix src/autoNumeric.js
```

#### How to push?
Every changes that you pushed in its own branch in your personal autoNumeric copy should be based on the latest version of the `next` branch.

When you create a pull request, make sure to push against the `next` branch.

Your commit must not contain any generated files (ie. files in the `/dist/` directory or logs).<br>
*Note: Generated `dist` files (ie. `autoNumeric.js` and `autoNumeric.min.js`) are built and force-added to the git repository only once for each official release on `master`.*

### Dependencies
Currently, autoNumeric depends on jQuery (which is pretty logical since it's a jQuery plugin ;P).<br>
Some work is [in progress](https://github.com/autoNumeric/autoNumeric/issues/244) to provide a jQuery-free version of autoNumeric.

## Older versions
The previous stable autoNumeric version v1.9.46 can be found [here](https://github.com/autoNumeric/autoNumeric/releases/tag/1.9.46).

## Related projects
For integration into [Rails](http://rubyonrails.org/) projects, you can use the [autonumeric-rails](https://github.com/randoum/autonumeric-rails) project.

## Documentation
A more detailed documentation can be found in the [Documentation](Documentation.md) file.<br>
For more examples and an option code generator (that may be outdated), take a look [here](http://www.decorplanit.com/plugin/).

## Licence
autoNumeric is an [MIT](http://opensource.org/licenses/MIT)-licensed open source project, and its authors are credited in [AUTHORS.md](https://github.com/autoNumeric/autoNumeric/blob/master/AUTHORS.md).

****

Feel free to donate via Paypal [![Donate][paypal-image]][paypal-url] or [Patreon](https://www.patreon.com/user?u=4810062) to support autoNumeric development.


[downloads-image]: http://img.shields.io/npm/dm/autonumeric.svg
[downloads-url]: http://badge.fury.io/js/autonumeric
[gitter-image]: https://img.shields.io/badge/gitter-autonumeric%2Flobby-brightgreen.svg
[gitter-url]: https://gitter.im/autonumeric/lobby
[gitter-image]: https://img.shields.io/badge/gitter-autoNumeric%2FautoNumeric-brightgreen.svg
[gitter-url]: https://gitter.im/autoNumeric/autoNumeric
[npm-image]: https://img.shields.io/npm/v/autonumeric.svg
[npm-url]: https://npmjs.org/package/autonumeric
[nodei-image]: https://nodei.co/npm/autonumeric.png?downloads=true&downloadRank=true&stars=true
[nodei-url]: https://nodei.co/npm/autonumeric
[travis-url]: https://travis-ci.org/autoNumeric/autoNumeric
[travis-image]: https://img.shields.io/travis/autoNumeric/autoNumeric.svg
[snyk-image]: https://snyk.io/test/github/autoNumeric/autoNumeric/badge.svg
[snyk-url]: https://snyk.io/test/github/autoNumeric/autoNumeric
[coveralls-image]: https://coveralls.io/repos/github/autoNumeric/autoNumeric/badge.svg?branch=next
[coveralls-url]: https://coveralls.io/github/autoNumeric/autoNumeric?branch=next
[paypal-image]: http://img.shields.io/badge/paypal-donate-brightgreen.svg
[paypal-url]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NCW5699RY8NN2
[patreon-url]: https://www.patreon.com/user?u=4810062
