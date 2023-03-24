## Changelog for autoNumeric

### 4.8.0
+ Adds #709 Feature request: Disallow toggling the negative/positive sign with '+' and '-' keypress
  + This adds a new option `negativePositiveSignBehavior` for the managing the '-' and '+' key behavior
  + Setting `negativePositiveSignBehavior` to `true` will allow the toggling, while setting it to `false` will disable it; this means that when hitting the '-' key, the value will always be set to its negative value, and hitting the '+' key will always set the element to its positive value (given the minimum and maximum value allows this)
  + Do note that the default behavior is changed in this version, where toggling between the positive and negative value with the '-' or '+' keys is not activated by default. If you want to use the previous behavior, please set `negativePositiveSignBehavior: AutoNumeric.options.negativePositiveSignBehavior.toggle` in your options' configuration.
+ Updates the existing end-to-end tests that relied on the toggle behavior  
+ Fixes the incorrect error message when setting an invalid `positiveSignCharacter` option 
+ Attempts to fix the 'node: 18' error from Travis CI 

### 4.7.0
+ Fixes #719 Feature request: Up and down arrow keys behavior matching standard number input
+ Adds 2 new options to control how the up and down arrow keys behave: `modifyValueOnUpDownArrow` and `upDownStep`

### 4.6.3
+ Fixes #721 AutoNumeric.set() breaks internal state when string-value has leading or trailing whitespace
+ Fixes all the remaining end-to-end tests with the latest Webdriver.io version
+ Removes the remnants of PhantomJS hacks (#384)
+ Updates the Travis CI configuration
+ Fixes the caret positioning in some specific cases
+ Fixes the lint issues in the wdio config file
+ Fixes the webpack production config to correctly generate gzipped dist files

### 4.6.2
+ Fixes issue #757 Converted scientific numbers returns NaN when using `formArrayNumericString()`
+ Fixes warning messages in the IDE

### 4.6.1
+ Updates all the dependencies
+ Removes the PhantomJS dependency in favor of Puppeteer
+ Fixes and cleans the Karma configuration files to support v6.4.1
+ Fixes and cleans the Webpack configuration files to support v5.75.0
+ Fixes the failing unit tests on the `validate()` function for the `allowDecimalPadding` option
+ Updates the Webdriverio configuration to v8
+ Updates the Webdriver end-to-end tests to v8, i.e. removing the `@wdio/sync` package in favor of using async/await everywhere, and updating all the `keys()` calls to use the Webdriver `Key` object, and arrays of individual characters
+ Adds unit tests for feature request #741
+ Completes the `validate()` function with additional tests for the new `allowDecimalPadding` option as a number
+ Fixes #761 Undo and redo actions are done twice, on Z and Control KeyUp events
+ Fixes missing variable update in #739 (`this.onGoingRedo`)
+ Fixes the warning message when a faulty `styleRules` callback is passed as a parameter
+ Fixes typos and grammar in comments
+ Fixes #734 Fire change event onBlur only if number is changed (#735)
+ Fixes #753 Correct invalid JS imports
+ Fixes #758 Adding missing predefined options to typescript interface file
+ Update the readme with the new documentation website
+ Fixes #739 Add CTRL+Y shortcut for redo
+ Fixes the currency symbol for Brazilian real
+ Fixes #697 Currency can be deleted (#725)
+ Updates the README related to PR #742
+ Fixes #741 + Ability to set a numeric allowDecimalPadding (#742)
+ Adds default export to modules (#747)
+ Fixes #737 Undo/redo not firing input event
+ Fixes #684 Caret always set far right when deleting or inserting numbers using $ (#716)
+ Fixes unit tests following the changes in `v4.6.0`

### 4.6.0
+ Adds a new option `invalidClass`, which default to `an-invalid`, that defines the CSS class name to use when a contenteditable-enabled element value is invalid
+ Adds a new option value `'invalid'` for the `overrideMinMaxLimits` option, that will allow users to enter out-of-bound numbers
+ Fixes #543 Allow users to enter out-of-bound numbers, outside of the `minimumValue` and `maximumValue` range
  + This allows users to type temporary invalid numbers when the `minimumValue` is superior to `0`, or the `maximumValue` is inferior to `0`
  + While in this out-of-bound state, the element validity status is set to `invalid`
  + Users can then target the CSS `:invalid` and/or `:valid` state as they wish to display a visual feedback as needed
  + Do note that contenteditable-enabled elements cannot have a validity state set, so AutoNumeric instead sets by default the `an-invalid` CSS class on such 'invalid' elements
  + Whenever the user type an invalid number (out of range), the new `'autoNumeric:invalidValue'` event is sent. When the value is corrected, the new `'autoNumeric:correctedValue'` event is sent.
    + Beware; To reduce complexity, the `'autoNumeric:invalidValue'` event as well as the `'autoNumeric:minExceeded'` or `'autoNumeric:maxExceeded'` events are now sent up to three times for a single input; on keypress, keyup and blur
+ From now on, whenever the user sets a `minimumValue` higher than `0`, or a `maximumValue` lower than `0`, a warning will be displayed in the console telling him to perhaps use the `overrideMinMaxLimits` `invalid` option. For information, the `overrideMinMaxLimits` `doNotOverride` is still the default behavior.
+ Simplify the min and max range tests with the new private `_isWithinRangeWithOverrideOption()` function
+ Fixes the bug where you could always clear the input even if the limit were preventing you to do so (the last valid value was then set back on blur). Now AutoNumeric correctly prevents you to clear the input if the resulting value is out-of-bound.
+ Fixes #676 36 errors in index.d.ts when using with typescript
  + TypeScript users should now remove the `declare module 'autonumeric';` line from their script (cf. PR #677)
+ Removes node 6 from the CI tests (cf. PR #678)
+ Fixes the detection of wheel events when using a touchpad/trackball (cf. PR #672)

### 4.5.13
+ Fixes #675 The caret position is wrongly positioned when setting the raw value to zero on numbers with a prefix currency symbol (The bug was introduced in `v4.5.9` with the fix for #647)

### 4.5.12
+ Synchronizes the AutoNumeric version with the published npm one

### 4.5.11
+ Adds a typescript definitions file to the library
+ Fixes some errors in the typescript definitions file and fixes the indentation

### 4.5.10
+ Fixes #656 Input value will undo on focusout when using only Ctrl+Backspace

### 4.5.9
+ Fixes #647 Caret position is incorrectly set when the `currencySymbol` in prefix position contains the first value entered *(ie. a numeric value)*

### 4.5.8
+ Fixes #652 On initialization, `allowDecimalPadding` option `'floats'` does not hide the decimal zeroes if set in the html attribute

### 4.5.7
+ Fixes #621 The `autoNumeric:formatted` event should be triggered when the input field is cleared while continuously pressing the `Backspace` or `Delete` keys *(for real this time, see `v4.5.2`)*

### 4.5.6
+ Fix #602 Numpad decimal separator does not work on IE11 with a keyboard whose numpad decimal key outputs a comma
+ Adds a reference for the Angular 4+ implementation `ng-angular` component in the README

### 4.5.5
+ Update the dev dependencies, fix the unit and end-to-end tests  
+ Update the Babel version and fix the related configuration files
+ Update the Karma version and fix the related configuration files
+ Update the Webdriver.io version and fix the related configuration files
+ Update the Webpack version and fix the related configuration files

### 4.5.4
+ Fixes #626 Missing the `\u0092` digit group separator

### 4.5.3
+ Fixes #622 `freezeOptions()` can create issues in some browsers

### 4.5.2
+ Fixes #621 The `autoNumeric:formatted` event should be triggered when the input field is cleared while continuously pressing the `Backspace` or `Delete`keys

### 4.5.1
+ Fixes #611 The html `readonly` attribute is ignored on initial load
+ Fix how readonly and disabled inputs should not process keyboard events
+ Fix the formula mode so that the custom decimal character set with `decimalCharacter` is used instead of the default `'.'` character when writing float numbers

### 4.5.0
+ Closes #542 Allow basic calculations when entering expressions like `=12*78`
  + Introduces the *formula mode* which allows a user to enter a math expression in the element using the `=` key, then evaluate it with the `Enter` one
  + Adds the `formulaMode` option, set to `false` by default, that controls if the *formula mode* is enabled
+ Adds the `Lexer`, `Parser`, `Evaluator`, `ASTNode` and `Token` classes for managing math expressions
+ Fixes #612 Dist files contain eval
  + The webpack `devtool` option for the `development` configuration has been changed from `cheap-module-eval-source-map` to `cheap-source-map`;
    This removes any `eval()` from the generated `dist/autoNumeric.js` file, and makes the source maps works in all cases in the browsers
+ Merge the changes from `4.4.1` while making sure there is no regression with #609; this adds the `browser` field alongside the `main` one in `package.json`
  + Note: The `browser` option points to the minified library `dist/autoNumeric.min.js`
+ Update the `index.html` test file to use the un-minified `development` library `dist/autoNumeric.js`
  This allows to *temporarily* use forbidden functions like `console` or wrong formatting while debugging, using `yarn build:dev`
+ Fixes a call to `_reformatAltHovered()` even when the `unformatOnHover` option was set to `false`

### 4.4.3
+ Fixes #598 The `unformatOnHover` config value isn't used when set to `false`

### 4.4.2
+ Fixes #609 Uncaught Error: Cannot find module 'autonumeric' on v4.4.1
+ Reverts the changes from `4.4.1` : "Modify the `package.json` configuration `main` field to `browser`"

### 4.4.1
+ Modify the `package.json` configuration `main` field to `browser`
  + This is useful per npm's documentation when the module is using browser-specific features like the `window` object

### 4.4.0
+ Closes #476 Add a feature where `emptyInputBehavior` could be set to the minimum or maximum value
  + `emptyInputBehavior` now accepts either a number (or a string representing a number), or the `'min'` or `'max'` option
+ Fix the `emptyInputBehavior` validation test when checking the value limits
+ Fixes #579 Allow `emptyInputBehavior` to be set to min, max, or a number

### 4.3.7
+ Fixes #594 Currency at wrong position for empty fields with euro/french preset after typing minus sign
+ Fixes #565 Entering a single minus character in a `negativeBracketsTypeOnBlur` input invert the currency sign and that minus sign

### 4.3.6
+ Fixes #219 'Bug on form reset' that was re-opened
+ AutoNumeric now listens to the `reset` event on the parent form, and react accordingly if detected 

### 4.3.5
+ Really fixes issue #596 this time

### 4.3.4
+ Fixes #596 Change event not firing depending on cursor movement

### 4.3.3
+ Fixes #593 Pasting a negative value over a negative value that as a currency symbol and its numbers selected throws an error
+ Refactor the `_onPaste()` handler by removing duplicated parts
+ Fix the initialization call `new AutoNumeric()` where using as arguments a `string` (element selector), a `number` (initial value) and an `array` (array of options), in that particular order, would not be recognized

### 4.3.2
+ Fixes #589 The `percentageUS*` predefined options do not have the `rawValueDivisor` option set

### 4.3.1
+ Modify the `tenTrillions` and `oneBillion` limits to be exact
+ Remove the `maximumValue` and `minimumValue` `tenTrillionsNoDecimals` option, and update `tenTrillions` so that it equals ten trillions
+ The `tenTrillions` sub-option is now equal to `'10000000000000'`, and the `oneBillion` sub-option is now equal to `'1000000000'`
+ This change was long overdue since we modified in `v4.0.0-beta.22` how the number of decimal places was defined by the user using the `decimalPlaces` options instead of adding a specific number of decimal to the min/max values.

### 4.3.0
+ Fixes #559 Allow AutoNumeric to accept the decimal character input even when there is already one in the element
  + Add the new `alwaysAllowDecimalCharacter` option set to `false` by default
+ Fixes AutoNumeric so that elements now correctly accepts entering a decimal char on the far left of a negative number

### 4.2.15
+ Fixes #585 Internet Explorer 11 throws when freezing the options

### 4.2.14
+ Fixes #526 Memory / speed improvement in options
+ Fixes #583 AutoNumeric `v4.2.13` forces the contenteditable attribute to `true` when set on the html source
+ Fixes #584 Event listeners are not set/reset on option updates

### 4.2.13
+ Fixes #580 Allow non-input tags with the `readOnly` option to set the `contenteditable` attribute to `false`
+ Fix the `readonly` and `contenteditable` attributes so that they can be updated to read/write mode
+ Modify `_setReadOnly()` so that it *always* sets the element to read-only mode
+ Create a new `_setReadWrite()` function that sets the element to read-write mode
+ Create a new `_setWritePermissions()` function that sets the element read only/write mode according to the `readOnly` setting
+ Fix the urls to autonumeric.org in the readme

### 4.2.12
+ Fixes #574 The fractional part is converted to an integer if the part on the cursor left-hand side is equal to 0

### 4.2.11
+ Fixes #570 The minified version of AutoNumeric does not expose some of its static functions (ie. `AutoNumeric.getNumber()`)
  + Removing the standard `Function.name` feature fixes the bug in IE now. In the near future IE users will need to require a polyfill for this.
+ Reduce the size of the generated library by tuning the UglifyJs options
+ Fix the end-to-end tests so that they are run against AutoNumeric's minified version 

### 4.2.10
+ Fix various bugs regarding the incorrect static and instantiated function calls
+ Fix the polyfill so that `Array.from()` is correctly 'polyfilled' even if the `CustomEvent` object already exists
+ Fix the `CustomEvent` polyfill
+ Merges PR #572 Use `AutoNumericHelper.contains()` instead of `String.includes()` for the time being
+ Update the dev dependencies
+ Update the babel preset from `latest` to `env`

### 4.2.9
+ Fixes #568 Using brackets for negative numbers in AutoNumeric.format returns "undefined"

### 4.2.8
+ Fixes #566 Add the Turkish predefined currency

### 4.2.7
+ Fixes #521 The `input` event is not fired on `paste` if the element is empty or is completely selected beforehand
+ Fixes #563 The `import AutoNumeric from 'AutoNumeric'` line in the readme does not work on case sensitive OS (like Linux)

### 4.2.6
+ Fixes #561 Webpack bundles the already compiled library when imported in another project

### 4.2.5
+ Fix issue #550 The `change` event is sent twice on change
+ Fix the bug when an input with the `negativeBracketsTypeOnBlur` options was focused then blurred, it would dispatch a `change` event.

### 4.2.4
+ Fix issue #558 Switch the webpack 4

### 4.2.3
+ Fix issue #556 Modify the `update()` function so that it can accept an array of options

### 4.2.2
+ Fix issue #555 The `update()` function does not accept predefined option names (ie. `'euro'`)

### 4.2.1
+ Fix issue #553 Missing support for very small or very big numbers displayed by Javascript as scientific numbers
  + This adds support for using scientific notation for setting the input value (ie. `aNInput.set('6.1349392e-13');`, `<input value="7342.561e40">`)

### 4.2.0
+ Fix issue #535 Prevent entering any decimal character when only positive numbers are accepted
+ Change how the decimal character can be entered:
  + Before, the comma `','` and dot `'.'` where always accepted
  + Now, only the characters defined in `decimalCharacter` and `decimalCharacterAlternative` are accepted

### 4.1.3
+ Fix the `.travis.yml` file so that the `dist` file are built on the CI server

### 4.1.2
+ Fix the `.npmignore` file so that the npm autonumeric package can be installed

### 4.1.1
+ Fix issue #554 Automatize the build and publishing process of releases with Travis CI
+ Remove the generated files from the git repository
  + Instead of polluting the repo with the `dist/*` files that can be generated using `yarn build`, those files are now generated and published to npm automatically when tagging a commit.

### 4.1.0
+ Release `v4.1.0`

The highlights of this version are:
+ New features
  + AutoNumeric static functions can now be used in web workers (#494)
  + Add the new `valuesToStrings` option to allow displaying a pre-defined string depending on the `rawValue` (#450)
  + Allow the positive & negative signs to be specified via the two options `positiveSignCharacter` and `negativeSignCharacter` (#478)
  + Add more details to the `'autoNumeric:formatted'` event payload (#485)
  + Add a new event hook `autoNumeric:rawValueModified` that will be sent only when the `rawValue` is modified (#488)
  + Add a new custom AutoNumeric event `'autoNumeric:initialized'` sent as soon as an AutoNumeric element is initialized
  + Add the static `set` and `get*` functions that will allow setting the given DOM element on getting its value without having a reference to its AutoNumeric object (#515)
  + Add support for watching external changes when setting the input `value` directly with Javascript without using the `set()` method (Note: watching the external changes from `textContent` is not yet supported) (#513)
  + Add the new option `watchExternalChanges` (set to `false` by default) that defines if the AutoNumeric object should watch and react to external changes (not made via `.set()`)
  + Add the new option `wheelOn` that defines when we should be listening to the `wheel` event, either on 'hover' or on 'focus' (#456)
+ Changes
  + Change the `modifyValueOnWheel` default behaviour to act only when the element is focused. If you want to be able to use the mouse wheel on a non-focused AutoNumeric element, you'll now need to press the `Shift` key while doing so. You can change that behavior back like it was before by setting the new option `wheelOn` to `hover` (#456)
  + Allow changing the `bubble` and `cancelable` attributes of events sent by AutoNumeric. This adds two new options `eventBubbles` and `eventIsCancelable` that defaults to `true` to manage those event attributes (#524)
  + Modify the static `getAutoNumericElement()`, `test()` and `isManagedByAutoNumeric()` functions so that they accept either a DOM element or a selector string (#514)
  + When the `rawValue` is allowed to be `null` and is effectively `null`, the min/max limits are now ignored
  + Form serialization now outputs the empty string `''` on empty inputs, instead of `0` or `0.00` (#512)
+ Improvements
  + Switch to Webpack 3.* for leaner bundle creations (#438)
  + Migration to eslint 4.* for a cleaner codebase (#475)
  + The `decimalCharacterAlternative` now correctly ignores the 'comma' or 'dot' when set to `none` (#432)
  + Unit test now use the `mocha` profile as default instead of `progress`
+ Fixes
  + Coverage information is back (#490)
  + Workaround a geckodriver bug when trying to input an hyphen (#480)
  + Fix lots of pasting issues (#481, #482, #483, #484, #505, #510, #547)
  + Create workarounds (*hacks* really) for various IE-related bugs (#495, #516, #518)
  + `AutoNumeric.multiple()` now correctly add only one event listener to the parent form, if any (#457)
  + The `input` event is not fired on mouse wheel (#525)
  + Prevent using the `wheel` event on `disabled` input elements
  + The value of a read-only field can be changed with a scroll input (#541)
  + Cut text reappears when leaving the field (#527)
  + Input is duplicated and reversed on devices with Android < 7.0 using Android Chrome (#522)
  + Formatted numbers on Android Chrome do not get deleted on blur anymore

...and [more](https://github.com/autoNumeric/autoNumeric/projects/2).

### 4.1.0-beta.28
+ Fix issue #477 Modifying an input by selecting all its content and entering `0` drop the current selection, if 0 is out of the limit boundaries

### 4.1.0-beta.27
+ Fix issue #432 The `decimalCharacterAlternative` option does not ignore the comma when it's set to `none`

### 4.1.0-beta.26
+ Fix issue #522 Input is duplicated and reversed on devices with Android < 7.0
+ Remove the `input` event listener
+ Refactor parts of the `_stripAllNonNumberCharacters` and `_convertToNumericString()` functions by creating a `_normalizeCurrencySuffixAndNegativeSignCharacters()` function
+ Rename `_stripAllNonNumberCharacters()` to `_stripAllNonNumberCharactersExceptCustomDecimalChar()`
+ Create a `_stripAllNonNumberCharacters()` function that also normalize the decimal character
+ Remove the obsolete `skipFirstAutoStrip` and `skipLastAutoStrip` regex
+ Prevent the conversion of the `decimalCharacterAlternative` into the `decimalCharacter` when stripping the value
+ Simplify `_addBrackets()` and `_setBrackets()`
+ Simplify the `_removeBrackets()` calls
+ Fix `_convertToNumericString()` so that it normalize the positive sign and remove the brackets if any
+ Fix the bug where the formatted numbers on Android Chrome gets deleted on blur
+ Simplify the generated cached regex
+ Refactor `_processCharacterDeletionIfTrailingNegativeSign()` so `contains()` is called only once

### 4.1.0-beta.25
+ Add a new custom AutoNumeric event `'autoNumeric:initialized'` sent as soon as an AutoNumeric element is initialized

### 4.1.0-beta.24
+ Fix issue #527 Cut text reappears when leaving the field

### 4.1.0-beta.23
+ Fix issue #547 Newer version of Firefox breaks pasting in `contenteditable` elements
+ Fix issue #510 Pasting values in a `disabled` element should not be possible
+ Also prevent using the `wheel` event on `disabled` input elements.

### 4.1.0-beta.22
+ Fix issue #525 The `input` event is not fired on mouse wheel

### 4.1.0-beta.21
+ Fix issue #541 The value of a read-only field can be changed with a scroll input

### 4.1.0-beta.20
+ Fix issue #489 `valuesToStrings` is ignored when using the static `format()` and `unformat()` functions

### 4.1.0-beta.19
+ Add an option `watchExternalChanges` to react to external changes
  By default, an AutoNumeric element only format the value set with the `.set()` function.
  If you want the element to watch and format value set by third party script using the `aNElement.node().value = 42` notation, then you need to set the `watchExternalChanges` option to `true`.

### 4.1.0-beta.18
+ Fix issue #524 Allow changing the `bubble` and `cancelable` attributes of events sent by AutoNumeric
+ Add two new options `eventBubbles` and `eventIsCancelable` that defaults to `true` to manage the event attributes.

### 4.1.0-beta.17
+ Fix issue #457 Using `AutoNumeric.multiple()` generate many `submit` event listeners on the parent `form`
+ Fix the `drop` event handler removal that was omitted.
+ Add a global `aNFormHandlerMap` Map on the `window` object, that keep track of all `submit` event handler for each `<form>` element that has at least one AutoNumeric-managed element child.

### 4.1.0-beta.16
+ Fix issue #456 Change the `modifyValueOnWheel` default behaviour to act only when the element is focused
+ Add a new `wheelOn` option that will define when the `wheel` event will increment/decrement the element value.
  By default the `wheel` event is only used when the element is focused (`wheelOn` is set to `'focus'`), but you can also use the `'hover'` option if you want to keep the previous behavior.
  Note: There is a small caveat since the `Shift + mouse wheel event` is reserved by browsers for horizontal scrolling, using the `Shift` key and the `wheelOn` option set to `'hover'` will only scroll the page while the mouse *is hovered* over the AutoNumeric-managed element. Once it's out of the way, the page won't scroll since you'll be holding the `Shift` key. You'll then be able to scroll the page normally without having to hold that `Shift` key.

### 4.1.0-beta.15
+ Fix issue #513 Setting the input `value` directly with Javascript without using the `set()` method is not supported
  From now on, if an external change is detected when a script modify the input `value` attribute directly, AutoNumeric tries to format the new value.
  Note: watching the external changes to `textContent` is not supported yet.
+ Fix `_onFocusInAndMouseEnter()` where `setElementValue()` was called multiple times in a row
+ Fix the `AutoNumeric.events.formatted` event so that only one is sent for each user action
+ Change: The `AutoNumeric.events.formatted` event is not sent anymore when wiping an AutoNumeric object

### 4.1.0-beta.14
+ Fix issue #516 'Del' key does not work in IE browser
+ Fix issue #509 `allowDecimalPadding` set to `'floats'` when `decimalPlaces` is different from `0` output a warning

### 4.1.0-beta.13
+ Fix issue #518 'Drag-and-Drop' operation does not work in IE11

### 4.1.0-beta.12
+ Fix issue #514 Modify the static `getAutoNumericElement()`, `test()` and `isManagedByAutoNumeric()` functions so that they accept either a DOM element or a selector string
+ Fix issue #515 Add the static `set` and `get*` functions

### 4.1.0-beta.11
+ Fix issue #455 Uncaught Error: `_initialCaretPosition()` should never be called when the `caretPositionOnFocus` option is `null`
+ Fix issue #512 AutoNumeric serialized data return `0` instead of an empty value on empty inputs
  This fix changes how form serialization is done, by outputting the empty string on empty inputs, instead of `0` or `0.00`.

### 4.1.0-beta.10
+ Fix issue #502 The end-to-end tests fails on Chrome 61
+ Fix issue #505 Pasting values in a `readOnly` element should not be possible

### 4.1.0-beta.9
+ Fix issue #498 The `twoScaled` choice for the `digitalGroupSpacing` option cannot be validated
+ Convert all the end-to-end test `browser.execute()` calls so that hardcoded DOM ids are not used anymore

### 4.1.0-beta.8
+ Fix issue #496 The upgrade guide to v4 references the `decimalPlacesOverride` option without indicating it's deprecated
+ Fix issue #479 Whitespace on the left hand side of the html `value` attribute adds a zero on the formatted value on page load

### 4.1.0-beta.7
+ Fix issue #495 `AutoNumeric.multiple()` fail on IE11 on unknown `Array.from()`

### 4.1.0-beta.6
+ Fix issue #494 Allow AutoNumeric to be imported in web workers in a webpack setup

### 4.1.0-beta.5
+ Fix issue #493 When `formatOnPageLoad` option is set to `false`, neither the `rawValue` nor the element value are set

### 4.1.0-beta.4
+ Fix issue #438 Upgrade Webpack to 3.*
+ Fix issue #490 Fix the generated coverage information
+ Modify the unit test reporter to use 'mocha' instead of 'progress', in order to get more insightful reports.
+ Move the configuration files for the unit tests in the `test/unit` directory.
+ Update the dev dependencies (Babel, Babel-polyfill, Uglify, PhantomJS, Jasmine).

### 4.1.0-beta.3
+ Fix issue #485 Add more details to the `'autoNumeric:formatted'` event payload
+ Fix issue #488 Add a new event hook `autoNumeric:rawValueModified` that will be sent only when the `rawValue` is modified
 
### 4.1.0-beta.2
+ Fix issue #478 Allow the positive & negative signs to be specified via options 
+ Fix issue #480 On Firefox, the end-to-end tests fails when trying to send the minus `'-'` character.
+ Also fix the selenium tests where entering the hyphen (`'-'`) character was not correctly accepted under Firefox.
  This was due to the fact that the wrong keyCode `173` is sent instead of `189` like in all the other browsers for that character.
+ Fix issue #481 When the caret is on the far right and the negative sign too, entering `'+'` or `'-'` does not toggle the positive state, and only move the caret from one character to the left.
+ Fix issue #482 Pasting a positive value while selecting the entire content of an element that has a negative value result in an error.
+ Update the 'Options' chapter in the documentation to add some details on a few options.
+ Simplify `_checkPaste()` so that it's not processed any more times if the element has already been formatted.
+ Fix the range check so that when the `rawValue` is allowed to be `null` and is effectively `null`, the min/max limits are ignored.
+ Modify how `this.formatted` is used so it tracks if the element value has been formatted already. If that's the case, prevent further format calculations.
  This is a start and `this.formatted` usage should be reviewed in depth.
+ Fix issue #484 Pasting an invalid string into either a selection or at the caret position modify the element value.
+ Fix issue #483 Pasting a content over an element that already has the same exact content resets its value to zero.
  
### 4.1.0-beta.1
+ Fix issue #475 Migrate to eslint 4
+ Fix issue #450 Add the `valuesToStrings` option to allow displaying a pre-defined string when the `rawValue` equal a specific value

### 4.0.3
+ Fix issue #474 `AutoNumeric.format()` and `AutoNumeric.unformat()` do not accept named options

### 4.0.2
+ Fix issue #473 Static `format()` and `unformat()` functions ignores the `rawValueDivisor` option
+ Fix `AutoNumeric.unformat()` that used the number of decimal places shown on focus instead of the one for the raw value.

### 4.0.1
+ Fix issue #471 The static `format()` function does not keep the negative sign
+ Fix issue #472 The static `AutoNumeric.format()` function does not accept DOM element as its first parameter

### 4.0.0
+ Release `v4.0.0`
+ The highlights of this new version are:
  - AutoNumeric is now fully converted to an ES6 module.
  - No more jQuery dependency.
  - `AutoNumeric` is now a class. You can access the class method directly from the AutoNumeric object (ie. `const aNElement = new AutoNumeric(input, {options})); aNElement.set(123).update({options2});`).
  - The number of decimal places is now explicitly set via the `decimalPlaces` option.
  - You can now specify a different number of decimal place to show when focused and unfocused, and for the internal `rawValue`.
    If you relied on the number of decimals in `minimumValue` or `maximumValue` to define how many decimal places should be shown on the formatted value, or kept as the precision in the `rawValue`, you now need to explicitly define how many decimal places your want, whatever number of decimal places `minimumValue` and `maximumValue` have.
  - You can now 'cancel' any edits made to the element by hitting the `Escape` key. If no changes are detected, hitting `Esc` will select the element value (according to the `selectNumberOnly` option).
  - Undo/Redo are now supported.
  - You can modify the value of the element by using the mouse wheel on it, if `modifyValueOnWheel` is set. The `wheelStep` option defines the step to use.
  - An AutoNumeric object can now initialize other DOM elements with `init(domElement)`, which will then use the same options.
    The AutoNumeric-managed elements that initialized each other share a common list, allowing the user to perform a single action on many elements at once (via the `.global.*` functions, ie. `aNElement.update({options})` to update the options of all the elements, or `aNElement.set(42)` to set the same value for each elements).
    The `.global.*` functions you can use are : `set()`, `setUnformatted()`, `get()`, `getNumericString()`, `getFormatted()`, `getNumber()`, `getLocalized()`, `reformat()`, `unformat()`, `unformatLocalized()`, `update()`, `isPristine()`, `clear()`, `remove()`, `wipe()`, `nuke()`, `has()`, `addObject()`, `removeObject()`, `empty()`, `elements()`, `getList()` and `size()`.
    Managing that shared list is possible via `attach()` and `detach()`.
  - The options can now be updated one by one using the handy functions `aNElement.options.<nameOfTheOption>({newOption})`, ie. `aNElement.options.currencySymbol('€')`.
    You can also reset the options to the default ones using `aNElement.options.reset()`.
  - Lots of new options (`rawValueDivisor`, `decimalPlaces`, `decimalPlacesRawValue`, `decimalPlacesShownOnBlur`, `serializeSpaces`, `noEventListeners`, `readOnly`, `selectOnFocus`, `caretPositionOnFocus`, etc.).
  - While the AutoNumeric objects provides many methods, you can also directly use the AutoNumeric class static functions without having to instantiate an object. Those methods are `version()`, `test()`, `validate()`, `areSettingsValid()`, `getDefaultConfig()`, `getPredefinedOptions()`, `format()`, `formatAndSet()`, `unformat`. `unformatAndSet()`, `localize()`, `localizeAndSet()`, `isManagedByAutoNumeric()` and `getAutoNumericElement()`.
  - Lots of new functions (`isPristine()`, `clear()`, `nuke()`, `formatOther()` and `unformatOther()` which allows to format/unformat a numeric string or another DOM element with the current object settings, `setValue()`, etc.).
  - The `get()` function has been deprecated, in favor of more explicit `get*` methods : `getNumericString()`, `getFormatted()`, `getNumber()` and `getLocalized()`.
  - By default, `new AutoNumeric('.myClass')` will only initialize *one* element. If you want to initialize multiple DOM elements in one go, you need to use the static `AutoNumeric.multiple()` function.
   It allows to initialize numerous AutoNumeric objects (on numerous DOM elements) in one call (and possibly pass multiple values that will be mapped to each DOM element).
  - Support for the Android Chrome mobile browser (v57) (this is a work in progress though, since it's quite hard to work around its limitations).
  - Functions can now be chained (ie. `aNElement.clear().set(22).formSubmitJsonNumericString().nuke()`).
   Modify how updating the settings works ; before, all modifications to the settings were directly accepted and stored, then we immediately tried to `set()` back the current value with those new settings.
    This could lead to an object state where the object value would be out of the minimum and maximum value range, ie. we would accept the range modification, then immediately throw an error since the current value would then be out of range.
    For instance, if `minimumValue` equal `0`, `maximumValue` equal `100` and the current element value equal `50`, trying to change the `minimumValue` to `75` will fail, and the `minimumValue` will be reverted back to`0`.
    The new behavior is leaner ; if the new settings do not pass the `validate()` method or the following `set()` call fails, then the settings are reverted to the previous valid ones.
  - The `rawValueDivisor` option allows to display a formatted value different than the raw value. For instance you can display percentages like `'1.23%'`, while keeping the `rawValue` `0.0123` 'unmultiplied', if `rawValueDivisor` is set to `100`.
  
+ And also:
  - The new `selectNumber()`, `selectInteger()` and `selectDecimal()` function to select the element content as needed.
  - The DOM-specific functions to manipulate it ; `node()` (returns the DOM element managed by AutoNumeric), `parent()`, `form()` (returns the parent <form> element, if any).
  - More than 20 functions to manages html forms ; how to retrieve info from them, or submit the info (formatted, unformatted, localized).
  - Predefined options so that the user do not have to configure AutoNumeric manually.
    Those options are `dotDecimalCharCommaSeparator`, `commaDecimalCharDotSeparator`, `integer`, `integerPos`, `integerNeg`, `float`, `floatPos`, `floatNeg`, `numeric`, `numericPos`, `numericNeg`, `euro`, `euroPos`, `euroNeg`, `euroSpace`, `euroSpacePos`, `euroSpaceNeg`, `percentageEU2dec`, `percentageEU2decPos`, `percentageEU2decNeg`, `percentageEU3dec`, `percentageEU3decPos`, `percentageEU3decNeg`, `dollar`, `dollarPos`, `dollarNeg`, `percentageUS2dec`, `percentageUS2decPos`, `percentageUS2decNeg`, `percentageUS3dec`, `percentageUS3decPos` and `percentageUS3decNeg`.
  - Some language options are now shipped directly and you can use the language name as a function to activate those settings (ie. `aNElement.french()`).
  - Better support for `contenteditable` elements so that AutoNumeric is not only limited to `<input>` elements.
  - AutoNumeric send the `'autoNumeric:formatted'` event whenever it formats the element content.
  - The raw unformatted value can always be accessible with the `rawValue` attribute (ie. `aNElement.rawValue`).
  - When pressing the `Alt` key, you can hover your mouse over the AutoNumeric-managed elements to see their raw value.
  - You can prevent the mouse wheel to increment/decrement an element value by pressing the `Shift` key while using the mouse wheel.
  - Default values for each options can be easily accessed with an IDE autocompletion when using `AutoNumeric.options.|`.
  - Support for drag and dropping numbers into AutoNumeric-managed elements.
  - The `styleRules` option allows to either change the style of the current element based on the `rawValue` value, or just call any custom callbacks whenever the `rawValue` changes.
  - Allow setting the `rawValue` to `null`, either by setting it directly (ie. `aNElement.set(null)`), or by emptying the element, if `emptyInputBehavior` is set to `'null'`.
  - All `get*()` method accepts a callback function. The callback is passed the result of the `get*` functions as its first argument, and the current AutoNumeric object as its second.
  - Allow initializing an AutoNumeric element with an array of options objects or pre-defined option names (ie. `'euroPos'`).
  - Add a static `AutoNumeric.mergeOptions()` function that accepts an array of option objects and / or pre-defined option names, and return a single option object where the latter element overwrite the settings from the previous ones.
  
+ *Lots* of bug fixes and code simplification (#387, #391, #393, #397, #399, #398, #244, #396, #395, #401, #403, #408, #320, #411, #412, #413, #417, #423, #415, #418, #409, #416, #414, #427, #248, #425, #264, #250, #404, #434, #440, #442, #447, #448, #449, #454, #453, #388, #461, #452).
+ Better test coverage, both for unit tests and end-to-end tests.
+ Rewrite the documentation (README.md) to make it more 'browsable'.
+ For a more detailed changelog, you can read the changes listed from `v3.0.0-beta.1` to `v3.0.0-beta.14` and from `v4.0.0-beta.1` to `v4.0.0-beta.23`.

### 4.0.0-beta.23
+ Fix issue #453 Rename the `noSeparatorOnFocus` option to `showOnlyNumbersOnFocus`
+ Add the missing `options.historySize()` method that allows to update the `historySize` option
+ Move the raw value from `this.settings.rawValue` to `this.rawValue`. This prevent polluting the settings object.
+ Fix issue #388 autoNumeric does not work with Browserify
+ Fix issue #461 Fixed problem on Android Chrome browsers when a currency symbol is used
+ Fix issue #452 Add a new `rawValueDivisor` option to display a formatted value different than the raw value.
  This allows for instance to display percentages like `'1.23%'`, while keeping the `rawValue` `0.0123` 'unmultiplied', if `rawValueDivisor` is set to `100`.
+ Merge the `blur` event listeners into one.
+ Add the `this.isWheelEvent`, `this.isDropEvent` and `this.isEditing` attributes to track the `wheel` and `drop` events, as well as when the user is manually editing the element value.
+ Modify `_setRawValue()` to divide the `rawValue` if `rawValueDivisor` is set.
+ Fix the validation test for the `scaleDivisor` option where it did not check that it should not be equal to `0`.
+ Fix the validation test for the `allowDecimalPadding` when `decimalPlacesShownOnBlur` or `decimalPlacesShownOnFocus` is set.
+ Add a validation test for `divisorWhenUnfocused` so that it throws if it's set to `1`.
+ Modify the validation test so that setting `divisorWhenUnfocused` to `1` will throw.
+ Modify `_trimLeadingAndTrailingZeros()` so that it manages `null` values correctly (ie. it returns `null` instead of `'0'` if passed `null`).
+ Fix the error shown when blurring an input that accept a `null` value.
+ Modify the pre-defined options `percentage*` so that the `rawValueDivisor` is set to `100`.
+ Rename the `divisorWhenUnfocused` option value from `doNotActivateTheScalingOption` to `none`.
+ Fix `getNumericString()` so that it returns `null` when the `rawValue` is `null`.
+ Separate the `_calculateDecimalPlaces()` function into two `_calculateDecimalPlacesOnInit()` and `_calculateDecimalPlacesOnUpdate()`.
+ The callbacks found in the `settings` object are now run before modifying the `negativePositiveSignPlacement` option.
+ Modify how the settings are updated when the user pass the `decimalPlaces` option.
  Before, this was overriding any other `decimalPlaces*` options passed in the same object.
  Now, the `decimalPlaces` value is only used if the other `decimalPlaces*` options are not already set.
  Moreover, the `decimalPlacesRawValue` option is now overwritten by the other `decimalPlaces*` options defined in the same option object, if their values are higher.
+ Modify the behavior of the `wheelStep` 'progressive' mode so that values between ]-1;-1[ are treated specially, by allowing the wheel event to modify the decimal places. The precision used for the `step` depends on the number of decimal places used for the `rawValue`.
  Also, numbers between 1 and 9 (included) now use a step of `1`, instead of `10` like before.
+ Set the version of Webpack to `1.14.0`, instead of `latest`, in order to prevent potential incompatibility problems.

### 2.0.13
+ Merge the fix from issue #440 Pasting does not work in IE11 from `next` to `master`.
  This fix the issue #465 "Unable to get property 'getData' of undefined or null reference" on paste in IE11
+ Merge the fix from issue #449 `AutoNumeric.unformat()` only removes the first instance of `settings.digitGroupSeparator` from `next` to `master`.

### 4.0.0-beta.22
+ Fix issue #454 Rewrite how the number of decimal places for the formatted and the raw values are set
+ If you relied on the number of decimals in `minimumValue` or `maximumValue` to define how many decimal places should be shown on the formatted value, or kept as the precision in the `rawValue`, you now need to explicitly define how many decimal places your want, whatever number of decimal places `minimumValue` and `maximumValue` have.
+ To do so, you now need to define at least the `decimalPlaces` option.
+ If you want, you can also separately define `decimalPlacesRawValue`, `decimalPlacesShownOnBlur` and `decimalPlacesShownOnFocus`. For more details, read on.
+ Rename `scaleDecimalPlaces` to `decimalPlacesShownOnBlur`.
+ Rename `scaleDivisor` to `divisorWhenUnfocused`.
+ Rename `scaleSymbol` to `symbolWhenUnfocused`.
+ Rename the `decimalPlacesShownOnBlur.doNotChangeDecimalPlaces` to `decimalPlacesShownOnBlur.useDefault` to be coherent with the other `decimalPlaces*` options.
+ Remove the `decimalPlacesOverride` option in favor of explicit `decimalPlaces`, `decimalPlacesShownOnBlur` and `decimalPlacesShownOnFocus` ones.
+ Add a warning message if the old `mDec` option is used (which was the equivalent of `decimalPlacesOverride`).
+ Add a `decimalPlacesRawValue` option that define the precision the user wants to keep (in the `rawValue`).
+ Remove the need for saving `decimalPlacesOverride` to temporary change it in `set()`.
+ Create 3 different rounding functions that replace the `_roundValue()` calls: `_roundFormattedValueShownOnFocus`, `_roundFormattedValueShownOnBlur` and `_roundRawValue`. This way we are more explicit in what the code is doing.
+ Modify `_setRawValue()` so that it only save the given raw value if it's different than the current one (keeping the history table clean).
+ Use template strings instead of concatenation in `_addGroupSeparators()`, `_roundValue()` and `_prepareValueForRounding()` to prevent possible wrong typecasts.
+ Fix the error shown when hovering an input whose value has been set to `null` (a `toString()` was attempted on the `null` value in the `_roundValue()` method).
+ Fix the incoherent variable name `inputValueHasADot` in `_roundValue()` to better reflect what data it holds, ie. `inputValueHasNoDot`.
+ Fix typos in the `set()` warning messages.
+ Add a warning message when try to set a value that results in `NaN`.
+ Simplify the '_onFocusInAndMouseEnter` and `_onFocusOutAndMouseLeave` event handlers.
+ Update the tests with the new changes.
+ Modify how decimal places are set.
  Before you needed to add that many decimals to the `minimumValue` or `maximumValue`, and that maximum number of decimal place was used everywhere (except if you also defined `decimalPlacesOverride`, `decimalPlacesShownOnFocus` or `scaleDecimalPlaces`).
  Now you need to explicitly define the number of decimal places using the `decimalPlaces` option.
  If only `decimalPlaces` is defined, then the other `decimalPlaces*` options `decimalPlacesRawValue`, `decimalPlacesShownOnBlur` and `decimalPlacesShownOnFocus` are calculated from it.
  This way, you can now define clearly how many decimal places needs to be shown when focused/unfocused, and as the raw value precision.
  Note: updating the `decimalPlaces` will overwrite any `decimalPlaces*` option previously set.
+ Remove the `_maximumVMinAndVMaxDecimalLength()` since we do not set the number of decimal places this way.
+ Remove the `_correctDecimalPlacesOverrideOption()` function since `decimalPlacesOverride` is not used anymore.
+ Add a `_calculateDecimalPlaces()` static method that calculate the `decimalPlaces*` option value based on `decimalPlaces` and the `decimalPlaces*` ones.
+ Modify how updating the settings works ; before, all modifications to the settings were directly accepted and stored, then we immediately tried to `set()` back the current value with those new settings.
  This could lead to an object state where the object value would be out of the minimum and maximum value range, ie. we would accept the range modification, then immediately throw an error since the current value would then be out of range.
  For instance, if `minimumValue` equal `0`, `maximumValue` equal `100` and the current element value equal `50`, trying to change the `minimumValue` to `75` will fail, and the `minimumValue` will be reverted back to`0`.
  The new behavior is leaner ; if the new settings do not pass the `validate()` method or the following `set()` call fails, then the settings are reverted to the previous valid ones.
+ In `_setValueParts()`, set the `rawValue` and the formatted element value separately, since they can have different decimal places. For instance we could imagine keeping 3 decimal places for the `rawValue`, while only 2 is shown. I then need to make sure we keep that third decimal place information into the `rawValue`, instead of trimming it like it was done before.

### 4.0.0-beta.21
+ Set the read-only mode on the default settings, enumerations, events, options and pre-defined options objects.
+ Allow using a pre-defined option name directly when initializing an AutoNumeric element
+ Fix the initialization method to accepts arrays of options object/pre-defined options when using an initial value.
+ Fix an issue related to issue #447 when the focus out action produce an error when the input raw value is set to `null`
+ Fix a rare bug when `scaleSymbol` is a castable to a `Number`, and would be added to the formatted value, instead of concatenated.
+ Remove an unneeded temporary variable in `set()`.
+ Add more details in some JSDoc.
+ Fix `validate()` so that it throws an error early if `scaleDivisor` is wrongly set to `0`.
+ Fix `_trimLeadingAndTrailingZeros()` so that it correctly handles the `null` value.
+ Fix `_onFocusInAndMouseEnter()` so that the `decimalPlacesShownOnFocus` setting is correctly cast to a Number.
+ Fix `_onFocusOutAndMouseLeave()` so that the `null` value is correctly handle. Also fix the error message shown when the `rawValue` is not stored as a string.
+ Simplify a ternary condition into a simple `if` one.
+ Hardcode the `isFocused` state to `false` when calling `_addGroupSeparators()` in `_onFocusOutAndMouseLeave()` so that it does not rely on the order where `this.isFocused` is set back to `false`.

### 4.0.0-beta.20
+ Allow initializing an AutoNumeric element with an array of options objects or pre-defined option names.
  The latter options in the array will overwrite the previous ones.
  The array can contains either option objects, or pre-defined option names as a string (ie. `'euroPos'`).
  Both the initialization methods `new AutoNumeric()` and `AutoNumeric.multiple()` support using arrays of options.
+ Add a static `AutoNumeric.mergeOptions()` function that accepts an array of option objects and / or pre-defined option names, and return a single option object where the latter element overwrite the settings from the previous ones.
+ Allow passing an array of options objects or pre-defined option names to the static `format` and `unformat` methods.
  The latter options in the array will overwrite the previous ones.
  The array can contains either option objects, or pre-defined option names as a string (ie. `'euroPos'`).

### 4.0.0-beta.19
+ Fix issue #449 `AutoNumeric.unformat()` only removes the first instance of `settings.digitGroupSeparator`

### 4.0.0-beta.18
+ Modify the `get*` methods to allow passing them a callback function.
+ The callback is then executed on the `get*` method result, or the `global.get*` method array of result.
+ The callback is passed the result of the `get*` functions as its first argument, and the current AutoNumeric object as its second.
+ Split the `_saveValueToPersistentStorage()` method in three : `_saveValueToPersistentStorage()` to save the raw value to persistent storage, `_getValueFromPersistentStorage()` to retrieve that data, and `_removeValueFromPersistentStorage()` to delete it.
+ From now on, the `_storageTest` is only done once, and the result is kept in `this.sessionStorageAvailable`, and the storage variable name is also generated once and kept in `this.rawValueStorageName`.
+ You can now modify the raw value storage name variable prefix by modifying the `this.storageNamePrefix` attribute. Currently it defaults to `'AUTO_'`;

### 4.0.0-beta.17
+ Fix issue #447 Add a new `'null'` options to the `emptyInputBehavior` setting 
+ Add the `this.defaultRawValue` variable that store the hard-coded default raw value used during the initialization and reset.  
+ When using the option `{ emptyInputBehavior: AutoNumeric.options.emptyInputBehavior.null }`, the user can now explicitly set the AutoNumeric value to `null` (using `anElement.set(null)` for instance).
  Additionally, when this option is set, if the AutoNumeric element is emptied, then `rawValue` is set to `null`.
  Note: if the current raw value is equal to `null`, changing the `emptyInputBehavior` option to something different than `null` will update the rawValue to `''`.
  **Known limitation** : Initializing an AutoNumeric object with the `null` value is not allowed since using `null` for the initial value means that AutoNumeric needs to use the current html value instead of `null`.
+ Fix issue #448 When searching for the parent form element, the `tagName` can be undefined.
+ The `form()` method now accepts a `true` argument that will force it to discard the current parent form and search for a new one.
+ Enforce the use of `settings.showWarnings` for most calls to `AutoNumericHelper.warning()`, wherever possible.

### 4.0.0-beta.16
+ Move the options, default options and predefined options objects each in its own file.
  Separating them from the AutoNumeric class makes that information easier to find, study and modify.
+ Modify the `update()` and `global.update()` function signatures so that they can accept multiple option objects, the latter overwriting the settings from the former.
  This allows to fine tune the format settings in one go, and is specially useful when using a predefined option as the 'configuration base', and changing it slightly (ie. `anElement.update( AutoNumeric.getPredefinedOptions().French, { digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator })`).
+ Fix the `'autoNumeric:formatted'` event not being correctly sent if the AutoNumeric element was formatted without a `keyup` event.
  The event is now correctly sent when the value is set to empty, or when using `unformat()`, `unformatLocalized()` and `wipe()`, as well as when the user uses the wheel event to change the element value, or the `alt + mouse hover` feature, or just hover the element that has a `negativeBracketsTypeOnBlur` option set, or on the initial format on load.
+ Fix the fact that `'autoNumeric:formatted'` was not sent when pasting valid values.
+ Gather the AutoNumeric event names in a single configuration variable `AutoNumeric.events`.
+ Modify the default percentage pre-defined option `wheelStep` to `0.01` so that the wheel step is more logical when manipulating a small number.
+ Fix issue #442 Setting `unformatOnSubmit` to `true` does not unformat the element on the form' `submit` event
+ Fix issue #440 Pasting does not work in IE11

### 4.0.0-beta.15
+ Add a new option `selectOnFocus` that allow the user to choose if the value should be selected when the element is focused.
+ Add a new option `caretPositionOnFocus` that allow the user to choose where should be positioned the caret when the element is focused.
+ Modify how the caret is treated on focus ; if the `selectOnFocus` option is `true` then the value is selected, otherwise the caret is set at the position defined by the `caretPositionOnFocus` option.
+ `caretPositionOnFocus` can be `'start'`, `'end'`, `'decimalLeft'` and `'decimalRight'`, and will change where the caret will be positioned when the element get the focus. It can also be `null` which means the caret position is not forced.
+ The caret position is calculated by the new `_initialCaretPosition()` function.
+ Modify `validate()` so that an empty object can be used for the options, since the default settings would then be merged and used.
+ Modify the `validate()` function signature so that it accepts a third argument, the raw options passed by the user, without them having been merged with the default settings. This is useful for checking conflicting options that could be overwritten by the defaults.
+ Rewrite the call to `validate()` from `areSettingsValid()` to make it more explicit.
+ Rewrite one test condition in `_onFocusInAndMouseEnter()` so that it's not reserved only for elements that have their `emptyInputBehavior` option set to `focus` anymore.
+ Add a `focusin` event handler via `_onFocusIn()`, which take care of managing the element content selection on focus.
+ Add the `_correctCaretPositionOnFocusAndSelectOnFocusOptions()` function that manage the `caretPositionOnFocus` and `selectOnFocus` options in order to prevent any conflict.
+ Strengthen `setElementSelection()` so that `element.firstChild` is checked for `null` value.
+ Add a table of contents to the readme and reorganize its chapters.

### 4.0.0-beta.14
+ Add more bracket types to the `negativeBracketsTypeOnBlur` option ('〈,〉', '｢,｣', '⸤,⸥', '⟦,⟧', '‹,›' and '«,»')
+ Reformat the changelog, fix some typos
+ Modify the static `unformat()` signature to allow multiple options objects to be passed as arguments.
  Each more option object overwrite the previous ones.
  This allows to correctly unformat currencies that have a predefined option as its base, but has been slightly modified (ie. `AutoNumeric.unformat('241800,02 €', AutoNumeric.getPredefinedOptions().French, { digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator })`, and still get the right result).
+ Split the `_checkEmpty()` function into `_isElementValueEmptyOrOnlyTheNegativeSign()` and `_orderValueCurrencySymbolAndSuffixText()`. Both new functions only do one thing and one thing only, allowing the code to be rewrote in a clearer way.
+ Delete the `_checkEmpty()` function.
+ Simplify `_roundValue()` to make it more legible ; This is done by extracting `_roundCloseTo05()`, `_prepareValueForRounding()` and `_shouldRoundUp()`.
+ Remove an unnecessary `while` loop in `_stripAllNonNumberCharacters()`

### 4.0.0-beta.13
+ Modify `init()` so that it allows the user to also pass an array of DOM elements, or a CSS selector as its first argument (cf. issue #388 comments)

### 4.0.0-beta.12
+ Fix issue #434 Using `noSeparatorOnFocus` set to `noSeparator` should not remove the decimal character on focus

### 4.0.0-beta.11
+ Merge the Android support from `2.0.12` into `4.0.0-beta.*`

### 2.0.12
+ Add Android Chrome mobile (version 57) support (note: so far, not all android browsers are supported)
+ Fix issue #404 On the Android browser, inserted numbers are doubled if the user press the keys quickly on the virtual keyboard
+ Fix issue #250 The `maximumValue` and `minimumValue` options are not taken into account on Android
+ Fix issue #264 Entering the `decimalCharacterAlternative` is not taken into account on Android Chrome
+ Add the special keyCode 229 used by Android browsers as `keyCode.AndroidDefault`
+ Fix the `onPaste` handler throwing an error for uninitialized variables
+ Complete the `arabicToLatinNumbers()` function to return more quickly if no arabic numbers are found

### 4.0.0-beta.10
+ Reorganize the existing unit tests and add more to extend the coverage
+ Add a new `setValue()` method that allow the user to set any values, without any controls from AutoNumeric.
+ Replace all the calls to `setElementValue` then `_setRawValue` with either `setValue()` or `_setElementAndRawValue()`, so that this call order is respected.
+ Rewrite `setUnformatted()` so that it checks and validates the value given by the user.
+ Fix `options.createLocalList()` so that modifying the option will create/delete the local list accordingly.
+ Fix `selectDecimal()` so that the decimals are correctly selected when `decimalPlacesShownOnFocus` is used.
+ Add a thin unbreakable space`\u202f` in front of `%` in the predefined options `percentageEU*` (as per the [typographic rules](https://fr.wikipedia.org/wiki/Pourcentage#Notation)).

### 4.0.0-beta.9
+ Fix issue #425 The `minimumValue` and `maximumValue` options are not respected when `emptyInputBehavior` is set to `'zero'`

### 2.0.11
+ Fix issue #248 Create the `autoNumeric` organization, and move the repository to it

### 4.0.0-beta.8
+ Fix issue #248 Create the `autoNumeric` organization, and move the repository to it

### 4.0.0-beta.7
+ Fix issue #427 `autoUnformat()` converts `digitGroupSeparator` set to `.` as the decimal character
+ Modify `AutoNumeric.unformat()` so that 'real' javascript number are always directly returned, without taking into account the options passed (as it was supposed to do previously).
+ Correctly take into account the number of decimal places, the negative brackets, rounding and the suffix text options when unformatting with `AutoNumeric.unformat()`.
+ Complete the `AutoNumeric.unformat()` unit tests.
+ Modify `_removeBrackets()` so that we can only remove the brackets, without reordering the negative sign, currency symbol and value according to the settings.

### 4.0.0-beta.6
+ Fix issue #414 Changing the value of an element from negative to positive is not possible for some specific configuration of brackets, for the second time.
+ Remove the need to keep an ambiguous `settings.trailingNegative` variable, that was used for other things that its names suggests.
+ Extract the `_isTrailingNegative` test to its own function.
+ Fix `_convertToNumericString()` to make it remove the `suffixText` as well.
+ Use array destructuring to simplify the `_setValueParts()` function.
+ Remove the attribute `newValue` polluting `this`, which allow to explicitly pass the needed information.
+ Merge `this.settings.hasFocus` into `this.isFocused`.
+ Remove the need for the `this.settings.strip` variable.
+ Modify the event listener from `'focusin'` to `'focus'`, in order to prepare for the merge of `_onFocusInAndMouseEnter()` and `_onFocus()` handlers.
+ Modify `_cleanLeadingTrailingZeros()` so that the trailing zeroes if correctly done, even if `leadingZero` is set to `keep`.
+ Rename `_cleanLeadingTrailingZeros()` to `_trimLeadingAndTrailingZeros()`.
+ Change the `_addGroupSeparators()` signature so that the focused state is explicitly passed as a parameter, instead of piggy-backing on the settings object.
+ Add a `_setTrailingNegativeSignInfo()` function that parse the settings and initialize once the `this.isTrailingNegative` property if the negative sign should be trailing for negative values.
+ Rename the `leftOrAll` parameter from `_stripAllNonNumberCharacters()` to a more meaningful `stripZeros`.
+ Simplify a test in `_truncateDecimalPlaces()`.
+ Rename `_skipAlways()` to `_processNonPrintableKeysAndShortcuts()`.
+ Add cases to the helper function `isNegative()` to make it more efficient.
+ Add a new `isNegativeWithBrackets()` helper function that tests if the given value is a negative with brackets.

### 4.0.0-beta.5
+ Fix issue #416 Add support for changing the element style based on rules
+ Add the `styleRules` option that allows to modify the element style based on the raw value, but also to call any callbacks whenever this raw value change
+ Reorganize the `set()` function so that the formatted value is set before setting the `rawValue`. That way if a callback invoked by a `styleRules` modify the raw value, it'll be set correctly, since the previous `set()` call would have already changed the element value via `setElementValue()`.

### 4.0.0-beta.4
+ Fix issue #409 Do not add decimal padding when a number without decimals has been inserted
+ Fix an issue when you have `allowDecimalPadding` set to `never`, then if you delete the decimal places leaving the decimal character, it would not drop that dangling decimal character on focus out.
+ Fix issue #418 Complete the documentation with the AutoNumeric event lifecycle

### 4.0.0-beta.3
+ Fix issue #415 Support undo and redo actions
+ Add a new `historySize` option that allows to set how many undo states each AutoNumeric object should keep in memory.
+ Always use the `_setRawValue()` function to set the `rawValue` ; directly setting `this.settings.rawValue = 'foo'` is not allowed anymore.
+ Modify the `set()` function signature by allowing to pass a third parameter to prevent saving the changed state to the history table.
+ Update the `keyName` enumeration with the capitalized letters.
+ Upgrade the `getElementSelection()` helper function in order to support contenteditable-enabled elements and hidden inputs.
+ Add an `arrayTrim()` helper function that trim the start of an array.
+ Create undo/redo end-to-end tests.
+ Reorganize the `set()` function to keep logical steps together.
+ Rename the old `autoFormat.autoNumeric` event to the already used `autoNumeric:formatted` to keep the names consistent.
+ Sort the option list in the `_convertOldOptionsToNewOnes()` function.
+ Fix issue #423 `leadingZero` set to `keep` does not keep the leading zeros under Chrome

### 2.0.10
+ Fix issue #417 Error thrown in PhantomJS 2.1.1 on Linux under CI Environment
+ Fix the end-to-end tests for issue #403
+ Fix the webdriver.io configuration for the links to jQuery and AutoNumeric libraries

### 4.0.0-beta.2
+ Fix issue #413 Manage the drag 'n drop event so that the text dropped in the AutoNumeric element gets formatted accordingly

### 4.0.0-beta.1
+ Up the current `next` version to `v4` instead of `v3`, just because.
+ Add unit tests for the new `options.*` methods
+ Fix the issue where having `emptyInputBehavior` equal to `always` would not reformat the AutoNumeric element correctly if its value is set to the empty string `''`. 
+ Fix the issue where having `emptyInputBehavior` equal to `zero` would not reformat the AutoNumeric element correctly if its value is set to the empty string `''`. 
+ Fix the `_mergeCurrencySignNegativePositiveSignAndValue()` function that did not manage all `negativePositiveSignPlacement` combinations.
+ Simplify the `_mergeCurrencySignNegativePositiveSignAndValue()` function.
+ Add function chaining to the `options.*` methods.

### 3.0.0-beta.14
+ Add unit tests for the new `global.*` features
+ Fix issue #412 Using `set('')` does not respect the `emptyInputBehavior` option when it's set to `'always'`
+ Add a `createLocalList` option which allow to control whether a local list of AutoNumeric objects should be saved on initializations.
+ Add a `global.update()` function to update the settings on a local list.
+ Modify the `global.clear()` function to be able to force a `clear` call.
+ Add a `global.nuke()` function to `remove` then delete the local list DOM element from the DOM.
+ Update the `global.clear()` function signature with the `clear()` one.
+ Fix the `global.addObject()` function that did not update the local list of the added element.
+ Fix the `global.addObject()` function so that if it add an AutoNumeric object that already has a local list with multiple other AutoNumeric objects, it merges the list.
+ Fix the `global.removeObject()` function to make it update all the objects local list. Also add special behaviors when an AutoNumeric element removes itself or another one.
+ Fix the `global.empty()` function to match the `removeObject` behavior.
+ Simplify the `init()` method by removing a negation in one of its parameter.
+ Fix the `init()` method initialization process by preventing creating a local list, then removing it immediately if the user wanted a detached element. Now, the local list is just not created (Using the `createLocalList` option set to `false`).
+ Add an end-to-end test for the `remove()` method.
+ Add a `_hasLocalList()` method that tests if the AutoNumeric element has a local list and that it has at least one element in it (itself usually).

### 3.0.0-beta.13
+ Fix issue #411 Add the pre-defined Brazilian language configuration

### 3.0.0-beta.12
+ Refactor the hard-coded option values with the `AutoNumeric.options` object attribute values

### 3.0.0-beta.11
+ Fix issue #320 Use `event.key` instead of `event.keyCode` and `event.which` since those two attributes are deprecated

### 3.0.0-beta.10
+ Add lots of pre-defined options.
+ Those options are `dotDecimalCharCommaSeparator`, `commaDecimalCharDotSeparator`, `integer`, `integerPos`, `integerNeg`, `float`, `floatPos`, `floatNeg`, `numeric`, `numericPos`, `numericNeg`, `euro`, `euroPos`, `euroNeg`, `euroSpace`, `euroSpacePos`, `euroSpaceNeg`, `percentageEU2dec`, `percentageEU2decPos`, `percentageEU2decNeg`, `percentageEU3dec`, `percentageEU3decPos`, `percentageEU3decNeg`, `dollar`, `dollarPos`, `dollarNeg`, `percentageUS2dec`, `percentageUS2decPos`, `percentageUS2decNeg`, `percentageUS3dec`, `percentageUS3decPos` and `percentageUS3decNeg`.
+ Add the unit tests for those pre-defined options.
+ Update the readme accordingly, doing a distinction between the 'Predefined language options' and the 'Predefined common options'.
+ Rename `getLanguages()` to `getPredefinedOptions()`.
+ Add the percentage, permille and basis point sign to the default `suffixText` options.
+ Add a test to warn the user when the given CSS selector does not select any element during initialization.
+ Fix the initialization problem when searching for a parent <form> on an element that has no parentNode.
+ Re-order alphabetically the default settings
+ Replace the hard-coded default option values with references to the `AutoNumeric.options` object values.
+ Re-order alphabetically the options enumeration.
+ Add more choices for some options.
+ Rename default options value names to more meaningful descriptions.
+ Change the default option `selectNumberOnly` value to `true`
+ Simplify the `AutoNumeric.languageOptions` object.
+ Add the 'dot' character to the `decimalCharacterAlternative` option enumeration.
+ Update the end-to-end tests that test the element value selection on focus, to reflect the change to the default value for `selectNumberOnly`.
+ Update the unit tests to correct the rounding on some values that used the previous default one defined in `AutoNumeric.languageOptions.French`.
  
### 3.0.0-beta.9
+ Fix and removes some TODOs and FIXMEs
+ Remove some debug messages.
+ Remove the need to initialize the `savedCancellableValue` variable when unneeded.
+ Check and remove the unnecessary `hasFocus` calls and sets.
+ Add regex caching to the static `format()` function, since this used the `_addGroupSeparators` function that calls the `_stripAllNonNumberCharacters` one that extensively uses those.
+ Rename the temporary settings copy, and move those out of the `this.settings` object.
+ Prevent setting the value with `set()` if the value hasn't changed when calling the 'cancellable' event.
+ Rename `_setsAlternativeDecimalSeparatorCharacter()` to `_setAlternativeDecimalSeparatorCharacter()`.
+ Remove the unused and deprecated `aScale` reference from a test.
+ Move away from the `this.settings` object the following variables : `caretFix`, `throwInput`, `tagList`, `originalDecimalPlacesOverride`, `originalAllowDecimalPadding`, `originalNegativeBracketsTypeOnBlur`, `originalDigitGroupSeparator`, `originalCurrencySymbol`, `originalSuffixText` and `aNegRegAutoStrip`.
+ Refactor some tests in `_formatValue()`.

### 3.0.0-beta.8
+ Fix issue #408 Allow brackets and parenthesis to be added for negative numbers on any combination of `currencySymbolPlacement` and `negativePositiveSignPlacement` values

### 3.0.0-beta.7
+ Rename autoNumeric.js to AutoNumeric.js (since it's now a module)

### 3.0.0-beta.6
+ Finish merging the fixes for #403 and #401 into v3, and fix the introduced bugs
+ Make sure that if an element is focused, and a `mouseleave` event is captured, we do not unformat the element value (with the scale options).
+ Make sure if the element value is empty, that the scaleDivisor option do not convert it to `'0.00'` on `mouseenter`.
+ Remove a ternary operator which lead to a variable overwriting itself.
+ Fix the end-to-end tests which test the percentage with the scale options.

### 2.0.9
+ Fix issue #401 autoNumeric 2.0.8 prevents IE11 from entering the decimal character from the numpad
+ Fix issue #403 autoNumeric 2.0.8 scaling option when the divisor is less than zero and the input receives focus multiple times

### 3.0.0-beta.5
+ Fix issue #395 Allow to show the unformatted value when hovering over the element and pressing `Alt`

### 3.0.0-beta.4
+ Fix issue #396 Allow autoNumeric to manage user inputs in `contentEditable`-enabled elements
+ Simplify the `_formatDefaultValueOnPageLoad()` method signature.
+ Simplify how the `update()` function retrieve the current raw value and one of its test.
+ Remove any direct access to `this.domElement.value`, and use the `getElementValue()` to access the element `value` or `textContent`, and `setElementValue()` to set it.
+ Rewrite the `getElementSelection()` and `setElementSelection()` functions in order to manage non-input DOM elements.
+ Strengthen `getElementValue()` when managing non-input DOM elements.

### 3.0.0-beta.3
+ Fix issue #399 Fully convert autoNumeric to an ES6 module
+ Fix issue #398 Finish removing all jQuery dependencies
+ Fix issue #244 \[Feature request] Remove the jQuery dependency
+ Add an entry point `src/main.js` for bundling the library.
+ Split the library into 3 files ; 
 - `autoNumeric.js`, which contains the AutoNumeric class,
 - `AutoNumericEnum.js` which contains the enumerations used by AutoNumeric, and
 - `AutoNumericHelper.js` which contains the AutoNumericHelper class which provides static helper functions.
 
+ Extract the `allowedTagList`, `keyCode` and `keyName` into `AutoNumericEnum`.
+ Add the `isEmptyString`, `isNumberOrArabic`, `isFunction`, `isElement`, `isInputElement`, `arabicToLatinNumbers`, `triggerEvent`, `randomString`, `getElementValue`, `setElementValue`, `cloneObject`, `camelize`, `text`, `setText` and `filterOut` functions to the helper functions.
+ Move the `preparePastedText`, `runCallbacksFoundInTheSettingsObject`, `maximumVMinAndVMaxDecimalLength`, `stripAllNonNumberCharacters`, `toggleNegativeBracket`, `convertToNumericString`, `toLocale`, `modifyNegativeSignAndDecimalCharacterForRawValue`, `modifyNegativeSignAndDecimalCharacterForFormattedValue`, `checkEmpty`, `addGroupSeparators`, `truncateZeros`, `roundValue`, `truncateDecimal`, `checkIfInRangeWithOverrideOption` functions into the AutoNumeric object.
+ Improve the `character()` method to take into account the quirks of some obsolete browsers.
+ Remove the `getCurrentElement()` function since we now only need to access the `this.domElement` property.
+ Remove the `AutoNumericHolder` class and the `getAutoNumericHolder()` function since we are now using the AutoNumeric class as the 'property holder'.
+ Add multiple ways to initialize an AutoNumeric element (cf. the AutoNumeric constructor and the `_setArgumentsValues()` method).
+ Simplify the input type and tag support check.
+ Add the `serializeSpaces` option that allows the user to defines how the serialize function will managed the spaces, either by converting them to `'%20'`, or to the `'+'` string, the latter now being the default.
+ Add the `noEventListeners` option that allows the user to initialize an AutoNumeric `<input>` element without adding any AutoNumeric event listeners.
+ Add the `readOnly` option to the settings that allow the `<input>` element to be set to read-only on initialization.
+ Add a feature where all AutoNumeric-managed elements in a page share a common list.
+ Add a feature where the AutoNumeric-managed elements that initialized each other share a common list, allowing the user to perform a single action on many elements at once (via the `.global.*` functions).
+ Add a `isPristine()` method to test if an AutoNumeric-managed element `value`/`textContent` has been changed since its initialization.
+ Rename `unset` to `unformat`.
+ Rename `reSet` to `reformat`.
+ Add an `unformatLocalized()` function to unformat the element value while using the `outputFormat` setting.
+ Add a `clear()` method to empty the element value.
+ Add a `nuke()` method to remove the DOM element from the DOM tree.
+ Add a `.global.has()` method to check if the given AutoNumeric object (or DOM element) is in the local AutoNumeric element list.
+ Add a `.global.addObject()` method that adds an existing AutoNumeric object (or DOM element) to the local AutoNumeric element list.
+ Add a `.global.removeObject()` method that removes the given AutoNumeric object (or DOM element) from the local AutoNumeric element list.
+ Add a `.global.empty()` method to remove all elements from the shared list.
+ Add a `.global.elements()` method to retrieve all the AutoNumeric object that share the same local list.
+ Add a `.global.getList()` method to retrieve the local AutoNumeric element list.
+ Add one function for updating each option individually (ie. anElement.options.decimalCharacter('.')) instead of having to pass an object.
+ Add a `version()` method to output the current AutoNumeric version (for debug purpose).
+ Fix the `set()` method so that the `rawValue` is updated when the value is set to `''`.
+ Add a `setUnformatted()` method to set the value given value directly as the DOM element value, without formatting it beforehand.
+ Deprecate the `get()` method to the renamed `getNumericString()` which bares more meaning.
+ Add a `getFormatted()` method to retrieve the current formatted value of the AutoNumeric element as a string.
+ Add a `getNumber()` method that returns the element unformatted value as a real Javascript number.
+ Add a `getLocalized()` method that returns the unformatted value, but following the `outputFormat` setting.
+ Add a `unformatLocalized()` method that unformats the element value by removing the formatting and keeping only the localized unformatted value in the element.
+ Add a `selectNumber()` method that select only the numbers in the formatted element content, leaving out the currency symbol, whatever the value of the `selectNumberOnly` option.
+ Add a `selectInteger()` method that select only the integer part in the formatted element content, whatever the value of the `selectNumberOnly` option.
+ Add a `selectDecimal()` method that select only the decimal part in the formatted element content, whatever the value of `selectNumberOnly`.
+ Add a `node()` method that returns the DOM element reference of the autoNumeric-managed element.
+ Add a `parent()` method that returns the DOM element reference of the parent node of the autoNumeric-managed element.
+ Add a `detach()` method that detach the current AutoNumeric element from the shared local 'init' list.
+ Add an `attach()` method that attach the given AutoNumeric element to the shared local 'init' list.
+ Add a `formatOther()` method that format and return the given value, or set the formatted value into the given DOM element if one is passed as an argument.
+ Add an `unformatOther()` method that unformat and return the raw numeric string corresponding to the given value, or directly set the unformatted value into the given DOM element if one is passed as an argument.
+ Add an `init()` method that allows to use the current AutoNumeric element settings to initialize the DOM element given as a parameter. This effectively *link* the two AutoNumeric element by making them share the same local AutoNumeric element list.
+ Add a `form()` method that return a reference to the parent <form> element if it exists, otherwise return `null`.
+ Add a `formNumericString()` method that returns a string in standard URL-encoded notation with the form input values being unformatted.
+ Add a `formFormatted()` method that returns a string in standard URL-encoded notation with the form input values being formatted.
+ Add a `formLocalized()` method that returns a string in standard URL-encoded notation with the form input values, with localized values.
+ Add a `formArrayNumericString()` method that returns an array containing an object for each form `<input>` element.
+ Add a `formArrayFormatted()` method that returns an array containing an object for each form `<input>` element, with the value formatted.
+ Add a `formArrayLocalized()` method that returns an array containing an object for each form `<input>` element, with the value localized.
+ Add a `formJsonNumericString()` method that returns a JSON string containing an object representing the form input values.
+ Add a `formJsonFormatted()` method that returns a JSON string containing an object representing the form input values, with the value formatted.
+ Add a `formJsonLocalized()` method that returns a JSON string containing an object representing the form input values, with the value localized.
+ Add a `formUnformat()` method that unformat all the autoNumeric-managed elements that are a child of the parent <form> element of this DOM element, to numeric strings.
+ Add a `formUnformatLocalized()` method that unformat all the autoNumeric-managed elements that are a child of the parent <form> element of this DOM element, to localized strings.
+ Add a `formReformat()` method that reformat all the autoNumeric-managed elements that are a child of the parent <form> element of this DOM element.
+ Add a `formSubmitNumericString()` method that convert the input values to numeric strings, submit the form, then reformat those back.
+ Add a `formSubmitFormatted()` method that submit the form with the current formatted values.
+ Add a `formSubmitLocalized()` method that convert the input values to localized strings, submit the form, then reformat those back.
+ Add a `formSubmitArrayNumericString()` method that generate an array of numeric strings from the `<input>` elements, and pass it to the given callback.
+ Add a `formSubmitArrayFormatted()` method that generate an array of the current formatted values from the `<input>` elements, and pass it to the given callback.
+ Add a `formSubmitArrayLocalized()` method that generate an array of localized strings from the `<input>` elements, and pass it to the given callback.
+ Add a `formSubmitJsonNumericString()` method that generate a JSON string with the numeric strings values from the `<input>` elements, and pass it to the given callback.
+ Add a `formSubmitJsonFormatted()` method that generate a JSON string with the current formatted values from the `<input>` elements, and pass it to the given callback.
+ Add a `formSubmitJsonLocalized()` method that generate a JSON string with the localized strings values from the `<input>` elements, and pass it to the given callback.
+ Add a static `test()` method that if the given domElement is already managed by AutoNumeric (if it has been initialized on the current page).
+ Add multiple private methods to create and delete a global list of AutoNumeric objects (via a WeakMap), as well as the methods to add and remove elements to that list.
+ Add multiple private methods to manage the local enumerable list of AutoNumeric objects that are initialized together and share a common local list.
+ Add the private methods `_mergeSettings()` and `_cloneAndMergeSettings()` to do what they are named about.
+ Modify the static `format()` method so that it formats the given number (or numeric string) with the given options, and returns the formatted value as a string.
+ Add a static `formatAndSet()` method that format the given DOM element value, and set the resulting value back as the element value.
+ Modify the static `unformat()` method so that it unformats the given formatted string with the given options, and returns a numeric string.
+ Add a static `unformatAndSet()` method that unformat the given DOM element value, and set the resulting value back as the element value.
+ Add a static `localize()` method that unformat and localize the given formatted string with the given options, and returns a numeric string.
+ Add a static `isManagedByAutoNumeric()` method that returns `true` is the given DOM element has an AutoNumeric object that manages it.
+ Add a static `getAutoNumericElement()` method that returns the AutoNumeric object that manages the given DOM element.
+ Add the `french()`, `northAmerican()`, `british()`, `swiss()`, `japanese()`, `spanish()` and `chinese()` methods that update the settings to use the named pre-defined language options.
+ Convert some cryptic ternary statements to if/else block.
+ Remove the unknown parameter `setReal` from some functions.
+ Remove the need to pass around the settings in many functions signatures (using `this.settings` directly).
+ Rename the temporary variables created by coping some settings, with the new option names.
+ Correct the warning shown when using `isNan()` on non-number elements like strings.
+ Keep the focus status of the DOM element in the new `this.isFocused` variable.
+ Use the `getElementValue()` function to retrieve the element `value` or `textContent` (depending if the element in an `<input>` or another tag), which allow AutoNumeric to perform some operations on non-input elements too. This is the first changes needed for the goal of managing the non-input tags with `contentEditable` with AutoNumeric.
+ Use the `getElementValue()` function as well in order to be able to set the `value` or `textContent` transparently where needed.
+ Rename `_updateAutoNumericHolderProperties()` to `_updateInternalProperties()`.
+ Complete some JSDoc to be more precise on the event or element types. This helps for IDE autocompletion.
+ Rewrite completely how AutoNumeric test if the given DOM element is supported or not (by using the new `_checkElement()` method). This simplify the process by calling the new `_isElementTagSupported()`, `_isInputElement()` and `_isInputTypeSupported()` functions which respect the separation of concerns.
+ The `_formatDefaultValueOnPageLoad()` method now accepts a 'forced' initial value instead of the default one.
+ Remove the tests about the input type or element support from the `set()` methods, since those cannot change once AutoNumeric has been initialized, simplifying the code.
+ Remove duplicated tests (ie. `settings.formatOnPageLoad` inside the `formatDefaultValueOnPageLoad()` function that is only called if `settings.formatOnPageLoad` is already set).
+ Rename the `getInitialSettings()` method to `_setSettings()`.
+ Use array destructuring to give more meaningful names to the data returned by the `_getSignPosition()` function.
+ Add a private `_serialize()` function that take care of serializing the form data into multiple output as needed, which is called by the `_serializeNumericString()`, `_serializeFormatted()`,`_serializeLocalized()`, `_serializeNumericStringArray()`, `_serializeFormattedArray()` and `_serializeLocalizedArray()` methods.
+ The default settings are now exposed on the AutoNumeric class as a static object `AutoNumeric.defaultSettings`.
+ Add the static `AutoNumeric.options` object that gives access to all the possible options values, with a semantic name (handy for IDE autocompletion).
+ The pre-defined language options objects are now accessible via the static `AutoNumeric.languageOptions` object.
+ Add the static `AutoNumeric.multiple()` function that allows to initialize numerous AutoNumeric object (on numerous DOM elements) in one call (and possibly pass multiple values that will be mapped to each DOM element).
+ Add end-to-end tests for initializing non-`<input>` tags.
+ Add e2e tests for initializing elements with the `noEventListeners` or `readOnly` options.
+ Convert the end-to-end tests to the new API v3.
+ Convert the unit tests to the new API v3.
+ Add unit tests for the `serializeSpaces`, `noEventListeners` and `readOnly` options.
+ Fix the unit tests checking that the `rawValue` was correctly set when using `getSettings()`.
+ Add unit tests to check the `.global.*` methods.
+ Add unit tests to check the `AutoNumeric.multiple()` methods.
+ Add unit tests to check the `selectDecimal`, `selectInteger`, `reformat`, `unformat` and `unformatLocalized` methods.
+ Add unit tests to check the `.form*` methods.
+ Add the `babel-plugin-transform-object-assign` dev dependency in order to be able to use `Object.assign()` in the ES6 source.

### 3.0.0-beta.2
+ Fix issue #393 Add an option `modifyValueOnWheel` that allow the user to use mouse wheel to increment/decrement the element value
+ The related `wheelStep` option allows to either define a *fixed* step (ie. `1000`), or a *progressive* one calculated based on the current element value
+ Fix issue #397 Create enumerations for every options that allows only a set of values

### 3.0.0-beta.1
+ Fix issue #387 Add a 'cancellable' feature
+ It's now possible to select the whole input by hitting the `Escape` key (if no changes have been made to the element value, otherwise this will cancel those changes if the `isCancellable` is set to `true`)
+ Fix issue #391 The currency symbol is selected when focusing on an input via the `Tab` key, when `selectNumberOnly` is set to `true`
+ Refactor the code to create a `_selectOnlyNumbers()` function that extract that behavior for re-use.
+ Create a `_select()` function that select the whole element content, while respecting the `selectNumberOnly` option.
+ Create a `_defaultSelectAll()` function that select the whole element content, including all characters.
+ Modify the `setElementSelection()` calls to simplify them with the ability to use one argument instead of two when the `start` and `end` position are the same.
+ Add a feature where when the user hit 'Escape', the element content is selected (cf. issue #387).

### 2.0.8
+ Fix issue #389 autoNumeric 2.0.7 npm packages causes build error with typescriptify + browserify

### 2.0.5", "2.0.6" & "2.0.7
+ Fix issue #384 `npm install` for version 2.0.4 does not work on Windows machines

### 2.0.2", "2.0.3" & "2.0.4
+ Fix issue #377 The `dist` files in the last publish to npmjs were not rebuilt with the fixes pushed to 2.0.1
+ Fix issue #373 The `dist` files are not included when publishing to npmjs
+ Fix issue #371 The currency symbol is not removed on blur with the default `emptyInputBehavior` value `focus`
+ Fix issue #367 The package.json "postinstall" task does not find the target file when not using the dev dependencies

### 2.0.1
+ Fix issue #373 The `dist` files are not included when publishing to npmjs

### 2.0.0
+ Release autoNumeric version `2.0.0`, enjoy! (¬‿¬) :tada:
+ The old options names are being deprecated, and will be removed *soon* ; update your scripts with the [new ones](README.md#options)!
+ Please be sure to read the updated [readme](README.md) in order to know what else has changed. 

### 2.0.0-beta.25
+ Fix issue #310 Setup Webdriver.io for end-to-end (e2e) testing

### 2.0.0-beta.24
+ Fix issue #326 Pasting a single decimal character into an input that has none does not work
+ Fix issue #322 Pasting a string containing a comma set the caret position at the wrong position

### 2.0.0-beta.23
+ Fix issue #354 Setup automated coverage tests (with Coveralls)

### 2.0.0-beta.22
+ Fix issue #345 Setup continuous integration testing (with Travis CI)

### 2.0.0-beta.21
+ Fix issue #346 Add a `showPositiveSign` option to display the positive sign wherever needed

### 2.0.0-beta.20
+ Fix issue #341 Add some default options in the `languageOption` object
+ Fix issue #328 Switch from `npm` to `yarn`

### 2.0.0-beta.19
+ Allow using `set` with Arabic and Persian numbers (ie. `aNInput.autoNumeric('set', '١٠٢٣٤٥٦٧.٨٩');`)
+ Allow using Arabic and Persian numbers (used in Arabic languages) in the html `value` attribute
+ Allow pasting Arabic and Persian numbers (that will get converted to latin numbers on the fly)

### 2.0.0-beta.18
+ Fix issue #330 The `negativePositiveSignPlacement` option can be ignored in some cases
+ Fix issue #339 `get` returns `'0'` when the input is empty even if `emptyInputBehavior` is not equal to `'zero'`

### 2.0.0-beta.17
+ Fix issue #317 Jump over the decimal character when trying to enter a number and the integer part limit has already been attained
+ Fix issue #319 'get' returns wrong value when the value has a trailing negative sign
+ Fix issue #327 When focusing on an input via the `Tab` key, the value is not always selected 

### 2.0.0-beta.16
+ Fix issue #321 Allows more international decimal characters and grouping separators :
 + Allowed grouping separator : `','`, `'.'`, `'٬'`, `'˙'`, `"'"`, `' '`, `'\u2009'`, `'\u202f'`, `'\u00a0'` and `''`
 + Allowed decimal characters : `'.'`, `','`, `'·'`, `'⎖'` and `'٫'`

### 2.0.0-beta.15
+ Fix FireFox on issue #306 that allows the caret to move right when all zero present in the decimals
+ Fix issue #318 `this.selection` can be uninitialized if you focus on an input via the `Tab` key.
+ Add the `keyName` object that list the key values as defined is the KeyboardEvent Key_Values.
+ Rename the `key()` function to `keyCodeNumber()`.
+ Split `_updateFieldProperties()` into `_updateAutoNumericHolderProperties()` and `_updateAutoNumericHolderEventKeycode()`.
+ `_updateAutoNumericHolderProperties()` only update the value and selection in each event handler, and resets the 'processed' and 'formatted' states.
+ `_updateAutoNumericHolderEventKeycode()` is called only once on `keypress`, and set the event keyCode into the AutoNumericHolder object.
+ Remove the need to save `this.ctrlKey`, `this.cmdKey` and `this.shiftKey` three times on each key stroke.
+ Rename `this.kdCode` into `this.eventKeyCode`, and use that variable globally in the AutoNumericHolder object.
+ Fix `_normalizeParts()` so that a '0' entered via the numpad is managed as well.
+ Complete the substitution of magic numbers with `keyCode` values.
+ Modify `_processCharacterInsertion()` so that it take the event as an argument, and therefore can directly use `e.key`.
+ Simplify `_formatValue()` tests.

### 2.0.0-beta.14
+ Fix issue #306 when { leadingZero: 'deny' } and proper caret placement

### 2.0.0-beta.13
+ Fix issue #228 Do not modify the current selection when trying to input an invalid character
+ Mass rename functions to gives them a more explicit name :

| Old name                    |          | New name |
| :---------------- | :------------ | :-----------:  |
| autoCheck()       | -> | checkIfInRangeWithOverrideOption()                       |
| autoRound()       | -> | roundValue()                                             |
| autoGroup()       | -> | addGroupSeparators()                                     |
| fixNumber()       | -> | modifyNegativeSignAndDecimalCharacterForRawValue()       |
| presentNumber()   | -> | modifyNegativeSignAndDecimalCharacterForFormattedValue() |
| negativeBracket() | -> | toggleNegativeBracket()                                  |
| autoGet()         | -> | getCurrentElement()                                      |
| getHolder()       | -> | getAutoNumericHolder()                                   |
| autoSave()        | -> | saveValueToPersistentStorage()                           |
| _setPosition()    | -> | _setCaretPosition()                                      |
| _signPosition()   | -> | _getSignPosition()                                       |
| _formatQuick()    | -> | _formatValue()                                           |

### 2.0.0-beta.12
+ Modify the `validate()` function to show a warning when `decimalPlacesOverride` is greater than `decimalPlacesShownOnFocus`.
+ Implement feature request #183 that manage invalid results when trying to paste any number. This adds the `onInvalidPaste` option that can accept the `error`, `ignore`, `clamp`, `truncate` and `replace` value.
+ Rename `autoStrip()` to `stripAllNonNumberCharacters()`.
+ Upgrade the `setElementSelection()` function so that it can accept only one caret position.
+ Add a `failOnUnknownOption` option which allows autoNumeric to strictly analyse the options passed, and fails if an unknown options is used in the settings object.

### 2.0.0-beta.11
+ Fix typos and missing characters that prevented building the library.

### 2.0.0-beta.10
+ Fix issue #302 `leadingZero` option `deny` does not function correctly and deletes some of the zero to the right of the caret
+ Fix issue #303 When focusing on an input having `currencySymbolPlacement` set as `p` (prefix)

### 2.0.0-beta.9
+ Rename the old options name to more explicit ones :

| Old name         |          | New name |
| :------------ | :------------ | :-----------:  |
| aSep          | -> | digitGroupSeparator           |
| nSep          | -> | noSeparatorOnFocus            |
| dGroup        | -> | digitalGroupSpacing           |
| aDec          | -> | decimalCharacter              |
| altDec        | -> | decimalCharacterAlternative   |
| aSign         | -> | currencySymbol                |
| pSign         | -> | currencySymbolPlacement       |
| pNeg          | -> | negativePositiveSignPlacement |
| aSuffix       | -> | suffixText                    |
| oLimits       | -> | overrideMinMaxLimits          |
| vMax          | -> | maximumValue                  |
| vMin          | -> | minimumValue                  |
| mDec          | -> | decimalPlacesOverride         |
| eDec          | -> | decimalPlacesShownOnFocus     |
| scaleDecimal  | -> | scaleDecimalPlaces            |
| aStor         | -> | saveValueToSessionStorage     |
| mRound        | -> | roundingMethod                |
| aPad          | -> | allowDecimalPadding           |
| nBracket      | -> | negativeBracketsTypeOnBlur    |
| wEmpty        | -> | emptyInputBehavior            |
| lZero         | -> | leadingZero                   |
| aForm         | -> | formatOnPageLoad              |
| sNumber       | -> | selectNumberOnly              |
| anDefault     | -> | defaultValueOverride          |
| unSetOnSubmit | -> | unformatOnSubmit              |
| outputType    | -> | outputFormat                  |
| debug         | -> | showWarnings                  |

+ Add a `convertOldOptionsToNewOnes()` function that automatically convert old options to new ones, to ease the evolution to v2.*.
+ Update `typings.d.ts` accordingly
+ Update `README.md` accordingly
+ Complete the tests to make sure using old option names will output a warning about them being deprecated

### 2.0.0-beta.8
+ Fix issue #292 where native input and change events are not sent correctly.
+ Add a `isNumber()` helper function to test if a value is a number, or a string representing a number.
+ Add a `isInt()` helper function to test if a value is a 'real' integer.
+ Modify `decimalPlaces()` so that it always return the number of decimal places (ie. `0` instead of `null` if there is none). 
+ Add a `key()` helper function to retrieve an event keyCode.
+ Complete and improve some JSDoc.
+ Rename `runCallbacks()` into `runCallbacksFoundInTheSettingsObject()`.
+ Simplify `decLength()` function, as well as removing unnecessary code before each call to this function.
+ Rename `decLength()` to `maximumVMinAndVMaxDecimalLength()`.
+ Drastically improve performance by removing duplicated function calls.
+ Improve `autoCode()` call hierarchy.
+ Merge `autoCode()` into `getInitialSettings()`.
+ Caches an additional regex.
+ Rename some functions and variables to make them more explicit.
+ Refactor `autoGroup()` to use switch statements.
+ Refactor how `dPos` was used to make it more understandable.
+ Rename `keepOriginalSettings` into `keepAnOriginalSettingsCopy()`.
+ Simplify `autoSave()` so that it directly uses the element as an argument, instead of a jQuery reference.
+ Create an AutoNumericHolder ES6 class to store the field properties of an autoNumeric element.
+ Rename the AutoNumericHolder `init()` function to `_updateFieldProperties()`.
+ Rename the AutoNumericHolder functions that should be private.
+ Fix issue #283.
+ Rename `processAlways()` into `_processCharacterDeletion()`, and simplify it so that if does not do two things at the same time.
+ Rename `processKeypress()` into `_processCharacterInsertion()`, and simplify it so that if does not do two things at the same time.
+ Merge some conditions in `_formatQuick()`.
+ Remove the need for a jQuery dependency in the events listeners.
+ Convert some jQuery event listeners to pure JS event listeners.
+ Convert some jQuery-specific functions to native JS ones (ie. `$this.val()` to `e.target.value`).
+ Simplify the event listeners by removing any unused returns.
+ Remove unnecessary `getHolder()` calls in the event listeners.
+ Make the 'enter' key send a `change` event when used and the value has been changed.
+ Add an `onBlur` event listener, allowing us to trigger `change` events as needed.
+ Reduce `getInitialSettings()` length by a great deal, making it easier to read and understand.
+ The `getInitialSettings()` functions now calls the `calculateVMinAndVMaxIntegerSizes()`, `correctMDecOption()`, `setsAlternativeDecimalSeparatorCharacter()`, `cachesUsualRegularExpressions()` and `transformOptionsValuesToDefaultTypes()` functions.
+ Refactor the `update()` code into `getInitialSettings()`, which allows to remove the `autoCode()` calls from the AutoNumericHolder constructor and the `_updateFieldProperties()` function.
+ Remove the need for jQuery in `getSettings()`.
+ Modify the `validate()` test on the `mDec` option to allow for a positive integer too.
+ Allow the `autoFormat()` function to format numbers represented as a string.
+ Complete the `autoFormat()` tests and check for the value validity.
+ Remove the `sendCustomEvent()` function and replace it by the `triggerEvent()` one (and remove `createCustomEvent()` as well).
+ Complete the `autoUnFormat()` tests and check for the value validity.
+ Modify the `autoUnFormat()` behavior so that when given a number (a real one or a string representing one), the function always return a 'real' number, whatever the options passed.
+ Modify the eslint 'radix' rule to allow for always specifying a radix for the `parseInt` function.
+ Comment out the default Jasmine test in order to see a 100% success without any skipped tests.
+ Fix the `clean:build` npm script so that it does not try to remove an inexistant folder.

### 2.0.0-beta.7
+ Add "mouseenter" & "mouseleave" handlers to enable viewing the extended values for "eDec", "scaleDivisor" & "nSep" options.
+ Add third parameter to the "autoGet" call in "onFocusOutAndMouseLeave" function

### 2.0.0-beta.6
+ Rename the `localOutput` setting to `outputType`, and add an option 'number' that makes `getLocalized` always return a Number, instead of a string.
+ Modify the `get` function so that it always returns a valid Number or string representing a number that Javascript can interpret.
+ Add a `getLocalized` function that return the raw value of the input, but can also return the value localized with a decimal point and negative sign placement chosen by the user (basically, it replace the old `get` behavior if any user wants it back).
+ Modify the `pNeg` default value based on the `aSign` and `pSign` values. This leads to better user experience when setting a currency symbol without setting `pNeg`.
+ Errors are now always thrown. The `debug` option now only affects the warning messages (used for non-critical errors).

### 2.0.0-beta.5
+ Add a `validate()` method that checks if the given options object is valid.
+ Reorganize the `init` function code to check for critical error first, before doing other calculus.
+ Add a `areSettingsValid()` method that return true if the options object is valid.
+ Add multiple helper functions `isBoolean`, `isNull`, `isTrueOrFalseString`, `isObject`, `isEmptyObj`, `hasDecimals`,  `decimalsPlaces`.
+ Add a `warning()` method that output warning message to the console.
+ Rename `originalSettings` to `keepOriginalSettings` to better convey what this function is doing.

### 2.0.0-beta.4
+ Removed the index.html file
+ Additional mods/fixes to the scaling options
+ Additional mods/fixes to the "nSep" to also handle the "aSuffix"
+ Fixed the "mRound" default

### 2.0.0-beta.3
+ fixed nSep option which removes the Currency symbol and thousand separator on focusin
+ changed the defaults for scaleDivisor, scaleDecimal & scaleSymbol to null

### 2.0.0-beta.2
+ Modify the scaling options and separate them
+ aScale - removed
+ scaleDivisor added
+ scaleDecimal added
+ scaleSymbol added

### 2.0.0-beta.0 (released 2016-11-16)
+ Prepare the code base for future Jasmine tests
+ Add initial babel support
+ Add uglify and npm-build-process support
+ Merge the 2.0 changes into master
+ Add npm support for building the minified version
+ Multiple small fixes
+ Fixed paste event on both context menu and `ctrl-v` // issue #251 special thanks to @rhyek
+ Fixed tab in key select all and deletion // issue #246
+ Fixed issue with Vue.js 2.0 // issue #247 
+ Fixed context menu paste event // issue #251
+ switch from jsLint to jsHint
+ Fixed tab in key // thanks movalz issue #212
+ Fixed the cursor position when tabbing in Chrome // thanks Dennis Smith issue #221
+ Fixed the destroy method // thanks brunoporto & Mabusto issue #225
+ Fixed the readme file to show correct `$.extend` defaults // thanks  gayan85 issue #229
+ Fixed bug in unSetOnSubmit option to handle non autoNumeric controlled inputs
+ Fixed bug in `get` method
+ Mods to the trailing minus sign code 
+ Added UMD support
+ Modified & improved the shim for throwing the `input` event
+ Added option `unSetOnSubmit` to unformat input on the submit event
+ Added option `debug` to turn on and off error being thrown
+ Added support for arbitrary-precision decimal arithmetic. This was adapted from Big.js https://github.com/MikeMcl/big.js/ Many thanks to Mike
+ Added support for trailing minus signs
+ Added rounding methods for currencies with smallest coin being $0.05
+ Added modified `sNumber` option that selects only numbers ctr & a keys thanks Zayter
+ Added support for return values to have locale formats
+ Added debug option to turn off errors
+ Added option `anDefault` to help ASP.NETR postback errors
+ Modified the `wEmpty` option
+ Modified the `init` && `set` methods
+ General code clean up
+ Modified the `set`, `getString` & `getArray` methods
+ Modified the `nBracket` function
+ Fixed the `update` method when it is called during the `onfocus` event
+ Fixed the `getString` & `getArray` methods when multiple inputs share the same name - Thanks Retromax
+ Fixed bug in `ctrl + v` paste event to properly round 
+ Merged a mod that makes the defaults public and overridable - Thanks Peter Boccia
+ Fixed page reload when the thousand separator is a period `.`

### 1.9.46 (released 2016-09-11)
+ Fixed tab in key // thanks movalz issue #212
+ Fixed the cursor position when tabbing in Chrome // thanks Dennis Smith issue #221
+ Fixed the destroy method // thanks brunoporto & Mabusto issue #225
+ Fixed the readme file to show correct $.extend defaults // thanks  gayan85 issue #229 

### 1.9.45 (released 2016-06-13)
+ Modified the "set" method to handle NaN

### 1.9.44 (released 2016-06-06)
+ Fixed destroy method
+ Added Typings support - thanks bcherny 

### 1.9.43 (released 2015-12-19)
+ UMD support

### 1.9.42 (released 2015-11-20)
+ Fixed bug when pasting using  ctrl & v keys

### 1.9.41 (released 2015-11-02)
+ Fixed bug that allowed two currency symbols - thanks Mic Biert

### 1.9.40 (released 2015-10-25)
+ Fixed bug when pasting value and the decimal separator is a comma ","
+ Modified the "destroy" method so that an error is not thrown if the "init" method has not been called previously

### 1.9.39
+ Fixed 'aForm'option.
+ Updated the readme file

### 1.9.38
+ Added / fixed option to address asp.Net WebForm postback.
+ please see the readme section on default settings & options 

### 1.9.37
+ Added / fixed support for asp.Net WebForm postback.
+ During postback the default value is re-rendered showing the updated value
+ Because autoNumeric cannot distinguish between a page re-load and asp.net form postback, the following HTML data attribute is REQUIRED (data-an-default="same value as the value attribute") to prevent errors on postback
+ Example:
```html
<input type="text" id="someID" value="1234.56" data-an-default="1234.56">
```

### 1.9.36
+ Rewrote the "getString" & "getArray" methods to index successful elements and inputs that are controlled by autoNumeric. This ensures the proper input index is used when replacing the formatted value.
+ Added support for FireFox for Mac meta key "keycode 224" - Thanks Ney Estrabelli

### 1.9.35
+ Revert 'set' back to version 1.9.34

### 1.9.34
+ Modified the 'set', 'getString' & 'getArray' methods
+ Modified the 'nBracket' function
+ General code clean up

### 1.9.33
+ Fixed bug in "ctrl + v" paste event introduced in 1.9.32

### 1.9.32
+ Fixed bug when the "update" method is called in the "onfocus" event
+ Fixed the "getString" & "getArray" methods when multiple inputs share the same name - Thanks Retromax
+ Fixed bug in "ctrl + v" paste event to properly round

### 1.9.31
+ never officially release

### 1.9.30
+ Fixed bug introduced 1.9.29 too interested in Ohio State vs. Oregon

### 1.9.29
+ Fixed bug introduced in 1.9.27

### 1.9.28
+ Fixed focusout event when the thousand separator is a period "." and only one is present "x.xxx" with not other alpha characters.

### 1.9.27
+ Merged a mod that makes the defaults public and overridable - Thanks Peter Boccia
+ Fixed page reload when the thousand separator is a period "."

### 1.9.26
+ Fixed "getString" & "getArray" methods when multiple forms having some shared named inputs

### 1.9.25
+ Fixed mRound option "round-half-even"
+ Modified the "set" method to not throw an error when trying to "set" a null value

### 1.9.24
+ Changed the case on the supported elements
+ This was required because jQuery.prop('tagName') returns upper-case on html5 pages and returns lower-case on xhtml pages

### 1.9.23
+ Merged mod on the "getString" method

### 1.9.22
+ Fixed a bug when a negative value uses brackets and currency sign on page reload thanks to Allen Dumaine
+ Additional mods to the "set" method.
+ Eliminated lastSetValue setting

### 1.9.21
+ Mod to checkValue function to handle empty string - thanks to jedichenbin.
+ If CHF rounding is used decimal is automatically set to 2 places

### 1.9.20
+ Fixed issue for very small numbers - thanks to jedichenbin.

### 1.9.18
+ Added input type="tel" support.
+ Added support for Swiss currency rounding to the nearest ".00 or .05"
+ Fixed bug in Round-Half-Even "Bankers Rounding"

### 1.9.18
+ Fixed formatting on page load for text elements.

### 1.9.17
+ Fixed leading zero on page load when option lZero is set to 'keep'.

### 1.9.16
+ Fixed the checkValue function when vary small numbers in scientific notation are passed via the set method.
+ Modified the rounding method so zero value is not returned with a negative sign

### 1.9.15
+ Fixed bug introduced in version 1.9.14

### 1.9.14
+ Added additional supported tags ('b', 'caption', 'cite', 'code', 'dd', 'del', 'div', 'dfn', 'dt', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ins', 'kdb', 'label', 'li', 'output', 'p', 'q', 's', 'sample', 'span', 'strong', 'td', 'th', 'u', 'var')
+ Moved the routine that tests for supported tags
+ General code clean-up

### 1.9.13
+ Fixed the "get" method when the input receives focus for a second time.

### 1.9.12
+ Fixed brackets on page load when the decimal character is a comma.

### 1.9.11
+ Another mod to the 'set' method.

### 1.9.10
+ Fixed the 'set' method to handle page reload using the back button.

### 1.9.9
+ Fixed how non-input tags default value is handled.  When the default is an empty string and aSign is not empty the return value is now and empty string.
+ Modified how default values are handled when the decimal character equals ',' comma. Your default value can now use either a a period '.' or comma ',' as the decimal separator
+ Modified the caret placement on focusin (tab in). If only the currency sign is visible the caret is placed in the proper location depending on the sign placement (prefix or suffix).

### 1.9.8
+ Changed bind / unbind to on / off.
+ added lastSetValue to settings - this saves the unrounded value from the set method - $('selector').data('autoNumeric').lastSetValue; - helpful when you need to change the rounding accuracy

### 1.9.7
+ Modified /fixed the format default values on page ready.
+ Fixed the caret position when jumping over the thousand separator with back arrow.

### 1.9.6
+ Fixed bug introduced in 1.9.3 with shift key.
+ additional modification to the processKeypress function that automatically inserts a negative sign when vMax less than or equal to 0 and vMin is less than vMax.

### 1.9.5
+ Modified processKeypress function to automatically insert a negative sign when vMax <=0 and vMin < 0.
+ Changed the getSting and getArray functions to use decodeURIComponent() instead of unescape() which is depreciated

### 1.9.4
+ Merged issue #11 - Both getString and getArray were using escaped versions of the name from jQuery's serialization. So this change wraps the name finder with quotes and unescapes the name.Fixed a bug in autoCode that corrects the pasted values and page re-load - Thanks Cory.
+ Merged issue #12 - If a input is readonly during "init", autocomplete won't work if the input is enabled later. This commit should fix the Problem - Thanks Sven.

### 1.9.3
+ Fixed a bug in autoCode function that corrects pasted values and page re-load
+ Added support for "shift" + "insert" paste key combination

### 1.9.2
+ Modified the "checkValue" function - eliminated redundant code
+ Modified the "update" method include calling the "getHolder" function which updates the regular expressions
+ Modified the "getHolder function so the regular expressions are updated
+ Modified the "set" method to convert value from number to string

### 1.9.1
+ Modified the checkValue function to handle values as text with the exception of values less than "0.000001 and greater than -1"

### 1.9.0
+ Fixed a rounding error when the integers were 15 or more digits in length
+ Added "use strict";

### 1.8.9
+ Fixed the "get" and "set" methods by moving the settings.oEvent property to ensure the error message would be thrown if the element had not been initialized prior to calling the "get" and "set" methods

### 1.8.8
+ Fixed the "init" when there is a default and value aForm=true and the aSep and aDec are not the defaults

### 1.8.7
+ Fixed the "getSting" method - it use to returned an error when no values were entered
+ Modified the "init" method to better handle default and pre-existing values
+ Modified the "set" method - removed the routine that checked for values less than .000001 and greater than -1 and placed it in a separate function named checkValue()
+ Modified the "get" method:
    + Added a call to the checkValue() function - this corrects returned values example - when the input value was "12." the returned value was "12." - it now returns "12"
    + When no numeric character is entered the returned value is an empty string "".

### 1.8.6
+ Removed the error message when calling the 'init' methods multiple times. This was done when using the class selector for the 'init' method and then dynamically adding input(s) it allows you to use the same selector to init autoNumeric. **Please note:** if the input is already been initialized no changes to the option will occur you still need to use the update method to change existing options.
+ Added support for brackets '[,]', parentheses '(,)', braces '{,}' and '<,>' to the nBracket setting. **Please note:** the following format nBracket: '(,)' that the left and right symbol used to represent negative numbers must be enclosed in quote marks and separated by a comma to function properly.

### 1.8.5
+ Fixed readonly - this occurred when you toggle the readonly attribute

### 1.8.4
+ Fixed the getString and getArray methods under jQuery-1.9.1

### 1.8.3
+ Added input[type=hidden] support - this was done mainly for backward compatibility.
+ The "get" method now returns a numeric string - this also was done for backward compatibility.

### 1.8.2
+ Allowed dGroup settings to be passed as a numeric value or text representing a numeric value
+ Allows input fields without type that defaults to type text - Thanks Mathieu Demont

### 1.8.1
+ Modified the 'get' method so when a field is blank and the setting wEmpty:'empty' a empty string('') is returned.

### 1.8.0
+ autoNumeric() 1.8.0 is not compatible with earlier versions but I believe you will find version 1.8.0's new functionality and ease of use worth the effort to convert.
+ Changed autoNumeric structure to conform to jQuery's recommended plugin development.
+ Created a single namespace and added multiple methods.
+ Added HTML 5 data support and eliminated the metadata plugin dependency.
+ Added support for the following elements: 'DD', 'DT', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'input', 'LABEL', 'P', 'SPAN', 'TD', 'TH'.
+ Changed the settings loading order to defaults, HTML5 data then options. Now the defaults settings are overridden by HTML5 data and options overrides both defaults & HTML5 data.
+ Added "lZero" to the settings to control leading zero behavior.
+ Added "nBracket" to the settings which controls if negative values are display with brackets.
+ Changed the callback feature to accept functions only.
+ Improved the 'aForm' behavior that allows values to be automatically formatted on page ready.
+ Fixed the issue for numbers that are less than 1 and greater than -1 and have six or more decimal places.
+ Fixed 'crtl' + 'a' (select all) and 'ctrl' + 'c' (copy) combined key events.
+ Fixed a IE & FF bug on readonly attribute.
+ General code clean up
