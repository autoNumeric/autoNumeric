/**
 *               AutoNumeric.js
 *
 * @version      4.0.3
 * @date         2017-08-02 UTC 02:50
 *
 * @authors      Bob Knothe, Alexandre Bonneau
 * @contributors Sokolov Yura and others, cf. AUTHORS
 * @copyright    2009 Robert J. Knothe http://www.decorplanit.com/plugin/
 * @since        2009-08-09
 *
 * @summary      autoNumeric is a standalone Javascript library
 *               that provides live *as-you-type* formatting for
 *               international numbers and currencies.
 *
 *               Note : Some functions are borrowed from big.js
 * @link         https://github.com/MikeMcl/big.js/
 *
 * Please report any bugs to https://github.com/autoNumeric/autoNumeric
 *
 * @license      Released under the MIT License
 * @link         http://www.opensource.org/licenses/mit-license.php
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sub license, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* global module */

//TODO Prevent having to enter relative path in the js files (ie. using `./AutoNumericHelper` instead of just `AutoNumericHelper`) (cf. http://moduscreate.com/es6-es2015-import-no-relative-path-webpack/)
import AutoNumericHelper from './AutoNumericHelper';
import AutoNumericEnum from './AutoNumericEnum';

/**
 * Class declaration for the AutoNumeric object.
 *
 * An AutoNumeric element is an object wrapper that keeps a reference to the DOM element it manages (usually an <input> one), and provides autoNumeric-specific variables and functions.
 */
class AutoNumeric {
    //TODO Use the better notation `export default class` when webpack and babel will allow it (cf. https://github.com/webpack/webpack/issues/706)
    /**
     * Initialize the AutoNumeric object onto the given DOM element, and attach the settings and related event listeners to it.
     * The options passed as a parameter is an object that contains the settings (ie. {digitGroupSeparator: ".", decimalCharacter: ",", currencySymbol: '€ '})
     *
     * @example
     * anElement = new AutoNumeric(domElement); // With the default options
     * anElement = new AutoNumeric(domElement, { options }); // With one option object
     * anElement = new AutoNumeric(domElement, 'euroPos'); // With a named pre-defined string
     * anElement = new AutoNumeric(domElement, [{ options1 }, 'euroPos', { options2 }]); // With multiple option objects (the latest option overwriting the previous ones)
     * anElement = new AutoNumeric(domElement, null, { options }); // With one option object, and a failed initial value
     * anElement = new AutoNumeric(domElement).french(); // With one pre-defined language object
     * anElement = new AutoNumeric(domElement).french({ options });// With one pre-defined language object and additional options that will override the defaults
     *
     * // ...or init and set the value in one call :
     * anElement = new AutoNumeric(domElement, 12345.789); // With the default options, and an initial value
     * anElement = new AutoNumeric(domElement, 12345.789, { options });
     * anElement = new AutoNumeric(domElement, '12345.789', { options });
     * anElement = new AutoNumeric(domElement, 12345.789, 'euroPos');
     * anElement = new AutoNumeric(domElement, 12345.789, [{ options1 }, 'euroPos', { options2 }]);
     * anElement = new AutoNumeric(domElement, 12345.789).french({ options });
     * anElement = new AutoNumeric(domElement, 12345.789, { options }).french({ options }); // Not really helpful, but possible
     *
     * // The AutoNumeric constructor class can also accept a string as a css selector. Under the hood this use `QuerySelector` and limit itself to only the first element it finds.
     * anElement = new AutoNumeric('.myCssClass > input');
     * anElement = new AutoNumeric('.myCssClass > input', { options });
     * anElement = new AutoNumeric('.myCssClass > input', 'euroPos');
     * anElement = new AutoNumeric('.myCssClass > input', [{ options1 }, 'euroPos', { options2 }]);
     * anElement = new AutoNumeric('.myCssClass > input', 12345.789);
     * anElement = new AutoNumeric('.myCssClass > input', 12345.789, { options });
     * anElement = new AutoNumeric('.myCssClass > input', 12345.789, 'euroPos');
     * anElement = new AutoNumeric('.myCssClass > input', 12345.789, [{ options1 }, 'euroPos', { options2 }]);
     * anElement = new AutoNumeric('.myCssClass > input', null, { options }); // With a failed initial value
     * anElement = new AutoNumeric('.myCssClass > input', 12345.789).french({ options });
     *
     * @param {object|Array|number|string} arg1
     * @param {object|Array|number|string|null} arg2
     * @param {object|Array|number|string|null} arg3
     * @throws
     */
    constructor(arg1 = null, arg2 = null, arg3 = null) {
        // --------------------------------------------------------
        // -------------- Initialization
        // Initialize the arguments
        const { domElement, initialValue, userOptions } = AutoNumeric._setArgumentsValues(arg1, arg2, arg3);

        // Initialize the element
        this.domElement = domElement;

        // Generate the settings
        this.defaultRawValue = ''; // The default raw value to set when initializing an AutoNumeric object
        this._setSettings(userOptions, false);
        //TODO If `styleRules` is not null, add by default a class 'autoNumeric' that adds transition to color, background-color, border-color properties
        // Check if the DOM element is supported
        this._checkElement();

        // Store the additional attributes inside the AutoNumeric object
        // Note: This variable is needed and not a duplicate of `initialValueOnKeydown` nor `valueOnFocus` since it serves a different purpose and has a different lifecycle
        this.savedCancellableValue = null;

        // Initialize the undo/redo variables
        this.historyTable = []; // Keep track of *all* valid states of the element value
        this.historyTableIndex = -1; // Pointer to the current undo/redo state. This will be set to '0' during initialization since it first adds itself.
        this.onGoingRedo = false; // Variable that keeps track if a 'redo' is ongoing (in order to prevent an 'undo' to be launch when releasing the shift key before the ctrl key after a 'redo' shortcut)

        // Initialize the parent form element, if any
        this.parentForm = this._getParentForm();

        // Set the initial value if it exists and if the `formatOnPageLoad` option will allow it
        if (!this.runOnce && this.settings.formatOnPageLoad) {
            // Format the element value if needed
            this._formatDefaultValueOnPageLoad(initialValue);
        }

        this.runOnce = true;

        // Add the events listeners only on input elements
        if (this.isInputElement || this.isContentEditable) {
            if (!this.settings.noEventListeners) {
                //XXX Here we make sure the global list is created after creating the event listeners, to only create the event listeners on `document` once
                this._createEventListeners();
            }

            this._setReadOnly();
        }

        // Save the initial values (html attribute + element.value) for the pristine test
        this._saveInitialValues(initialValue);
        
        // Setup the data for the persistent storage solution (ie. sessionStorage or cookies)
        this.sessionStorageAvailable = this.constructor._storageTest();
        this.storageNamePrefix = 'AUTO_'; // The prefix for the raw value storage name variable can be modified here
        this._setPersistentStorageName();

        // --------------------------------------------------------
        // -------------- Tracking
        // Keep track if the element is currently focused
        this.isFocused = false;
        // Keep track if a mouse wheel event is currently ongoing
        this.isWheelEvent = false;
        // Keep track if a drop event is currently ongoing
        this.isDropEvent = false;
        // Keep track if the user is currently editing the element
        this.isEditing = false;

        if (this.settings.createLocalList) {
            // Keep track of every AutoNumeric elements that this object initialized
            this._createLocalList();
        }

        // Keep track of all AutoNumeric elements in the current web page
        this.constructor._addToGlobalList(this);

        // --------------------------------------------------------
        // -------------- Methods
        // Create the global functions
        this.global = {
            /**
             * Set the same given element value for each elements in the local AutoNumeric element list, and format those elements immediately
             *
             * @param {number|string} newValue The value must be a number or a numeric string
             * @param {object} options A settings object that will override the current settings. Note: the update is done only if the `newValue` is defined.
             */
            set: (newValue, options = null) => {
                this.autoNumericLocalList.forEach(aNObject => {
                    aNObject.set(newValue, options);
                });
            },

            /**
             * Set the value given value directly as the DOM element value, without formatting it beforehand.
             * This sets the same unformatted value for each elements in the local AutoNumeric element list.
             *
             * @param {number|string} value
             * @param {object} options
             */
            setUnformatted: (value, options = null) => {
                this.autoNumericLocalList.forEach(aNObject => {
                    aNObject.setUnformatted(value, options);
                });
            },

            /**
             * This is an alias of the `getNumericString()` function, and should not be used anymore.
             *
             * @param {function|null} callback If a callback is passed, then the result is passed to it as its first argument, and the AutoNumeric object has its second
             * @returns {Array<string>}
             * @deprecated
             */
            get: (callback = null) => {
                const result = [];
                this.autoNumericLocalList.forEach(aNObject => {
                    result.push(aNObject.get());
                });
                this._executeCallback(result, callback);

                return result;
            },

            /**
             * Return an array of the unformatted values (as a string) of each AutoNumeric element of the local AutoNumeric element list
             *
             * @param {function|null} callback If a callback is passed, then the result is passed to it as its first argument, and the AutoNumeric object has its second
             * @returns {Array<string>}
             */
            getNumericString: (callback = null) => {
                const result = [];
                this.autoNumericLocalList.forEach(aNObject => {
                    result.push(aNObject.getNumericString());
                });
                this._executeCallback(result, callback);

                return result;
            },

            /**
             * Return an array of the current formatted values (as a string) of each AutoNumeric element of the local AutoNumeric element list
             *
             * @param {function|null} callback If a callback is passed, then the result is passed to it as its first argument, and the AutoNumeric object has its second
             * @returns {Array<string>}
             */
            getFormatted: (callback = null) => {
                const result = [];
                this.autoNumericLocalList.forEach(aNObject => {
                    result.push(aNObject.getFormatted());
                });
                this._executeCallback(result, callback);

                return result;
            },

            /**
             * Return an array of the element unformatted values (as a real Javascript number), for each element of the local AutoNumeric element list
             *
             * @param {function|null} callback If a callback is passed, then the result is passed to it as its first argument, and the AutoNumeric object has its second
             * @returns {Array<number>}
             */
            getNumber: (callback = null) => {
                const result = [];
                this.autoNumericLocalList.forEach(aNObject => {
                    result.push(aNObject.getNumber());
                });
                this._executeCallback(result, callback);

                return result;
            },

            /**
             * Returns the unformatted values (following the `outputFormat` setting) of each element of the local AutoNumeric element list into an array
             *
             * @param {function|null} callback If a callback is passed, then the result is passed to it as its first argument, and the AutoNumeric object has its second
             * @returns {Array<string>}
             */
            getLocalized: (callback = null) => {
                const result = [];
                this.autoNumericLocalList.forEach(aNObject => {
                    result.push(aNObject.getLocalized());
                });
                this._executeCallback(result, callback);

                return result;
            },

            /**
             * Force each element of the local AutoNumeric element list to reformat its value
             */
            reformat: () => {
                this.autoNumericLocalList.forEach(aNObject => {
                    aNObject.reformat();
                });
            },

            /**
             * Remove the formatting and keep only the raw unformatted value (as a numericString) in each elements of the local AutoNumeric element list
             */
            unformat: () => {
                this.autoNumericLocalList.forEach(aNObject => {
                    aNObject.unformat();
                });
            },

            /**
             * Remove the formatting and keep only the localized unformatted value in the element, with the option to override the default outputFormat if needed
             *
             * @param {null|string} forcedOutputFormat If set to something different than `null`, then this is used as an overriding outputFormat option
             */
            unformatLocalized: (forcedOutputFormat = null) => {
                this.autoNumericLocalList.forEach(aNObject => {
                    aNObject.unformatLocalized(forcedOutputFormat);
                });
            },

            /**
             * Updates the AutoNumeric settings, and immediately format the elements accordingly, for each elements of the local AutoNumeric element list
             *
             * @param {object} newOptions This can be either one or more option objects
             */
            update: (...newOptions) => {
                this.autoNumericLocalList.forEach(aNObject => {
                    aNObject.update(...newOptions);
                });
            },

            /**
             * Return `true` if *all* the autoNumeric-managed elements are pristine, if their raw value hasn't changed.
             * By default, this returns `true` if the raw unformatted value is still the same even if the formatted one has changed (due to a configuration update for instance).
             *
             * @param {boolean} checkOnlyRawValue If set to `true`, the pristine value is done on the raw unformatted value, not the formatted one. If set to `false`, this also checks that the formatted value hasn't changed.
             * @returns {boolean}
             */
            isPristine: (checkOnlyRawValue = true) => {
                let isPristine = true;
                this.autoNumericLocalList.forEach(aNObject => {
                    if (isPristine && !aNObject.isPristine(checkOnlyRawValue)) {
                        isPristine = false;
                    }
                });

                return isPristine;
            },

            /**
             * Execute the `clear()` method on each AutoNumeric object in the local AutoNumeric element list
             *
             * @param {boolean} forceClearAll
             */
            clear: (forceClearAll = false) => {
                this.autoNumericLocalList.forEach(aNObject => {
                    aNObject.clear(forceClearAll);
                });
            },

            /**
             * Execute the `remove()` method on each AutoNumeric object in the local AutoNumeric element list
             */
            remove: () => {
                this.autoNumericLocalList.forEach(aNObject => {
                    aNObject.remove();
                });
            },

            /**
             * Execute the `wipe()` method on each AutoNumeric object in the local AutoNumeric element list
             */
            wipe: () => {
                this.autoNumericLocalList.forEach(aNObject => {
                    aNObject.wipe();
                });
            },

            /**
             * Execute the `nuke()` method on each AutoNumeric object in the local AutoNumeric element list
             */
            nuke: () => {
                this.autoNumericLocalList.forEach(aNObject => {
                    aNObject.nuke();
                });
            },

            /**
             * Return `true` if the given AutoNumeric object (or DOM element) is in the local AutoNumeric element list
             *
             * @param {HTMLElement|HTMLInputElement|AutoNumeric} domElementOrAutoNumericObject
             * @returns {*}
             */
            has: domElementOrAutoNumericObject => {
                let result;
                if (domElementOrAutoNumericObject instanceof AutoNumeric) {
                    result = this.autoNumericLocalList.has(domElementOrAutoNumericObject.node());
                } else {
                    result = this.autoNumericLocalList.has(domElementOrAutoNumericObject);
                }

                return result;
            },

            /**
             * Add an existing AutoNumeric object (or DOM element) to the local AutoNumeric element list, using the DOM element as the key.
             * This manages the case where `addObject` is used on an AutoNumeric object that already has multiple elements in its local list.
             *
             * @param {HTMLElement|HTMLInputElement|AutoNumeric} domElementOrAutoNumericObject
             */
            addObject: domElementOrAutoNumericObject => {
                // Start with the same data, whatever the user passed as arguments
                let domElement;
                let otherAutoNumericObject;
                if (domElementOrAutoNumericObject instanceof AutoNumeric) {
                    domElement = domElementOrAutoNumericObject.node();
                    otherAutoNumericObject = domElementOrAutoNumericObject;
                } else {
                    domElement = domElementOrAutoNumericObject;
                    otherAutoNumericObject = AutoNumeric.getAutoNumericElement(domElementOrAutoNumericObject);
                }

                // Check if the current autoNumeric object has a local list
                if (!this._hasLocalList()) {
                    this._createLocalList();
                }

                // Check if the other autoNumeric object has a local list...
                let otherANLocalList = otherAutoNumericObject._getLocalList();
                if (otherANLocalList.size === 0) {
                    // Special case if the other AutoNumeric object has an empty local list, then populate itself to it
                    otherAutoNumericObject._createLocalList();
                    otherANLocalList = otherAutoNumericObject._getLocalList(); // Update the other local list
                }

                let mergedLocalLists;
                if (otherANLocalList instanceof Map) {
                    // ...If it does, merge the local lists together
                    mergedLocalLists = AutoNumericHelper.mergeMaps(this._getLocalList(), otherANLocalList);
                } else {
                    // ...If not, just set the current local list onto the other AutoNumeric object
                    // We need to specify the AutoNumeric object, otherwise the `_addToLocalList` function would not correctly add the AutoNumeric object since we would not have a reference to it, but a reference to the current AutoNumeric object on which is called this method.
                    this._addToLocalList(domElement, otherAutoNumericObject);
                    mergedLocalLists = this._getLocalList();
                }

                // Update the resulting list, on all the objects of that local list (so that we can indifferently use `init()` on any object belonging to that list)
                mergedLocalLists.forEach(aNObject => {
                    aNObject._setLocalList(mergedLocalLists);
                });
            },

            /**
             * Remove the given AutoNumeric object (or DOM element) from the local AutoNumeric element list, using the DOM element as the key.
             * If this function attempts to remove the current AutoNumeric object from the local list, a warning is shown, but the deletion is still done.
             *
             * Special cases :
             * - If the current object removes itself, then it's removed from the shared local list, then a new empty local list is used/created
             * - If another object remove this object, then a local list with only this object is used/created
             *
             * @param {HTMLElement|HTMLInputElement|AutoNumeric} domElementOrAutoNumericObject
             * @param {boolean} keepCurrentANObject If set to `false`, then the function will also remove the current AutoNumeric object if asked, otherwise it will ignore it and print a warning message
             */
            removeObject: (domElementOrAutoNumericObject, keepCurrentANObject = false) => {
                // Start with the same data, whatever the user passed as arguments
                let domElement;
                let otherAutoNumericObject;
                if (domElementOrAutoNumericObject instanceof AutoNumeric) {
                    domElement = domElementOrAutoNumericObject.node();
                    otherAutoNumericObject = domElementOrAutoNumericObject;
                } else {
                    domElement = domElementOrAutoNumericObject;
                    otherAutoNumericObject = AutoNumeric.getAutoNumericElement(domElementOrAutoNumericObject);
                }

                // Remove the other object from the local list
                const initialCompleteLocalList = this.autoNumericLocalList;
                this.autoNumericLocalList.delete(domElement);

                // Update the local list for all objects in it
                initialCompleteLocalList.forEach(aNObject => {
                    aNObject._setLocalList(this.autoNumericLocalList);
                });

                if (!keepCurrentANObject && domElement === this.node()) {
                    // This object is removed by itself
                    // Empty the object local list
                    otherAutoNumericObject._setLocalList(new Map);
                } else {
                    // This object is removed by another object
                    // Set the local list for the removed object, with only this object in it
                    otherAutoNumericObject._createLocalList();
                }
            },

            /**
             * Remove all elements from the shared list, effectively emptying it.
             * This is the equivalent of calling `detach()` on each of its elements.
             *
             * @param {boolean} keepEachANObjectInItsOwnList If set to `true`, then instead of completely emptying the local list of each AutoNumeric objects, each one of those keeps itself in its own local list
             */
            empty: (keepEachANObjectInItsOwnList = false) => {
                const initialCompleteLocalList = this.autoNumericLocalList;

                // Update the local list for all objects in it
                initialCompleteLocalList.forEach(aNObject => {
                    if (keepEachANObjectInItsOwnList) {
                        aNObject._createLocalList();
                    } else {
                        aNObject._setLocalList(new Map);
                    }
                });
            },

            /**
             * Return an array containing all the AutoNumeric DOM elements that have been initialized by each other
             *
             * @returns {Array<HTMLElement>}
             */
            elements: () => {
                const result = [];
                this.autoNumericLocalList.forEach(aNObject => {
                    result.push(aNObject.node());
                });

                return result;
            },

            /**
             * Return the `Map` object directly
             * @returns {Map}
             */
            getList: () => this.autoNumericLocalList,

            /**
             * Return the number of element in the local AutoNumeric element list
             * @returns {number}
             */
            size: () => this.autoNumericLocalList.size,
        };

        // Create the functions that will allow to change each setting one by one
        /**
         * For each options, we define if we need to reformat the element content (does changing the options should change the way its value is displayed?).
         * If yes, then we use the `update()` for force a reformat, otherwise, we just update the `settings` object.
         */
        this.options = {
            /**
             * Reset any options set previously, by overwriting them with the default settings
             *
             * @returns {AutoNumeric}
             */
            reset                        : () => {
                //TODO Add a `settings` parameter so that the user can reset to a specific set of settings. This is different than update since it drops any non-default settings before using those new settings.
                this.settings = { rawValue : this.defaultRawValue }; // Here we pass the default rawValue in order to prevent showing a warning that we try to set an `undefined` value
                this.update(AutoNumeric.defaultSettings);

                return this;
            },
            allowDecimalPadding          : allowDecimalPadding => {
                this.update({ allowDecimalPadding });

                return this;
            },
            caretPositionOnFocus         : caretPositionOnFocus => { //FIXME test this
                this.settings.caretPositionOnFocus = caretPositionOnFocus;

                return this;
            },
            createLocalList              : createLocalList => {
                this.settings.createLocalList = createLocalList;

                // Delete the local list when this is set to `false`, create it if this is set to `true` and there is not pre-existing list
                if (this.settings.createLocalList) {
                    if (!this._hasLocalList()) {
                        this._createLocalList();
                    }
                } else {
                    this._deleteLocalList();
                }

                return this;
            },
            currencySymbol               : currencySymbol => {
                this.update({ currencySymbol });

                return this;
            },
            currencySymbolPlacement      : currencySymbolPlacement => {
                this.update({ currencySymbolPlacement });

                return this;
            },
            decimalCharacter             : decimalCharacter => {
                this.update({ decimalCharacter });

                return this;
            },
            decimalCharacterAlternative  : decimalCharacterAlternative => {
                this.settings.decimalCharacterAlternative = decimalCharacterAlternative;

                return this;
            },
            /**
             * Update the decimal places globally, which means this override any previously set number of decimal shown on focus, on blur, or in the raw value.
             *
             * @param {int} decimalPlaces
             * @returns {AutoNumeric}
             */
            decimalPlaces                : decimalPlaces => {
                AutoNumericHelper.warning('Using `options.decimalPlaces()` instead of calling the specific `options.decimalPlacesRawValue()`, `options.decimalPlacesShownOnFocus()` and `options.decimalPlacesShownOnBlur()` methods will reset those options.\nPlease call the specific methods if you do not want to reset those.', this.settings.showWarnings);
                this.update({ decimalPlaces });

                return this;
            },
            decimalPlacesRawValue        : decimalPlacesRawValue => { //FIXME test this
                this.update({ decimalPlacesRawValue });

                return this;
            },
            decimalPlacesShownOnBlur     : decimalPlacesShownOnBlur => {
                this.update({ decimalPlacesShownOnBlur });

                return this;
            },
            decimalPlacesShownOnFocus    : decimalPlacesShownOnFocus => {
                this.update({ decimalPlacesShownOnFocus });

                return this;
            },
            defaultValueOverride         : defaultValueOverride => {
                this.update({ defaultValueOverride });

                return this;
            },
            digitalGroupSpacing          : digitalGroupSpacing => {
                this.update({ digitalGroupSpacing });

                return this;
            },
            digitGroupSeparator          : digitGroupSeparator => {
                this.update({ digitGroupSeparator });

                return this;
            },
            divisorWhenUnfocused         : divisorWhenUnfocused => {
                this.update({ divisorWhenUnfocused });

                return this;
            },
            emptyInputBehavior           : emptyInputBehavior => {
                if (this.rawValue === null && emptyInputBehavior !== AutoNumeric.options.emptyInputBehavior.null) {
                    // Special case : if the current `rawValue` is `null` and the `emptyInputBehavior` is changed to something else than `'null'`, then it makes that `rawValue` invalid.
                    // Here we can either prevent the option update and throw an error, or still accept the option update and update the value from `null` to `''`.
                    // We cannot keep `rawValue` to `null` since if `emptyInputBehavior` is not set to `null`, lots of function assume `rawValue` is a string.
                    AutoNumericHelper.warning(`You are trying to modify the \`emptyInputBehavior\` option to something different than \`'null'\` (${emptyInputBehavior}), but the element raw value is currently set to \`null\`. This would result in an invalid \`rawValue\`. In order to fix that, the element value has been changed to the empty string \`''\`.`, this.settings.showWarnings);
                    this.rawValue = '';
                }

                this.update({ emptyInputBehavior });

                return this;
            },
            failOnUnknownOption          : failOnUnknownOption => {
                this.settings.failOnUnknownOption = failOnUnknownOption; //FIXME test this

                return this;
            },
            formatOnPageLoad             : formatOnPageLoad => {
                this.settings.formatOnPageLoad = formatOnPageLoad; //FIXME test this

                return this;
            },
            historySize                  : historySize => {
                this.settings.historySize = historySize;

                return this;
            },
            isCancellable                : isCancellable => {
                this.settings.isCancellable = isCancellable; //FIXME test this

                return this;
            },
            leadingZero                  : leadingZero => {
                this.update({ leadingZero });

                return this;
            },
            maximumValue                 : maximumValue => {
                this.update({ maximumValue });

                return this;
            },
            minimumValue                 : minimumValue => {
                this.update({ minimumValue });

                return this;
            },
            modifyValueOnWheel           : modifyValueOnWheel => {
                this.settings.modifyValueOnWheel = modifyValueOnWheel; //FIXME test this

                return this;
            },
            negativeBracketsTypeOnBlur   : negativeBracketsTypeOnBlur => {
                this.update({ negativeBracketsTypeOnBlur });

                return this;
            },
            negativePositiveSignPlacement: negativePositiveSignPlacement => {
                this.update({ negativePositiveSignPlacement });

                return this;
            },
            noEventListeners             : noEventListeners => { //FIXME test this
                if (noEventListeners === AutoNumeric.options.noEventListeners.noEvents && this.settings.noEventListeners === AutoNumeric.options.noEventListeners.addEvents) {
                    // Remove the events once
                    this._removeEventListeners();
                }

                this.update({ noEventListeners });

                return this;
            },
            onInvalidPaste               : onInvalidPaste => {
                this.settings.onInvalidPaste = onInvalidPaste; //FIXME test this

                return this;
            },
            outputFormat                 : outputFormat => {
                this.settings.outputFormat = outputFormat;

                return this;
            },
            overrideMinMaxLimits         : overrideMinMaxLimits => {
                this.update({ overrideMinMaxLimits });

                return this;
            },
            rawValueDivisor              : rawValueDivisor => {
                this.update({ rawValueDivisor });

                return this;
            },
            readOnly                     : readOnly => { //FIXME test this
                this.settings.readOnly = readOnly;
                this._setReadOnly();

                return this;
            },
            roundingMethod               : roundingMethod => {
                this.update({ roundingMethod });

                return this;
            },
            saveValueToSessionStorage    : saveValueToSessionStorage => {
                this.update({ saveValueToSessionStorage });

                return this;
            },
            symbolWhenUnfocused          : symbolWhenUnfocused => {
                this.update({ symbolWhenUnfocused });

                return this;
            },
            selectNumberOnly             : selectNumberOnly => {
                this.settings.selectNumberOnly = selectNumberOnly; //FIXME test this

                return this;
            },
            selectOnFocus                : selectOnFocus => {
                this.settings.selectOnFocus = selectOnFocus; //FIXME test this

                return this;
            },
            serializeSpaces              : serializeSpaces => {
                this.settings.serializeSpaces = serializeSpaces; //FIXME test this

                return this;
            },
            showOnlyNumbersOnFocus       : showOnlyNumbersOnFocus => {
                this.update({ showOnlyNumbersOnFocus });

                return this;
            },
            showPositiveSign             : showPositiveSign => {
                this.update({ showPositiveSign });

                return this;
            },
            showWarnings                 : showWarnings => {
                this.settings.showWarnings = showWarnings; //FIXME test this

                return this;
            },
            styleRules                   : styleRules => {
                this.update({ styleRules });

                return this;
            },
            suffixText                   : suffixText => {
                this.update({ suffixText });

                return this;
            },
            unformatOnHover              : unformatOnHover => {
                this.settings.unformatOnHover = unformatOnHover; //FIXME test this

                return this;
            },
            unformatOnSubmit             : unformatOnSubmit => {
                this.settings.unformatOnSubmit = unformatOnSubmit; //FIXME test this

                return this;
            },
            wheelStep                    : wheelStep => {
                this.settings.wheelStep = wheelStep; //FIXME test this

                return this;
            },
        };
    }

    /**
     * Return the autoNumeric version number (for debugging purpose)
     *
     * @returns {string}
     */
    static version() {
        return '4.0.3';
    }

    /**
     * Take the parameters given to the AutoNumeric object, and output the three variables that are needed to finish initializing it :
     * - domElement : The target DOM element
     * - initialValue : The initial value, or `null` if none is given
     * - userOptions : The option object
     *
     * @param {object|Array|number|string} arg1
     * @param {object|Array|number|string|null} arg2
     * @param {object|Array|number|string|null} arg3
     * @returns {{domElement: *, initialValue: *, userOptions: *}}
     * @throws
     * @private
     */
    static _setArgumentsValues(arg1, arg2, arg3) {
        // Basic check on the argument count
        if (AutoNumericHelper.isNull(arg1)) {
            AutoNumericHelper.throwError('At least one valid parameter is needed in order to initialize an AutoNumeric object');
        }

        // Prepare the arguments in order to create the AutoNumeric object with the right values
        // Test the argument types
        const isArg1Element = AutoNumericHelper.isElement(arg1);
        const isArg1String = AutoNumericHelper.isString(arg1);

        const isArg2Object = AutoNumericHelper.isObject(arg2);
        const isArg2Array = Array.isArray(arg2) && arg2.length > 0;
        const isArg2Number = AutoNumericHelper.isNumberOrArabic(arg2) || arg2 === '';
        const isArg2PreDefinedOptionName = this._isPreDefinedOptionValid(arg2);
        const isArg2Null = AutoNumericHelper.isNull(arg2);
        const isArg2EmptyString = AutoNumericHelper.isEmptyString(arg2);

        const isArg3Object = AutoNumericHelper.isObject(arg3);
        const isArg3Array = Array.isArray(arg3) && arg3.length > 0;
        const isArg3Null = AutoNumericHelper.isNull(arg3);
        const isArg3PreDefinedOptionName = this._isPreDefinedOptionValid(arg3);

        // Given the parameters passed, sort the data and return a stable state before the initialization
        let domElement;
        let userOptions;
        let initialValue;

        //TODO Simplify those tests -->
        if (isArg1Element && isArg2Null && isArg3Null) {
            // new AutoNumeric(domElement); // With the default options
            domElement = arg1;
            initialValue = null;
            userOptions = null;
        } else if (isArg1Element && isArg2Number && isArg3Null) {
            // new AutoNumeric(domElement, 12345.789); // With the default options, and an initial value
            // new AutoNumeric(domElement, '12345.789');
            domElement = arg1;
            initialValue = arg2;
            userOptions = null;
        } else if (isArg1Element && isArg2Object && isArg3Null) {
            // new AutoNumeric(domElement, { options }); // With one option object
            domElement = arg1;
            initialValue = null;
            userOptions = arg2;
        } else if (isArg1Element && isArg2PreDefinedOptionName && isArg3Null) {
            // new AutoNumeric(domElement, 'euroPos'); // With one pre-defined option name
            domElement = arg1;
            initialValue = null;
            userOptions = this._getOptionObject(arg2);
        } else if (isArg1Element && isArg2Array && isArg3Null) {
            // new AutoNumeric(domElement, [{ options1 }, { options2 }]); // With multiple option objects (the latest option overwriting the previous ones)
            domElement = arg1;
            initialValue = null;
            userOptions = this.mergeOptions(arg2);
        } else if (isArg1Element && (isArg2Null || isArg2EmptyString) && isArg3Object) {
            // new AutoNumeric(domElement, null, { options }); // With one option object
            domElement = arg1;
            initialValue = null;
            userOptions = arg3;
        } else if (isArg1Element && (isArg2Null || isArg2EmptyString) && isArg3Array) {
            // new AutoNumeric(domElement, null, [{ options1 }, { options2 }]); // With multiple option objects
            domElement = arg1;
            initialValue = null;
            userOptions = this.mergeOptions(arg3);
        } else if (isArg1String && isArg2Null && isArg3Null) {
            // new AutoNumeric('.myCssClass > input');
            domElement = document.querySelector(arg1);
            initialValue = null;
            userOptions = null;
        } else if (isArg1String && isArg2Object && isArg3Null) {
            // new AutoNumeric('.myCssClass > input', { options });
            domElement = document.querySelector(arg1);
            initialValue = null;
            userOptions = arg2;
        } else if (isArg1String && isArg2PreDefinedOptionName && isArg3Null) {
            // new AutoNumeric('.myCssClass > input', 'euroPos');
            domElement = document.querySelector(arg1);
            initialValue = null;
            userOptions = this._getOptionObject(arg2);
        } else if (isArg1String && isArg2Array && isArg3Null) {
            // new AutoNumeric('.myCssClass > input', [{ options1 }, { options2 }]); // With multiple option objects
            domElement = document.querySelector(arg1);
            initialValue = null;
            userOptions = this.mergeOptions(arg2);
        } else if (isArg1String && (isArg2Null || isArg2EmptyString) && isArg3Object) {
            // new AutoNumeric('.myCssClass > input', null, { options });
            domElement = document.querySelector(arg1);
            initialValue = null;
            userOptions = arg3;
        } else if (isArg1String && (isArg2Null || isArg2EmptyString) && isArg3Array) {
            // new AutoNumeric('.myCssClass > input', null, [{ options1 }, { options2 }]); // With multiple option objects
            domElement = document.querySelector(arg1);
            initialValue = null;
            userOptions = this.mergeOptions(arg3);
        } else if (isArg1String && isArg2Number && isArg3Null) {
            // new AutoNumeric('.myCssClass > input', 12345.789);
            // new AutoNumeric('.myCssClass > input', '12345.789');
            // new AutoNumeric('.myCssClass > input', '');
            domElement = document.querySelector(arg1);
            initialValue = arg2;
            userOptions = null;
        } else if (isArg1String && isArg2Number && isArg3Object) {
            // new AutoNumeric('.myCssClass > input', 12345.789, { options });
            // new AutoNumeric('.myCssClass > input', '12345.789', { options });
            // new AutoNumeric('.myCssClass > input', '', { options });
            domElement = document.querySelector(arg1);
            initialValue = arg2;
            userOptions = arg3;
        } else if (isArg1String && isArg2Number && isArg3PreDefinedOptionName) {
            // new AutoNumeric('.myCssClass > input', 12345.789, 'euroPos');
            // new AutoNumeric('.myCssClass > input', '12345.789', 'euroPos');
            // new AutoNumeric('.myCssClass > input', '', 'euroPos');
            domElement = document.querySelector(arg1);
            initialValue = arg2;
            userOptions = this._getOptionObject(arg3);
        } else if (isArg1Element && isArg2Number && isArg3Object) {
            // new AutoNumeric(domElement, 12345.789, { options });
            // new AutoNumeric(domElement, '12345.789', { options });
            // new AutoNumeric(domElement, '', { options });
            domElement = arg1;
            initialValue = arg2;
            userOptions = arg3;
        } else if (isArg1Element && isArg2Number && isArg3PreDefinedOptionName) {
            // new AutoNumeric(domElement, 12345.789, 'euroPos');
            // new AutoNumeric(domElement, '12345.789', 'euroPos');
            // new AutoNumeric(domElement, '', 'euroPos');
            domElement = arg1;
            initialValue = arg2;
            userOptions = this._getOptionObject(arg3);
        } else if (isArg1Element && isArg2Number && isArg3Array) {
            // new AutoNumeric(domElement, 12345.789, [{ options1 }, { options2 }]);
            // new AutoNumeric(domElement, '12345.789', [{ options1 }, { options2 }]);
            // new AutoNumeric(domElement, '', [{ options1 }, { options2 }]);
            domElement = arg1;
            initialValue = arg2;
            userOptions = this.mergeOptions(arg3);
        } else {
            AutoNumericHelper.throwError(`The parameters given to the AutoNumeric object are not valid, '${arg1}', '${arg2}' and '${arg3}' given.`);
        }

        if (AutoNumericHelper.isNull(domElement)) {
            AutoNumericHelper.throwError(`The selector '${arg1}' did not select any valid DOM element. Please check on which element you called AutoNumeric.`);
        }

        return { domElement, initialValue, userOptions };
    }

    /**
     * Merge the option objects found in the given array `optionsArray`.
     * If a `string` is found, then we try to get the related pre-defined option using that string as its name.
     * When merging the options, the latest option overwrite any previously set. This allows to fine tune a pre-defined option for instance.
     *
     * @param {Array<object|string>} optionsArray
     * @returns {{}}
     */
    static mergeOptions(optionsArray) {
        // This allows the user to use multiple options (strings or objects) in an array, and overwrite the previous one with the next option element ; this is useful to tune the wanted format
        const mergedOptions = {};
        optionsArray.forEach(optionObjectOrPredefinedOptionString => {
            Object.assign(mergedOptions, this._getOptionObject(optionObjectOrPredefinedOptionString));
        });

        return mergedOptions;
    }

    /**
     * Return `true` if the given pre-defined option name is an attribute of the `AutoNumeric.predefinedOptions` object
     *
     * @param {string} preDefinedOptionName
     * @returns {boolean}
     * @private
     */
    static _isPreDefinedOptionValid(preDefinedOptionName) {
        return AutoNumeric.predefinedOptions.hasOwnProperty(preDefinedOptionName);
    }

    /**
     * Return an option object based on the given parameter.
     * If `optionObjectOrPredefinedName` is as string, then we retrieve the pre-defined option object, if it's an object, we use it as is.
     *
     * @param {object|string} optionObjectOrPredefinedName
     * @returns {object}
     */
    static _getOptionObject(optionObjectOrPredefinedName) {
        let options;
        if (AutoNumericHelper.isString(optionObjectOrPredefinedName)) {
            options = AutoNumeric.getPredefinedOptions()[optionObjectOrPredefinedName];
            if (options === void(0) || options === null) {
                // If the given pre-defined name does not exist, warn that something is wrong, and continue the execution of the initialization
                AutoNumericHelper.warning(`The given pre-defined option [${optionObjectOrPredefinedName}] is not recognized by autoNumeric. Please check that pre-defined option name.`, true);
            }
        } else { // A `settings` object
            options = optionObjectOrPredefinedName;
        }

        return options;
    }

    /**
     * Save the initial element values for later use in the pristine test.
     * Those values are :
     * - the html attribute (ie. <input value='42'>), and
     * - the script `value` (ie. `let domElement.value`)
     *
     * @param {null|number|string} initialValue
     * @private
     */
    _saveInitialValues(initialValue) {
        // Keep the very first initial values (in the html attribute and set by the script). This is needed to check if the element is pristine.
        // Save the html attribute 'value'
        this.initialValueHtmlAttribute = this.domElement.getAttribute('value');
        if (AutoNumericHelper.isNull(this.initialValueHtmlAttribute)) {
            // Set the default empty value attribute instead of `null`, since if the initial value is null, the empty string is used
            this.initialValueHtmlAttribute = '';
        }

        // Save the 'script' value
        this.initialValue = initialValue;
        if (AutoNumericHelper.isNull(this.initialValue)) {
            // Same as above
            this.initialValue = '';
        }
    }

    /**
     * Generate all the event listeners for the given DOM element
     * @private
     */
    _createEventListeners() {
        // Create references to the event handler functions, so we can then cleanly removes those listeners if needed
        // That would not be possible if we used closures directly in the event handler declarations
        this._onFocusInFunc = e => { this._onFocusIn(e); };
        this._onFocusInAndMouseEnterFunc = e => { this._onFocusInAndMouseEnter(e); };
        this._onFocusFunc = () => { this._onFocus(); };
        this._onKeydownFunc = e => { this._onKeydown(e); };
        this._onKeypressFunc = e => { this._onKeypress(e); };
        this._onInputFunc = e => { this._onInput(e); };
        this._onKeyupFunc = e => { this._onKeyup(e); };
        this._onFocusOutAndMouseLeaveFunc = e => { this._onFocusOutAndMouseLeave(e); };
        this._onPasteFunc = e => { this._onPaste(e); };
        this._onWheelFunc = e => { this._onWheel(e); };
        this._onFormSubmitFunc = () => { this._onFormSubmit(); };
        this._onKeydownGlobalFunc = e => { this._onKeydownGlobal(e); };
        this._onKeyupGlobalFunc = e => { this._onKeyupGlobal(e); };
        this._onDropFunc = e => { this._onDrop(e); };

        // Add the event listeners
        this.domElement.addEventListener('focusin', this._onFocusInFunc, false);
        this.domElement.addEventListener('focus', this._onFocusInAndMouseEnterFunc, false);
        this.domElement.addEventListener('focus', this._onFocusFunc, false);
        this.domElement.addEventListener('mouseenter', this._onFocusInAndMouseEnterFunc, false);
        this.domElement.addEventListener('keydown', this._onKeydownFunc, false);
        this.domElement.addEventListener('keypress', this._onKeypressFunc, false);
        this.domElement.addEventListener('input', this._onInputFunc, false);
        this.domElement.addEventListener('keyup', this._onKeyupFunc, false);
        this.domElement.addEventListener('blur', this._onFocusOutAndMouseLeaveFunc, false);
        this.domElement.addEventListener('mouseleave', this._onFocusOutAndMouseLeaveFunc, false);
        this.domElement.addEventListener('paste', this._onPasteFunc, false);
        this.domElement.addEventListener('wheel', this._onWheelFunc, false);
        this.domElement.addEventListener('drop', this._onDropFunc, false);

        if (!AutoNumericHelper.isNull(this.parentForm)) {
            this.parentForm.addEventListener('submit', this._onFormSubmitFunc, false);
        }

        // Create one global event listener for the keyup event on the document object, which will be shared by all the autoNumeric elements
        if (!AutoNumeric._doesGlobalListExists()) {
            document.addEventListener('keydown', this._onKeydownGlobalFunc, false);
            document.addEventListener('keyup', this._onKeyupGlobalFunc, false);
        }
    }

    /**
     * Remove all the autoNumeric-related event listeners for the given DOM element
     * @private
     */
    _removeEventListeners() { //FIXME test this
        this.domElement.removeEventListener('focusin', this._onFocusInFunc, false);
        this.domElement.removeEventListener('focus', this._onFocusInAndMouseEnterFunc, false);
        this.domElement.removeEventListener('focus', this._onFocusFunc, false);
        this.domElement.removeEventListener('mouseenter', this._onFocusInAndMouseEnterFunc, false);
        this.domElement.removeEventListener('blur', this._onFocusOutAndMouseLeaveFunc, false);
        this.domElement.removeEventListener('mouseleave', this._onFocusOutAndMouseLeaveFunc, false);
        this.domElement.removeEventListener('keydown', this._onKeydownFunc, false);
        this.domElement.removeEventListener('keypress', this._onKeypressFunc, false);
        this.domElement.removeEventListener('input', this._onInputFunc, false);
        this.domElement.removeEventListener('keyup', this._onKeyupFunc, false);
        this.domElement.removeEventListener('paste', this._onPasteFunc, false);
        this.domElement.removeEventListener('wheel', this._onWheelFunc, false);

        document.removeEventListener('keydown', this._onKeydownGlobalFunc, false);
        document.removeEventListener('keyup', this._onKeyupGlobalFunc, false);

        if (!AutoNumericHelper.isNull(this.parentForm)) {
            this.parentForm.removeEventListener('submit', this._onFormSubmitFunc, false);
        }
    }

    /**
     * Set the element attribute 'readonly' according to the current settings.
     *
     * @private
     */
    _setReadOnly() {
        if (this.isInputElement && this.settings.readOnly) {
            this.domElement.readOnly = true;
        }
    }

    /**
     * Save the current raw value into the history table, along with the selection information.
     *
     * If the user has done some undos and tries to enter:
     * - a new and different number than the 'next' state, this drops the rest of the history table
     * - the very same number that result in the same rawValue than the 'next' state, we only move the history table pointer to the next state
     *
     * @private
     */
    _historyTableAdd() {
        //TODO Add a `this.settings.saveSelectionsIntoHistory` option to prevent saving the selections (in order to gain performance)
        const isEmptyHistoryTable = this.historyTable.length === 0;
        // Only add a new value if it's different than the previous one (to prevent infinitely adding values on mouseover for instance)
        if (isEmptyHistoryTable || this.rawValue !== this._historyTableCurrentValueUsed()) {
            // Trim the history table if the user changed the value of an intermediary state
            let addNewHistoryState = true;
            if (!isEmptyHistoryTable) {
                // If some undo has been done and the user type the exact same data than the next entry after the current history pointer, do no drop the rest of the 'redo' list, and just advance the historyTableIndex
                const nextHistoryStateIndex = this.historyTableIndex + 1;
                if (nextHistoryStateIndex < this.historyTable.length && this.rawValue === this.historyTable[nextHistoryStateIndex].value) {
                    // If the character input result in the same state than the next one, do not remove the next history states nor add a new one
                    addNewHistoryState = false;
                } else {
                    // First remove anything that is after the current index
                    AutoNumericHelper.arrayTrim(this.historyTable, this.historyTableIndex + 1);
                }
            }

            // Update the history pointer
            this.historyTableIndex++;

            // Add the new history state, if needed
            if (addNewHistoryState) {
                // Save the selection info
                const selection = AutoNumericHelper.getElementSelection(this.domElement);
                this.selectionStart = selection.start;
                this.selectionEnd = selection.end;

                // Then add the new raw value
                this.historyTable.push({
                    // Save the rawValue and selection start/end
                    value: this.rawValue,
                    // The selection for this element is temporary, and will be updated when the next history state will be recorded.
                    // That way, we are always sure we save the last caret or selection positions just before the value is changed. Otherwise we would only save those positions when the value is first changed, and would not take into account that the user could move the caret around afterward.
                    // For instance, this is needed if the user change the element value, and immediately undo it ; if he then does a redo, he'll see the value and the right selection
                    // To sum up; The selection position are not always +1 character, since it could also be '2' if a group separator is added when entering one character. That's why the current history state caret/selection position is updated on each `keyup` event.
                    start: this.selectionStart + 1, // Here we add one since the user added one character too
                    end  : this.selectionEnd + 1,
                });

                // Update the selection in the previous entry, in order to keep track of the updated caret/selection positions
                if (this.historyTable.length > 1) {
                    this.historyTable[this.historyTableIndex - 1].start = this.selectionStart;
                    this.historyTable[this.historyTableIndex - 1].end = this.selectionEnd;
                }
            }

            // Limit the history table size according to the `historySize` option
            if (this.historyTable.length > this.settings.historySize) {
                this._historyTableForget();
            }
        }
    }

    /**
     * Debug function for the history table
     * @private
     */
    /*
    _debugHistoryTable() {
        let i = 0;
        let mark;
        this.historyTable.forEach(history => {
            if (this.historyTableIndex === i) {
                mark = '> ';
            } else {
                mark = '';
            }
            console.log(`${mark}${i++}: ${history.value} ${history.start}|${history.end} [onGoingRedo: ${this.onGoingRedo}]`); //DEBUG
        });
    }
    */

    /**
     * 'Undo' or 'Redo' the last/next user entry in the history table.
     * This does not modify the history table, only the pointer to the current state.
     *
     * @param {boolean} undo If set to `true`, then this function does an 'Undo', otherwise it does a 'Redo'
     * @private
     */
    _historyTableUndoOrRedo(undo = true) {
        let check;
        if (undo) {
            // Only 'undo' if there are some info to undo
            check = this.historyTableIndex > 0;
            if (check) {
                this.historyTableIndex--;
            }
        } else {
            // Only 'redo' if there are some info to redo at the end of the history table
            check = this.historyTableIndex + 1 < this.historyTable.length;
            if (check) {
                this.historyTableIndex++;
            }
        }

        if (check) {
            // Set the value back
            const undoInfo = this.historyTable[this.historyTableIndex];
            this.set(undoInfo.value, null, false); // next or previous raw value

            // Set the selection back
            AutoNumericHelper.setElementSelection(this.domElement, undoInfo.start, undoInfo.end);
        }
    }

    /**
     * 'Undo' the last user entry by going back one entry in the history table.
     * This keeps the following entries in order to allow for a 'redo'.
     * This does not modify the history table, only the pointer to the current state.
     * @private
     */
    _historyTableUndo() {
        this._historyTableUndoOrRedo(true);
    }

    /**
     * 'Redo' the next user entry in the history table.
     * This does not modify the history table, only the pointer to the current state.
     * @private
     */
    _historyTableRedo() {
        this._historyTableUndoOrRedo(false);
    }

    /**
     * Reset the history table to its initial state, and select the value.
     * @private
     */
    /*
    resetHistoryTable() { //FIXME Test this
        this.set(this.rawValue, null, false);
        this.select();
        const selection = AutoNumericHelper.getElementSelection(this.domElement);
        this.historyTableIndex = 0;
        this.historyTable = [{
            // Save the rawValue and selection start/end
            value: this.rawValue,
            start: selection.start,
            end  : selection.end,
        }];
    }
    */

    /**
     * Make the history table forget its first N elements, shifting its indexes in the process.
     * `N` being given as the `numberOfEntriesToForget` parameter.
     *
     * @param {Number} numberOfEntriesToForget
     * @returns {object|Array<object>} The discarded objects, in an Array.
     * @private
     */
    _historyTableForget(numberOfEntriesToForget = 1) {
        const shiftedAway = [];
        for (let i = 0; i < numberOfEntriesToForget; i++) {
            shiftedAway.push(this.historyTable.shift());
            // Update the history table index accordingly
            this.historyTableIndex--;
            if (this.historyTableIndex < 0) {
                // In case this function is called more times than there is states in the history table
                this.historyTableIndex = 0;
            }
        }

        if (shiftedAway.length === 1) {
            return shiftedAway[0];
        }

        return shiftedAway;
    }

    /**
     * Return the currently used value from the history table.
     *
     * @returns {string|number}
     * @private
     */
    _historyTableCurrentValueUsed() {
        let indexToUse = this.historyTableIndex;
        if (indexToUse < 0) {
            indexToUse = 0;
        }

        let result;
        if (AutoNumericHelper.isUndefinedOrNullOrEmpty(this.historyTable[indexToUse])) {
            result = '';
        } else {
            result = this.historyTable[indexToUse].value;
        }

        return result;
    }

    /**
     * Parse the `styleRules` option and run the test for each given rules, either pre-defined ones like `positive`, `negative` and `ranges`, or user defined callbacks within the `userDefined` attribute.
     * @private
     */
    _parseStyleRules() {
        if (AutoNumericHelper.isUndefinedOrNullOrEmpty(this.settings.styleRules) || this.rawValue === '') {
            return;
        }

        // 'positive' attribute
        if (!AutoNumericHelper.isUndefinedOrNullOrEmpty(this.settings.styleRules.positive)) {
            if (this.rawValue >= 0) {
                this._addCSSClass(this.settings.styleRules.positive);
            } else {
                this._removeCSSClass(this.settings.styleRules.positive);
            }
        }

        // 'negative' attribute
        if (!AutoNumericHelper.isUndefinedOrNullOrEmpty(this.settings.styleRules.negative)) {
            if (this.rawValue < 0) {
                this._addCSSClass(this.settings.styleRules.negative);
            } else {
                this._removeCSSClass(this.settings.styleRules.negative);
            }
        }

        // 'ranges' attribute
        if (!AutoNumericHelper.isUndefinedOrNullOrEmpty(this.settings.styleRules.ranges) && this.settings.styleRules.ranges.length !== 0) {
            this.settings.styleRules.ranges.forEach(range => {
                if (this.rawValue >= range.min && this.rawValue < range.max) {
                    this._addCSSClass(range.class);
                } else {
                    this._removeCSSClass(range.class);
                }
            });
        }

        // 'userDefined' attribute
        //TODO Also pass the old raw value as a parameter, and not only the new raw value
        if (!AutoNumericHelper.isUndefinedOrNullOrEmpty(this.settings.styleRules.userDefined) && this.settings.styleRules.userDefined.length !== 0) {
            this.settings.styleRules.userDefined.forEach(userObject => {
                if (AutoNumericHelper.isFunction(userObject.callback)) {
                    // Test for the type of the `classes` attribute, which changes the function behavior
                    if (AutoNumericHelper.isString(userObject.classes)) {
                        // If 'classes' is a string, set it if `true`, remove it if `false`
                        if (userObject.callback(this.rawValue)) {
                            this._addCSSClass(userObject.classes);
                        } else {
                            this._removeCSSClass(userObject.classes);
                        }
                    } else if (AutoNumericHelper.isArray(userObject.classes)) {
                        if (userObject.classes.length === 2) {
                            // If 'classes' is an array with only 2 elements, set the first class if `true`, the second if `false`
                            if (userObject.callback(this.rawValue)) {
                                this._addCSSClass(userObject.classes[0]);
                                this._removeCSSClass(userObject.classes[1]);
                            } else {
                                this._removeCSSClass(userObject.classes[0]);
                                this._addCSSClass(userObject.classes[1]);
                            }
                        } else if (userObject.classes.length > 2) {
                            // The callback returns an array of indexes to use on the `classes` array
                            const callbackResult = userObject.callback(this.rawValue);
                            if (AutoNumericHelper.isArray(callbackResult)) {
                                // If multiple indexes are returned
                                userObject.classes.forEach((userClass, index) => {
                                    if (AutoNumericHelper.isInArray(index, callbackResult)) {
                                        this._addCSSClass(userClass);
                                    } else {
                                        this._removeCSSClass(userClass);
                                    }
                                });
                            } else if (AutoNumericHelper.isInt(callbackResult)) {
                                // If only one index is returned
                                userObject.classes.forEach((userClass, index) => {
                                    if (index === callbackResult) {
                                        this._addCSSClass(userClass);
                                    } else {
                                        this._removeCSSClass(userClass);
                                    }
                                });
                            } else if (AutoNumericHelper.isNull(callbackResult)) {
                                // Remove all the classes
                                userObject.classes.forEach(userClass => {
                                    this._removeCSSClass(userClass);
                                });
                            } else {
                                AutoNumericHelper.throwError(`The callback result is not an array nor a valid array index, ${typeof callbackResult} given.`);
                            }
                        } else {
                            AutoNumericHelper.throwError('The classes attribute is not valid for the `styleRules` option.');
                        }
                    } else if (AutoNumericHelper.isUndefinedOrNullOrEmpty(userObject.classes)) {
                        // If 'classes' is `undefined` or `null`, then the callback is called with the AutoNumeric object passed as a parameter
                        userObject.callback(this);
                    } else {
                        AutoNumericHelper.throwError('The callback/classes structure is not valid for the `styleRules` option.');
                    }
                } else {
                    AutoNumericHelper.warning(`The given \`styleRules\` callback is not a function, ${typeof callback} given.`, this.settings.showWarnings);
                }
            });
        }
    }

    /**
     * Add the given CSS class to the DOM element.
     *
     * @param {string} cssClassName
     * @private
     */
    _addCSSClass(cssClassName) {
        this.domElement.classList.add(cssClassName);
    }

    /**
     * Remove the given CSS class from the DOM element.
     *
     * @param {string} cssClassName
     * @private
     */
    _removeCSSClass(cssClassName) {
        this.domElement.classList.remove(cssClassName);
    }

    // This are the public function available on each autoNumeric-managed element

    /**
     * Method that updates the AutoNumeric settings, and immediately format the element accordingly.
     * The options passed as parameter(s) is either one or many objects that each contains some settings, ie. :
     * {
     *     digitGroupSeparator: ".",
     *     decimalCharacter: ",",
     *     currencySymbol: '€ ',
     * }
     * If multiple options are passed, the latter overwrite the previous ones.
     *
     * Note: If the new settings are not validated, or the call to `set()` fails, then the previous valid settings are reverted back to.
     *
     * @example anElement.update({ options }) // Updates the settings
     * @example anElement.update({ options1 }, { options2 }) // Updates the settings with multiple option objects
     *
     * @param {object} newOptions
     * @returns {AutoNumeric}
     */
    update(...newOptions) {
        // Keep a copy of the original settings before changing them, in case they do not validate correctly, so we can switch back to them
        const originalSettings = AutoNumericHelper.cloneObject(this.settings); //TODO Check that the `styleRules` option is correctly cloned (due to depth cloning limitation)

        // Store the current unformatted input value
        const numericString = this.rawValue;

        // Generate a single option object with the settings from the latter overwriting those from the former
        let optionsToUse = {};
        if (AutoNumericHelper.isUndefinedOrNullOrEmpty(newOptions) || newOptions.length === 0) {
            optionsToUse = null;
        } else if (newOptions.length >= 1) {
            newOptions.forEach(optionObject => {
                Object.assign(optionsToUse, optionObject);
            });
        }

        // Update the settings
        try {
            this._setSettings(optionsToUse, true);

            // Reformat the input value with the new settings
            // Note: we always `set`, even when `numericString` is the empty string '', since `emptyInputBehavior` (set to `always` or `zero`) can change how the empty input is formatted
            this.set(numericString);
        } catch (error) {
            // If the settings validation fails, then we switch back to the previous valid settings
            this._setSettings(originalSettings, true); // `_setSettings()` is used here instead of directly doing `this.settings = originalSettings;` since lots of side variables are calculated from the settings, and we need to get those back to their previous state. Note: `_setSettings()` is called in the 'update' mode in order to correctly set back the `originalDecimalPlacesRawValue` value.
            AutoNumericHelper.throwError(`Unable to update the settings, those are invalid: [${error}]`);

            return this;
        }

        return this;
    }

    /**
     * Return the options object containing all the current autoNumeric settings in effect.
     * You can then directly access each option by using its name : `anElement.getSettings().optionNameAutoCompleted`.
     *
     * @example
     * anElement.getSettings()
     * anElement.getSettings().decimalCharacter // Return the decimalCharacter setting as a string - any valid option name can be used
     *
     * @returns {object}
     */
    getSettings() {
        return this.settings;
    }

    /**
     * Set the given element value, and format it immediately.
     * Additionally, this `set()` method can accept options that will be merged into the current AutoNumeric element, taking precedence over any previous settings.
     *
     * @example anElement.set('12345.67') // Formats the value
     * @example anElement.set(12345.67) // Formats the value
     * @example anElement.set(12345.67, { decimalCharacter : ',' }) // Update the settings and formats the value in one go
     * @example anElement.northAmerican().set('$12,345.67') // Set an already formatted value (this does not _exactly_ respect the currency symbol/negative placements, but only remove all non-numbers characters, according to the ones given in the settings)
     * @example anElement.set(null) // Set the rawValue and element value to `null`
     *
     * @param {number|string|null} newValue The value must be a number, a numeric string or `null` (if `emptyInputBehavior` is set to `'null'`)
     * @param {object} options A settings object that will override the current settings. Note: the update is done only if the `newValue` is defined.
     * @param {boolean} saveChangeToHistory If set to `true`, then the change is recorded in the history table
     * @returns {AutoNumeric}
     * @throws
     */
    set(newValue, options = null, saveChangeToHistory = true) {
        //TODO Add the `saveSettings` options. If `true`, then when `options` is passed, then it overwrite the current `this.settings`. If `false` the `options` are only used once and `this.settings` is not modified
        if (AutoNumericHelper.isUndefined(newValue)) {
            AutoNumericHelper.warning(`You are trying to set an 'undefined' value ; an error could have occurred.`, this.settings.showWarnings);
            return this;
        }

        // The options update is done only if the `newValue` is not `undefined`
        if (!AutoNumericHelper.isNull(options)) {
            this._setSettings(options, true); // We do not call `update` here since this would call `set` too
        }

        if (newValue === null && this.settings.emptyInputBehavior !== AutoNumeric.options.emptyInputBehavior.null) {
            AutoNumericHelper.warning(`You are trying to set the \`null\` value while the \`emptyInputBehavior\` option is set to ${this.settings.emptyInputBehavior}. If you want to be able to set the \`null\` value, you need to change the 'emptyInputBehavior' option to \`'null'\`.`, this.settings.showWarnings);
            return this;
        }

        let value;
        if (newValue === null) {
            //TODO Merge this into a global `if (newValue === null) {` test, with the test above
            // Here this.settings.emptyInputBehavior === AutoNumeric.options.emptyInputBehavior.null
            this._setElementAndRawValue(null, null, saveChangeToHistory);
            this._saveValueToPersistentStorage();

            return this;
        }

        value = this.constructor._toNumericValue(newValue, this.settings);
        if (isNaN(Number(value))) {
            //TODO Do not modify the element value if the newValue results in `NaN`. Make sure the settings, if modified, are revert back too.
            AutoNumericHelper.warning(`The value you are trying to set results in \`NaN\`. The element value is set to the empty string instead.`, this.settings.showWarnings);
            this.setValue('', saveChangeToHistory);

            return this;
        }
        
        if (value === '' && this.settings.emptyInputBehavior === AutoNumeric.options.emptyInputBehavior.zero) {
            // Keep the value zero inside the element
            value = 0;
        }

        if (value !== '') {
            const [minTest, maxTest] = this.constructor._checkIfInRangeWithOverrideOption(value, this.settings);
            // This test is needed by the `showPositiveSign` option
            const isZero = AutoNumericHelper.isZeroOrHasNoValue(value);
            if (isZero) {
                value = '0';
            }

            if (minTest && maxTest) {
                let forcedRawValue = this.constructor._roundRawValue(value, this.settings);
                forcedRawValue = this._trimLeadingAndTrailingZeros(forcedRawValue.replace(this.settings.decimalCharacter, '.')); // Move the `setRawValue` call after the `setElementValue` one
                value = this._getRawValueToFormat(value); // Multiply the raw value to obtain the formatted value

                // Round the given value according to the object state (focused/unfocused)
                if (this.isFocused) {
                    value = this.constructor._roundFormattedValueShownOnFocus(value, this.settings);
                } else {
                    if (this.settings.divisorWhenUnfocused) {
                        value = value / this.settings.divisorWhenUnfocused;
                        value = value.toString();
                    }

                    value = this.constructor._roundFormattedValueShownOnBlur(value, this.settings);
                }

                value = this.constructor._modifyNegativeSignAndDecimalCharacterForFormattedValue(value, this.settings);
                value = this.constructor._addGroupSeparators(value, this.settings, this.isFocused, this.rawValue, forcedRawValue);
                if (!this.isFocused && this.settings.symbolWhenUnfocused) {
                    value = `${value}${this.settings.symbolWhenUnfocused}`;
                }

                if (this.settings.decimalPlacesShownOnFocus || this.settings.divisorWhenUnfocused) {
                    this._saveValueToPersistentStorage();
                }

                this._setElementAndRawValue(value, forcedRawValue, saveChangeToHistory);

                return this;
            } else {
                if (!minTest) {
                    AutoNumericHelper.triggerEvent(AutoNumeric.events.minRangeExceeded, this.domElement);
                }

                if (!maxTest) {
                    AutoNumericHelper.triggerEvent(AutoNumeric.events.maxRangeExceeded, this.domElement);
                }

                AutoNumericHelper.throwError(`The value [${value}] being set falls outside of the minimumValue [${this.settings.minimumValue}] and maximumValue [${this.settings.maximumValue}] range set for this element`);

                this._removeValueFromPersistentStorage();
                this.setValue('', saveChangeToHistory); //TODO Shouldn't we just drop that faulty newValue and keep the previous one? This is behind a `throwError()` call anyway..

                return this;
            }
        } else {
            // Here, `value` equal the empty string `''`
            let result;
            if (this.settings.emptyInputBehavior === AutoNumeric.options.emptyInputBehavior.always) {
                // Keep the currency symbol as per emptyInputBehavior
                result = this.settings.currencySymbol;
            } else {
                result = '';
            }

            this._setElementAndRawValue(result, '', saveChangeToHistory);

            return this;
        }
    }

    /**
     * Set the given value directly as the DOM element value, without formatting it beforehand.
     * You can also set the value and update the setting in one go (the value will again not be formatted immediately).
     *
     * @param {number|string} value
     * @param {object} options
     * @returns {AutoNumeric}
     * @throws
     */
    setUnformatted(value, options = null) {
        //TODO Should we use `AutoNumeric.unformat()` here and set the unformatted result in case `value` is formatted?
        if (value === null || AutoNumericHelper.isUndefined(value)) {
            return this;
        }

        // The options update is done only if the `value` is not null
        if (!AutoNumericHelper.isNull(options)) {
            this._setSettings(options, true); // We do not call `update` here since this would call `set` too
        }

        const strippedValue = this.constructor._removeBrackets(value, this.settings);
        let normalizedValue = this.constructor._stripAllNonNumberCharacters(strippedValue, this.settings, true, this.isFocused);
        normalizedValue = normalizedValue.replace(this.settings.decimalCharacter, '.');
        if (!AutoNumericHelper.isNumber(normalizedValue)) {
            AutoNumericHelper.throwError(`The value is not a valid one, it's not a numeric string nor a recognized currency.`);
        }

        const [minTest, maxTest] = this.constructor._checkIfInRangeWithOverrideOption(normalizedValue, this.settings);
        if (minTest && maxTest) {
            // If the `normalizedValue` is in the range
            this.setValue(value);
        } else {
            AutoNumericHelper.throwError(`The value is out of the range limits [${this.settings.minimumValue}, ${this.settings.maximumValue}].`);
        }

        return this;
    }

    /**
     * Set the given value directly as the DOM element value, without formatting it beforehand, and without checking its validity.
     * This also updates the `rawValue` with the given `newValue`, without checking it too ; if it's not formatted like a number recognized by Javascript, this *will* likely make other AutoNumeric methods fail.
     *
     * @param {string|number|null} newValue The new value to set on the element
     * @param {boolean} saveChangeToHistory If set to `true`, then the change is recorded in the history array, otherwise it is not
     * @returns {AutoNumeric}
     */
    setValue(newValue, saveChangeToHistory = true) {
        this._setElementAndRawValue(newValue, saveChangeToHistory);

        return this;
    }

    /**
     * Save the raw value inside the AutoNumeric object.
     *
     * @param {number|string|null} rawValue The numeric value as understood by Javascript like a `Number`
     * @param {boolean} saveChangeToHistory If set to `true`, then the change is recorded in the history array, otherwise it is not
     * @private
     */
    _setRawValue(rawValue, saveChangeToHistory = true) {
        // Only set the raw value if the given value is different than the current one
        if (this.rawValue !== rawValue) { //TODO Manage the case where one value is a string while the other is a number?
            // Update the raw value
            this.rawValue = rawValue; // By default, if the `rawValue` is changed programmatically

            if ((!AutoNumericHelper.isNull(this.settings.rawValueDivisor) && this.settings.rawValueDivisor !== 0) && // Only divide if the `rawValueDivisor` option is set
                rawValue !== '' && rawValue !== null && // Do not modify the `rawValue` if it's an empty string or null
                this._isUserManuallyEditingTheValue()) { // If the user is manually changing the element value
                this.rawValue /= this.settings.rawValueDivisor;
            }

            // Change the element style or use the relevant callbacks
            this._parseStyleRules();

            if (saveChangeToHistory) {
                // Save in the history the last known raw value and formatted result selection
                this._historyTableAdd();
            }
        }
    }

    /**
     * Set the given value on the DOM element, without affecting the `rawValue`.
     * This send an 'autoNumeric:formatted' event if the new value is different than the old one.
     *
     * @param {number|string} newElementValue
     * @returns {AutoNumeric}
     * @private
     */
    _setElementValue(newElementValue) {
        //TODO Use an internal attribute to track the current value of the element `formattedValue` (like its counterpart `rawValue`). This would allow us to avoid calling `getElementValue` many times
        // `oldElementValue` is the previous value that will be overwritten. This is used to decide if an event should be sent or not.
        const oldElementValue = AutoNumericHelper.getElementValue(this.domElement);

        if (newElementValue !== oldElementValue) {
            // Only update the value if it's different from the current one
            AutoNumericHelper.setElementValue(this.domElement, newElementValue);
            AutoNumericHelper.triggerEvent(AutoNumeric.events.formatted, this.domElement, { oldValue: oldElementValue, newValue: newElementValue });
        }

        return this;
    }

    /**
     * Set the given value on the DOM element, and the raw value on `this.rawValue`, if both are given.
     * If only one value is given, then both the DOM element value and the raw value are set with that value.
     * The third argument `saveChangeToHistory` defines if the change should be recorded in the history array.
     * Note: if the second argument `rawValue` is a boolean, we consider that is really is the `saveChangeToHistory` argument.
     *
     * @param {number|string|null} newElementValue
     * @param {number|string|null|boolean} rawValue
     * @param {boolean} saveChangeToHistory
     * @returns {AutoNumeric}
     * @private
     */
    _setElementAndRawValue(newElementValue, rawValue = null, saveChangeToHistory = true) {
        if (AutoNumericHelper.isNull(rawValue)) {
            rawValue = newElementValue;
        } else if (AutoNumericHelper.isBoolean(rawValue)) {
            saveChangeToHistory = rawValue;
            rawValue = newElementValue;
        }

        //XXX The order here is important ; the value should first be set on the element, then and only then we should update the raw value
        // In the `set()` function, we make sure to call `_setRawValue` *after* `setElementValue` so that if `_setRawValue` calls a callback that modify the `rawValue`, then the new value is set correctly (after `setElementValue` briefly set its value first)
        this._setElementValue(newElementValue);
        this._setRawValue(rawValue, saveChangeToHistory);

        return this;
    }

    /**
     * Return the multiplied raw value with the `rawValueDivisor`.
     * This is used to display different values between the raw and formatted values.
     *
     * @param {number|string|null} rawValue The numeric value as understood by Javascript like a `Number`
     * @returns {number|string|null}
     * @private
     */
    _getRawValueToFormat(rawValue) {
        let rawValueForTheElementValue;
        if ((!AutoNumericHelper.isNull(this.settings.rawValueDivisor) && this.settings.rawValueDivisor !== 0) && // Only multiply if the `rawValueDivisor` option is set
            rawValue !== '' && rawValue !== null) { // Do not modify the `rawValue` if it's an empty string or null
            // !this._isUserManuallyEditingTheValue()) { // If the user is NOT manually changing the element value, but that is done programmatically
            rawValueForTheElementValue = rawValue * this.settings.rawValueDivisor;
        } else {
            rawValueForTheElementValue = rawValue;
        }

        return rawValueForTheElementValue;
    }

    /**
     * Return `true` if the user is currently modifying the element value manually.
     *
     * @returns {boolean}
     * @private
     */
    _isUserManuallyEditingTheValue() {
        // return (this.isFocused && this.isEditing) || this.isWheelEvent || this.isDropEvent;
        return (this.isFocused && this.isEditing) || this.isDropEvent;
    }

    /**
     * Execute the given callback function using the given result as its first parameter, and the AutoNumeric object as its second.
     *
     * @param {number|string|Array|null} result
     * @param {function|null} callback If a callback is passed, then the result is passed to it as its first argument, and the AutoNumeric object has its second
     * @private
     */
    _executeCallback(result, callback) {
        if (!AutoNumericHelper.isNull(callback) && AutoNumericHelper.isFunction(callback)) {
            callback(result, this);
        }
    }

    /**
     * Alias of the `getNumericString()` function.
     * Developers should use one of the more explicit function names to get what they want :
     * - a numeric string : `getNumericString()`
     * - a formatted string : `getFormatted()`
     * - a number : `getNumber()`, or
     * - a localized numeric string : `getLocalized()`
     *
     * @usage anElement.get();
     *
     * @param {function|null} callback If a callback is passed, then the result is passed to it as its first argument, and the AutoNumeric object has its second
     *
     * @deprecated
     * @returns {string|null}
     */
    get(callback = null) {
        return this.getNumericString(callback);
    }

    /**
     * Return the unformatted value as a string.
     * This can also return `null` if `rawValue` is null.
     *
     * @usage anElement.getNumericString();
     *
     * @param {function|null} callback If a callback is passed, then the result is passed to it as its first argument, and the AutoNumeric object has its second
     *
     * @returns {string|null}
     */
    getNumericString(callback = null) {
        let result;
        if (AutoNumericHelper.isNull(this.rawValue)) {
            result = null;
        } else {
            // Always return a numeric string
            // The following statement gets rid of the trailing zeros in the decimal places since the current method does not pad decimals
            result = AutoNumericHelper.trimPaddedZerosFromDecimalPlaces(this.rawValue);
        }

        this._executeCallback(result, callback);

        return result;
    }

    /**
     * Return the current formatted value of the AutoNumeric element as a string
     *
     * @usage anElement.getFormatted()
     *
     * @param {function|null} callback If a callback is passed, then the result is passed to it as its first argument, and the AutoNumeric object has its second
     *
     * @returns {string}
     */
    getFormatted(callback = null) {
        if (!('value' in this.domElement || 'textContent' in this.domElement)) {
            // Make sure `.value` or `.textContent' exists before trying to access those properties
            AutoNumericHelper.throwError('Unable to get the formatted string from the element.');
        }

        const result = AutoNumericHelper.getElementValue(this.domElement);
        this._executeCallback(result, callback);

        return result;
    }

    /**
     * Return the element unformatted value as a real Javascript number.
     * Warning: This can lead to precision problems with big numbers that should be stored as strings.
     *
     * @usage anElement.getNumber()
     *
     * @param {function|null} callback If a callback is passed, then the result is passed to it as its first argument, and the AutoNumeric object has its second
     *
     * @returns {number|null}
     */
    getNumber(callback = null) {
        let result;
        if (this.rawValue === null) {
            result = null;
        } else {
            result = this.constructor._toLocale(this.getNumericString(), 'number');
        }

        this._executeCallback(result, callback);

        return result;
    }

    /**
     * Returns the unformatted value, but following the `outputFormat` setting, which means the output can either be :
     * - a string (that could or could not represent a number (ie. "12345,67-")), or
     * - a plain number (if the setting 'number' is used).
     *
     * By default the returned values are an ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period.
     * Check the "outputFormat" option definition for more details.
     *
     * @usage anElement.getLocalized();
     *
     * @param {null|string|function} forcedOutputFormat If set to something different than `null`, then this is used as an overriding outputFormat option
     * @param {function|null} callback If a callback is passed, then the result is passed to it as its first argument, and the AutoNumeric object has its second
     *
     * @returns {*}
     */
    getLocalized(forcedOutputFormat = null, callback = null) {
        // First, check if only a callback has been passed, and if so, sanitize the parameters
        if (AutoNumericHelper.isFunction(forcedOutputFormat) && AutoNumericHelper.isNull(callback)) {
            callback = forcedOutputFormat;
            forcedOutputFormat = null;
        }

        // Then get the localized value
        let value;
        if (AutoNumericHelper.isEmptyString(this.rawValue)) {
            value = '';
        } else {
            // Here I use `this.rawValue` instead of `this.getNumericString()` since the current input value could be unformatted with a localization (ie. '1234567,89-').
            // I also convert the rawValue to a number, then back to a string in order to drop the decimal part if the rawValue is an integer.
            value = ''+Number(this.rawValue);
        }

        if (value !== '' && Number(value) === 0 && this.settings.leadingZero !== AutoNumeric.options.leadingZero.keep) {
            value = '0';
        }

        let outputFormatToUse;
        if (AutoNumericHelper.isNull(forcedOutputFormat)) {
            outputFormatToUse = this.settings.outputFormat;
        } else {
            outputFormatToUse = forcedOutputFormat;
        }

        const result = this.constructor._toLocale(value, outputFormatToUse);
        this._executeCallback(result, callback);

        return result;
    }

    /**
     * Force the element to reformat its value again (just in case the formatting has been lost).
     * This can be used right after a form submission for instance (after a previous call to `unformat`).
     *
     * @example anElement.reformat()
     *
     * @returns {AutoNumeric}
     */
    reformat() {
        // `this.rawValue` is used instead of `this.domElement.value` because when the content is `unformatLocalized`, it can become a string that cannot be converted to a number easily
        this.set(this.rawValue);

        return this;
    }

    /**
     * Remove the formatting and keep only the raw unformatted value in the element (as a numericString)
     * Note: this is loosely based on the previous 'unSet()' function
     *
     * By default, values are returned as ISO numeric strings (ie. "1234.56" or "-1234.56"), where the decimal character is a period.
     * @example anElement.unformat()
     *
     * @returns {AutoNumeric}
     */
    unformat() {
        this._setElementValue(this.getNumericString());

        return this;
    }

    /**
     * Remove the formatting and keep only the localized unformatted value in the element, with the option to override the default outputFormat if needed
     *
     * Locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-", or even plain numbers.
     * Take a look at the `outputFormat` option definition in the default settings for more details.
     *
     * @param {null|string} forcedOutputFormat If set to something different than `null`, then this is used as an overriding outputFormat option
     * @returns {AutoNumeric}
     */
    unformatLocalized(forcedOutputFormat = null) {
        this._setElementValue(this.getLocalized(forcedOutputFormat));

        return this;
    }

    /**
     * Return `true` if the current value is the same as when the element got initialized.
     * Note: By default, this returns `true` if the raw unformatted value is still the same even if the formatted one has changed (due to a configuration update for instance).
     * In order to test if the formatted value is the same (which means neither the raw value nor the settings have been changed), then you must pass `false` as its argument.
     *
     * @param {boolean} checkOnlyRawValue If set to `true`, the pristine value is done on the raw unformatted value, not the formatted one.  If set to `false`, this also checks that the formatted value hasn't changed.
     * @returns {boolean}
     */
    isPristine(checkOnlyRawValue = true) {
        let result;
        if (checkOnlyRawValue) {
            result = this.initialValue === this.getNumericString();
        } else {
            result = this.initialValueHtmlAttribute === this.getFormatted();
        }

        return result;
    }

    /**
     * Select the formatted element content, based on the `selectNumberOnly` option
     *
     * @returns {AutoNumeric}
     */
    select() {
        if (this.settings.selectNumberOnly) {
            this.selectNumber();
        } else {
            this._defaultSelectAll();
        }

        return this;
    }

    /**
     * Select the whole element content (including the currency symbol).
     * @private
     */
    _defaultSelectAll() {
        AutoNumericHelper.setElementSelection(this.domElement, 0, AutoNumericHelper.getElementValue(this.domElement).length);
    }

    /**
     * Select only the numbers in the formatted element content, leaving out the currency symbol, whatever the value of the `selectNumberOnly` option
     *
     * @returns {AutoNumeric}
     */
    selectNumber() {
        //TODO Make sure the selection is ok when showPositiveSign is set to `true` (select the negative sign, but not the positive one)
        const unformattedValue = AutoNumericHelper.getElementValue(this.domElement);
        const valueLen = unformattedValue.length;
        const currencySymbolSize = this.settings.currencySymbol.length;
        const currencySymbolPlacement = this.settings.currencySymbolPlacement;
        const negLen = (!AutoNumericHelper.isNegative(unformattedValue))?0:1;
        const suffixTextLen = this.settings.suffixText.length;

        let start;
        if (currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix) {
            start = 0;
        } else if (this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.left &&
            negLen === 1 && currencySymbolSize > 0) {
            start = currencySymbolSize + 1;
        } else {
            start = currencySymbolSize;
        }

        let end;
        if (currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.prefix) {
            end = valueLen - suffixTextLen;
        } else {
            switch (this.settings.negativePositiveSignPlacement) {
                case AutoNumeric.options.negativePositiveSignPlacement.left:
                    end = valueLen - (suffixTextLen + currencySymbolSize);
                    break;
                case AutoNumeric.options.negativePositiveSignPlacement.right:
                    if (currencySymbolSize > 0) {
                        end = valueLen - (currencySymbolSize + negLen + suffixTextLen);
                    } else {
                        end = valueLen - (currencySymbolSize + suffixTextLen);
                    }
                    break;
                default :
                    end = valueLen - (currencySymbolSize + suffixTextLen);
            }
        }

        AutoNumericHelper.setElementSelection(this.domElement, start, end);

        return this;
    }

    /**
     * Select only the integer part in the formatted element content, whatever the value of `selectNumberOnly`
     *
     * @returns {AutoNumeric}
     */
    selectInteger() {
        let start = 0;
        const isPositive = this.rawValue >= 0;

        // Negative or positive sign, if any
        if (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.prefix ||
            (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix &&
            (this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.prefix ||
            this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.none))) {
            if ((this.settings.showPositiveSign && isPositive) ||  // This only exclude the positive sign from being selected
                (!isPositive && this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.prefix && this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.left)) { // And this exclude the negative sign from being selected in this special case : '-€ 1.234,57suffixText'
                start = start + 1;
            }
        }

        // Currency symbol
        if (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.prefix) {
            start = start + this.settings.currencySymbol.length;
        }

        // Calculate the selection end position
        const elementValue = AutoNumericHelper.getElementValue(this.domElement);
        let end = elementValue.indexOf(this.settings.decimalCharacter);
        if (end === -1) {
            // No decimal character found
            if (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix) {
                end = elementValue.length - this.settings.currencySymbol.length;
            } else {
                end = elementValue.length;
            }

            // Trailing negative sign
            if (!isPositive &&
                (this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.suffix ||
                this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix)) {
                end = end - 1;
            }

            // Avoid selecting the suffix test
            end = end - this.settings.suffixText.length;
        }

        AutoNumericHelper.setElementSelection(this.domElement, start, end);

        return this;
    }

    /**
     * Select only the decimal part in the formatted element content, whatever the value of `selectNumberOnly`
     * Multiple cases are possible :
     * +1.234,57suffixText
     *
     * € +1.234,57suffixText
     * +€ 1.234,57suffixText
     * € 1.234,57+suffixText
     *
     * 1.234,57+ €suffixText
     * 1.234,57 €+suffixText
     * +1.234,57 €suffixText
     *
     * @returns {AutoNumeric}
     */
    selectDecimal() {
        let start = AutoNumericHelper.getElementValue(this.domElement).indexOf(this.settings.decimalCharacter);
        let end;

        if (start === -1) {
            // The decimal character has not been found, we deselect all
            start = 0;
            end = 0;
        } else {
            // A decimal character has been found
            start = start + 1; // We add 1 to exclude the decimal character from the selection

            let decimalCount;
            if (this.isFocused) {
                decimalCount = this.settings.decimalPlacesShownOnFocus;
            } else {
                decimalCount = this.settings.decimalPlacesShownOnBlur;
            }

            end = start + Number(decimalCount);
        }

        AutoNumericHelper.setElementSelection(this.domElement, start, end);

        return this;
    }

    /**
     * Return the DOM element reference of the autoNumeric-managed element
     *
     * @returns {HTMLElement|HTMLInputElement}
     */
    node() {
        return this.domElement;
    }

    /**
     * Return the DOM element reference of the parent node of the autoNumeric-managed element
     *
     * @returns {HTMLElement|HTMLInputElement|Node}
     */
    parent() {
        return this.domElement.parentNode;
    }

    /**
     * Detach the current AutoNumeric element from the shared local 'init' list.
     * This means any changes made on that local shared list will not be transmitted to that element anymore.
     * Note : The user can provide another AutoNumeric element, and detach this one instead of the current one.
     *
     * @param {AutoNumeric} otherAnElement
     * @returns {AutoNumeric}
     */
    detach(otherAnElement = null) { //FIXME test this
        let domElementToDetach;
        if (!AutoNumericHelper.isNull(otherAnElement)) {
            domElementToDetach = otherAnElement.node();
        } else {
            domElementToDetach = this.domElement;
        }

        this._removeFromLocalList(domElementToDetach); //FIXME What happens if the selected dom element does not exist in the list?

        return this;
    }

    /**
     * Attach the given AutoNumeric element to the shared local 'init' list.
     * When doing that, by default the DOM content is left untouched.
     * The user can force a reformat with the new shared list options by passing a second argument to `true`.
     *
     * @param {AutoNumeric} otherAnElement
     * @param {boolean} reFormat
     * @returns {AutoNumeric}
     */
    attach(otherAnElement, reFormat = true) { //FIXME test this
        this._addToLocalList(otherAnElement.node()); //FIXME Should we make sure the element is not already in the list?
        if (reFormat) {
            otherAnElement.update(this.settings);
        }

        return this;
    }

    /**
     * Format and return the given value, or set the formatted value into the given DOM element if one is passed as an argument.
     * By default, this use the current element settings.
     * The user can override any option of its choosing by passing an option object.
     *
     * @param {number|HTMLElement|HTMLInputElement} valueOrElement
     * @param {null|object} optionOverride
     * @returns {string|null}
     */
    formatOther(valueOrElement, optionOverride = null) { //FIXME test this
        return this._formatOrUnformatOther(true, valueOrElement, optionOverride);
    }

    /**
     * Unformat and return the raw numeric string corresponding to the given value, or directly set the unformatted value into the given DOM element if one is passed as an argument.
     * By default, this use the current element settings.
     * The user can override any option of its choosing by passing an option object.

     * @param {string|HTMLElement|HTMLInputElement} stringOrElement
     * @param {null|object} optionOverride
     * @returns {string|null}
     */
    unformatOther(stringOrElement, optionOverride = null) { //FIXME test this
        return this._formatOrUnformatOther(false, stringOrElement, optionOverride);
    }

    /**
     * Method that either format or unformat the value of another element.
     *
     * - Format and return the given value, or set the formatted value into the given DOM element if one is passed as an argument.
     * - Unformat and return the raw numeric string corresponding to the given value, or directly set the unformatted value into the given DOM element if one is passed as an argument.
     *
     * By default, this use the current element settings.
     * The user can override any option of its choosing by passing an option object.
     *
     * @param {boolean} isFormatting If set to `true`, then the method formats, otherwise if set to `false`, it unformats
     * @param {number|string|HTMLElement|HTMLInputElement} valueOrStringOrElement
     * @param {null|object} optionOverride
     * @returns {string|null}
     * @private
     */
    _formatOrUnformatOther(isFormatting, valueOrStringOrElement, optionOverride = null) { //FIXME test this
        // If the user wants to override the current element settings temporarily
        let settingsToUse;
        if (!AutoNumericHelper.isNull(optionOverride)) {
            settingsToUse = this._cloneAndMergeSettings(optionOverride);
        } else {
            settingsToUse = this.settings;
        }

        // Then the unformatting is done...
        let result;
        if (AutoNumericHelper.isElement(valueOrStringOrElement)) {
            // ...either directly on the DOM element value
            const elementValue = AutoNumericHelper.getElementValue(valueOrStringOrElement);
            if (isFormatting) {
                result = AutoNumeric.format(elementValue, settingsToUse);
            }
            else {
                result = AutoNumeric.unformat(elementValue, settingsToUse);
            }

            AutoNumericHelper.setElementValue(valueOrStringOrElement, result); //TODO Use `unformatAndSet` and `formatAndSet`instead

            return null;
        }

        // ...or on the given value
        if (isFormatting) {
            result = AutoNumeric.format(valueOrStringOrElement, settingsToUse);
        }
        else {
            result = AutoNumeric.unformat(valueOrStringOrElement, settingsToUse);
        }

        return result;
    }

    /**
     * Use the current AutoNumeric element settings to initialize the DOM element(s) given as a parameter.
     * Doing so will *link* the AutoNumeric elements together since they will share the same local AutoNumeric element list.
     * (cf. prototype pattern : https://en.wikipedia.org/wiki/Prototype_pattern)
     *
     * You can `init` either a single DOM element (in that case an AutoNumeric object will be returned), or an array of DOM elements or a string that will be used as a CSS selector. In the latter cases, an array of AutoNumeric objects will then be returned (or an empty array if nothing gets selected by the CSS selector).
     *
     * Use case : Once you have an AutoNumeric element already setup correctly with the right options, you can use it as many times you want to initialize as many other DOM elements as needed.
     * Note : this works only on elements that can be managed by autoNumeric.
     *
     * @param {HTMLElement|HTMLInputElement|Array<HTMLElement|HTMLInputElement>|string} domElementOrArrayOrString
     * @param {boolean} attached If set to `false`, then the newly generated AutoNumeric element will not share the same local element list
     * @returns {AutoNumeric|[AutoNumeric]}
     */
    init(domElementOrArrayOrString, attached = true) {
        let returnASingleAutoNumericObject = false; // By default, this function returns an array of AutoNumeric objects
        let domElementsArray = [];
        if (AutoNumericHelper.isString(domElementOrArrayOrString)) {
            domElementsArray = [... document.querySelectorAll(domElementOrArrayOrString)]; // Convert a NodeList to an Array
        } else if (AutoNumericHelper.isElement(domElementOrArrayOrString)) {
            domElementsArray.push(domElementOrArrayOrString);
            returnASingleAutoNumericObject = true; // Special case when only one DOM element is passed as a parameter
        } else if (AutoNumericHelper.isArray(domElementOrArrayOrString)) {
            domElementsArray = domElementOrArrayOrString;
        } else {
            AutoNumericHelper.throwError(`The given parameters to the 'init' function are invalid.`);
        }

        if (domElementsArray.length === 0) {
            AutoNumericHelper.warning(`No valid DOM elements were given hence no AutoNumeric object were instantiated.`, true);

            return [];
        }

        const currentLocalList = this._getLocalList();
        const autoNumericObjectsArray = [];

        // Instantiate (and link depending on `attached`) each AutoNumeric objects
        domElementsArray.forEach(domElement => {
            // Initialize the new AutoNumeric element
            const originalCreateLocalListSetting = this.settings.createLocalList;
            if (attached) {
                // Temporary variable to know if we should create the local list during the initialization (since we'll remove it afterwards)
                this.settings.createLocalList = false;
            }

            const newAutoNumericElement =  new AutoNumeric(domElement, AutoNumericHelper.getElementValue(domElement), this.settings);

            // Set the common shared local list if needed
            // If the user wants to create a detached new AutoNumeric element, then skip the following step that bind the two elements together by default
            if (attached) {
                // 1) Set the local list reference to point to the initializer's one
                newAutoNumericElement._setLocalList(currentLocalList);

                // 2) Add the new element to that existing list
                this._addToLocalList(domElement, newAutoNumericElement); // Here we use the *new* AutoNumeric object reference to add to the local list, since we'll need the reference to `this` in the methods to points to that new AutoNumeric object.
                this.settings.createLocalList = originalCreateLocalListSetting;
            }

            autoNumericObjectsArray.push(newAutoNumericElement);
        });

        if (returnASingleAutoNumericObject) {
            // If a single DOM element was used as the parameter, then we return an AutoNumeric object directly
            return autoNumericObjectsArray[0];
        }

        // ...otherwise we return an Array of AutoNumeric objects
        return autoNumericObjectsArray;
    }

    /**
     * Reset the element value either to the empty string '', or the currency sign, depending on the `emptyInputBehavior` option value.
     * If you set the `forceClearAll` argument to `true`, then the `emptyInputBehavior` option is overridden and the whole input is clear, including any currency sign.
     *
     * @param {boolean} forceClearAll
     * @returns {AutoNumeric}
     */
    clear(forceClearAll = false) {
        if (forceClearAll) {
            const temporaryForcedOptions = {
                emptyInputBehavior: AutoNumeric.options.emptyInputBehavior.focus,
            };
            this.set('', temporaryForcedOptions);
        } else {
            this.set('');
        }

        return this;
    }

    /**
     * Remove the autoNumeric data and event listeners from the element, but keep the element content intact.
     * This also clears the value from sessionStorage (or cookie, depending on browser supports).
     * Note: this does not remove the formatting.
     *
     * @example anElement.remove()
     */
    remove() {
        this._removeValueFromPersistentStorage();
        this._removeEventListeners();

        // Also remove the element from the local AutoNumeric list
        this._removeFromLocalList(this.domElement);
        // Also remove the element from the global AutoNumeric list
        this.constructor._removeFromGlobalList(this);
    }

    /**
     * Remove the autoNumeric data and event listeners from the element, and reset its value to the empty string ''.
     * This also clears the value from sessionStorage (or cookie, depending on browser supports).
     *
     * @example anElement.wipe()
     */
    wipe() {
        this._setElementValue('');
        this.remove();
    }

    /**
     * Remove the autoNumeric data and event listeners from the element, and delete the DOM element altogether
     */
    nuke() {
        this.remove();
        // Remove the element from the DOM
        this.domElement.parentNode.removeChild(this.domElement);
    }


    // Special functions that really work on the parent <form> element, instead of the <input> element itself

    /**
     * Return a reference to the parent <form> element if it exists, otherwise return `null`.
     * If the parent form element as already been found, this directly return a reference to it.
     * However, you can force AutoNumeric to search again for its reference by passing `true` as a parameter to this method.
     * This method updates the `this.parentForm` attribute.
     *
     * @param {boolean} forceSearch If set to `true`, the parent form is searched again, even if `this.parentForm` is already set.
     * @returns {HTMLFormElement|null}
     */
    form(forceSearch = false) {
        if (forceSearch || AutoNumericHelper.isUndefinedOrNullOrEmpty(this.parentForm)) {
            this.parentForm = this._getParentForm();
        }

        return this.parentForm;
    }

    /**
     * Return a reference to the parent <form> element if it exists, otherwise return `null`.
     *
     * @returns {HTMLFormElement|null}
     * @private
     */
    _getParentForm() {
        if (this.domElement.tagName.toLowerCase() === 'body') {
            return null;
        }

        let node = this.domElement;
        let tagName;
        do {
            node = node.parentNode;
            if (AutoNumericHelper.isNull(node)) {
                // Special case when using templates with frameworks like Vue.js, where the input element can be 'detached' when initializing the DOM structure
                return null;
            }

            if (node.tagName) {
                tagName = node.tagName.toLowerCase();
            } else {
                tagName = '';
            }

            if (tagName === 'body') {
                // Get out of the loop if we get up to the `<body>` element
                break;
            }
        } while (tagName !== 'form');

        if (tagName === 'form') {
            return node;
        } else {
            return null;
        }
    }

    /**
     * Return a string in standard URL-encoded notation with the form input values being unformatted.
     * This string can be used as a query for instance.
     *
     * @returns {string}
     */
    formNumericString() {
        return this.constructor._serializeNumericString(this.form(), this.settings.serializeSpaces);
    }

    /**
     * Return a string in standard URL-encoded notation with the form input values being formatted.
     *
     * @returns {string}
     */
    formFormatted() {
        return this.constructor._serializeFormatted(this.form(), this.settings.serializeSpaces);
    }

    /**
     * Return a string in standard URL-encoded notation with the form input values, with localized values.
     * The default output format can be overridden by passing the option as a parameter.
     *
     * @param {null|string} forcedOutputFormat If set to something different than `null`, then this is used as an overriding outputFormat option
     * @returns {string}
     */
    formLocalized(forcedOutputFormat = null) {
        let outputFormatToUse;
        if (AutoNumericHelper.isNull(forcedOutputFormat)) {
            outputFormatToUse = this.settings.outputFormat;
        } else {
            outputFormatToUse = forcedOutputFormat;
        }

        return this.constructor._serializeLocalized(this.form(), this.settings.serializeSpaces, outputFormatToUse);
    }

    /**
     * Return an array containing an object for each form <input> element.
     * Those objects are of the following structure `{ name: foo, value: '42' }`, where the `name` is the DOM element name, and the `value` is an unformatted numeric string.
     *
     * @returns {Array}
     */
    formArrayNumericString() {
        return this.constructor._serializeNumericStringArray(this.form(), this.settings.serializeSpaces);
    }

    /**
     * Return an array containing an object for each form <input> element.
     * Those objects are of the following structure `{ name: foo, value: '42' }`, where the `name` is the DOM element name, and the `value` is the formatted string.
     *
     * @returns {Array}
     */
    formArrayFormatted() {
        return this.constructor._serializeFormattedArray(this.form(), this.settings.serializeSpaces);
    }

    /**
     * Return an array containing an object for each form <input> element.
     * Those objects are of the following structure `{ name: foo, value: '42' }`, where the `name` is the DOM element name, and the `value` is the localized numeric string.
     *
     * @param {null|string} forcedOutputFormat If set to something different than `null`, then this is used as an overriding outputFormat option
     * @returns {Array}
     */
    formArrayLocalized(forcedOutputFormat = null) {
        let outputFormatToUse;
        if (AutoNumericHelper.isNull(forcedOutputFormat)) {
            outputFormatToUse = this.settings.outputFormat;
        } else {
            outputFormatToUse = forcedOutputFormat;
        }

        return this.constructor._serializeLocalizedArray(this.form(), this.settings.serializeSpaces, outputFormatToUse);
    }

    /**
     * Return a JSON string containing an object representing the form input values.
     * This is based on the result of the `formArrayNumericString()` function.
     *
     * @returns {string}
     */
    formJsonNumericString() {
        return JSON.stringify(this.formArrayNumericString());
    }

    /**
     * Return a JSON string containing an object representing the form input values.
     * This is based on the result of the `formArrayFormatted()` function.
     *
     * @returns {string}
     */
    formJsonFormatted() {
        return JSON.stringify(this.formArrayFormatted());
    }

    /**
     * Return a JSON string containing an object representing the form input values.
     * This is based on the result of the `formArrayLocalized()` function.
     *
     * @param {null|string} forcedOutputFormat If set to something different than `null`, then this is used as an overriding outputFormat option
     * @returns {string}
     */
    formJsonLocalized(forcedOutputFormat = null) {
        return JSON.stringify(this.formArrayLocalized(forcedOutputFormat));
    }

    /**
     * Unformat all the autoNumeric-managed elements that are a child of the parent <form> element of this DOM element, to numeric strings
     *
     * @returns {AutoNumeric}
     */
    formUnformat() { //FIXME test this
        const inputs = this.constructor._getChildANInputElement(this.form());
        inputs.forEach(input => {
            AutoNumeric.getAutoNumericElement(input).unformat();
        });

        return this;
    }

    /**
     * Unformat all the autoNumeric-managed elements that are a child of the parent <form> element of this DOM element, to localized strings
     *
     * @returns {AutoNumeric}
     */
    formUnformatLocalized() { //FIXME test this
        const inputs = this.constructor._getChildANInputElement(this.form());
        inputs.forEach(input => {
            AutoNumeric.getAutoNumericElement(input).unformatLocalized();
        });

        return this;
    }

    /**
     * Reformat all the autoNumeric-managed elements that are a child of the parent <form> element of this DOM element
     *
     * @returns {AutoNumeric}
     */
    formReformat() { //FIXME test this
        const inputs = this.constructor._getChildANInputElement(this.form());
        inputs.forEach(input => {
            AutoNumeric.getAutoNumericElement(input).reformat();
        });

        return this;
    }

    /**
     * Convert the input values to numeric strings, submit the form, then reformat those back.
     * The function can either take a callback, or not. If it doesn't, the default `form.submit()` function will be called.
     * Otherwise, it runs `callback(value)` with `value` being equal to the result of `formNumericString()`.
     *
     * @param {function|null} callback
     * @returns {AutoNumeric}
     */
    formSubmitNumericString(callback = null) { //FIXME test this
        if (AutoNumericHelper.isNull(callback)) {
            this.formUnformat();
            this.form().submit();
            this.formReformat();
        } else if (AutoNumericHelper.isFunction(callback)) {
            callback(this.formNumericString());
        } else {
            AutoNumericHelper.throwError(`The given callback is not a function.`);
        }

        return this;
    }

    /**
     * Submit the form with the current formatted values.
     * The function can either take a callback, or not. If it doesn't, the default `form.submit()` function will be called.
     * Otherwise, it runs `callback(value)` with `value` being equal to the result of `formFormatted()`.
     *
     * @param {function|null} callback
     * @returns {AutoNumeric}
     */
    formSubmitFormatted(callback = null) { //FIXME test this
        if (AutoNumericHelper.isNull(callback)) {
            this.form().submit();
        } else if (AutoNumericHelper.isFunction(callback)) {
            callback(this.formFormatted());
        } else {
            AutoNumericHelper.throwError(`The given callback is not a function.`);
        }

        return this;
    }

    /**
     * Convert the input values to localized strings, submit the form, then reformat those back.
     * The function can either take a callback, or not. If it doesn't, the default `form.submit()` function will be called.
     * Otherwise, it runs `callback(value)` with `value` being equal to the result of `formLocalized()`.
     *
     * @param {null|string} forcedOutputFormat If set to something different than `null`, then this is used as an overriding outputFormat option
     * @param {function|null} callback
     * @returns {AutoNumeric}
     */
    formSubmitLocalized(forcedOutputFormat = null, callback = null) { //FIXME test this
        if (AutoNumericHelper.isNull(callback)) {
            this.formUnformatLocalized();
            this.form().submit();
            this.formReformat();
        } else if (AutoNumericHelper.isFunction(callback)) {
            callback(this.formLocalized(forcedOutputFormat));
        } else {
            AutoNumericHelper.throwError(`The given callback is not a function.`);
        }

        return this;
    }

    /**
     * Generate an array of numeric strings from the `<input>` elements, and pass it to the given callback.
     * Under the hood, the array is generated via a call to `formArrayNumericString()`.
     *
     * @param {function} callback
     * @returns {AutoNumeric}
     */
    formSubmitArrayNumericString(callback) { //FIXME test this
        if (AutoNumericHelper.isFunction(callback)) {
            callback(this.formArrayNumericString());
        } else {
            AutoNumericHelper.throwError(`The given callback is not a function.`);
        }

        return this;
    }

    /**
     * Generate an array of the current formatted values from the `<input>` elements, and pass it to the given callback.
     * Under the hood, the array is generated via a call to `formArrayFormatted()`.
     *
     * @param {function} callback
     * @returns {AutoNumeric}
     */
    formSubmitArrayFormatted(callback) { //FIXME test this
        if (AutoNumericHelper.isFunction(callback)) {
            callback(this.formArrayFormatted());
        } else {
            AutoNumericHelper.throwError(`The given callback is not a function.`);
        }

        return this;
    }

    /**
     * Generate an array of localized strings from the `<input>` elements, and pass it to the given callback.
     * Under the hood, the array is generated via a call to `formArrayLocalized()`.
     *
     * @param {function} callback
     * @param {null|string} forcedOutputFormat If set to something different than `null`, then this is used as an overriding outputFormat option
     * @returns {AutoNumeric}
     */
    formSubmitArrayLocalized(callback, forcedOutputFormat = null) { //FIXME test this
        if (AutoNumericHelper.isFunction(callback)) {
            callback(this.formArrayLocalized(forcedOutputFormat));
        } else {
            AutoNumericHelper.throwError(`The given callback is not a function.`);
        }

        return this;
    }

    /**
     * Generate a JSON string with the numeric strings values from the `<input>` elements, and pass it to the given callback.
     * Under the hood, the array is generated via a call to `formJsonNumericString()`.
     *
     * @param {function} callback
     * @returns {AutoNumeric}
     */
    formSubmitJsonNumericString(callback) { //FIXME test this
        if (AutoNumericHelper.isFunction(callback)) {
            callback(this.formJsonNumericString());
        } else {
            AutoNumericHelper.throwError(`The given callback is not a function.`);
        }

        return this;
    }

    /**
     * Generate a JSON string with the current formatted values from the `<input>` elements, and pass it to the given callback.
     * Under the hood, the array is generated via a call to `formJsonFormatted()`.
     *
     * @param {function} callback
     * @returns {AutoNumeric}
     */
    formSubmitJsonFormatted(callback) { //FIXME test this
        if (AutoNumericHelper.isFunction(callback)) {
            callback(this.formJsonFormatted());
        } else {
            AutoNumericHelper.throwError(`The given callback is not a function.`);
        }

        return this;
    }

    /**
     * Generate a JSON string with the localized strings values from the `<input>` elements, and pass it to the given callback.
     * Under the hood, the array is generated via a call to `formJsonLocalized()`.
     *
     * @param {function} callback
     * @param {null|string} forcedOutputFormat If set to something different than `null`, then this is used as an overriding outputFormat option
     * @returns {AutoNumeric}
     */
    formSubmitJsonLocalized(callback, forcedOutputFormat = null) { //FIXME test this
        if (AutoNumericHelper.isFunction(callback)) {
            callback(this.formJsonLocalized(forcedOutputFormat));
        } else {
            AutoNumericHelper.throwError(`The given callback is not a function.`);
        }

        return this;
    }

    /**
     * Unformat the given AutoNumeric element, and update the `hoveredWithAlt` variable.
     *
     * @param {AutoNumeric} anElement
     * @private
     */
    static _unformatAltHovered(anElement) {
        anElement.hoveredWithAlt = true;
        anElement.unformat();
    }

    /**
     * Reformat the given AutoNumeric element, and update the `hoveredWithAlt` variable.
     *
     * @param {AutoNumeric} anElement
     * @private
     */
    static _reformatAltHovered(anElement) {
        anElement.hoveredWithAlt = false;
        anElement.reformat();
    }

    /**
     * Return an array of autoNumeric elements, child of the <form> element passed as a parameter.
     *
     * @param {HTMLElement} formNode
     * @returns {Array}
     * @private
     */
    static _getChildANInputElement(formNode) { //FIXME test this
        const inputList = formNode.getElementsByTagName('input');

        // Loop this list and keep only the inputs that are managed by AutoNumeric
        const autoNumericInputs = [];
        const inputElements = Array.prototype.slice.call(inputList, 0);
        inputElements.forEach(input => {
            if (this.test(input)) {
                autoNumericInputs.push(input);
            }
        });

        return autoNumericInputs;
    }

    // Static methods
    /**
     * Test if the given domElement is already managed by AutoNumeric (if it has been initialized on the current page).
     *
     * @param {HTMLElement} domElement
     * @returns {boolean}
     */
    static test(domElement) {
        return this._isInGlobalList(domElement);
    }

    /**
     * Create a WeakMap with the given name.
     *
     * @param {string} weakMapName
     * @private
     */
    static _createWeakMap(weakMapName) {
        window[weakMapName] = new WeakMap();
    }

    /**
     * Create a list of all the AutoNumeric elements that are initialized on the current page.
     * This is needed in order to determine if a given dom element is already managed by autoNumeric.
     * This uses a WeakMap in order to limit potential garbage collection problems.
     * (cf. my tests on http://codepen.io/AnotherLinuxUser/pen/pRQGaM?editors=1011)
     * @private
     */
    static _createGlobalList() {
        // The check that this global list does not exists already is done in the add and remove functions already
        this.autoNumericGlobalListName = 'autoNumericGlobalList'; //XXX This looks weird to set a variable on `this.` in a static method, but that really declare that variable like a static property
        // Note: I should not get any memory leaks for referencing the DOM element in the `value`, this DOM element also being the `key`, according to the spec : http://www.ecma-international.org/ecma-262/6.0/#sec-weakmap-objects
        this._createWeakMap(this.autoNumericGlobalListName);
    }

    /**
     * Return `true` if the global AutoNumeric element list exists.
     *
     * @returns {boolean}
     * @private
     */
    static _doesGlobalListExists() {
        const type = typeof window[this.autoNumericGlobalListName];
        return type !== 'undefined' &&
               type === 'object';
    }

    /**
     * Add the given object to the global AutoNumeric element list.
     *
     * @param {AutoNumeric} autoNumericObject
     * @private
     */
    static _addToGlobalList(autoNumericObject) {
        if (!this._doesGlobalListExists()) {
            this._createGlobalList();
        }

        const domElement = autoNumericObject.node();
        // This checks if the object is not already in the global list before adding it.
        // This could happen if an AutoNumeric element is initialized, then the DOM element is removed directly via `removeChild` (hence the reference does not get removed from the global list), then it get recreated and initialized again
        if (this._isInGlobalList(domElement)) {
            if (this._getFromGlobalList(domElement) === this) {
                // Do not add this AutoNumeric object again since it's already in that global list
                return;
            } else {
                // Print a warning to warn that the domElement already has a reference in the global map (but we cannot for sure starts deleting those old references since they could still be used by another AutoNumeric object)
                AutoNumericHelper.warning(`A reference to the DOM element you just initialized already exists in the global AutoNumeric element list. Please make sure to not initialize the same DOM element multiple times.`, autoNumericObject.getSettings().showWarnings);
            }
        }

        window[this.autoNumericGlobalListName].set(domElement, autoNumericObject);
    }

    /**
     * Remove the given object from the global AutoNumeric element list.
     *
     * @param {AutoNumeric} autoNumericObject
     * @private
     */
    static _removeFromGlobalList(autoNumericObject) { //FIXME test this
        if (this._doesGlobalListExists()) {
            window[this.autoNumericGlobalListName].delete(autoNumericObject.node());
        }
    }

    /**
     * Return the value associated to the key `domElement` passed as a parameter.
     * The value is the AutoNumeric object that manages the DOM element `domElement`.
     *
     * @param {HTMLElement|HTMLInputElement} domElement
     * @returns {null|AutoNumeric}
     * @private
     */
    static _getFromGlobalList(domElement) { //FIXME test this
        if (this._doesGlobalListExists()) {
            return window[this.autoNumericGlobalListName].get(domElement);
        }

        return null;
    }

    /**
     * Check if the given DOM element is in the global AutoNumeric element list.
     *
     * @param {HTMLElement|HTMLInputElement} domElement
     * @returns {boolean}
     * @private
     */
    static _isInGlobalList(domElement) { //FIXME test this
        if (!this._doesGlobalListExists()) {
            return false;
        }

        return window[this.autoNumericGlobalListName].has(domElement);
    }

    /**
     * Create a `Map` that will stores all the autoNumeric elements that are initialized from this current element.
     * @private
     */
    _createLocalList() {
        this.autoNumericLocalList = new Map();
        this._addToLocalList(this.domElement);
    }

    /**
     * In some rare cases, you could want to delete the local list generated during the element initialization (in order to use another one instead for instance).
     * @private
     */
    _deleteLocalList() {
        delete this.autoNumericLocalList;
    }

    /**
     * Set the local list with the given Map object.
     *
     * @param {Map} localList
     * @private
     */
    _setLocalList(localList) {
        this.autoNumericLocalList = localList;
    }

    /**
     * Return the local list Map object.
     *
     * @returns {*|Map}
     * @private
     */
    _getLocalList() {
        return this.autoNumericLocalList;
    }

    /**
     * Return `true` if the AutoNumeric object has a local list defined already and has at least one element in it (itself usually).
     *
     * @returns {boolean}
     * @private
     */
    _hasLocalList() {
        return this.autoNumericLocalList instanceof Map && this.autoNumericLocalList.size !== 0;
    }

    /**
     * Add the given object to the local autoNumeric element list.
     * Note: in order to keep a coherent list, we only add DOM elements in it, not the autoNumeric object.
     *
     * @param {HTMLElement|HTMLInputElement} domElement
     * @param {AutoNumeric} autoNumericObject A reference to the AutoNumeric object that manage the given DOM element
     * @throws
     * @private
     */
    _addToLocalList(domElement, autoNumericObject = null) {
        if (AutoNumericHelper.isNull(autoNumericObject)) {
            autoNumericObject = this;
        }

        if (!AutoNumericHelper.isUndefined(this.autoNumericLocalList)) {
            this.autoNumericLocalList.set(domElement, autoNumericObject); // Use the DOM element as key, and the AutoNumeric object as the value
        } else {
            AutoNumericHelper.throwError(`The local list provided does not exists when trying to add an element. [${this.autoNumericLocalList}] given.`);
        }
    }

    /**
     * Remove the given object from the local autoNumeric element list.
     *
     * @param {HTMLElement|HTMLInputElement} domElement
     * @private
     */
    _removeFromLocalList(domElement) {
        if (!AutoNumericHelper.isUndefined(this.autoNumericLocalList)) {
            this.autoNumericLocalList.delete(domElement);
        } else if (this.settings.createLocalList) {
            AutoNumericHelper.throwError(`The local list provided does not exists when trying to remove an element. [${this.autoNumericLocalList}] given.`);
        }
    }

    /**
     * Merge the `newSettings` given as parameters into the current element settings.
     *
     * WARNING: Using `Object.assign()` here means the merge is not recursive and only one depth is merged.
     * cf. http://stackoverflow.com/a/39188108/2834898
     * cf. tests on http://codepen.io/AnotherLinuxUser/pen/KaJORq?editors=0011
     *
     * @param {object} newSettings
     * @private
     */
    _mergeSettings(...newSettings) {
        Object.assign(this.settings, ...newSettings);
    }

    /**
     * Return a new object with the current element settings merged with the new settings.
     *
     * @param {object} newSettings
     * @returns {object}
     * @private
     */
    _cloneAndMergeSettings(...newSettings) {
        const result = {};
        Object.assign(result, this.settings, ...newSettings);

        return result;
    }

    /**
     * Validate the given option object.
     * If the options are valid, this function returns nothing, otherwise if the options are invalid, this function throws an error.
     *
     * This tests if the options are not conflicting and are well formatted.
     * This function is lenient since it only tests the settings properties ; it ignores any other properties the options object could have.
     *
     * @param {*} userOptions
     * @param {Boolean} shouldExtendDefaultOptions If `true`, then this function will extends the `userOptions` passed by the user, with the default options.
     * @param {object|null} originalOptions The user can pass the original options (and not the one that are generated from the default settings and the various usability corrections), in order to add compatibility and conflicts checks.
     * @throws Error This throws if the `userOptions` are not valid
     */
    static validate(userOptions, shouldExtendDefaultOptions = true, originalOptions = null) {
        if (AutoNumericHelper.isUndefinedOrNullOrEmpty(userOptions) || !AutoNumericHelper.isObject(userOptions)) {
            AutoNumericHelper.throwError(`The userOptions are invalid ; it should be a valid object, [${userOptions}] given.`);
        }

        const isOriginalOptionAnObject = AutoNumericHelper.isObject(originalOptions);
        if (!isOriginalOptionAnObject && !AutoNumericHelper.isNull(originalOptions)) {
            AutoNumericHelper.throwError(`The 'originalOptions' parameter is invalid ; it should either be a valid option object or \`null\`, [${userOptions}] given.`);
        }

        // If the user used old options, we convert them to new ones
        if (!AutoNumericHelper.isNull(userOptions)) {
            this._convertOldOptionsToNewOnes(userOptions);
        }

        // The user can choose if the `userOptions` has already been extended with the default options, or not
        let options;
        if (shouldExtendDefaultOptions) {
            options = Object.assign({}, this.getDefaultConfig(), userOptions);
        } else {
            options = userOptions;
        }

        // First things first, we test that the `showWarnings` option is valid
        if (!AutoNumericHelper.isTrueOrFalseString(options.showWarnings) && !AutoNumericHelper.isBoolean(options.showWarnings)) {
            AutoNumericHelper.throwError(`The debug option 'showWarnings' is invalid ; it should be either 'false' or 'true', [${options.showWarnings}] given.`);
        }

        // Define the regular expressions needed for the following tests
        const testPositiveInteger = /^[0-9]+$/;
        const testNumericalCharacters = /[0-9]+/;
        // const testFloatAndPossibleNegativeSign = /^-?[0-9]+(\.?[0-9]+)$/;
        const testFloatOrIntegerAndPossibleNegativeSign = /^-?[0-9]+(\.?[0-9]+)?$/;
        const testPositiveFloatOrInteger = /^[0-9]+(\.?[0-9]+)?$/;

        // Then tests the options individually
        if (!AutoNumericHelper.isTrueOrFalseString(options.allowDecimalPadding) &&
            !AutoNumericHelper.isBoolean(options.allowDecimalPadding) &&
            options.allowDecimalPadding !== AutoNumeric.options.allowDecimalPadding.floats) {
            AutoNumericHelper.throwError(`The decimal padding option 'allowDecimalPadding' is invalid ; it should either be \`false\`, \`true\` or \`'floats'\`, [${options.allowDecimalPadding}] given.`);
        }

        if ((options.allowDecimalPadding === AutoNumeric.options.allowDecimalPadding.never ||
            options.allowDecimalPadding === 'false' || //TODO Make sure for the other options that 'false' and 'true' are correctly taken into account
            options.allowDecimalPadding === AutoNumeric.options.allowDecimalPadding.floats) &&
            (options.decimalPlaces !== AutoNumeric.options.decimalPlaces.none ||
            options.decimalPlacesShownOnBlur !== AutoNumeric.options.decimalPlacesShownOnBlur.none ||
            options.decimalPlacesShownOnFocus !== AutoNumeric.options.decimalPlacesShownOnFocus.none)) {
            AutoNumericHelper.warning(`Setting 'allowDecimalPadding' to [${options.allowDecimalPadding}] will override the current 'decimalPlaces*' settings [${options.decimalPlaces}, ${options.decimalPlacesShownOnBlur} and ${options.decimalPlacesShownOnFocus}].`, options.showWarnings);
        }

        if (!AutoNumericHelper.isNull(options.caretPositionOnFocus) && !AutoNumericHelper.isInArray(options.caretPositionOnFocus, [
            AutoNumeric.options.caretPositionOnFocus.start,
            AutoNumeric.options.caretPositionOnFocus.end,
            AutoNumeric.options.caretPositionOnFocus.decimalLeft,
            AutoNumeric.options.caretPositionOnFocus.decimalRight,
        ])) {
            AutoNumericHelper.throwError(`The display on empty string option 'caretPositionOnFocus' is invalid ; it should either be \`null\`, 'focus', 'press', 'always' or 'zero', [${options.caretPositionOnFocus}] given.`);
        }

        // Special case here for `caretPositionOnFocus` and `selectOnFocus` where we need to check the original non-tempered version of the options in order to check for conflicts, since using the default settings remove those and would prevent us warning the user that his option object is not correct.
        let optionsToUse;
        if (isOriginalOptionAnObject) {
            optionsToUse = originalOptions;
        } else {
            optionsToUse = this._correctCaretPositionOnFocusAndSelectOnFocusOptions(userOptions);
        }

        if (!AutoNumericHelper.isNull(optionsToUse) &&
            ((optionsToUse.caretPositionOnFocus !== AutoNumeric.options.caretPositionOnFocus.doNoForceCaretPosition &&
            optionsToUse.selectOnFocus === AutoNumeric.options.selectOnFocus.select))) {
            AutoNumericHelper.warning(`The 'selectOnFocus' option is set to 'select', which is in conflict with the 'caretPositionOnFocus' which is set to '${optionsToUse.caretPositionOnFocus}'. As a result, if this has been called when instantiating an AutoNumeric object, the 'selectOnFocus' option is forced to 'doNotSelect'.`, options.showWarnings);
        }

        if (!AutoNumericHelper.isInArray(options.digitGroupSeparator, [
            AutoNumeric.options.digitGroupSeparator.comma,
            AutoNumeric.options.digitGroupSeparator.dot,
            AutoNumeric.options.digitGroupSeparator.normalSpace,
            AutoNumeric.options.digitGroupSeparator.thinSpace,
            AutoNumeric.options.digitGroupSeparator.narrowNoBreakSpace,
            AutoNumeric.options.digitGroupSeparator.noBreakSpace,
            AutoNumeric.options.digitGroupSeparator.noSeparator,
            AutoNumeric.options.digitGroupSeparator.apostrophe,
            AutoNumeric.options.digitGroupSeparator.arabicThousandsSeparator,
            AutoNumeric.options.digitGroupSeparator.dotAbove,
        ])) {
            AutoNumericHelper.throwError(`The thousand separator character option 'digitGroupSeparator' is invalid ; it should be ',', '.', '٬', '˙', "'", ' ', '\u2009', '\u202f', '\u00a0' or empty (''), [${options.digitGroupSeparator}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.showOnlyNumbersOnFocus) && !AutoNumericHelper.isBoolean(options.showOnlyNumbersOnFocus)) {
            AutoNumericHelper.throwError(`The 'showOnlyNumbersOnFocus' option is invalid ; it should be either 'false' or 'true', [${options.showOnlyNumbersOnFocus}] given.`);
        }

        if (!testPositiveInteger.test(options.digitalGroupSpacing)) {
            AutoNumericHelper.throwError(`The digital grouping for thousand separator option 'digitalGroupSpacing' is invalid ; it should be a positive integer, [${options.digitalGroupSpacing}] given.`);
        }

        if (!AutoNumericHelper.isInArray(options.decimalCharacter, [
            AutoNumeric.options.decimalCharacter.comma,
            AutoNumeric.options.decimalCharacter.dot,
            AutoNumeric.options.decimalCharacter.middleDot,
            AutoNumeric.options.decimalCharacter.arabicDecimalSeparator,
            AutoNumeric.options.decimalCharacter.decimalSeparatorKeySymbol,
        ])) {
            AutoNumericHelper.throwError(`The decimal separator character option 'decimalCharacter' is invalid ; it should be '.', ',', '·', '⎖' or '٫', [${options.decimalCharacter}] given.`);
        }

        // Checks if the decimal and thousand characters are the same
        if (options.decimalCharacter === options.digitGroupSeparator) {
            AutoNumericHelper.throwError(`autoNumeric will not function properly when the decimal character 'decimalCharacter' [${options.decimalCharacter}] and the thousand separator 'digitGroupSeparator' [${options.digitGroupSeparator}] are the same character.`);
        }

        if (!AutoNumericHelper.isNull(options.decimalCharacterAlternative) && !AutoNumericHelper.isString(options.decimalCharacterAlternative)) {
            AutoNumericHelper.throwError(`The alternate decimal separator character option 'decimalCharacterAlternative' is invalid ; it should be a string, [${options.decimalCharacterAlternative}] given.`);
        }

        if (options.currencySymbol !== '' && !AutoNumericHelper.isString(options.currencySymbol)) {
            AutoNumericHelper.throwError(`The currency symbol option 'currencySymbol' is invalid ; it should be a string, [${options.currencySymbol}] given.`);
        }

        if (!AutoNumericHelper.isInArray(options.currencySymbolPlacement, [
            AutoNumeric.options.currencySymbolPlacement.prefix,
            AutoNumeric.options.currencySymbolPlacement.suffix,
        ])) {
            AutoNumericHelper.throwError(`The placement of the currency sign option 'currencySymbolPlacement' is invalid ; it should either be 'p' (prefix) or 's' (suffix), [${options.currencySymbolPlacement}] given.`);
        }

        if (!AutoNumericHelper.isInArray(options.negativePositiveSignPlacement, [
            AutoNumeric.options.negativePositiveSignPlacement.prefix,
            AutoNumeric.options.negativePositiveSignPlacement.suffix,
            AutoNumeric.options.negativePositiveSignPlacement.left,
            AutoNumeric.options.negativePositiveSignPlacement.right,
            AutoNumeric.options.negativePositiveSignPlacement.none,
        ])) {
            AutoNumericHelper.throwError(`The placement of the negative sign option 'negativePositiveSignPlacement' is invalid ; it should either be 'p' (prefix), 's' (suffix), 'l' (left), 'r' (right) or 'null', [${options.negativePositiveSignPlacement}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.showPositiveSign) && !AutoNumericHelper.isBoolean(options.showPositiveSign)) {
            AutoNumericHelper.throwError(`The show positive sign option 'showPositiveSign' is invalid ; it should be either 'false' or 'true', [${options.showPositiveSign}] given.`);
        }

        if (!AutoNumericHelper.isString(options.suffixText) || (options.suffixText !== '' && (AutoNumericHelper.isNegative(options.suffixText) || testNumericalCharacters.test(options.suffixText)))) {
            AutoNumericHelper.throwError(`The additional suffix option 'suffixText' is invalid ; it should not contains the negative sign '-' nor any numerical characters, [${options.suffixText}] given.`);
        }

        if (!AutoNumericHelper.isNull(options.overrideMinMaxLimits) && !AutoNumericHelper.isInArray(options.overrideMinMaxLimits, [
            AutoNumeric.options.overrideMinMaxLimits.ceiling,
            AutoNumeric.options.overrideMinMaxLimits.floor,
            AutoNumeric.options.overrideMinMaxLimits.ignore,
        ])) {
            AutoNumericHelper.throwError(`The override min & max limits option 'overrideMinMaxLimits' is invalid ; it should either be 'ceiling', 'floor' or 'ignore', [${options.overrideMinMaxLimits}] given.`);
        }

        if (!AutoNumericHelper.isString(options.maximumValue) || !testFloatOrIntegerAndPossibleNegativeSign.test(options.maximumValue)) {
            AutoNumericHelper.throwError(`The maximum possible value option 'maximumValue' is invalid ; it should be a string that represents a positive or negative number, [${options.maximumValue}] given.`);
        }

        if (!AutoNumericHelper.isString(options.minimumValue) || !testFloatOrIntegerAndPossibleNegativeSign.test(options.minimumValue)) {
            AutoNumericHelper.throwError(`The minimum possible value option 'minimumValue' is invalid ; it should be a string that represents a positive or negative number, [${options.minimumValue}] given.`);
        }

        if (parseFloat(options.minimumValue) > parseFloat(options.maximumValue)) {
            AutoNumericHelper.throwError(`The minimum possible value option is greater than the maximum possible value option ; 'minimumValue' [${options.minimumValue}] should be smaller than 'maximumValue' [${options.maximumValue}].`);
        }

        if (!((AutoNumericHelper.isInt(options.decimalPlaces) && options.decimalPlaces >= 0) || // If integer option
            (AutoNumericHelper.isString(options.decimalPlaces) && testPositiveInteger.test(options.decimalPlaces))) // If string option
        ) {
            AutoNumericHelper.throwError(`The number of decimal places option 'decimalPlaces' is invalid ; it should be a positive integer, [${options.decimalPlaces}] given.`);
        }

        if (!(AutoNumericHelper.isNull(options.decimalPlacesRawValue) ||
            (AutoNumericHelper.isInt(options.decimalPlacesRawValue) && options.decimalPlacesRawValue >= 0) || // If integer option
            (AutoNumericHelper.isString(options.decimalPlacesRawValue) && testPositiveInteger.test(options.decimalPlacesRawValue))) // If string option
        ) {
            AutoNumericHelper.throwError(`The number of decimal places for the raw value option 'decimalPlacesRawValue' is invalid ; it should be a positive integer or \`null\`, [${options.decimalPlacesRawValue}] given.`);
        }

        // Checks if the number of decimal places for the raw value is lower than the `decimalPlaces`, `decimalPlacesShownOnFocus` and/or `decimalPlacesShownOnBlur` options
        this._validateDecimalPlacesRawValue(options);

        if (!AutoNumericHelper.isNull(options.decimalPlacesShownOnFocus) &&
            !testPositiveInteger.test(String(options.decimalPlacesShownOnFocus))) {
            AutoNumericHelper.throwError(`The number of expanded decimal places option 'decimalPlacesShownOnFocus' is invalid ; it should be a positive integer or \`null\`, [${options.decimalPlacesShownOnFocus}] given.`);
        }

        // Checks if the extended decimal places "decimalPlacesShownOnFocus" is greater than the decimal places number `decimalPlaces`
        if (!AutoNumericHelper.isNull(options.decimalPlacesShownOnFocus) && Number(options.decimalPlaces) > Number(options.decimalPlacesShownOnFocus)) {
            AutoNumericHelper.warning(`The extended decimal places 'decimalPlacesShownOnFocus' [${options.decimalPlacesShownOnFocus}] should be greater than the 'decimalPlaces' [${options.decimalPlaces}] value. Currently, this will limit the ability of your user to manually change some of the decimal places. Do you really want to do that?`, options.showWarnings);
        }

        if (!AutoNumericHelper.isNull(options.divisorWhenUnfocused) &&
            !testPositiveFloatOrInteger.test(options.divisorWhenUnfocused) ||
            options.divisorWhenUnfocused === 0 || options.divisorWhenUnfocused === '0' ||
            options.divisorWhenUnfocused === 1 || options.divisorWhenUnfocused === '1') {
            AutoNumericHelper.throwError(`The divisor option 'divisorWhenUnfocused' is invalid ; it should be a positive number higher than one, preferably an integer, [${options.divisorWhenUnfocused}] given.`);
        }

        if (!AutoNumericHelper.isNull(options.decimalPlacesShownOnBlur) && !testPositiveInteger.test(options.decimalPlacesShownOnBlur)) {
            AutoNumericHelper.throwError(`The number of decimals shown when unfocused option 'decimalPlacesShownOnBlur' is invalid ; it should be a positive integer or \`null\`, [${options.decimalPlacesShownOnBlur}] given.`);
        }

        if (!AutoNumericHelper.isNull(options.symbolWhenUnfocused) && !AutoNumericHelper.isString(options.symbolWhenUnfocused)) {
            AutoNumericHelper.throwError(`The symbol to show when unfocused option 'symbolWhenUnfocused' is invalid ; it should be a string, [${options.symbolWhenUnfocused}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.saveValueToSessionStorage) && !AutoNumericHelper.isBoolean(options.saveValueToSessionStorage)) {
            AutoNumericHelper.throwError(`The save to session storage option 'saveValueToSessionStorage' is invalid ; it should be either 'false' or 'true', [${options.saveValueToSessionStorage}] given.`);
        }

        if (!AutoNumericHelper.isInArray(options.onInvalidPaste, [
            AutoNumeric.options.onInvalidPaste.error,
            AutoNumeric.options.onInvalidPaste.ignore,
            AutoNumeric.options.onInvalidPaste.clamp,
            AutoNumeric.options.onInvalidPaste.truncate,
            AutoNumeric.options.onInvalidPaste.replace,
        ])) {
            AutoNumericHelper.throwError(`The paste behavior option 'onInvalidPaste' is invalid ; it should either be 'error', 'ignore', 'clamp', 'truncate' or 'replace' (cf. documentation), [${options.onInvalidPaste}] given.`);
        }

        if (!AutoNumericHelper.isInArray(options.roundingMethod, [
            AutoNumeric.options.roundingMethod.halfUpSymmetric,
            AutoNumeric.options.roundingMethod.halfUpAsymmetric,
            AutoNumeric.options.roundingMethod.halfDownSymmetric,
            AutoNumeric.options.roundingMethod.halfDownAsymmetric,
            AutoNumeric.options.roundingMethod.halfEvenBankersRounding,
            AutoNumeric.options.roundingMethod.upRoundAwayFromZero,
            AutoNumeric.options.roundingMethod.downRoundTowardZero,
            AutoNumeric.options.roundingMethod.toCeilingTowardPositiveInfinity,
            AutoNumeric.options.roundingMethod.toFloorTowardNegativeInfinity,
            AutoNumeric.options.roundingMethod.toNearest05,
            AutoNumeric.options.roundingMethod.toNearest05Alt,
            AutoNumeric.options.roundingMethod.upToNext05,
            AutoNumeric.options.roundingMethod.downToNext05,
        ])) {
            AutoNumericHelper.throwError(`The rounding method option 'roundingMethod' is invalid ; it should either be 'S', 'A', 's', 'a', 'B', 'U', 'D', 'C', 'F', 'N05', 'CHF', 'U05' or 'D05' (cf. documentation), [${options.roundingMethod}] given.`);
        }

        if (!AutoNumericHelper.isNull(options.negativeBracketsTypeOnBlur) && !AutoNumericHelper.isInArray(options.negativeBracketsTypeOnBlur, [
            AutoNumeric.options.negativeBracketsTypeOnBlur.parentheses,
            AutoNumeric.options.negativeBracketsTypeOnBlur.brackets,
            AutoNumeric.options.negativeBracketsTypeOnBlur.chevrons,
            AutoNumeric.options.negativeBracketsTypeOnBlur.curlyBraces,
            AutoNumeric.options.negativeBracketsTypeOnBlur.angleBrackets,
            AutoNumeric.options.negativeBracketsTypeOnBlur.japaneseQuotationMarks,
            AutoNumeric.options.negativeBracketsTypeOnBlur.halfBrackets,
            AutoNumeric.options.negativeBracketsTypeOnBlur.whiteSquareBrackets,
            AutoNumeric.options.negativeBracketsTypeOnBlur.quotationMarks,
            AutoNumeric.options.negativeBracketsTypeOnBlur.guillemets,
        ])) {
            AutoNumericHelper.throwError(`The brackets for negative values option 'negativeBracketsTypeOnBlur' is invalid ; it should either be '(,)', '[,]', '<,>', '{,}', '〈,〉', '｢,｣', '⸤,⸥', '⟦,⟧', '‹,›' or '«,»', [${options.negativeBracketsTypeOnBlur}] given.`);
        }

        if (!AutoNumericHelper.isInArray(options.emptyInputBehavior, [
            AutoNumeric.options.emptyInputBehavior.focus,
            AutoNumeric.options.emptyInputBehavior.press,
            AutoNumeric.options.emptyInputBehavior.always,
            AutoNumeric.options.emptyInputBehavior.zero,
            AutoNumeric.options.emptyInputBehavior.null,
        ])) {
            AutoNumericHelper.throwError(`The display on empty string option 'emptyInputBehavior' is invalid ; it should either be 'focus', 'press', 'always', 'zero' or 'null', [${options.emptyInputBehavior}] given.`);
        }

        if (options.emptyInputBehavior === AutoNumeric.options.emptyInputBehavior.zero &&
            (options.minimumValue > 0 || options.maximumValue < 0)) {
            AutoNumericHelper.throwError(`The 'emptyInputBehavior' option is set to 'zero', but this value is outside of the range defined by 'minimumValue' and 'maximumValue' [${options.minimumValue}, ${options.maximumValue}].`);
        }

        if (!AutoNumericHelper.isInArray(options.leadingZero, [
            AutoNumeric.options.leadingZero.allow,
            AutoNumeric.options.leadingZero.deny,
            AutoNumeric.options.leadingZero.keep,
        ])) {
            AutoNumericHelper.throwError(`The leading zero behavior option 'leadingZero' is invalid ; it should either be 'allow', 'deny' or 'keep', [${options.leadingZero}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.formatOnPageLoad) && !AutoNumericHelper.isBoolean(options.formatOnPageLoad)) {
            AutoNumericHelper.throwError(`The format on initialization option 'formatOnPageLoad' is invalid ; it should be either 'false' or 'true', [${options.formatOnPageLoad}] given.`);
        }

        if (!testPositiveInteger.test(options.historySize) || options.historySize === 0) {
            AutoNumericHelper.throwError(`The history size option 'historySize' is invalid ; it should be a positive integer, [${options.historySize}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.selectNumberOnly) && !AutoNumericHelper.isBoolean(options.selectNumberOnly)) {
            AutoNumericHelper.throwError(`The select number only option 'selectNumberOnly' is invalid ; it should be either 'false' or 'true', [${options.selectNumberOnly}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.selectOnFocus) && !AutoNumericHelper.isBoolean(options.selectOnFocus)) {
            AutoNumericHelper.throwError(`The select on focus option 'selectOnFocus' is invalid ; it should be either 'false' or 'true', [${options.selectOnFocus}] given.`);
        }

        if (!AutoNumericHelper.isNull(options.defaultValueOverride) && (options.defaultValueOverride !== '' && !testFloatOrIntegerAndPossibleNegativeSign.test(options.defaultValueOverride))) {
            AutoNumericHelper.throwError(`The unformatted default value option 'defaultValueOverride' is invalid ; it should be a string that represents a positive or negative number, [${options.defaultValueOverride}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.unformatOnSubmit) && !AutoNumericHelper.isBoolean(options.unformatOnSubmit)) {
            AutoNumericHelper.throwError(`The remove formatting on submit option 'unformatOnSubmit' is invalid ; it should be either 'false' or 'true', [${options.unformatOnSubmit}] given.`);
        }

        if (!AutoNumericHelper.isNull(options.outputFormat) && !AutoNumericHelper.isInArray(options.outputFormat, [
            AutoNumeric.options.outputFormat.string,
            AutoNumeric.options.outputFormat.number,
            AutoNumeric.options.outputFormat.dot,
            AutoNumeric.options.outputFormat.negativeDot,
            AutoNumeric.options.outputFormat.comma,
            AutoNumeric.options.outputFormat.negativeComma,
            AutoNumeric.options.outputFormat.dotNegative,
            AutoNumeric.options.outputFormat.commaNegative,
        ])) {
            AutoNumericHelper.throwError(`The custom locale format option 'outputFormat' is invalid ; it should either be null, 'string', 'number', '.', '-.', ',', '-,', '.-' or ',-', [${options.outputFormat}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.isCancellable) && !AutoNumericHelper.isBoolean(options.isCancellable)) {
            AutoNumericHelper.throwError(`The cancellable behavior option 'isCancellable' is invalid ; it should be either 'false' or 'true', [${options.isCancellable}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.modifyValueOnWheel) && !AutoNumericHelper.isBoolean(options.modifyValueOnWheel)) {
            AutoNumericHelper.throwError(`The increment/decrement on mouse wheel option 'modifyValueOnWheel' is invalid ; it should be either 'false' or 'true', [${options.modifyValueOnWheel}] given.`);
        }

        if (!(AutoNumericHelper.isString(options.wheelStep) || AutoNumericHelper.isNumber(options.wheelStep)) ||
            (options.wheelStep !== 'progressive' && !testPositiveFloatOrInteger.test(options.wheelStep)) ||
            Number(options.wheelStep) === 0) {
            // A step equal to '0' is rejected
            AutoNumericHelper.throwError(`The wheel step value option 'wheelStep' is invalid ; it should either be the string 'progressive', or a number or a string that represents a positive number (excluding zero), [${options.wheelStep}] given.`);
        }

        if (!AutoNumericHelper.isInArray(options.serializeSpaces, [
            AutoNumeric.options.serializeSpaces.plus,
            AutoNumeric.options.serializeSpaces.percent,
        ])) {
            AutoNumericHelper.throwError(`The space replacement character option 'serializeSpaces' is invalid ; it should either be '+' or '%20', [${options.serializeSpaces}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.noEventListeners) && !AutoNumericHelper.isBoolean(options.noEventListeners)) {
            AutoNumericHelper.throwError(`The option 'noEventListeners' that prevent the creation of event listeners is invalid ; it should be either 'false' or 'true', [${options.noEventListeners}] given.`);
        }

        if (!AutoNumericHelper.isNull(options.styleRules) &&
            !(AutoNumericHelper.isObject(options.styleRules) &&
            ((options.styleRules.hasOwnProperty('positive') ||
            options.styleRules.hasOwnProperty('negative') ||
            options.styleRules.hasOwnProperty('ranges') ||
            options.styleRules.hasOwnProperty('userDefined'))))) {
            AutoNumericHelper.throwError(`The option 'styleRules' is invalid ; it should be a correctly structured object, with one or more 'positive', 'negative', 'ranges' or 'userDefined' attributes, [${options.styleRules}] given.`);
        }

        // Deeper tests of the `styleRules` object : Check that the callback, if defined, is a function
        if (!AutoNumericHelper.isNull(options.styleRules) &&
            options.styleRules.hasOwnProperty('userDefined') &&
            !AutoNumericHelper.isNull(options.styleRules.userDefined)) {
            options.styleRules.userDefined.forEach(rule => {
                if (rule.hasOwnProperty('callback') && !AutoNumericHelper.isFunction(rule.callback)) {
                    AutoNumericHelper.throwError(`The callback defined in the \`userDefined\` attribute is not a function, ${typeof rule.callback} given.`);
                }
            });
        }

        if (!AutoNumericHelper.isNull(options.rawValueDivisor) &&
            !testPositiveFloatOrInteger.test(options.rawValueDivisor) ||
            options.rawValueDivisor === 0 || options.rawValueDivisor === '0' ||
            options.rawValueDivisor === 1 || options.rawValueDivisor === '1') {
            AutoNumericHelper.throwError(`The raw value divisor option 'rawValueDivisor' is invalid ; it should be a positive number higher than one, preferably an integer, [${options.rawValueDivisor}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.readOnly) && !AutoNumericHelper.isBoolean(options.readOnly)) {
            AutoNumericHelper.throwError(`The option 'readOnly' is invalid ; it should be either 'false' or 'true', [${options.readOnly}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.unformatOnHover) && !AutoNumericHelper.isBoolean(options.unformatOnHover)) {
            AutoNumericHelper.throwError(`The option 'unformatOnHover' is invalid ; it should be either 'false' or 'true', [${options.unformatOnHover}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.failOnUnknownOption) && !AutoNumericHelper.isBoolean(options.failOnUnknownOption)) {
            AutoNumericHelper.throwError(`The debug option 'failOnUnknownOption' is invalid ; it should be either 'false' or 'true', [${options.failOnUnknownOption}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.createLocalList) && !AutoNumericHelper.isBoolean(options.createLocalList)) {
            AutoNumericHelper.throwError(`The debug option 'createLocalList' is invalid ; it should be either 'false' or 'true', [${options.createLocalList}] given.`);
        }
    }

    /**
     * Check the `decimalPlaces*` options and output the relevant warnings if some of those will get overwritten during the initialization or settings update.
     *
     * @param {object} options
     * @private
     */
    static _validateDecimalPlacesRawValue(options) {
        // Checks if the number of decimal places for the raw value is lower than the `decimalPlaces`, `decimalPlacesShownOnFocus` and/or `decimalPlacesShownOnBlur` options
        if (!AutoNumericHelper.isNull(options.decimalPlacesRawValue)) {
            if (options.decimalPlacesRawValue < options.decimalPlaces) {
                AutoNumericHelper.warning(`The number of decimal places to store in the raw value [${options.decimalPlacesRawValue}] is lower than the ones to display [${options.decimalPlaces}]. This will likely confuse your users.
To solve that, you'd need to either set \`decimalPlacesRawValue\` to \`null\`, or set a number of decimal places for the raw value equal of bigger than \`decimalPlaces\`.`, options.showWarnings);
            }

            if (options.decimalPlacesRawValue < options.decimalPlacesShownOnFocus) {
                AutoNumericHelper.warning(`The number of decimal places to store in the raw value [${options.decimalPlacesRawValue}] is lower than the ones shown on focus [${options.decimalPlacesShownOnFocus}]. This will likely confuse your users.
To solve that, you'd need to either set \`decimalPlacesRawValue\` to \`null\`, or set a number of decimal places for the raw value equal of bigger than \`decimalPlacesShownOnFocus\`.`, options.showWarnings);
            }

            if (options.decimalPlacesRawValue < options.decimalPlacesShownOnBlur) {
                AutoNumericHelper.warning(`The number of decimal places to store in the raw value [${options.decimalPlacesRawValue}] is lower than the ones shown when unfocused [${options.decimalPlacesShownOnBlur}]. This will likely confuse your users.
To solve that, you'd need to either set \`decimalPlacesRawValue\` to \`null\`, or set a number of decimal places for the raw value equal of bigger than \`decimalPlacesShownOnBlur\`.`, options.showWarnings);
            }
        }
    }

    /**
     * Return `true` if the settings/options are valid, `false` otherwise.
     *
     * @param {object} options
     * @returns {boolean}
     */
    static areSettingsValid(options) {
        let isValid = true;
        try {
            this.validate(options, true);
        } catch (error) {
            isValid = false;
        }

        return isValid;
    }

    /**
     * Return the default autoNumeric settings.
     *
     * @returns {object}
     */
    static getDefaultConfig() {
        return AutoNumeric.defaultSettings;
    }

    /**
     * Return all the predefined language options in one object.
     * You can also access a specific language object directly by using `AutoNumeric.getPredefinedOptions().French` for instance.
     *
     * @returns {object}
     */
    static getPredefinedOptions() {
        return AutoNumeric.predefinedOptions;
    }

    /**
     * Analyse the given array `options` and return a single 'merged' option objet.
     * `options` can be `null`, or an array of an option objects, or an array containing another array of option objects / strings (pre-defined option names)
     *
     * @param {null|Array<object|string|Array<string|object>>} options
     * @returns {null|object}
     * @private
     */
    static _generateOptionsObjectFromOptionsArray(options) {
        let optionsResult;
        if (AutoNumericHelper.isUndefinedOrNullOrEmpty(options) || options.length === 0) {
            optionsResult = null;
        } else {
            optionsResult = {};
            if (options.length === 1 && Array.isArray(options[0])) {
                options[0].forEach(optionObject => {
                    // Using `_getOptionObject()` allows using pre-defined names in the `options` array
                    Object.assign(optionsResult, this._getOptionObject(optionObject));
                });
            } else if (options.length >= 1) {
                options.forEach(optionObject => {
                    Object.assign(optionsResult, this._getOptionObject(optionObject));
                });
            }
        }

        return optionsResult;
    }

    /**
     * Format the given number (or numeric string) with the given options. This returns the formatted value as a string.
     * This can also format the given DOM element value with the given options and returns the formatted value as a string.
     * Note : This function does *not* update that element value with the newly formatted value.
     * This basically allows to get the formatted value without first having to initialize an AutoNumeric object.
     *
     * @param {number|string|HTMLElement|HTMLInputElement} numericStringOrDomElement A number, or a string that represent a javascript number, or a DOM element
     * @param {object|null} options Multiple objects can be passed, the latter overwriting the settings from the former ones
     * @returns {string|null}
     */
    static format(numericStringOrDomElement, ...options) {
        if (AutoNumericHelper.isUndefined(numericStringOrDomElement) || numericStringOrDomElement === null) {
            return null;
        }

        // Retrieve the value to format
        let value;
        if (AutoNumericHelper.isElement(numericStringOrDomElement)) {
            value = AutoNumericHelper.getElementValue(numericStringOrDomElement);
        } else {
            value = numericStringOrDomElement;
        }

        if (!AutoNumericHelper.isString(value) && !AutoNumericHelper.isNumber(value)) {
            AutoNumericHelper.throwError(`The value "${value}" being "set" is not numeric and therefore cannot be used appropriately.`);
        }

        // Manage options
        const optionsToUse = this._generateOptionsObjectFromOptionsArray(options);

        // Initiate a very basic settings object
        const settings = Object.assign({}, this.getDefaultConfig(), optionsToUse);
        if (value < 0) {
            settings.negativeSignCharacter = '-';
        } else {
            settings.negativeSignCharacter = '';
        }

        const regex = {};
        this._cachesUsualRegularExpressions(settings, regex); // This is needed by `_stripAllNonNumberCharacters` that uses those regex

        // Check the validity of the `value` parameter
        // Convert the value to a numeric string, stripping unnecessary characters in the process
        let valueString = this._toNumericValue(value, settings);
        if (isNaN(Number(valueString))) {
            AutoNumericHelper.throwError(`The value [${valueString}] that you are trying to format is not a recognized number.`);
        }

        // Basic tests to check if the given valueString is valid
        const [minTest, maxTest] = this._checkIfInRangeWithOverrideOption(valueString, settings);
        if (!minTest || !maxTest) {
            // Throw a custom event
            AutoNumericHelper.triggerEvent(AutoNumeric.events.formatted, document, 'Range test failed');
            AutoNumericHelper.throwError(`The value [${valueString}] being set falls outside of the minimumValue [${settings.minimumValue}] and maximumValue [${settings.maximumValue}] range set for this element`);
        }

        // Generate the `negativePositiveSignPlacement` option as needed
        this._correctNegativePositiveSignPlacementOption(settings);
        // Calculate the needed decimal places
        this._calculateDecimalPlacesOnInit(settings);

        // Multiply the raw value with `rawValueDivisor` if defined
        if ((!AutoNumericHelper.isUndefinedOrNullOrEmpty(settings.rawValueDivisor) && settings.rawValueDivisor !== 0) && // Only divide if the `rawValueDivisor` option is set
            valueString !== '' && valueString !== null) { // Do not modify the `valueString` if it's an empty string or null
            valueString *= settings.rawValueDivisor;
        }

        // Everything is ok, proceed to rounding, formatting and grouping
        valueString = this._roundFormattedValueShownOnFocus(valueString, settings);
        valueString = this._modifyNegativeSignAndDecimalCharacterForFormattedValue(valueString, settings);
        valueString = this._addGroupSeparators(valueString, settings, false, valueString);

        return valueString;
    }

    /**
     * Format the given DOM element value, and set the resulting value back as the element value.
     *
     * @param {HTMLElement|HTMLInputElement} domElement
     * @param {object} options
     * @returns {string|null}
     */
    static formatAndSet(domElement, options = null) { //FIXME test this
        const formattedValue = this.format(domElement, options);
        AutoNumericHelper.setElementValue(domElement, formattedValue);

        return formattedValue;
    }

    /**
     * Unformat the given formatted string with the given options. This returns a numeric string.
     * It can also unformat the given DOM element value with the given options and returns the unformatted numeric string.
     * Note: This does *not* update that element value.
     * This basically allows to get the unformatted value without first having to initialize an AutoNumeric object.
     *
     * @param {string|number|HTMLElement|HTMLInputElement} numericStringOrDomElement A number, or a string that represent a javascript number, or a DOM element
     * @param {object|null} options Multiple objects can be passed, the latter overwriting the settings from the former ones
     * @returns {string|number|NaN}
     */
    static unformat(numericStringOrDomElement, ...options) {
        if (AutoNumericHelper.isNumberStrict(numericStringOrDomElement)) {
            // Giving an unformatted value should return the same unformatted value, whatever the options passed as a parameter
            return numericStringOrDomElement;
        }

        // Retrieve the value to unformat
        let value;
        if (AutoNumericHelper.isElement(numericStringOrDomElement)) {
            value = AutoNumericHelper.getElementValue(numericStringOrDomElement);
        } else {
            value = numericStringOrDomElement;
        }

        if (AutoNumericHelper.isUndefined(value) || value === null) {
            return null;
        }

        if (AutoNumericHelper.isArray(value) || AutoNumericHelper.isObject(value)) {
            // Check the validity of the `value` parameter
            AutoNumericHelper.throwError(`A number or a string representing a number is needed to be able to unformat it, [${value}] given.`);
        }

        // Manage options
        const optionsToUse = this._generateOptionsObjectFromOptionsArray(options);

        // Generate the settings
        const settings = Object.assign({}, this.getDefaultConfig(), optionsToUse);
        value = value.toString();

        // This checks if a negative sign is anywhere in the `value`, not just on the very first character (ie. '12345.67-')
        if (AutoNumericHelper.isNegative(value)) {
            settings.negativeSignCharacter = '-';
        } else if (!AutoNumericHelper.isNull(settings.negativeBracketsTypeOnBlur)) {
            [settings.firstBracket, settings.lastBracket] = settings.negativeBracketsTypeOnBlur.split(',');
            if (value.charAt(0) === settings.firstBracket &&
                value.charAt(value.length - 1) === settings.lastBracket) {
                settings.negativeSignCharacter = '-';
                value = this._removeBrackets(value, settings, false);
            }
        }

        value = this._convertToNumericString(value, settings);
        const unwantedCharacters = new RegExp(`[^+-0123456789.]`, 'gi');
        if (unwantedCharacters.test(value)) {
            return NaN;
        }

        // Generate the `negativePositiveSignPlacement` option as needed
        this._correctNegativePositiveSignPlacementOption(settings);
        // Calculate the needed decimal places
        if (settings.decimalPlacesRawValue) { // `originalDecimalPlacesRawValue` needs to be defined
            settings.originalDecimalPlacesRawValue = settings.decimalPlacesRawValue;
        } else {
            settings.originalDecimalPlacesRawValue = settings.decimalPlaces;
        }

        this._calculateDecimalPlacesOnInit(settings);

        // Divide the raw value with `rawValueDivisor` if defined
        if ((!AutoNumericHelper.isUndefinedOrNullOrEmpty(settings.rawValueDivisor) && settings.rawValueDivisor !== 0) && // Only divide if the `rawValueDivisor` option is set
            value !== '' && value !== null) { // Do not modify the `value` if it's an empty string or null
            value /= settings.rawValueDivisor;
        }
        
        value = this._roundRawValue(value, settings);
        value = value.replace(settings.decimalCharacter, '.'); // Here we need to convert back the decimal character to a period since `_roundValue` adds it in some cases
        value = this._toLocale(value, settings.outputFormat);

        return value;
    }

    /**
     * Unformat the given DOM element value, and set the resulting value back as the element value.
     *
     * @param {HTMLElement|HTMLInputElement} domElement
     * @param {object} options
     * @returns {*}
     */
    static unformatAndSet(domElement, options = null) { //FIXME test this
        const unformattedValue = this.unformat(domElement, options);
        AutoNumericHelper.setElementValue(domElement, unformattedValue);

        return unformattedValue;
    }

    /**
     * Unformat and localize the given formatted string with the given options. This returns a numeric string.
     * It can also unformat and localize the given DOM element value with the given options and returns the unformatted numeric string.
     * Note: This does *not* update that element value.
     * This basically allows to get the localized value without first having to initialize an AutoNumeric object.
     *
     * @param {string|number|HTMLElement|HTMLInputElement} numericStringOrDomElement
     * @param {object} options
     * @returns {*}
     */
    static localize(numericStringOrDomElement, options = null) {
        let value;
        if (AutoNumericHelper.isElement(numericStringOrDomElement)) {
            value = AutoNumericHelper.getElementValue(numericStringOrDomElement);
        } else {
            value = numericStringOrDomElement;
        }

        if (AutoNumericHelper.isNull(options)) {
            options = AutoNumeric.defaultSettings;
        }

        value = this.unformat(value, options);

        //XXX The following code is pretty close to the one you can find in `getLocalized()`, but different enough so we won't refactor it.
        if (Number(value) === 0 && options.leadingZero !== AutoNumeric.options.leadingZero.keep) {
            value = '0';
        }

        let outputFormatToUse;
        if (AutoNumericHelper.isNull(options)) {
            outputFormatToUse = options.outputFormat;
        } else {
            outputFormatToUse = AutoNumeric.defaultSettings.outputFormat;
        }

        return this._toLocale(value, outputFormatToUse);
    }

    static localizeAndSet(domElement, options = null) { //FIXME test this
        const localizedValue = this.localize(domElement, options);
        AutoNumericHelper.setElementValue(domElement, localizedValue);

        return localizedValue;
    }

    /**
     * Return `true` if the given DOM element has an AutoNumeric object that manages it.
     *
     * @param {HTMLElement} domElement
     * @returns {boolean}
     */
    static isManagedByAutoNumeric(domElement) { //FIXME test this
        return this._isInGlobalList(domElement);
    }

    /**
     * Return the AutoNumeric object that manages the given DOM element.
     *
     * @param {HTMLElement} domElement
     * @returns {null|AutoNumeric}
     */
    static getAutoNumericElement(domElement) { //FIXME test this
        if (!this.isManagedByAutoNumeric(domElement)) {
            return null;
        }

        return this._getFromGlobalList(domElement);
    }


    // Pre-defined options can be called to update the current default options with their specificities
    //XXX A better way would be to not initialize first, but that's not possible since `new` is called first and we do not pass the language options (ie. `French`) to the constructor

    /**
     * Update the AutoNumeric object with the predefined options, and possibly some option overrides.
     *
     * @param {object} predefinedOption
     * @param {object} optionOverride
     * @private
     * @returns {AutoNumeric}
     */
    _updatePredefinedOptions(predefinedOption, optionOverride = null) {
        if (!AutoNumericHelper.isNull(optionOverride)) {
            this._mergeSettings(predefinedOption, optionOverride);
            this.update(this.settings);
        } else {
            this.update(predefinedOption);
        }

        return this;
    }

    /**
     * Update the settings to use the French pre-defined language options.
     * Those pre-defined options can be overridden by passing an option object as a parameter.
     *
     * @param {object} optionOverride
     * @returns {AutoNumeric}
     */
    french(optionOverride = null) {
        this._updatePredefinedOptions(AutoNumeric.getPredefinedOptions().French, optionOverride);

        return this;
    }

    /**
     * Update the settings to use the North American pre-defined language options.
     * Those pre-defined options can be overridden by passing an option object as a parameter.
     *
     * @param {object} optionOverride
     * @returns {AutoNumeric}
     */
    northAmerican(optionOverride = null) {
        this._updatePredefinedOptions(AutoNumeric.getPredefinedOptions().NorthAmerican, optionOverride);

        return this;
    }

    /**
     * Update the settings to use the British pre-defined language options.
     * Those pre-defined options can be overridden by passing an option object as a parameter.
     *
     * @param {object} optionOverride
     * @returns {AutoNumeric}
     */
    british(optionOverride = null) {
        this._updatePredefinedOptions(AutoNumeric.getPredefinedOptions().British, optionOverride);

        return this;
    }

    /**
     * Update the settings to use the Swiss pre-defined language options.
     * Those pre-defined options can be overridden by passing an option object as a parameter.
     *
     * @param {object} optionOverride
     * @returns {AutoNumeric}
     */
    swiss(optionOverride = null) {
        this._updatePredefinedOptions(AutoNumeric.getPredefinedOptions().Swiss, optionOverride);

        return this;
    }

    /**
     * Update the settings to use the Japanese pre-defined language options.
     * Those pre-defined options can be overridden by passing an option object as a parameter.
     *
     * @param {object} optionOverride
     * @returns {AutoNumeric}
     */
    japanese(optionOverride = null) {
        this._updatePredefinedOptions(AutoNumeric.getPredefinedOptions().Japanese, optionOverride);

        return this;
    }

    /**
     * Update the settings to use the Spanish pre-defined language options.
     * Those pre-defined options can be overridden by passing an option object as a parameter.
     *
     * @param {object} optionOverride
     * @returns {AutoNumeric}
     */
    spanish(optionOverride = null) {
        this._updatePredefinedOptions(AutoNumeric.getPredefinedOptions().Spanish, optionOverride);

        return this;
    }

    /**
     * Update the settings to use the Chinese pre-defined language options.
     * Those pre-defined options can be overridden by passing an option object as a parameter.
     *
     * @param {object} optionOverride
     * @returns {AutoNumeric}
     */
    chinese(optionOverride = null) {
        this._updatePredefinedOptions(AutoNumeric.getPredefinedOptions().Chinese, optionOverride);

        return this;
    }

    /**
     * Update the settings to use the Brazilian pre-defined language options.
     * Those pre-defined options can be overridden by passing an option object as a parameter.
     *
     * @param {object} optionOverride
     * @returns {AutoNumeric}
     */
    brazilian(optionOverride = null) {
        this._updatePredefinedOptions(AutoNumeric.getPredefinedOptions().Brazilian, optionOverride);

        return this;
    }


    // Internal private functions
    /**
     * Run any callbacks found in the settings object in order to set the settings value back.
     * Any parameter can have a callback defined.
     * The callback takes the current AutoNumeric element as the first argument, and the key name as the second.
     * @example callback(this, 'currencySymbol')
     */
    _runCallbacksFoundInTheSettingsObject() { //FIXME test this
        // Loops through the this.settings object (option array) to find the following
        for (const key in this.settings) {
            if (this.settings.hasOwnProperty(key)) {
                const value = this.settings[key];

                if (typeof value === 'function') {
                    this.settings[key] = value(this, key);
                } else {
                    // Calls the attached function from the html5 data. For instance: <tag data-currency-symbol="functionName"></tag>
                    let htmlAttribute = this.domElement.getAttribute(key); //TODO Use `dataset` instead of `getAttribute` when we won't need to support obsolete browsers
                    htmlAttribute = AutoNumericHelper.camelize(htmlAttribute);
                    if (typeof this.settings[htmlAttribute] === 'function') {
                        this.settings[key] = htmlAttribute(this, key);
                    }
                }
            }
        }
    }

    /**
     * Keep track if the settings configuration leads to a trailing negative sign (only when the raw value is negative), so we do not have to test the settings values every time we need to know that.
     * `isTrailingNegative` is set to `true` if the settings result in a trailing negative character, `false` otherwise.
     * Note: This returns `true` even if the raw value is positive.
     * @private
     */
    _setTrailingNegativeSignInfo() {
        this.isTrailingNegative = (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.prefix && this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.suffix) ||
        (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix &&
        (this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.left || this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.right));
    }

    /**
     * Strip all unwanted non-number characters.
     * This keeps the numbers, the negative sign as well as the custom decimal character.
     *
     * @param {string} s
     * @param {object} settings
     * @param {boolean} stripZeros If set to `false`, then the leading zero(s) are not stripped, otherwise if set to `true`, the `leadingZero` option is followed
     * @param {boolean} isFocused If the element is focused, then this is `true`
     * @returns {string|*}
     */
    static _stripAllNonNumberCharacters(s, settings, stripZeros, isFocused) {
        //XXX Note; this function is static since we need to pass a `settings` object when calling the static `AutoNumeric.format()` method
        //TODO This function is called 10 times (sic!) on each key input, couldn't we lower that number? cf. issue #325
        //TODO Refactor this with `convertToNumericString()` if possible?
        s = String(s); // Typecast to to a string, in case that the initialValue is a number

        if (settings.currencySymbol !== '') {
            // Remove currency sign
            s = s.replace(settings.currencySymbol, '');
        }

        if (settings.suffixText) {
            // Remove suffix
            s = s.replace(settings.suffixText, '');
        }

        //TODO Remove the positive sign too?

        // First replace anything before digits
        s = s.replace(settings.skipFirstAutoStrip, '$1$2');

        // Then replace anything after digits
        s = s.replace(settings.skipLastAutoStrip, '$1');

        // Then remove any uninteresting characters
        s = s.replace(settings.allowedAutoStrip, '');
        if (settings.decimalCharacterAlternative) {
            s = s.replace(settings.decimalCharacterAlternative, settings.decimalCharacter);
        }

        // Get only number string
        const m = s.match(settings.numRegAutoStrip);
        s = m ? [m[1], m[2], m[3]].join('') : '';

        if (settings.leadingZero === AutoNumeric.options.leadingZero.allow || settings.leadingZero === AutoNumeric.options.leadingZero.keep) {
            let negativeSign = '';
            const [integerPart, decimalPart] = s.split(settings.decimalCharacter);
            let modifiedIntegerPart = integerPart;
            if (AutoNumericHelper.contains(modifiedIntegerPart, settings.negativeSignCharacter)) {
                negativeSign = settings.negativeSignCharacter;
                modifiedIntegerPart = modifiedIntegerPart.replace(settings.negativeSignCharacter, '');
            }

            // Strip leading zero on positive value if need
            if (negativeSign === '' && modifiedIntegerPart.length > settings.mIntPos && modifiedIntegerPart.charAt(0) === '0') {
                modifiedIntegerPart = modifiedIntegerPart.slice(1);
            }

            // Strip leading zero on negative value if need
            if (negativeSign !== '' && modifiedIntegerPart.length > settings.mIntNeg && modifiedIntegerPart.charAt(0) === '0') {
                modifiedIntegerPart = modifiedIntegerPart.slice(1);
            }

            s = `${negativeSign}${modifiedIntegerPart}${AutoNumericHelper.isUndefined(decimalPart)?'':settings.decimalCharacter + decimalPart}`;
        }

        if ((stripZeros && settings.leadingZero === AutoNumeric.options.leadingZero.deny) ||
            (!isFocused && settings.leadingZero === AutoNumeric.options.leadingZero.allow)) {
            s = s.replace(settings.stripReg, '$1$2');
        }

        return s;
    }

    /**
     * Sets or removes brackets on negative values, depending on the focus state, which is passed as `isFocused`.
     * The focus state is 'stored' in that object property.
     *
     * @param {string} value
     * @param {object} settings
     * @param {boolean} isFocused
     * @returns {*}
     */
    static _toggleNegativeBracket(value, settings, isFocused) {
        //XXX Note; this function is static since we need to pass a `settings` object when calling the static `AutoNumeric.format()` method
        let result;
        if (isFocused) {
            result = this._removeBrackets(value, settings);
        } else {
            result = this._addBrackets(value, settings);
        }

        return result;
    }

    /**
     * Add the bracket types specified in the `settings` object, to the given string `value`.
     *
     * @param {string} value
     * @param {object} settings
     * @returns {string}
     * @private
     */
    static _addBrackets(value, settings) {
        let result;
        if (!AutoNumericHelper.isNull(settings.negativeBracketsTypeOnBlur)) {
            result = `${settings.firstBracket}${value.replace(settings.negativeSignCharacter, '')}${settings.lastBracket}`;
        } else {
            result = value;
        }

        return result;
    }

    /**
     * Remove the bracket types specified in the `settings` object, from the given string `value`.
     *
     * @param {string} value
     * @param {object} settings
     * @param {boolean} rearrangeSignsAndValueOrder If set to `true`, then only the brackets are remove and a negative sign is added, without reordering the negative sign, currency symbol and value according to the settings.
     * @returns {string}
     * @private
     */
    static _removeBrackets(value, settings, rearrangeSignsAndValueOrder = true) {
        let result;
        if (!AutoNumericHelper.isNull(settings.negativeBracketsTypeOnBlur) && value.charAt(0) === settings.firstBracket) {
            // Remove the brackets if they are present
            result = value.replace(settings.firstBracket, '');
            result = result.replace(settings.lastBracket, '');

            // Add back the negative sign at the right place
            if (rearrangeSignsAndValueOrder) {
                // First we need to remove the currency symbol from the value, since we want to be able to add back the negative sign at the right place (including between the value and the currency sign)
                result = result.replace(settings.currencySymbol, '');
                result = this._mergeCurrencySignNegativePositiveSignAndValue(result, settings, true, false); //TODO This assume the value is negative and non-empty. Is this always the case?
            } else {
                // Here we only want to add the negative sign since we removed the brackets, without reordering
                result = '-' + result;
            }
        } else {
            result = value;
        }

        return result;
    }

    /**
     * Analyze the `negativeBracketsTypeOnBlur` options and keep track of the first and last bracket characters to use.
     * @private
     */
    _setBrackets() {
        if (!AutoNumericHelper.isNull(this.settings.negativeBracketsTypeOnBlur)) {
            [this.settings.firstBracket, this.settings.lastBracket] = this.settings.negativeBracketsTypeOnBlur.split(',');
        } else {
            this.settings.firstBracket = '';
            this.settings.lastBracket = '';
        }
    }

    /**
     * Return a number as a numeric string that can be typecast to a Number that Javascript will understand.
     *
     * This function return the given string by stripping the currency sign (currencySymbol), the grouping separators (digitalGroupSpacing) and by replacing the decimal character (decimalCharacter) by a dot.
     * Lastly, it also put the negative sign back to its normal position if needed.
     *
     * @param {string} s
     * @param {object} settings
     * @returns {string|void|XML|*}
     */
    static _convertToNumericString(s, settings) {
        // Remove the currency symbol
        s = s.replace(settings.currencySymbol, '');

        // Remove the grouping separators (thousands separators usually)
        s = s.replace(new RegExp(`[${settings.digitGroupSeparator}]`, 'g'), '');

        // Replace the decimal character by a dot
        if (settings.decimalCharacter !== '.') {
            s = s.replace(settings.decimalCharacter, '.');
        }

        // Remove the suffixText
        if (settings.suffixText !== AutoNumeric.options.suffixText.none) {
            s = s.replace(settings.suffixText, '');
        }

        // Move the trailing negative sign to the right position, if any
        if (AutoNumericHelper.isNegative(s) && s.lastIndexOf('-') === s.length - 1) {
            s = s.replace('-', '');
            s = '-' + s;
        }

        // Convert arabic numbers to latin ones, if any
        const convertToNumber = settings.leadingZero !== AutoNumeric.options.leadingZero.keep;
        const temp = AutoNumericHelper.arabicToLatinNumbers(s, convertToNumber, false, false);
        if (!isNaN(temp)) {
            s = temp.toString();
        }

        return s;
    }

    /**
     * Converts the ISO numeric string to the locale decimal and minus sign placement.
     * See the "outputFormat" option definition for more details.
     *
     * @param {string|null} value
     * @param {string|null} locale
     * @returns {*}
     */
    static _toLocale(value, locale) {
        if (AutoNumericHelper.isNull(locale) || locale === AutoNumeric.options.outputFormat.string) {
            return value;
        }

        let result;
        switch (locale) {
            case AutoNumeric.options.outputFormat.number:
                result = Number(value);
                break;
            case AutoNumeric.options.outputFormat.dotNegative:
                result = AutoNumericHelper.isNegative(value) ? value.replace('-', '') + '-' : value;
                break;
            case AutoNumeric.options.outputFormat.comma:
            case AutoNumeric.options.outputFormat.negativeComma:
                result = value.replace('.', ',');
                break;
            case AutoNumeric.options.outputFormat.commaNegative:
                result = value.replace('.', ',');
                result = AutoNumericHelper.isNegative(result) ? result.replace('-', '') + '-' : result;
                break;
            // The default case
            case AutoNumeric.options.outputFormat.dot:
            case AutoNumeric.options.outputFormat.negativeDot:
                result = value;
                break;
            default :
                AutoNumericHelper.throwError(`The given outputFormat [${locale}] option is not recognized.`);
        }

        return result;
    }

    /**
     * Modify the negative sign and the decimal character of the given string value to an hyphen (-) and a dot (.) in order to make that value 'typecastable' to a real number.
     *
     * @param {string} s
     * @returns {string}
     */
    _modifyNegativeSignAndDecimalCharacterForRawValue(s) {
        if (this.settings.decimalCharacter !== '.') {
            s = s.replace(this.settings.decimalCharacter, '.');
        }

        if (this.settings.negativeSignCharacter !== '-' && this.settings.negativeSignCharacter !== '') {
            s = s.replace(this.settings.negativeSignCharacter, '-');
        }

        if (!s.match(/\d/)) {
            // The default value returned by `get` is not formatted with decimals
            s += '0';
        }

        return s;
    }

    /**
     * Modify the negative sign and the decimal character to use those defined in the settings.
     *
     * @param {string} s
     * @param {object} settings
     * @returns {string}
     */
    static _modifyNegativeSignAndDecimalCharacterForFormattedValue(s, settings) {
        //XXX Note; this function is static since we need to pass a `settings` object when calling the static `AutoNumeric.format()` method
        if (settings.negativeSignCharacter !== '-' && settings.negativeSignCharacter !== '') {
            s = s.replace('-', settings.negativeSignCharacter);
        }

        if (settings.decimalCharacter !== '.') {
            s = s.replace('.', settings.decimalCharacter);
        }

        return s;
    }

    /**
     * Return `true` if the given value is empty or is equal to the negative sign character defined in the given settings.
     *
     * @param {string} value
     * @param {object} settings
     * @returns {boolean}
     * @private
     */
    static _isElementValueEmptyOrOnlyTheNegativeSign(value, settings) {
        return value === '' || value === settings.negativeSignCharacter;
    }

    /**
     * Return the value with the currency symbol and the suffix text ordered according to the given settings.
     *
     * @param {string} value
     * @param {object} settings
     * @param {boolean} signOnEmpty
     * @returns {*}
     * @private
     */
    static _orderValueCurrencySymbolAndSuffixText(value, settings, signOnEmpty) {
        let result;
        if (settings.emptyInputBehavior === AutoNumeric.options.emptyInputBehavior.always || signOnEmpty) {
            if (settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.left) {
                result = value + settings.currencySymbol + settings.suffixText;
            } else {
                result = settings.currencySymbol + value + settings.suffixText;
            }
        } else {
            result = value;
        }

        return result;
    }

    /**
     * Modify the input value by adding the group separators, as defined in the settings.
     *
     * @param {string} inputValue The formatted value (ie. with the `decimalCharacter` defined in the settings, not the raw value)
     * @param {object} settings
     * @param {boolean} isFocused
     * @param {number|string|null} currentRawValue The object current raw value (`this.rawValue`)
     * @param {number|string|null} forcedRawValue If this is set, then this rawValue is used instead of the one passed through the `settings` object. This is useful is some very specific cases where we need to set the raw value *after* settings the formatted value, using the `_addGroupSeparators()` method.
     * @returns {*}
     */
    static _addGroupSeparators(inputValue, settings, isFocused, currentRawValue, forcedRawValue = null) {
        //TODO Test if `inputValue` === '', and return '' directly if that's the case,
        //XXX Note; this function is static since we need to pass a `settings` object when calling the static `AutoNumeric.format()` method
        const isValueNegative = AutoNumericHelper.isNegative(inputValue) || AutoNumericHelper.isNegativeWithBrackets(inputValue, settings.firstBracket, settings.lastBracket); // Test if the value is negative before removing the negative sign

        inputValue = this._stripAllNonNumberCharacters(inputValue, settings, false, isFocused);

        if (this._isElementValueEmptyOrOnlyTheNegativeSign(inputValue, settings)) {
            return this._orderValueCurrencySymbolAndSuffixText(inputValue, settings, true);
        }

        const isZeroOrHasNoValue = AutoNumericHelper.isZeroOrHasNoValue(inputValue);

        // Temporarily remove the negative sign if present
        if (isValueNegative) {
            inputValue = inputValue.replace('-', '');
        }

        settings.digitalGroupSpacing = settings.digitalGroupSpacing.toString();
        let digitalGroup;
        switch (settings.digitalGroupSpacing) {
            case AutoNumeric.options.digitalGroupSpacing.two:
                digitalGroup = /(\d)((\d)(\d{2}?)+)$/;
                break;
            case AutoNumeric.options.digitalGroupSpacing.twoScaled:
                digitalGroup = /(\d)((?:\d{2}){0,2}\d{3}(?:(?:\d{2}){2}\d{3})*?)$/;
                break;
            case AutoNumeric.options.digitalGroupSpacing.four:
                digitalGroup = /(\d)((\d{4}?)+)$/;
                break;
            case AutoNumeric.options.digitalGroupSpacing.three:
            default :
                digitalGroup = /(\d)((\d{3}?)+)$/;
        }

        // Splits the string at the decimal string
        let [integerPart, decimalPart] = inputValue.split(settings.decimalCharacter);
        if (settings.decimalCharacterAlternative && AutoNumericHelper.isUndefined(decimalPart)) {
            [integerPart, decimalPart] = inputValue.split(settings.decimalCharacterAlternative);
        }

        if (settings.digitGroupSeparator !== '') {
            // Re-inserts the thousand separator via a regular expression
            while (digitalGroup.test(integerPart)) {
                integerPart = integerPart.replace(digitalGroup, `$1${settings.digitGroupSeparator}$2`);
            }
        }

        // Find out how many decimal places should be kept, depending on the object state (isFocused)
        let decimalPlacesToRoundTo;
        if (isFocused) {
            decimalPlacesToRoundTo = settings.decimalPlacesShownOnFocus;
        } else {
            decimalPlacesToRoundTo = settings.decimalPlacesShownOnBlur;
        }

        if (decimalPlacesToRoundTo !== 0 && !AutoNumericHelper.isUndefined(decimalPart)) {
            if (decimalPart.length > decimalPlacesToRoundTo) {
                // Trim the excessive number of decimal places
                decimalPart = decimalPart.substring(0, decimalPlacesToRoundTo);
            }

            // Joins the whole number with the decimal value
            inputValue = `${integerPart}${settings.decimalCharacter}${decimalPart}`;
        } else {
            // Otherwise if it's an integer
            inputValue = integerPart;
        }

        // Add back the negative/positive sign and the currency symbol, at the right positions
        inputValue = AutoNumeric._mergeCurrencySignNegativePositiveSignAndValue(inputValue, settings, isValueNegative, isZeroOrHasNoValue); //TODO this function is called again in `_toggleNegativeBracket` if the brackets are removed; let's DRY this

        if (AutoNumericHelper.isNull(forcedRawValue)) {
            // If the raw value is not forced, use the default one from the settings object
            forcedRawValue = currentRawValue;
        }

        // Toggle the negative sign and brackets
        if (settings.negativeBracketsTypeOnBlur !== null && (forcedRawValue < 0 || AutoNumericHelper.isNegativeStrict(inputValue))) {
            inputValue = this._toggleNegativeBracket(inputValue, settings, isFocused);
        }

        let result;
        if (settings.suffixText) {
            result = `${inputValue}${settings.suffixText}`;
        } else {
            result = inputValue;
        }

        return result;
    }

    /**
     * Return a semi-formatted string where the input value, the negative or positive sign, and the currency symbol are stitched together at the right positions, using the options set in the `settings` object.
     * Note : the `inputValue` is usually not a numeric string since the grouping symbols are already added to it at this point.
     *
     * @param {string} inputValue
     * @param {object} settings
     * @param {boolean} isValueNegative
     * @param {boolean} isZeroOrHasNoValue
     * @returns {*}
     * @throws
     * @private
     */
    static _mergeCurrencySignNegativePositiveSignAndValue(inputValue, settings, isValueNegative, isZeroOrHasNoValue) {
        let signToUse = '';
        if (isValueNegative) {
            signToUse = settings.negativeSignCharacter;
        } else if (settings.showPositiveSign && !isZeroOrHasNoValue) {
            signToUse = settings.positiveSignCharacter;
        }

        let result;
        if (settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.prefix) {
            if (settings.negativePositiveSignPlacement !== AutoNumeric.options.negativePositiveSignPlacement.none &&
                (isValueNegative || (!isValueNegative && settings.showPositiveSign && !isZeroOrHasNoValue))) {
                switch (settings.negativePositiveSignPlacement) {
                    case AutoNumeric.options.negativePositiveSignPlacement.prefix:
                    case AutoNumeric.options.negativePositiveSignPlacement.left:
                        result = `${signToUse}${settings.currencySymbol}${inputValue}`;
                        break;
                    case AutoNumeric.options.negativePositiveSignPlacement.right:
                        result = `${settings.currencySymbol}${signToUse}${inputValue}`;
                        break;
                    case AutoNumeric.options.negativePositiveSignPlacement.suffix:
                        result = `${settings.currencySymbol}${inputValue}${signToUse}`;
                        break;
                }
            } else {
                result = settings.currencySymbol + inputValue;
            }
        } else if (settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix) {
            if (settings.negativePositiveSignPlacement !== AutoNumeric.options.negativePositiveSignPlacement.none &&
                (isValueNegative || (!isValueNegative && settings.showPositiveSign && !isZeroOrHasNoValue))) {
                switch (settings.negativePositiveSignPlacement) {
                    case AutoNumeric.options.negativePositiveSignPlacement.suffix:
                    case AutoNumeric.options.negativePositiveSignPlacement.right:
                        result = `${inputValue}${settings.currencySymbol}${signToUse}`;
                        break;
                    case AutoNumeric.options.negativePositiveSignPlacement.left:
                        result = `${inputValue}${signToUse}${settings.currencySymbol}`;
                        break;
                    case AutoNumeric.options.negativePositiveSignPlacement.prefix:
                        result = `${signToUse}${inputValue}${settings.currencySymbol}`;
                        break;
                }
            } else {
                result = inputValue + settings.currencySymbol;
            }
        }

        return result;
    }

    /**
     * Calculate where to put the caret position on focus if the element content is not selected.
     * This calculation is affected by the `caretPositionOnFocus` option which can be either `null`, `'start'`, `'end'`, `'decimalLeft'` or 'decimalRight'`, and will decide where to put the caret (on the left or right of the value or the decimal character, respectively) :
     * - `null` : the caret position is not forced
     * - `'start'` : the caret is positioned on the left hand side of the value
     * - `'end'` : the caret is positioned on the right hand side of the value
     * - `'decimalLeft'` : the caret is positioned on the left side of the decimal character
     * - `'decimalRight'` : the caret is positioned on the right side of the decimal character
     *
     * @param {string} value The formatted string stripped of the currency symbol and negative/positive sign
     * @returns {number}
     * @throws
     * @private
     */
    _initialCaretPosition(value) {
        if (AutoNumericHelper.isNull(this.settings.caretPositionOnFocus)) {
            AutoNumericHelper.throwError('`_initialCaretPosition()` should never be called when the `caretPositionOnFocus` option is `null`.');
        }

        const isValueNegative = this.rawValue < 0;
        const isZeroOrHasNoValue = AutoNumericHelper.isZeroOrHasNoValue(value);
        const totalLength = value.length;

        let valueSize = 0;
        let integerSize = 0;
        let hasDecimalChar = false;
        let offsetDecimalChar = 0;
        if (this.settings.caretPositionOnFocus !== AutoNumeric.options.caretPositionOnFocus.start) {
            value = value.replace('-', '');
            value = value.replace('+', '');
            value = value.replace(this.settings.currencySymbol, '');
            valueSize = value.length;
            hasDecimalChar = AutoNumericHelper.contains(value, this.settings.decimalCharacter);

            if (this.settings.caretPositionOnFocus === AutoNumeric.options.caretPositionOnFocus.decimalLeft ||
                this.settings.caretPositionOnFocus === AutoNumeric.options.caretPositionOnFocus.decimalRight) {
                if (hasDecimalChar) {
                    integerSize = value.indexOf(this.settings.decimalCharacter);
                    offsetDecimalChar = this.settings.decimalCharacter.length;
                } else {
                    integerSize = valueSize;
                    offsetDecimalChar = 0;
                }
            }
        }

        let signToUse = '';
        if (isValueNegative) {
            signToUse = this.settings.negativeSignCharacter;
        } else if (this.settings.showPositiveSign && !isZeroOrHasNoValue) {
            signToUse = this.settings.positiveSignCharacter;
        }
        
        const positiveNegativeSignSize = signToUse.length;
        const currencySymbolSize = this.settings.currencySymbol.length;

        // Calculate the caret position based on `currencySymbolPlacement`, `negativePositiveSignPlacement` and `caretPositionOnFocus`
        let caretPosition;
        if (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.prefix) {
            if (this.settings.caretPositionOnFocus === AutoNumeric.options.caretPositionOnFocus.start) {
                if (this.settings.negativePositiveSignPlacement !== AutoNumeric.options.negativePositiveSignPlacement.none &&
                    (isValueNegative || (!isValueNegative && this.settings.showPositiveSign && !isZeroOrHasNoValue))) {
                    switch (this.settings.negativePositiveSignPlacement) {
                        case AutoNumeric.options.negativePositiveSignPlacement.prefix: // +€|12.34
                        case AutoNumeric.options.negativePositiveSignPlacement.left:   // +€|12.34
                        case AutoNumeric.options.negativePositiveSignPlacement.right:  // €+|12.34
                            caretPosition = positiveNegativeSignSize + currencySymbolSize;
                            break;
                        case AutoNumeric.options.negativePositiveSignPlacement.suffix: // €|12.34+
                            caretPosition = currencySymbolSize;
                            break;
                    }
                } else {                                                               // €|12.34
                    caretPosition = currencySymbolSize;
                }
            } else if (this.settings.caretPositionOnFocus === AutoNumeric.options.caretPositionOnFocus.end) {
                if (this.settings.negativePositiveSignPlacement !== AutoNumeric.options.negativePositiveSignPlacement.none &&
                    (isValueNegative || (!isValueNegative && this.settings.showPositiveSign && !isZeroOrHasNoValue))) {
                    switch (this.settings.negativePositiveSignPlacement) {
                        case AutoNumeric.options.negativePositiveSignPlacement.prefix: // +€12.34|
                        case AutoNumeric.options.negativePositiveSignPlacement.left:   // +€12.34|
                        case AutoNumeric.options.negativePositiveSignPlacement.right:  // €+12.34|
                            caretPosition = totalLength;
                            break;
                        case AutoNumeric.options.negativePositiveSignPlacement.suffix: // €12.34|+
                            caretPosition = currencySymbolSize + valueSize;
                            break;
                    }
                } else {                                                               // €12.34|
                    caretPosition = totalLength;
                }
            } else if (this.settings.caretPositionOnFocus === AutoNumeric.options.caretPositionOnFocus.decimalLeft) {
                if (this.settings.negativePositiveSignPlacement !== AutoNumeric.options.negativePositiveSignPlacement.none &&
                    (isValueNegative || (!isValueNegative && this.settings.showPositiveSign && !isZeroOrHasNoValue))) {
                    switch (this.settings.negativePositiveSignPlacement) {
                        case AutoNumeric.options.negativePositiveSignPlacement.prefix: // +€12|.34
                        case AutoNumeric.options.negativePositiveSignPlacement.left:   // +€12|.34
                        case AutoNumeric.options.negativePositiveSignPlacement.right:  // €+12|.34
                            caretPosition = positiveNegativeSignSize + currencySymbolSize + integerSize;
                            break;
                        case AutoNumeric.options.negativePositiveSignPlacement.suffix: // €12|.34+
                            caretPosition = currencySymbolSize + integerSize;
                            break;
                    }
                } else {                                                               // €12|.34
                    caretPosition = currencySymbolSize + integerSize;
                }
            } else if (this.settings.caretPositionOnFocus === AutoNumeric.options.caretPositionOnFocus.decimalRight) {
                if (this.settings.negativePositiveSignPlacement !== AutoNumeric.options.negativePositiveSignPlacement.none &&
                    (isValueNegative || (!isValueNegative && this.settings.showPositiveSign && !isZeroOrHasNoValue))) {
                    switch (this.settings.negativePositiveSignPlacement) {
                        case AutoNumeric.options.negativePositiveSignPlacement.prefix: // +€12.|34
                        case AutoNumeric.options.negativePositiveSignPlacement.left:   // +€12.|34
                        case AutoNumeric.options.negativePositiveSignPlacement.right:  // €+12.|34
                            caretPosition = positiveNegativeSignSize + currencySymbolSize + integerSize + offsetDecimalChar;
                            break;
                        case AutoNumeric.options.negativePositiveSignPlacement.suffix: // €12.|34+
                            caretPosition = currencySymbolSize + integerSize + offsetDecimalChar;
                            break;
                    }
                } else {                                                               // €12.|34
                    caretPosition = currencySymbolSize + integerSize + offsetDecimalChar;
                }
            }
        } else if (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix) {
            if (this.settings.caretPositionOnFocus === AutoNumeric.options.caretPositionOnFocus.start) {
                if (this.settings.negativePositiveSignPlacement !== AutoNumeric.options.negativePositiveSignPlacement.none &&
                    (isValueNegative || (!isValueNegative && this.settings.showPositiveSign && !isZeroOrHasNoValue))) {
                    switch (this.settings.negativePositiveSignPlacement) {
                        case AutoNumeric.options.negativePositiveSignPlacement.suffix: // |12.34€+
                        case AutoNumeric.options.negativePositiveSignPlacement.right:  // |12.34€+
                        case AutoNumeric.options.negativePositiveSignPlacement.left:   // |12.34+€
                            caretPosition = 0;
                            break;
                        case AutoNumeric.options.negativePositiveSignPlacement.prefix: // +|12.34€
                            caretPosition = positiveNegativeSignSize;
                            break;
                    }
                } else {                                                               // |12.34€
                    caretPosition = 0;
                }
            } else if (this.settings.caretPositionOnFocus === AutoNumeric.options.caretPositionOnFocus.end) {
                if (this.settings.negativePositiveSignPlacement !== AutoNumeric.options.negativePositiveSignPlacement.none &&
                    (isValueNegative || (!isValueNegative && this.settings.showPositiveSign && !isZeroOrHasNoValue))) {
                    switch (this.settings.negativePositiveSignPlacement) {
                        case AutoNumeric.options.negativePositiveSignPlacement.suffix: // 12.34|€+
                        case AutoNumeric.options.negativePositiveSignPlacement.right:  // 12.34|€+
                        case AutoNumeric.options.negativePositiveSignPlacement.left:   // 12.34|+€
                            caretPosition = valueSize;
                            break;
                        case AutoNumeric.options.negativePositiveSignPlacement.prefix: // +12.34|€
                            caretPosition = positiveNegativeSignSize + valueSize;
                            break;
                    }
                } else {                                                               // 12.34|€
                    caretPosition = valueSize;
                }
            } else if (this.settings.caretPositionOnFocus === AutoNumeric.options.caretPositionOnFocus.decimalLeft) {
                if (this.settings.negativePositiveSignPlacement !== AutoNumeric.options.negativePositiveSignPlacement.none &&
                    (isValueNegative || (!isValueNegative && this.settings.showPositiveSign && !isZeroOrHasNoValue))) {
                    switch (this.settings.negativePositiveSignPlacement) {
                        case AutoNumeric.options.negativePositiveSignPlacement.suffix: // 12|.34€+
                        case AutoNumeric.options.negativePositiveSignPlacement.right:  // 12|.34€+
                        case AutoNumeric.options.negativePositiveSignPlacement.left:   // 12|.34+€
                            caretPosition = integerSize;
                            break;
                        case AutoNumeric.options.negativePositiveSignPlacement.prefix: // +12|.34€
                            caretPosition = positiveNegativeSignSize + integerSize;
                            break;
                    }
                } else {                                                               // 12|.34€
                    caretPosition = integerSize;
                }
            } else if (this.settings.caretPositionOnFocus === AutoNumeric.options.caretPositionOnFocus.decimalRight) {
                if (this.settings.negativePositiveSignPlacement !== AutoNumeric.options.negativePositiveSignPlacement.none &&
                    (isValueNegative || (!isValueNegative && this.settings.showPositiveSign && !isZeroOrHasNoValue))) {
                    switch (this.settings.negativePositiveSignPlacement) {
                        case AutoNumeric.options.negativePositiveSignPlacement.suffix: // 12.|34€+
                        case AutoNumeric.options.negativePositiveSignPlacement.right:  // 12.|34€+
                        case AutoNumeric.options.negativePositiveSignPlacement.left:   // 12.|34+€
                            caretPosition = integerSize + offsetDecimalChar;
                            break;
                        case AutoNumeric.options.negativePositiveSignPlacement.prefix: // +12.|34€
                            caretPosition = positiveNegativeSignSize + integerSize + offsetDecimalChar;
                            break;
                    }
                } else {                                                               // 12.|34€
                    caretPosition = integerSize + offsetDecimalChar;
                }
            }
        }

        return caretPosition;
    }

    /**
     * Truncate the trailing zeroes to the given number of decimal places
     *
     * @param {string} roundedInputValue
     * @param {int} decimalPlacesNeeded The number of decimal places to keep
     * @returns {string}
     */
    static _truncateZeros(roundedInputValue, decimalPlacesNeeded) {
        let regex;
        switch (decimalPlacesNeeded) {
            case 0:
                // Prevents padding - removes trailing zeros until the first significant digit is encountered
                regex = /(\.(?:\d*[1-9])?)0*$/;
                break;
            case 1:
                // Allows padding when decimalPlacesNeeded equals one - leaves one zero trailing the decimal character
                regex = /(\.\d(?:\d*[1-9])?)0*$/;
                break;
            default :
                // Removes superfluous zeros after the decimalPlacesNeeded length
                regex = new RegExp(`(\\.\\d{${decimalPlacesNeeded}}(?:\\d*[1-9])?)0*`);
        }

        // If there are no decimal places, we don't need a decimal point at the end
        roundedInputValue = roundedInputValue.replace(regex, '$1');
        if (decimalPlacesNeeded === 0) {
            roundedInputValue = roundedInputValue.replace(/\.$/, '');
        }

        return roundedInputValue;
    }

    /**
     * Round the given `value` with the number of decimal places to keep for the raw value.
     *
     * @param {string|null} value An unformatted numeric value
     * @param {object} settings
     * @returns {*}
     * @private
     */
    static _roundRawValue(value, settings) {
        return this._roundValue(value, settings, settings.decimalPlacesRawValue);
    }

    /**
     * Round the given `value` with the number of decimal places to show for the element is focused.
     *
     * @param {string|null} value An unformatted numeric value
     * @param {object} settings
     * @returns {*}
     * @private
     */
    static _roundFormattedValueShownOnFocus(value, settings) {
        return this._roundValue(value, settings, Number(settings.decimalPlacesShownOnFocus));
    }

    /**
     * Round the given `value` with the number of decimal places to show for the element is unfocused.
     *
     * @param {string|null} value An unformatted numeric value
     * @param {object} settings
     * @returns {*}
     * @private
     */
    static _roundFormattedValueShownOnBlur(value, settings) {
        return this._roundValue(value, settings, Number(settings.decimalPlacesShownOnBlur));
    }

    /**
     * Round the input value using the rounding method defined in the settings.
     * This function accepts multiple rounding methods. See the documentation for more details about those.
     *
     * Note : This is handled as text since JavaScript math functions can return inaccurate values.
     *
     * @param {string|null} inputValue An unformatted numeric value
     * @param {object} settings
     * @param {int} decimalPlacesToRoundTo
     * @returns {*}
     */
    static _roundValue(inputValue, settings, decimalPlacesToRoundTo) {
        //XXX Note; this function is static since we need to pass a `settings` object when calling the static `AutoNumeric.format()` method
        if (AutoNumericHelper.isNull(inputValue)) {
            // Prevent rounding a `null` value
            return inputValue;
        }

        //TODO Divide this function to make it easier to understand
        inputValue = (inputValue === '') ? '0' : inputValue.toString();
        if (settings.roundingMethod === AutoNumeric.options.roundingMethod.toNearest05 ||
            settings.roundingMethod === AutoNumeric.options.roundingMethod.toNearest05Alt ||
            settings.roundingMethod === AutoNumeric.options.roundingMethod.upToNext05 ||
            settings.roundingMethod === AutoNumeric.options.roundingMethod.downToNext05) {
            return this._roundCloseTo05(inputValue, settings);
        }

        const [negativeSign, preparedValue] = AutoNumeric._prepareValueForRounding(inputValue, settings);
        inputValue = preparedValue;

        const decimalCharacterPosition = inputValue.lastIndexOf('.');
        const inputValueHasNoDot = decimalCharacterPosition === -1; // No dot character is found in the `inputValue`
        const [, decimalPart] = inputValue.split('.'); // Here the decimal character is always a period '.'
        const hasDecimals = decimalPart > 0;

        // If no decimals are detected
        if (!hasDecimals &&
            (settings.allowDecimalPadding === AutoNumeric.options.allowDecimalPadding.never ||
            settings.allowDecimalPadding === AutoNumeric.options.allowDecimalPadding.floats)) {
            return (Number(inputValue) === 0) ? inputValue : `${negativeSign}${inputValue}`;
        }

        // Else there are some decimal places that may need to be rounded
        // Sets the truncate zero method
        let temporaryDecimalPlacesOverride;
        if (settings.allowDecimalPadding === AutoNumeric.options.allowDecimalPadding.always ||
            settings.allowDecimalPadding === AutoNumeric.options.allowDecimalPadding.floats) {
            temporaryDecimalPlacesOverride = decimalPlacesToRoundTo;
        } else {
            temporaryDecimalPlacesOverride = 0;
        }

        // Define the decimal position to use (use the very last position if there are no dot in the initial inputValue)
        const decimalPositionToUse = inputValueHasNoDot ? inputValue.length - 1 : decimalCharacterPosition;
        // Checks decimal places to determine if rounding is required
        let checkDecimalPlaces = (inputValue.length - 1) - decimalPositionToUse;
        let inputValueRounded = '';

        // Check if no rounding is required
        if (checkDecimalPlaces <= decimalPlacesToRoundTo) {
            // Check if we need to pad with zeros
            inputValueRounded = inputValue;
            if (checkDecimalPlaces < temporaryDecimalPlacesOverride) {
                if (inputValueHasNoDot) {
                    inputValueRounded = `${inputValueRounded}${settings.decimalCharacter}`;
                }

                let zeros = '000000'; //TODO Change that string with a longer one to prevent having to loop numerous times in the next `while` statement?
                while (checkDecimalPlaces < temporaryDecimalPlacesOverride) {
                    zeros = zeros.substring(0, temporaryDecimalPlacesOverride - checkDecimalPlaces);
                    inputValueRounded += zeros;
                    checkDecimalPlaces += zeros.length;
                }
            } else if (checkDecimalPlaces > temporaryDecimalPlacesOverride) {
                inputValueRounded = this._truncateZeros(inputValueRounded, temporaryDecimalPlacesOverride);
            } else if (checkDecimalPlaces === 0 && temporaryDecimalPlacesOverride === 0) {
                // Remove any trailing dot, if any
                inputValueRounded = inputValueRounded.replace(/\.$/, '');
            }

            return (Number(inputValueRounded) === 0) ? inputValueRounded : `${negativeSign}${inputValueRounded}`;
        }

        // Rounded length of the string after rounding
        let roundedStrLength;
        if (inputValueHasNoDot) {
            roundedStrLength = decimalPlacesToRoundTo - 1;
        } else {
            roundedStrLength = Number(decimalPlacesToRoundTo) + Number(decimalCharacterPosition);
        }

        const lastDigit = Number(inputValue.charAt(roundedStrLength + 1));
        let inputValueArray = inputValue.substring(0, roundedStrLength + 1).split('');
        let odd;
        if (inputValue.charAt(roundedStrLength) === '.') {
            odd = inputValue.charAt(roundedStrLength - 1) % 2;
        } else {
            odd = inputValue.charAt(roundedStrLength) % 2;
        }

        if (this._shouldRoundUp(lastDigit, settings, negativeSign, odd)) {
            // Round up the last digit if required, and continue until no more 9's are found
            for (let i = (inputValueArray.length - 1); i >= 0; i -= 1) {
                if (inputValueArray[i] !== '.') {
                    inputValueArray[i] = +inputValueArray[i] + 1;
                    if (inputValueArray[i] < 10) {
                        break;
                    }

                    if (i > 0) {
                        inputValueArray[i] = '0';
                    }
                }
            }
        }

        // Reconstruct the string, converting any 10's to 0's
        inputValueArray = inputValueArray.slice(0, roundedStrLength + 1);

        // Return the rounded value
        inputValueRounded = this._truncateZeros(inputValueArray.join(''), temporaryDecimalPlacesOverride);

        return (Number(inputValueRounded) === 0) ? inputValueRounded : `${negativeSign}${inputValueRounded}`;
    }

    /**
     * Round the `value` when the rounding method deals with '.05'
     *
     * @param {string} value
     * @param {object} settings
     * @returns {string}
     * @private
     */
    static _roundCloseTo05(value, settings) {
        switch (settings.roundingMethod) {
            case AutoNumeric.options.roundingMethod.toNearest05:
            case AutoNumeric.options.roundingMethod.toNearest05Alt:
                value = (Math.round(value * 20) / 20).toString();
                break;
            case AutoNumeric.options.roundingMethod.upToNext05:
                value = (Math.ceil(value * 20) / 20).toString();
                break;
            default :
                value = (Math.floor(value * 20) / 20).toString();
        }

        let result;
        if (!AutoNumericHelper.contains(value, '.')) {
            result = value + '.00';
        } else if (value.length - value.indexOf('.') < 3) {
            result = value + '0';
        } else {
            result = value;
        }

        return result;
    }

    /**
     * Modify the given `value` in order to make it usable for the rest of the rounding function.
     * This convert the `value` to a positive one, trim any leading zeros and make sure it does not starts with a leading dot.
     *
     * @param {string} value
     * @param {object} settings
     * @returns {[string, string]}
     * @private
     */
    static _prepareValueForRounding(value, settings) {
        // Checks if `inputValue` is a negative value
        let negativeSign = '';
        if (AutoNumericHelper.isNegativeStrict(value)) {
            negativeSign = '-';

            // Removes the negative sign that will be added back later if required
            value = value.replace('-', '');
        }

        // Append a zero if the first character is not a digit (then it is likely a dot)
        if (!value.match(/^\d/)) {
            value = `0${value}`;
        }

        // Determines if the value is equal to zero. If it is, remove the negative sign
        if (Number(value) === 0) {
            negativeSign = '';
        }

        // Trims leading zero's as needed
        if ((Number(value) > 0 && settings.leadingZero !== AutoNumeric.options.leadingZero.keep) ||
            (value.length > 0 && settings.leadingZero === AutoNumeric.options.leadingZero.allow)) {
            value = value.replace(/^0*(\d)/, '$1');
        }

        return [negativeSign, value];
    }

    /**
     * Return `true` if a round up should be done given the last digit, the settings and other information about the value.
     * 
     * @param {number} lastDigit
     * @param {object} settings
     * @param {string} negativeSign
     * @param {number} odd
     * @returns {boolean}
     * @private
     */
    static _shouldRoundUp(lastDigit, settings, negativeSign, odd) {
        return (lastDigit > 4 && settings.roundingMethod === AutoNumeric.options.roundingMethod.halfUpSymmetric)                                     || // Round half up symmetric
            (lastDigit > 4 && settings.roundingMethod === AutoNumeric.options.roundingMethod.halfUpAsymmetric && negativeSign === '')                || // Round half up asymmetric positive values
            (lastDigit > 5 && settings.roundingMethod === AutoNumeric.options.roundingMethod.halfUpAsymmetric && negativeSign === '-')               || // Round half up asymmetric negative values
            (lastDigit > 5 && settings.roundingMethod === AutoNumeric.options.roundingMethod.halfDownSymmetric)                                      || // Round half down symmetric
            (lastDigit > 5 && settings.roundingMethod === AutoNumeric.options.roundingMethod.halfDownAsymmetric && negativeSign === '')              || // Round half down asymmetric positive values
            (lastDigit > 4 && settings.roundingMethod === AutoNumeric.options.roundingMethod.halfDownAsymmetric && negativeSign === '-')             || // Round half down asymmetric negative values
            (lastDigit > 5 && settings.roundingMethod === AutoNumeric.options.roundingMethod.halfEvenBankersRounding)                                ||
            (lastDigit === 5 && settings.roundingMethod === AutoNumeric.options.roundingMethod.halfEvenBankersRounding && odd === 1)                 ||
            (lastDigit > 0 && settings.roundingMethod === AutoNumeric.options.roundingMethod.toCeilingTowardPositiveInfinity && negativeSign === '') ||
            (lastDigit > 0 && settings.roundingMethod === AutoNumeric.options.roundingMethod.toFloorTowardNegativeInfinity && negativeSign === '-')  ||
            (lastDigit > 0 && settings.roundingMethod === AutoNumeric.options.roundingMethod.upRoundAwayFromZero);                                      // Round up away from zero
    }

    /**
     * Truncates the decimal part of a number to the given number of decimal places `decimalPlacesToRoundTo`.
     *
     * @param {string} value
     * @param {object} settings
     * @param {boolean} isPaste
     * @param {int} decimalPlacesToRoundTo
     * @returns {*}
     */
    static _truncateDecimalPlaces(value, settings, isPaste, decimalPlacesToRoundTo) {
        if (isPaste) {
            value = this._roundFormattedValueShownOnFocus(value, settings);
        }

        const [integerPart, decimalPart] = value.split(settings.decimalCharacter);

        // Truncate the decimal part to the satisfying length since we would round it anyway
        if (decimalPart && decimalPart.length > decimalPlacesToRoundTo) {
            if (decimalPlacesToRoundTo > 0) {
                const modifiedDecimalPart = decimalPart.substring(0, decimalPlacesToRoundTo);
                value = `${integerPart}${settings.decimalCharacter}${modifiedDecimalPart}`;
            } else {
                value = integerPart;
            }
        }

        return value;
    }

    /**
     * Check that the number satisfy the format conditions
     * and lays between settings.minimumValue and settings.maximumValue
     * and the string length does not exceed the digits in settings.minimumValue and settings.maximumValue
     *
     * @param {string} value
     * @param {object} settings
     * @returns {*}
     */
    static _checkIfInRangeWithOverrideOption(value, settings) {
        value = value.toString();
        value = value.replace(',', '.');
        const minParse = AutoNumericHelper.parseStr(settings.minimumValue);
        const maxParse = AutoNumericHelper.parseStr(settings.maximumValue);
        const valParse = AutoNumericHelper.parseStr(value);

        let result;
        switch (settings.overrideMinMaxLimits) {
            case AutoNumeric.options.overrideMinMaxLimits.floor:
                result = [AutoNumericHelper.testMinMax(minParse, valParse) > -1, true];
                break;
            case AutoNumeric.options.overrideMinMaxLimits.ceiling:
                result = [true, AutoNumericHelper.testMinMax(maxParse, valParse) < 1];
                break;
            case AutoNumeric.options.overrideMinMaxLimits.ignore:
                result = [true, true];
                break;
            default:
                result = [AutoNumericHelper.testMinMax(minParse, valParse) > -1, AutoNumericHelper.testMinMax(maxParse, valParse) < 1];
        }

        return result;
    }

    /**
     * Original settings saved for use when the `decimalPlacesShownOnFocus` and `showOnlyNumbersOnFocus` options are used.
     * Those original settings are used exclusively in the `focusin` and `focusout` event handlers.
     */
    _keepAnOriginalSettingsCopy() {
        this.originalDigitGroupSeparator = this.settings.digitGroupSeparator;
        this.originalCurrencySymbol      = this.settings.currencySymbol;
        this.originalSuffixText          = this.settings.suffixText;
    }

    /**
     * Original settings saved for use when `decimalPlacesShownOnFocus` & `showOnlyNumbersOnFocus` options are being used.
     * This is taken from Quirksmode.
     *
     * @param {string} name
     * @returns {*}
     */
    static _readCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        let c = '';
        for (let i = 0; i < ca.length; i += 1) {
            c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }

        return null;
    }

    /**
     * Test if sessionStorage is supported.
     * This is taken from Modernizr.
     *
     * @returns {boolean}
     */
    static _storageTest() {
        const mod = 'modernizr';
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Removes any zeros in excess in the front and back of the given `value`, according to the `settings`.
     * This also manages the cases where the decimal point is on the far left or far right of the `value`.
     *
     * @param {string} value
     * @returns {string|null}
     */
    _trimLeadingAndTrailingZeros(value) {
        // Return the empty string is the value is already empty. This prevent converting that value to '0'.
        if (value === '' || value === null) {
            return value;
        }

        if (this.settings.leadingZero !== AutoNumeric.options.leadingZero.keep) {
            if (Number(value) === 0) {
                // Return '0' if the value is zero
                return '0';
            }

            // Trim the leading zeros, while leaving one zero to the left of the decimal point if needed
            value = value.replace(/^(-)?0+(?=\d)/g,'$1');
        }

        //TODO remove this from that function and use `trimPaddedZerosFromDecimalPlaces()` instead
        // Trim the trailing zeros after the last decimal place not being a zero (ie. 1.2300 -> 1.23)
        if (AutoNumericHelper.contains(value, '.')) {
            value = value.replace(/(\.[0-9]*?)0+$/, '$1');
        }

        // Remove any trailing decimal point
        value = value.replace(/\.$/, '');

        return value;
    }

    /**
     * Generate the name for the persistent stored data variable
     * @private
     */
    _setPersistentStorageName() {
        if (this.settings.saveValueToSessionStorage) {
            if (this.domElement.name !== '' && !AutoNumericHelper.isUndefined(this.domElement.name)) {
                this.rawValueStorageName = `${this.storageNamePrefix}${decodeURIComponent(this.domElement.name)}`;
            } else {
                this.rawValueStorageName = `${this.storageNamePrefix}${this.domElement.id}`;
            }
        }
    }

    /**
     * Save the raw Value into sessionStorage or a cookie depending on what the browser is supporting.
     * @private
     */
    _saveValueToPersistentStorage() {
        if (this.settings.saveValueToSessionStorage) {
            if (this.sessionStorageAvailable) {
                sessionStorage.setItem(this.rawValueStorageName, this.rawValue);
            } else {
                // Use cookies for obsolete browsers that do not support sessionStorage (ie. IE 6 & 7)
                document.cookie = `${this.rawValueStorageName}=${this.rawValue}; expires= ; path=/`;
            }
        }
    }

    /**
     * Retrieve the raw value from sessionStorage or the cookie depending on what the browser is supporting.
     *
     * @returns {*}
     * @private
     */
    _getValueFromPersistentStorage() {
        if (this.settings.saveValueToSessionStorage) {
            let result;
            if (this.sessionStorageAvailable) {
                result = sessionStorage.getItem(this.rawValueStorageName);
            } else {
                result = this._readCookie(this.rawValueStorageName);
            }

            return result;
        }

        AutoNumericHelper.warning('`_getValueFromPersistentStorage()` is called but `settings.saveValueToSessionStorage` is false. There must be an error that needs fixing.', this.settings.showWarnings);

        return null;
    }

    /**
     * Remove the raw value data from sessionStorage or the cookie depending on what the browser is supporting.
     * @private
     */
    _removeValueFromPersistentStorage() {
        if (this.settings.saveValueToSessionStorage) {
            if (this.sessionStorageAvailable) {
                sessionStorage.removeItem(this.rawValueStorageName);
            } else {
                const date = new Date();
                date.setTime(date.getTime() - 86400000); // -86400000 === -1 * 24 * 60 * 60 * 1000
                const expires = `; expires=${date.toUTCString()}`;
                document.cookie = `${this.rawValueStorageName}='' ;${expires}; path=/`;
            }
        }
    }

    /**
     * Handler for 'focusin' and 'mouseenter' events
     * On focusin, multiple things happens :
     * - If `Alt` is pressed, unformat
     * - Remove the separators if `showOnlyNumbersOnFocus` is set
     * - Depending on `emptyInputBehavior`, reformat the empty formatted value
     * - Display the correct number of decimal places (on focus/blur)
     * - Place the caret correctly if the element is empty
     *
     * Note: On focusin, the `rawValue` is never changed. Only the formatted value can be modified.
     *
     * @param {Event} e
     * @private
     */
    _onFocusInAndMouseEnter(e) {
        this.isEditing = false; // Just in case no `keyUp` event have been sent (if the user lost the focus to the window while typing)

        //TODO `AutoNumericHelper.setElementValue` is called 3 times sequentially here, fix that
        //TODO Create separate handlers for the focus and mouseenter events
        const initialElementValue = AutoNumericHelper.getElementValue(this.domElement);
        
        if (this.settings.unformatOnHover && e.type === 'mouseenter' && e.altKey) {
            this.constructor._unformatAltHovered(this);

            return;
        }

        if (e.type === 'focus') { //TODO Move that back to the 'focus' event handler when the separation between the 'focus' and 'mouseenter' handler will be done
            // We keep track if the element is currently focused
            this.isFocused = true;
        }

        if (e.type === 'focus' && this.settings.unformatOnHover && this.hoveredWithAlt) {
            this.constructor._reformatAltHovered(this);
        }

        if (e.type === 'focus' || e.type === 'mouseenter' && !this.isFocused) {
            if (this.settings.emptyInputBehavior === AutoNumeric.options.emptyInputBehavior.focus &&
                this.rawValue < 0 && this.settings.negativeBracketsTypeOnBlur !== null && this.settings.negativeSignCharacter !== '') { //FIXME this is called a second time in _addGroupSeparators too. Prevent this, if possible.
                // Only remove the brackets if the value is negative
                AutoNumericHelper.setElementValue(this.domElement, this.constructor._removeBrackets(AutoNumericHelper.getElementValue(this.domElement), this.settings));
            }

            // Use the rawValue, multiplied by `rawValueDivisor` if defined
            const rawValueToFormat = this._getRawValueToFormat(this.rawValue);

            // Modify the element value according to the number of decimal places to show on focus or the `showOnlyNumbersOnFocus` option
            if (rawValueToFormat !== '') {
                // Round the given value according to the object state (focus/unfocused)
                let roundedValue;
                if (this.isFocused) {
                    roundedValue = this.constructor._roundFormattedValueShownOnFocus(rawValueToFormat, this.settings);
                } else {
                    roundedValue = this.constructor._roundFormattedValueShownOnBlur(rawValueToFormat, this.settings);
                }

                if (this.settings.showOnlyNumbersOnFocus === AutoNumeric.options.showOnlyNumbersOnFocus.onlyNumbers) {
                    //TODO Use a `this.settingsOverride` object instead of modifying the `this.settings` object
                    this.settings.digitGroupSeparator = '';
                    this.settings.currencySymbol      = '';
                    this.settings.suffixText          = '';
                    AutoNumericHelper.setElementValue(this.domElement, roundedValue.replace('.', this.settings.decimalCharacter));
                } else {
                    let formattedValue;
                    if (AutoNumericHelper.isNull(roundedValue)) {
                        formattedValue = '';
                    } else {
                        formattedValue = this.constructor._addGroupSeparators(roundedValue.replace('.', this.settings.decimalCharacter), this.settings, this.isFocused, rawValueToFormat);
                    }
                    AutoNumericHelper.setElementValue(this.domElement, formattedValue);
                }
            }

            // In order to send a 'native' change event when blurring the input, we need to first store the initial input value on focus.
            this.valueOnFocus = AutoNumericHelper.getElementValue(e.target);
            this.lastVal = this.valueOnFocus;
            const isEmptyValue = this.constructor._isElementValueEmptyOrOnlyTheNegativeSign(this.valueOnFocus, this.settings);
            const orderedValue = this.constructor._orderValueCurrencySymbolAndSuffixText(this.valueOnFocus, this.settings, true); // This displays the currency sign on hover even if the rawValue is empty
            if ((isEmptyValue && orderedValue !== '') && this.settings.emptyInputBehavior === AutoNumeric.options.emptyInputBehavior.focus) {
                AutoNumericHelper.setElementValue(this.domElement, orderedValue);

                // If there is a currency symbol and its on the right hand side, then we place the caret accordingly on the far left side
                if (orderedValue === this.settings.currencySymbol && this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix) {
                    AutoNumericHelper.setElementSelection(e.target, 0);
                }
            }
        }

        if (AutoNumericHelper.getElementValue(this.domElement) !== initialElementValue) {
            AutoNumericHelper.triggerEvent(AutoNumeric.events.formatted, this.domElement, { oldValue: initialElementValue, newValue: AutoNumericHelper.getElementValue(this.domElement) });
        }
    }

    /**
     * Handler for the 'focus' event.
     * We update the info of the focused state in the `this.isFocused` variable when the element gets focused.
     * @private
     */
    _onFocus() {
        if (this.settings.isCancellable) {
            // Save the current unformatted value for later use by the 'cancellable' feature
            this._saveCancellableValue();
        }
    }

    /**
     * Handler for the 'focusin' event.
     * This is called before the 'focus' event, and is necessary to change the selection on focus under Firefox for instance.
     *
     * @param {Event} e
     * @private
     */
    _onFocusIn(e) {
        if (this.settings.selectOnFocus) {
            // The whole input content is selected on focus (following the `selectOnFocus` and `selectNumberOnly` options)
            //XXX Firefox <47 does not respect this selection...Oh well.
            this.select();
        } else {
            // Or we decide where to put the caret using the `caretPositionOnFocus` option
            AutoNumericHelper.setElementSelection(e.target, this._initialCaretPosition(AutoNumericHelper.getElementValue(this.domElement)));
        }
    }

    /**
     * Handler for 'keydown' events.
     * The user just started pushing any key, hence one event is sent.
     *
     * Note :
     * By default a 'normal' input output those events in the right order when inputting a character key (ie. 'a') :
     * - keydown
     * - keypress
     * - input
     * - keyup
     *
     * ...when inputting a modifier key (ie. 'ctrl') :
     * - keydown
     * - keyup
     *
     * If 'delete' or 'backspace' is entered, the following events are sent :
     * - keydown
     * - input
     * - keyup
     *
     * If 'enter' is entered and the value has not changed, the following events are sent :
     * - keydown
     * - keypress
     * - keyup
     *
     * If 'enter' is entered and the value has been changed, the following events are sent :
     * - keydown
     * - keypress
     * - change
     * - keyup
     *
     * When a paste is done, the following events are sent :
     * - input (if paste is done with the mouse)
     *
     * - keydown (if paste is done with ctrl+v)
     * - keydown
     * - input
     * - keyup
     * - keyup
     *
     * @param {KeyboardEvent} e
     */
    _onKeydown(e) {
        this.isEditing = true; // Keep track if the user is currently editing the element manually

        if (!this.isFocused && this.settings.unformatOnHover && e.altKey && this.domElement === AutoNumericHelper.getHoveredElement()) {
            // Here I prevent calling _unformatAltHovered if the element is already focused, since the global 'keydown' listener will pick it up as well
            this.constructor._unformatAltHovered(this);

            return;
        }

        this._updateEventKeyInfo(e);
        this.initialValueOnKeydown = AutoNumericHelper.getElementValue(e.target); // This is needed in `onKeyup()` to check if the value as changed during the key press

        if (this.domElement.readOnly) {
            this.processed = true;

            return;
        }

        if (this.eventKey === AutoNumericEnum.keyName.Esc) {
            //XXX The default 'Escape' key behavior differs between Firefox and Chrome, Firefox already having a built-in 'cancellable-like' feature. This is why we call `e.preventDefault()` here instead of just when `isCancellable` is set to `true`. This allow us to keep the same behavior across browsers.
            e.preventDefault();

            if (this.settings.isCancellable) {
                // If the user wants to cancel its modifications :
                // We set back the saved value
                if (this.rawValue !== this.savedCancellableValue) {
                    // Do not set the value again if it has not changed
                    this.set(this.savedCancellableValue);
                    // And we need to send an 'input' event when setting back the initial value in order to make other scripts aware of the value change...
                    AutoNumericHelper.triggerEvent(AutoNumeric.events.native.input, e.target);
                }
            }

            // ..and lastly we update the caret selection, even if the option `isCancellable` is false
            this.select();
            //TODO Add an option to select either the integer or decimal part with `Esc`
        }

        // The "enter" key throws a `change` event if the value has changed since the `focus` event
        let targetValue = AutoNumericHelper.getElementValue(e.target);
        if (this.eventKey === AutoNumericEnum.keyName.Enter && this.valueOnFocus !== targetValue) {
            AutoNumericHelper.triggerEvent(AutoNumeric.events.native.change, e.target);
            this.valueOnFocus = targetValue;

            if (this.settings.isCancellable) {
                // If the user activated the 'cancellable' feature, we save the validated value when 'Enter' is hit
                this._saveCancellableValue();
            }
        }

        this._updateInternalProperties(e);

        if (this._processNonPrintableKeysAndShortcuts(e)) {
            this.processed = true;

            return;
        }

        // Check if the key is a delete/backspace key
        if (this.eventKey === AutoNumericEnum.keyName.Backspace || this.eventKey === AutoNumericEnum.keyName.Delete) {
            this._processCharacterDeletion(); // Because backspace and delete only triggers keydown and keyup events, not keypress
            this.processed = true;
            this._formatValue(e);

            // If and only if the resulting value has changed after that backspace/delete, then we have to send an 'input' event like browsers normally do.
            targetValue = AutoNumericHelper.getElementValue(e.target); // Update the value since it could have been changed during the deletion
            if ((targetValue !== this.lastVal) && this.throwInput) {
                // Throw an input event when a character deletion is detected
                AutoNumericHelper.triggerEvent(AutoNumeric.events.native.input, e.target);
                e.preventDefault(); // ...and immediately prevent the browser to delete a second character
            }

            this.lastVal = targetValue;
            this.throwInput = true;

            return;
        }

        this.formatted = false; //TODO Is this line needed? (I mean, _formatValue always set it to `true`, and this overwrite that info)
    }

    /**
     * Handler for 'keypress' events.
     * The user is still pressing the key, which will output a character (ie. '2') continuously until it releases the key.
     * Note: 'keypress' events are not sent for delete keys like Backspace/Delete.
     *
     * @param {KeyboardEvent} e
     */
    _onKeypress(e) {
        if (this.eventKey === AutoNumericEnum.keyName.Insert) {
            return;
        }

        const processed = this.processed;
        this._updateInternalProperties(e);

        if (this._processNonPrintableKeysAndShortcuts(e)) {
            return;
        }

        if (processed) {
            e.preventDefault();

            return;
        }

        const isCharacterInsertionAllowed = this._processCharacterInsertion();
        if (isCharacterInsertionAllowed) {
            this._formatValue(e);
            const targetValue = AutoNumericHelper.getElementValue(e.target);
            if ((targetValue !== this.lastVal) && this.throwInput) {
                // Throws input event on adding a character
                AutoNumericHelper.triggerEvent(AutoNumeric.events.native.input, e.target);
                e.preventDefault(); // ...and immediately prevent the browser to add a second character
            } else {
                if ((this.eventKey === this.settings.decimalCharacter || this.eventKey === this.settings.decimalCharacterAlternative) &&
                    (AutoNumericHelper.getElementSelection(e.target).start === AutoNumericHelper.getElementSelection(e.target).end) &&
                    AutoNumericHelper.getElementSelection(e.target).start === targetValue.indexOf(this.settings.decimalCharacter)) {
                    const position = AutoNumericHelper.getElementSelection(e.target).start + 1;
                    AutoNumericHelper.setElementSelection(e.target, position);
                }

                e.preventDefault();
            }

            this.lastVal = AutoNumericHelper.getElementValue(e.target);
            this.throwInput = true;

            return;
        }

        e.preventDefault();

        this.formatted = false; //TODO Is this line needed? (I mean, _formatValue always set it to `true`, and this overwrite that info)
    }

    /**
     * Handler for 'input' events.
     * Handling this event instead of `keypress` is needed in order to support android devices.
     *
     * @param {Event} e
     */
    _onInput(e) {
        const value = AutoNumericHelper.getElementValue(this.domElement);

        // Fix the caret position on keyup in the `_formatValue()` function
        this.androidSelectionStart = null;

        if (this.eventKey === AutoNumericEnum.keyName.AndroidDefault) {
            let selection = AutoNumericHelper.getElementSelection(this.domElement);
            // The keyCode is equal to the default Android Chrome one (which is always equal to `keyCode.AndroidDefault`)
            if (value.length > this.lastVal.length || value.length >= this.lastVal.length - selection.length) {
                // Determine the keycode of the character that was entered, and overwrite the faulty `eventKeyCode` info with it
                this.eventKey = value.charCodeAt(selection.start);

                // Capture the actual character entered, and update the `eventKey` with it (instead of the Android default one)
                this.eventKey = value.charAt(selection.start);

                // Check if the given character should be inserted, and if so, do insert it into the current element value
                const isCharacterInsertionAllowed = this._processCharacterInsertion();

                if (isCharacterInsertionAllowed) {
                    // Allowed character entered (number, decimal or plus/minus sign)
                    this._formatValue(e);

                    selection = AutoNumericHelper.getElementSelection(this.domElement); //TODO is this needed a second time?
                    // Capture the new caret position. This is required because on keyup, `_updateAutoNumericHolderEventKeycode()` captures the old caret position
                    //TODO Check if this is an Android bug or an autoNumeric one
                    this.androidSelectionStart = selection.start;

                    // Move the caret to the right if the `androidCharEntered` is the decimal character or if it's on the left of the caret position
                    const decimalCharacterPosition = AutoNumericHelper.getElementValue(this.domElement).indexOf(this.settings.decimalCharacter);
                    const hasDecimalCharacter = decimalCharacterPosition !== -1;
                    if (this.eventKey === this.settings.decimalCharacter ||
                        hasDecimalCharacter && decimalCharacterPosition < this.androidSelectionStart) {
                        this.androidSelectionStart += this.settings.decimalCharacter.length;
                    }

                    if (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.prefix && this.settings.currencySymbol.length) {
                        this.androidSelectionStart += this.settings.currencySymbol.length;
                    }

                    if (selection.length > value.length) {
                        // Position the caret right now before the 'keyup' event in order to prevent the caret from jumping around
                        this._setCaretPosition(this.androidSelectionStart);
                    }

                    this.lastVal = AutoNumericHelper.getElementValue(this.domElement);

                    return;
                } else {
                    // The entered character is not allowed ; overwrite the new invalid value with the previous valid one, and set back the caret/selection
                    AutoNumericHelper.setElementValue(this.lastVal); //TODO Update the rawValue here too via _setValue()?
                    AutoNumericHelper.setElementSelection(this.domElement, selection.start, selection.end);
                    this.androidSelectionStart = selection.start;
                }

                e.preventDefault(); //TODO Check how that is affecting the normal trigger of the input event

                this.formatted = false;
            } else {
                // Character deleted
                //XXX The change in length could also be the result of the `Delete` key, but there usually are no such key in the Android virtual keyboards
                this.eventKey = AutoNumericEnum.keyName.Backspace;
            }
        }
    }

    /**
     * Handler for 'keyup' events.
     * The user just released any key, hence one event is sent.
     *
     * @param {KeyboardEvent} e
     */
    _onKeyup(e) {
        this.isEditing = false;

        if (this.settings.isCancellable && this.eventKey === AutoNumericEnum.keyName.Esc) {
            // If the user wants to cancel its modifications, we drop the 'keyup' event for the Esc key
            e.preventDefault();

            return;
        }

        // Manage the undo/redo events
        if (this.eventKey === AutoNumericEnum.keyName.Z || this.eventKey === AutoNumericEnum.keyName.z) {
            if (e.ctrlKey && e.shiftKey) {
                // Redo
                e.preventDefault();
                this._historyTableRedo();
                this.onGoingRedo = true;

                return;
            } else if (e.ctrlKey && !e.shiftKey) {
                if (this.onGoingRedo) {
                    // Prevent an 'undo' to be launch when releasing the shift key before the ctrl key after a 'redo' shortcut
                    this.onGoingRedo = false;
                } else {
                    e.preventDefault();
                    // Undo
                    this._historyTableUndo();

                    return;
                }
            }
        }

        if (this.onGoingRedo && (e.ctrlKey || e.shiftKey)) {
            // Special case where if the user has entered `Control+Shift+z`, then release `z`, keeping `Control` or `Shift` pressed, then `this.onGoingRedo` is never changed back to `false` when the user release `Control` or `Shift`
            this.onGoingRedo = false;
        }

        // Manage the reformat when hovered with the Alt key pressed
        if (this.eventKey === AutoNumericEnum.keyName.Alt && this.hoveredWithAlt) {
            this.constructor._reformatAltHovered(this);

            return;
        }

        this._updateInternalProperties(e);

        const skip = this._processNonPrintableKeysAndShortcuts(e);
        delete this.valuePartsBeforePaste;
        const isOnAndroid = this.androidSelectionStart !== null;
        const targetValue = AutoNumericHelper.getElementValue(e.target);
        if (skip && !isOnAndroid || targetValue === '') {
            return;
        }

        // Added to properly place the caret when only the currency sign is present
        if (targetValue === this.settings.currencySymbol) {
            if (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix) {
                AutoNumericHelper.setElementSelection(e.target, 0);
            } else {
                AutoNumericHelper.setElementSelection(e.target, this.settings.currencySymbol.length);
            }
        } else if (this.eventKey === AutoNumericEnum.keyName.Tab) {
            AutoNumericHelper.setElementSelection(e.target, 0, targetValue.length);
        }

        if ((targetValue === this.settings.suffixText) ||
            (this.rawValue === '' && this.settings.currencySymbol !== '' && this.settings.suffixText !== '')) {
            AutoNumericHelper.setElementSelection(e.target, 0);
        }

        // Saves the extended decimal to preserve the data when navigating away from the page
        if (this.settings.decimalPlacesShownOnFocus !== null) {
            this._saveValueToPersistentStorage();
        }

        if (!this.formatted) {  //TODO Is this line needed? Considering that onKeydown and onKeypress both finish by setting it to false...
            this._formatValue(e);
        }

        // If the input value has changed during the key press event chain, an event is sent to alert that a formatting has been done (cf. Issue #187)
        if (targetValue !== this.initialValueOnKeydown) {
            AutoNumericHelper.triggerEvent(AutoNumeric.events.formatted, e.target, { oldValue: this.initialValueOnKeydown, newValue: targetValue }); //TODO Do I need to remove this since we now send this event on `set()`?
        }

        // Update the selection of the current element of the history table
        if (this.historyTable.length > 1) {
            const selection = AutoNumericHelper.getElementSelection(this.domElement);
            this.selectionStart = selection.start;
            this.selectionEnd = selection.end;
            this.historyTable[this.historyTableIndex].start = this.selectionStart;
            this.historyTable[this.historyTableIndex].end = this.selectionEnd;
        }
    }

    /**
     * Handler for 'focusout' events
     * On focusout, multiple things happens :
     * - The element value is formatted back if the `Alt` key was pressed,
     * - The element value is formatted back if `showOnlyNumbersOnFocus` was set to only show numbers,
     * - The element value is multiplied by `rawValueDivisor` on `blur`
     *
     * Note: On focusout, the `rawValue` is never changed. Only the formatted value can be modified.
     *
     * @param {Event} e
     */
    _onFocusOutAndMouseLeave(e) {
        this.isEditing = false; // Just in case no `keyUp` event have been sent (if the user lost the focus to the window while typing)

        //TODO Create separate handlers for blur and mouseleave
        //FIXME Do not call `set()` if the current raw value is the same as the one we are trying to set (currently, on focus out, `set()` is always called, even if the value has not changed
        if (this.settings.unformatOnHover && e.type === 'mouseleave' && this.hoveredWithAlt) {
            this.constructor._reformatAltHovered(this);

            return;
        }

        if ((e.type === 'mouseleave' && !this.isFocused) || e.type === 'blur') {
            this._saveValueToPersistentStorage();
            if (this.settings.showOnlyNumbersOnFocus === AutoNumeric.options.showOnlyNumbersOnFocus.onlyNumbers) {
                this.settings.digitGroupSeparator = this.originalDigitGroupSeparator;
                this.settings.currencySymbol = this.originalCurrencySymbol;
                this.settings.suffixText = this.originalSuffixText;
            }

            // Use the rawValue, multiplied by `rawValueDivisor` if defined
            const rawValueToFormat = this._getRawValueToFormat(this.rawValue);

            let value;
            const isRawValueNull = AutoNumericHelper.isNull(rawValueToFormat);
            if (isRawValueNull || rawValueToFormat === '') {
                value = rawValueToFormat;
            } else {
                value = String(rawValueToFormat);
            }

            if (rawValueToFormat !== '' && !isRawValueNull) {
                const [minTest, maxTest] = this.constructor._checkIfInRangeWithOverrideOption(rawValueToFormat, this.settings);
                if (minTest && maxTest && !this.constructor._isElementValueEmptyOrOnlyTheNegativeSign(rawValueToFormat, this.settings)) {
                    value = this._modifyNegativeSignAndDecimalCharacterForRawValue(value);

                    if (this.settings.divisorWhenUnfocused && !AutoNumericHelper.isNull(value)) {
                        value = value / this.settings.divisorWhenUnfocused;
                        value = value.toString();
                    }

                    value = this.constructor._roundFormattedValueShownOnBlur(value, this.settings);
                    value = this.constructor._modifyNegativeSignAndDecimalCharacterForFormattedValue(value, this.settings);
                } else {
                    if (!minTest) {
                        AutoNumericHelper.triggerEvent(AutoNumeric.events.minRangeExceeded, this.domElement);
                    }
                    if (!maxTest) {
                        AutoNumericHelper.triggerEvent(AutoNumeric.events.maxRangeExceeded, this.domElement);
                    }
                }
            } else if (rawValueToFormat === '' && this.settings.emptyInputBehavior === AutoNumeric.options.emptyInputBehavior.zero) {
                this._setRawValue('0');
                value = this.constructor._roundValue('0', this.settings, 0);
            }


            let groupedValue = this.constructor._orderValueCurrencySymbolAndSuffixText(value, this.settings, false);
            if (!(this.constructor._isElementValueEmptyOrOnlyTheNegativeSign(value, this.settings) ||
                (isRawValueNull && this.settings.emptyInputBehavior === AutoNumeric.options.emptyInputBehavior.null))) {
                groupedValue = this.constructor._addGroupSeparators(value, this.settings, false, rawValueToFormat);
            }

            // Testing for `allowDecimalPadding.never` or `allowDecimalPadding.floats` is needed to make sure we do not keep a trailing decimalCharacter (like '500.') in the element, since the raw value would still be a correctly formatted integer ('500')
            if (groupedValue !== rawValueToFormat ||
                rawValueToFormat === '' || // This make sure we get rid on any currency symbol or suffix that might have been added on focus
                this.settings.allowDecimalPadding === AutoNumeric.options.allowDecimalPadding.never ||
                this.settings.allowDecimalPadding === AutoNumeric.options.allowDecimalPadding.floats) {
                if (this.settings.symbolWhenUnfocused && rawValueToFormat !== '' && rawValueToFormat !== null) {
                    groupedValue = `${groupedValue}${this.settings.symbolWhenUnfocused}`;
                }

                this._setElementValue(groupedValue);
            }

            if (groupedValue !== this.valueOnFocus) {
                AutoNumericHelper.triggerEvent(AutoNumeric.events.native.change, this.domElement);
                delete this.valueOnFocus;
            }

            this._onBlur(e);
        }
    }

    /**
     * Handler for 'paste' event
     *
     * @param {Event|ClipboardEvent} e
     */
    _onPaste(e) {
        //TODO Using ctrl+z after a paste should cancel it -> How would that affect other frameworks/component built with that feature in mind though?
        //FIXME When pasting '000' on a thousand group selection, the whole selection gets deleted, and only one '0' is pasted (cf. issue #302)
        // The event is prevented by default, since otherwise the user would be able to paste invalid characters into the input
        e.preventDefault();

        let rawPastedText;
        if (window.clipboardData && window.clipboardData.getData) {
            // Special case for the obsolete and non-standard IE browsers 10 and 11
            rawPastedText = window.clipboardData.getData('Text');
        } else if (e.clipboardData && e.clipboardData.getData) {
            // Normal case with modern browsers
            rawPastedText = e.clipboardData.getData('text/plain');
        } else {
            AutoNumericHelper.throwError('Unable to retrieve the pasted value. Please use a modern browser (ie. Firefox or Chromium).');
        }

        // 0. Special case if the user has selected all the input text before pasting
        const initialFormattedValue = AutoNumericHelper.getElementValue(e.target);
        const selectionStart = e.target.selectionStart || 0;
        const selectionEnd = e.target.selectionEnd || 0;
        const selectionSize = selectionEnd - selectionStart;
        let isAllInputTextSelected = false;

        if (selectionSize === initialFormattedValue.length) {
            isAllInputTextSelected = true;
        }

        // 1. Check if the paste has a negative sign (only if it's the first character), and store that information for later use
        const isPasteNegative = AutoNumericHelper.isNegativeStrict(rawPastedText);
        if (isPasteNegative) {
            // 1a. Remove the negative sign from the pasted text
            rawPastedText = rawPastedText.slice(1, rawPastedText.length);
        }

        // 2. Strip all thousand separators, brackets and currency sign, and convert the decimal character to a dot
        const untranslatedPastedText = this._preparePastedText(rawPastedText);

        let pastedText;
        if (untranslatedPastedText === '.') {
            // Special case : If the user tries to paste a single decimal character (that has been translated to '.' already)
            pastedText = '.';
        } else {
            // Normal case
            // Allow pasting arabic numbers
            pastedText = AutoNumericHelper.arabicToLatinNumbers(untranslatedPastedText, false, false, false);
        }

        // 3. Test if the paste is valid (only has numbers and eventually a decimal character). If it's not valid, stop here.
        if (pastedText !== '.' && (!AutoNumericHelper.isNumber(pastedText) || pastedText === '')) {
            if (this.settings.onInvalidPaste === AutoNumeric.options.onInvalidPaste.error) {
                //TODO Should we send a warning instead of throwing an error?
                AutoNumericHelper.throwError(`The pasted value '${rawPastedText}' is not a valid paste content.`);
            }

            return;
        }

        // 4. Calculate the paste result
        let caretPositionOnInitialTextAfterPasting;
        let initialUnformattedNumber = this.getNumericString();
        let isInitialValueNegative = AutoNumericHelper.isNegativeStrict(initialUnformattedNumber);
        let isPasteNegativeAndInitialValueIsPositive;
        let result;

        // If the pasted content is negative, then the result will be negative too
        if (isPasteNegative && !isInitialValueNegative) {
            initialUnformattedNumber = `-${initialUnformattedNumber}`;
            isInitialValueNegative = true;
            isPasteNegativeAndInitialValueIsPositive = true;
        }
        else {
            isPasteNegativeAndInitialValueIsPositive = false;
        }

        let leftPartContainedADot = false;
        let leftPart;
        let rightPart;
        switch (this.settings.onInvalidPaste) {
            /* 4a. Truncate paste behavior:
             * Insert as many numbers as possible on the right hand side of the caret from the pasted text content, until the input reach its range limit.
             * If there is more characters in the clipboard once a limit is reached, drop the extraneous characters.
             * Otherwise paste all the numbers in the clipboard.
             * While doing so, we check if the result is within the minimum and maximum values allowed, and stop as soon as we encounter one of those.
             *
             * 4b. Replace paste behavior:
             * Idem than the 'truncate' paste behavior, except that when a range limit is hit, we try to replace the subsequent initial numbers with the pasted ones, until we hit the range limit a second (and last) time, or we run out of numbers to paste
             */
            /* eslint no-case-declarations: 0 */
            case AutoNumeric.options.onInvalidPaste.truncate:
            case AutoNumeric.options.onInvalidPaste.replace:
                const leftFormattedPart = initialFormattedValue.slice(0, selectionStart);
                const rightFormattedPart = initialFormattedValue.slice(selectionEnd, initialFormattedValue.length);

                if (selectionStart !== selectionEnd) {
                    // a. If there is a selection, remove the selected part, and return the left and right part
                    result = this._preparePastedText(leftFormattedPart + rightFormattedPart);
                } else {
                    // b. Else if this is only one caret (and therefore no selection), then return the left and right part
                    result = this._preparePastedText(initialFormattedValue);
                }

                // Add back the negative sign if needed
                if (isInitialValueNegative) {
                    result = AutoNumericHelper.setRawNegativeSign(result);
                }

                // Build the unformatted result string
                caretPositionOnInitialTextAfterPasting = AutoNumericHelper.convertCharacterCountToIndexPosition(AutoNumericHelper.countNumberCharactersOnTheCaretLeftSide(initialFormattedValue, selectionStart, this.settings.decimalCharacter));
                if (isPasteNegativeAndInitialValueIsPositive) {
                    // If the initial paste is negative and the initial value is not, then I must offset the caret position by one place to the right to take the additional hyphen into account
                    caretPositionOnInitialTextAfterPasting++;
                    //TODO Quid if the negative sign is not on the left (negativePositiveSignPlacement and currencySymbolPlacement)?
                }

                leftPart = result.slice(0, caretPositionOnInitialTextAfterPasting);
                rightPart = result.slice(caretPositionOnInitialTextAfterPasting, result.length);
                if (pastedText === '.') {
                    if (AutoNumericHelper.contains(leftPart, '.')) {
                        // If I remove a dot here, then I need to update the caret position (decrement it by 1) when positioning it
                        // To do so, we keep that info in order to modify the caret position later
                        leftPartContainedADot = true;
                        leftPart = leftPart.replace('.', '');
                    }
                    
                    rightPart = rightPart.replace('.', '');
                }
                // -- Here, we are good to go to continue on the same basis

                // c. Add numbers one by one at the caret position, while testing if the result is valid and within the range of the minimum and maximum value
                //    Continue until you either run out of numbers to paste, or that you get out of the range limits
                const minParse = AutoNumericHelper.parseStr(this.settings.minimumValue);
                const maxParse = AutoNumericHelper.parseStr(this.settings.maximumValue);
                let lastGoodKnownResult = result; // This is set as the default, in case we do not add even one number
                let pastedTextIndex = 0;
                let modifiedLeftPart = leftPart;

                while (pastedTextIndex < pastedText.length) {
                    // Modify the result with another pasted character
                    modifiedLeftPart += pastedText[pastedTextIndex];
                    result = modifiedLeftPart + rightPart;

                    // Check the range limits
                    if (!this.constructor._checkIfInRange(result, minParse, maxParse)) {
                        // The result is out of the range limits, stop the loop here
                        break;
                    }

                    // Save the last good known result
                    lastGoodKnownResult = result;

                    // Update the local variables for the next loop
                    pastedTextIndex++;
                }

                // Update the last caret position where to insert a new number
                caretPositionOnInitialTextAfterPasting += pastedTextIndex;

                //XXX Here we have the result for the `truncate` option
                if (this.settings.onInvalidPaste === AutoNumeric.options.onInvalidPaste.truncate) {
                    //TODO If the user as defined a truncate callback and there are still some numbers (that will be dropped), then call this callback with the initial paste as well as the remaining numbers
                    result = lastGoodKnownResult;

                    if (leftPartContainedADot) {
                        // If a dot has been removed for the part on the left of the caret, we decrement the caret index position
                        caretPositionOnInitialTextAfterPasting--;
                    }
                    break;
                }
                //XXX ...else we need to continue modifying the result for the 'replace' option

                // d. Until there are numbers to paste, replace the initial numbers one by one, and still do the range test.
                //    Stop when you have no more numbers to paste, or if you are out of the range limits.
                //    If you do get to the range limits, use the previous known good value within those limits.
                //    Note: The numbers are replaced one by one, in the integer then decimal part, while ignoring the decimal character
                //TODO What should happen if the user try to paste a decimal number? Should we override the current initial decimal character in favor of this new one? If we do, then we have to recalculate the vMin/vMax from the start in order to take into account this new decimal character position..
                let lastGoodKnownResultIndex = caretPositionOnInitialTextAfterPasting;
                const lastGoodKnownResultSize = lastGoodKnownResult.length;

                while (pastedTextIndex < pastedText.length && lastGoodKnownResultIndex < lastGoodKnownResultSize) {
                    if (lastGoodKnownResult[lastGoodKnownResultIndex] === '.') {
                        // We skip the decimal character 'replacement'. That way, we do not change the decimal character position regarding the remaining numbers.
                        lastGoodKnownResultIndex++;
                        continue;
                    }

                    // This replace one character at a time
                    result = AutoNumericHelper.replaceCharAt(lastGoodKnownResult, lastGoodKnownResultIndex, pastedText[pastedTextIndex]);

                    // Check the range limits
                    if (!this.constructor._checkIfInRange(result, minParse, maxParse)) {
                        // The result is out of the range limits, stop the loop here
                        break;
                    }

                    // Save the last good known result
                    lastGoodKnownResult = result;

                    // Update the local variables for the next loop
                    pastedTextIndex++;
                    lastGoodKnownResultIndex++;
                }

                // Update the last caret position where to insert a new number
                caretPositionOnInitialTextAfterPasting = lastGoodKnownResultIndex;

                if (leftPartContainedADot) {
                    // If a dot has been removed for the part on the left of the caret, we decrement the caret index position
                    caretPositionOnInitialTextAfterPasting--;
                }

                result = lastGoodKnownResult;

                break;
            /* 4c. Normal paste behavior:
             * Insert the pasted number inside the current unformatted text, at the right caret position or selection
             */
            case AutoNumeric.options.onInvalidPaste.error:
            case AutoNumeric.options.onInvalidPaste.ignore:
            case AutoNumeric.options.onInvalidPaste.clamp:
            default:
                // 1. Generate the unformatted result
                const leftFormattedPart2 = initialFormattedValue.slice(0, selectionStart);
                const rightFormattedPart2 = initialFormattedValue.slice(selectionEnd, initialFormattedValue.length);

                if (selectionStart !== selectionEnd) {
                    // a. If there is a selection, remove the selected part, and return the left and right part
                    result = this._preparePastedText(leftFormattedPart2 + rightFormattedPart2);
                } else {
                    // b. Else if this is only one caret (and therefore no selection), then return the left and right part
                    result = this._preparePastedText(initialFormattedValue);
                }

                // Add back the negative sign if needed
                if (isInitialValueNegative) {
                    result = AutoNumericHelper.setRawNegativeSign(result);
                }

                // Build the unformatted result string
                caretPositionOnInitialTextAfterPasting = AutoNumericHelper.convertCharacterCountToIndexPosition(AutoNumericHelper.countNumberCharactersOnTheCaretLeftSide(initialFormattedValue, selectionStart, this.settings.decimalCharacter));
                if (isPasteNegativeAndInitialValueIsPositive) {
                    // If the initial paste is negative and the initial value is not, then I must offset the caret position by one place to the right to take the additional hyphen into account
                    caretPositionOnInitialTextAfterPasting++;
                    //TODO Quid if the negative sign is not on the left (negativePositiveSignPlacement and currencySymbolPlacement)?
                }

                leftPart = result.slice(0, caretPositionOnInitialTextAfterPasting);
                rightPart = result.slice(caretPositionOnInitialTextAfterPasting, result.length);
                if (pastedText === '.') {
                    // If the user only paste a single decimal character, then we remove the previously existing one (if any)
                    if (AutoNumericHelper.contains(leftPart, '.')) {
                        // If I remove a dot here, then I need to update the caret position (decrement it by 1) when positioning it
                        // To do so, we keep that info in order to modify the caret position later
                        leftPartContainedADot = true;
                        leftPart = leftPart.replace('.', '');
                    }
                    rightPart = rightPart.replace('.', '');
                }
                // -- Here, we are good to go to continue on the same basis

                // Generate the unformatted result
                result = `${leftPart}${pastedText}${rightPart}`;

                // 2. Calculate the caret position in the unformatted value, for later use
                if (selectionStart === selectionEnd) {
                    // There is no selection, then the caret position is set after the pasted text
                    const indexWherePastedTextHasBeenInserted = AutoNumericHelper.convertCharacterCountToIndexPosition(AutoNumericHelper.countNumberCharactersOnTheCaretLeftSide(initialFormattedValue, selectionStart, this.settings.decimalCharacter));
                    caretPositionOnInitialTextAfterPasting = indexWherePastedTextHasBeenInserted + pastedText.length; // I must not count the characters that have been removed from the pasted text (ie. '.')
                } else {
                    if (isAllInputTextSelected) {
                        // Special case when all the input text is selected before pasting, which means we'll completely erase its content and paste only the clipboard content
                        caretPositionOnInitialTextAfterPasting = result.length;
                    } else if (rightPart === '') {
                        // If the user selected from the caret position to the end of the input (on the far right)
                        caretPositionOnInitialTextAfterPasting = AutoNumericHelper.convertCharacterCountToIndexPosition(AutoNumericHelper.countNumberCharactersOnTheCaretLeftSide(initialFormattedValue, selectionStart, this.settings.decimalCharacter)) + pastedText.length;
                    } else {
                        // Normal case
                        const indexSelectionEndInRawValue = AutoNumericHelper.convertCharacterCountToIndexPosition(AutoNumericHelper.countNumberCharactersOnTheCaretLeftSide(initialFormattedValue, selectionEnd, this.settings.decimalCharacter));

                        // Here I must not count the characters that have been removed from the pasted text (ie. '.'), or the thousand separators in the initial selected text
                        const selectedText = AutoNumericHelper.getElementValue(e.target).slice(selectionStart, selectionEnd);
                        caretPositionOnInitialTextAfterPasting = indexSelectionEndInRawValue - selectionSize + AutoNumericHelper.countCharInText(this.settings.digitGroupSeparator, selectedText) + pastedText.length;
                    }
                }

                // Modify the caret position for special cases, only if the whole input has not been selected
                if (!isAllInputTextSelected) {
                    if (isPasteNegativeAndInitialValueIsPositive) {
                        // If the pasted value has a '-' sign, but the initial value does not, offset the index by one
                        caretPositionOnInitialTextAfterPasting++;
                    }

                    if (leftPartContainedADot) {
                        // If a dot has been removed for the part on the left of the caret, we decrement the caret index position
                        caretPositionOnInitialTextAfterPasting--;
                    }
                }
        }

        // 5. Check if the result is a valid number, if not, drop the paste and do nothing.
        if (!AutoNumericHelper.isNumber(result) || result === '') {
            if (this.settings.onInvalidPaste === AutoNumeric.options.onInvalidPaste.error) {
                AutoNumericHelper.throwError(`The pasted value '${rawPastedText}' would result into an invalid content '${result}'.`); //TODO Should we send a warning instead of throwing an error?
                //TODO This is not DRY ; refactor with above
            }
            return;
        }

        // 6. If it's a valid number, check if it falls inside the minimum and maximum value. If this fails, modify the value following this procedure :
        /*
         * If 'error' (this is the default) :
         *      - Normal paste behavior.
         *      - Try to set the new value, if it fails, then throw an error in the console.
         *      - Do not change the input value, do not change the current selection.
         * If 'ignore' :
         *      - Normal paste behavior.
         *      - Try to set the new value, if it fails, do nothing more.
         *      - Do not change the input value, do not change the current selection.
         * If 'clamp' :
         *      - Normal paste behavior.
         *      - Try to set the new value, if it fails, set the value to the minimum or maximum limit, whichever is closest to the
         *        paste result.
         *      - Change the caret position to be positioned on the left hand side of the decimal character.
         * If 'truncate' :
         *      - Truncate paste behavior.
         *      - Try to set the new value, until it fails (if the result is out of the min and max value limits).
         *      - Drop the remaining non-pasted numbers, and keep the last known non-failing result.
         *      - Change the caret position to be positioned after the last pasted character.
         * If 'replace' :
         *      - Replace paste behavior.
         *      - Try to set the new value, until it fails (if the result is out of the min and max value limits).
         *     - Then try to replace as many numbers as possible with the pasted ones. Once it fails, keep the last known non-failing result.
         *      - Change the caret position to be positioned after the last pasted character.
         */
        let valueHasBeenSet = false;
        let valueHasBeenClamped = false;
        try {
            this.set(result);
            valueHasBeenSet = true;
        } catch (error) {
            let clampedValue;
            switch (this.settings.onInvalidPaste) {
                case AutoNumeric.options.onInvalidPaste.clamp:
                    clampedValue = AutoNumericHelper.clampToRangeLimits(result, this.settings);
                    try {
                        this.set(clampedValue);
                    } catch (error) {
                        AutoNumericHelper.throwError(`Fatal error: Unable to set the clamped value '${clampedValue}'.`);
                    }

                    valueHasBeenClamped = true;
                    valueHasBeenSet = true;
                    result = clampedValue; // This is used only for setting the caret position later
                    break;
                case AutoNumeric.options.onInvalidPaste.error:
                case AutoNumeric.options.onInvalidPaste.truncate:
                case AutoNumeric.options.onInvalidPaste.replace:
                    // Throw an error message
                    AutoNumericHelper.throwError(`The pasted value '${rawPastedText}' results in a value '${result}' that is outside of the minimum [${this.settings.minimumValue}] and maximum [${this.settings.maximumValue}] value range.`);
                // falls through
                case AutoNumeric.options.onInvalidPaste.ignore:
                // Do nothing
                // falls through
                default :
                    return; // ...and nothing else should be changed
            }
        }

        // 7. Then lastly, set the caret position at the right logical place
        const targetValue = AutoNumericHelper.getElementValue(e.target);
        let caretPositionInFormattedNumber;
        if (valueHasBeenSet) {
            switch (this.settings.onInvalidPaste) {
                case AutoNumeric.options.onInvalidPaste.clamp:
                    if (valueHasBeenClamped) {
                        if (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix) {
                            AutoNumericHelper.setElementSelection(e.target, targetValue.length - this.settings.currencySymbol.length); // This puts the caret on the right of the last decimal place
                        } else {
                            AutoNumericHelper.setElementSelection(e.target, targetValue.length); // ..and this on the far right
                        }

                        break;
                    } // else if the value has not been clamped, the default behavior is used...
                // falls through
                case AutoNumeric.options.onInvalidPaste.error:
                case AutoNumeric.options.onInvalidPaste.ignore:
                case AutoNumeric.options.onInvalidPaste.truncate:
                case AutoNumeric.options.onInvalidPaste.replace:
                default :
                    // Whenever one or multiple characters are pasted, this means we have to manage the potential thousand separators that could be added by the formatting
                    caretPositionInFormattedNumber = AutoNumericHelper.findCaretPositionInFormattedNumber(result, caretPositionOnInitialTextAfterPasting, targetValue, this.settings.decimalCharacter);
                    AutoNumericHelper.setElementSelection(e.target, caretPositionInFormattedNumber);
            }
        }

        // 8. We make sure we send an input event only if the result is different than the initial value before the paste
        if (valueHasBeenSet && initialFormattedValue !== targetValue) {
            // On a 'normal' non-autoNumeric input, an `input` event is sent when a paste is done. We mimic that.
            AutoNumericHelper.triggerEvent(AutoNumeric.events.native.input, e.target);
        }
    }

    /**
     * When focusing out of the input, we check if the value has changed, and if it has, then we send a `change` event (since the native one would have been prevented by `e.preventDefault()` called in the other event listeners).
     * We also update the info of the focused state in the `this.isFocused` variable.
     *
     * @param {Event} e
     */
    _onBlur(e) {
        // Keep track if the element is currently focused
        this.isFocused = false;
        // Keep track if the user is currently editing the element
        this.isEditing = false;

        if (AutoNumericHelper.getElementValue(e.target) !== this.valueOnFocus) {
            AutoNumericHelper.triggerEvent(AutoNumeric.events.native.change, e.target);
        }
    }

    /**
     * Handler for 'wheel' event
     *
     * @param {WheelEvent} e
     */
    _onWheel(e) {
        // If the user is using the 'Shift' key modifier, then we ignore the wheel event
        // This special behavior is applied in order to avoid preventing the user to scroll the page if the inputs are covering the whole available space.
        // If that's the case, then he can use the 'Shift' modifier key while using the mouse wheel in order to bypass the increment/decrement feature
        // This is useful on small screen where some badly configured inputs could use all the available space.
        if (!e.shiftKey && this.settings.modifyValueOnWheel) {
            this.isWheelEvent = true; // Keep the info that we are currently managing a mouse wheel event

            // 0) First, save the caret position so we can set it back once the value has been changed
            const selectionStart = e.target.selectionStart || 0;
            const selectionEnd = e.target.selectionEnd || 0;

            // 1) Get the unformatted value
            const currentUnformattedValue = this.rawValue;

            let result;
            if (AutoNumericHelper.isUndefinedOrNullOrEmpty(currentUnformattedValue)) {
                // If by default the input is empty, start at '0'
                if (this.settings.minimumValue > 0 || this.settings.maximumValue < 0) {
                    // or if '0' is not between min and max value, 'minimumValue' if the user does a wheelup, 'maximumValue' if the user does a wheeldown
                    if (AutoNumericHelper.isWheelUpEvent(e)) {
                        result = this.settings.minimumValue;
                    } else if (AutoNumericHelper.isWheelDownEvent(e)) {
                        result = this.settings.maximumValue;
                    } else {
                        AutoNumericHelper.throwError(`The event is not a 'wheel' event.`);
                    }
                } else {
                    result = 0;
                }
            } else {
                result = currentUnformattedValue;
            }

            result = +result; // Typecast to a number needed for the following addition/subtraction

            // 2) Increment/Decrement the value
            // But first, choose the increment/decrement method ; fixed or progressive
            if (AutoNumericHelper.isNumber(this.settings.wheelStep)) {
                const step = +this.settings.wheelStep; // Typecast to a number needed for the following addition/subtraction
                // Fixed method
                // This is the simplest method, where a fixed offset in added/subtracted from the current value
                if (AutoNumericHelper.isWheelUpEvent(e)) { // Increment
                    result += step;
                } else if (AutoNumericHelper.isWheelDownEvent(e)) { // Decrement
                    result -= step;
                }
            } else {
                // Progressive method
                // For this method, we calculate an offset that is in relation to the size of the current number (using only the integer part size).
                // The bigger the number, the bigger the offset (usually the number count in the integer part minus 3, except for small numbers where a different behavior is better for the user experience).
                //TODO Known limitation : The progressive method does not play well with numbers between 0 and 1 where to modify the decimal places the rawValue first has to go from '1' to '0'
                if (AutoNumericHelper.isWheelUpEvent(e)) { // Increment
                    result = AutoNumericHelper.addAndRoundToNearestAuto(result, this.settings.decimalPlacesRawValue);
                } else if (AutoNumericHelper.isWheelDownEvent(e)) { // Decrement
                    result = AutoNumericHelper.subtractAndRoundToNearestAuto(result, this.settings.decimalPlacesRawValue);
                }
            }

            // 3) Set the new value so it gets formatted
            // First clamp the result if needed
            result = AutoNumericHelper.clampToRangeLimits(result, this.settings);
            if (result !== +currentUnformattedValue) {
                // Only 'set' the value if it has changed. For instance 'set' should not happen if the user hits a limit and continue to try to go past it since we clamp the value.
                this.set(result);
            }

            //XXX Do not prevent if the value is not modified? From a UX point of view, preventing the wheel event when the user use it on top of an autoNumeric element should always be done, even if the value does not change. Perhaps that could affect other scripts relying on this event to be sent though.
            e.preventDefault(); // We prevent the page to scroll while we increment/decrement the value

            // 4) Finally, we set back the caret position/selection
            // There is no need to take into account the fact that the number count could be different at the end of the wheel event ; it would be too complex and most of the time unreliable
            this._setSelection(selectionStart, selectionEnd);

            this.isWheelEvent = false; // Set back the mouse wheel indicator to its default
        }
    }

    /**
     * Handler for 'drop' event
     *
     * @param {DragEvent} e
     */
    _onDrop(e) {
        this.isDropEvent = true;
        e.preventDefault();
        const droppedText = e.dataTransfer.getData('text/plain');
        const cleanedValue = this.unformatOther(droppedText);
        this.set(cleanedValue);
        this.isDropEvent = false;
    }

    /**
     * Handler for 'submit' events happening on the parent <form> element.
     * If `unformatOnSubmit` is set to `true`, the element value is first unformatted before the form is submitted.
     *
     * @returns {boolean}
     */
    _onFormSubmit() {
        if (this.settings.unformatOnSubmit) {
            this._setElementValue(this.rawValue);
        }

        return true;
    }

    /**
     * Listen for the `alt` key keydown event globally, and if the event is caught, unformat the AutoNumeric element that is hovered by the mouse.
     *
     * @param {KeyboardEvent} e
     * @private
     */
    _onKeydownGlobal(e) {
        //TODO Find a way to keep the caret position between the alt keyup/keydown states
        if (AutoNumericHelper.character(e) === AutoNumericEnum.keyName.Alt) {
            const hoveredElement = AutoNumericHelper.getHoveredElement();
            if (AutoNumeric.isManagedByAutoNumeric(hoveredElement)) {
                const anElement = AutoNumeric.getAutoNumericElement(hoveredElement);
                this.constructor._unformatAltHovered(anElement);
            }
        }
    }

    /**
     * Listen for the `alt` key keyup event globally, and if the event is caught, reformat the AutoNumeric element that is hovered by the mouse.
     *
     * @param {KeyboardEvent} e
     * @private
     */
    _onKeyupGlobal(e) {
        if (AutoNumericHelper.character(e) === AutoNumericEnum.keyName.Alt) {
            const hoveredElement = AutoNumericHelper.getHoveredElement();
            if (AutoNumeric.isManagedByAutoNumeric(hoveredElement)) {
                const anElement = AutoNumeric.getAutoNumericElement(hoveredElement);
                this.constructor._reformatAltHovered(anElement);
            }
        }
    }

    /**
     * Return `true` if the DOM element is supported by autoNumeric.
     * A supported element is an element whitelisted in the `allowedTagList`.
     *
     * @returns {boolean}
     * @private
     */
    _isElementTagSupported() {
        if (!AutoNumericHelper.isElement(this.domElement)) {
            AutoNumericHelper.throwError(`The DOM element is not valid, ${this.domElement} given.`);
        }

        return AutoNumericHelper.isInArray(this.domElement.tagName.toLowerCase(), this.allowedTagList);
    }

    /**
     * Return `true` in the DOM element is an <input>.
     *
     * @returns {boolean}
     * @private
     */
    _isInputElement() {
        return this.domElement.tagName.toLowerCase() === 'input';
    }

    /**
     * Return `true` if the input type is supported by AutoNumeric
     *
     * @returns {boolean}
     * @throws
     */
    _isInputTypeSupported() {
        return (this.domElement.type === 'text' ||
                this.domElement.type === 'hidden' ||
                this.domElement.type === 'tel' ||
                AutoNumericHelper.isUndefinedOrNullOrEmpty(this.domElement.type));
    }

    /**
     * Check if the DOM element is supported by autoNumeric.
     * A supported element is either an <input> element with the right 'type' attribute, or a tag whitelisted in the `allowedTagList`.
     * If the check fails, this method throws.
     * This function also set the info `this.isInputElement` which keep tracks if the DOM element is an <input> or not, and the `this.isContentEditable` if the element has the `contenteditable` attribute set to `true`.
     *
     * @throws
     * @private
     */
    _checkElement() {
        const currentElementTag = this.domElement.tagName.toLowerCase();

        if (!this._isElementTagSupported()) {
            AutoNumericHelper.throwError(`The <${currentElementTag}> tag is not supported by autoNumeric`);
        }

        if (this._isInputElement()) {
            if (!this._isInputTypeSupported()) {
                AutoNumericHelper.throwError(`The input type "${this.domElement.type}" is not supported by autoNumeric`);
            }

            this.isInputElement = true;
        } else {
            this.isInputElement = false;
            this.isContentEditable = this.domElement.hasAttribute('contenteditable') && this.domElement.getAttribute('contenteditable') === 'true';
        }
    }

    /**
     * Formats the default value on page load.
     * This is called only if the `formatOnPageLoad` option is set to `true`.
     *
     * @param {number|string|null} forcedInitialValue The value that should be used for initialization, in place on the eventual html one
     */
    _formatDefaultValueOnPageLoad(forcedInitialValue = null) {
        let setValue = true;
        let currentValue;
        if (!AutoNumericHelper.isNull(forcedInitialValue)) {
            currentValue = forcedInitialValue;
        } else {
            currentValue = AutoNumericHelper.getElementValue(this.domElement);
        }

        if (this.isInputElement || this.isContentEditable) {
            /*
             * If the input value has been set by the dev, but not directly as an attribute in the html, then it takes
             * precedence and should get formatted during the initialization (if this input value is a valid number and that the
             * developer wants it formatted on init (cf. the `settings.formatOnPageLoad` option)).
             * Note; this is true whatever the developer has set for `data-default-value-override` in the html (asp.net users).
             *
             * In other words : if `defaultValueOverride` is not null, it means the developer is trying to prevent postback problems.
             * But if `input.value` is set to a number, and the html `value` attribute is not set, then it means the dev has
             * changed the input value, and then it means we should not overwrite his own decision to do so.
             * Hence, if `defaultValueOverride` is not null, but `input.value` is a number and `this.domElement.hasAttribute('value')`
             * is false, we should ignore `defaultValueOverride` altogether.
             */
            const unLocalizedCurrentValue = this.constructor._toNumericValue(currentValue, this.settings); // This allows to use a localized value on startup
            if (!this.domElement.hasAttribute('value') || this.domElement.getAttribute('value') === '') {
                // Check if the `value` is valid or not
                if (!isNaN(Number(unLocalizedCurrentValue)) && Infinity !== unLocalizedCurrentValue) {
                    this.set(unLocalizedCurrentValue);
                    setValue = false;
                } else {
                    // If not, inform the developer that nothing usable has been provided
                    AutoNumericHelper.throwError(`The value [${currentValue}] used in the input is not a valid value autoNumeric can work with.`);
                }
            } else {
                /* Checks for :
                 * - page reload from back button, and
                 * - ASP.net form post back
                 *      The following HTML data attribute is REQUIRED (data-an-default="same value as the value attribute")
                 *      example: <asp:TextBox runat="server" id="someID" text="1234.56" data-an-default="1234.56">
                 */
                if ((this.settings.defaultValueOverride !== null && this.settings.defaultValueOverride.toString() !== currentValue) ||
                    (this.settings.defaultValueOverride === null && currentValue !== '' && currentValue !== this.domElement.getAttribute('value')) ||
                    (currentValue !== '' && this.domElement.getAttribute('type') === 'hidden' && !AutoNumericHelper.isNumber(unLocalizedCurrentValue))) {
                    if (this.settings.saveValueToSessionStorage && (this.settings.decimalPlacesShownOnFocus !== null || this.settings.divisorWhenUnfocused)) {
                        this._setRawValue(this._getValueFromPersistentStorage());
                    }

                    // If the decimalPlacesShownOnFocus value should NOT be saved in sessionStorage
                    if (!this.settings.saveValueToSessionStorage) {
                        let toStrip;

                        if (this.settings.negativeBracketsTypeOnBlur !== null && this.settings.negativeSignCharacter !== '') {
                            toStrip = this.constructor._removeBrackets(currentValue, this.settings);
                        } else {
                            toStrip = currentValue;
                        }

                        if ((this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.suffix ||
                            (this.settings.negativePositiveSignPlacement !== AutoNumeric.options.negativePositiveSignPlacement.prefix && this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix)) &&
                            this.settings.negativeSignCharacter !== '' &&
                            AutoNumericHelper.isNegative(currentValue)) {
                            this._setRawValue(this.settings.negativeSignCharacter + this.constructor._stripAllNonNumberCharacters(toStrip, this.settings, true, this.isFocused));
                        } else {
                            this._setRawValue(this.constructor._stripAllNonNumberCharacters(toStrip, this.settings, true, this.isFocused));
                        }
                    }

                    setValue = false;
                }
            }

            if (currentValue === '') {
                switch (this.settings.emptyInputBehavior) {
                    case AutoNumeric.options.emptyInputBehavior.focus:
                        setValue = false;
                        break;
                    //TODO What about the `AutoNumeric.options.emptyInputBehavior.press` value?
                    case AutoNumeric.options.emptyInputBehavior.always:
                        this._setElementValue(this.settings.currencySymbol);
                        setValue = false;
                        break;
                    case AutoNumeric.options.emptyInputBehavior.zero:
                        this.set('0');
                        setValue = false;
                        break;
                    default :
                    //
                }
            } else if (setValue && currentValue === this.domElement.getAttribute('value')) {
                this.set(currentValue);
            }
        } else {
            if (this.settings.defaultValueOverride === null) {
                this.set(currentValue);
            } else {
                if (this.settings.defaultValueOverride === currentValue) {
                    this.set(currentValue);
                }
            }
        }
    }

    /**
     * Enhance the user experience by modifying the default `negativePositiveSignPlacement` option depending on `currencySymbol` and `currencySymbolPlacement`.
     *
     * If the user has not set the placement of the negative sign (`negativePositiveSignPlacement`), but has set a currency symbol (`currencySymbol`),
     * then we modify the default value of `negativePositiveSignPlacement` in order to keep the resulting output logical by default :
     * - "$-1,234.56" instead of "-$1,234.56" ({currencySymbol: "$", negativePositiveSignPlacement: "r"})
     * - "-1,234.56$" instead of "1,234.56-$" ({currencySymbol: "$", currencySymbolPlacement: "s", negativePositiveSignPlacement: "p"})
     *
     * @param {object} settings
     */
    static _correctNegativePositiveSignPlacementOption(settings) {
        //XXX Note; this function is static since we need to pass a `settings` object when calling the static `AutoNumeric.format()` method
        // If negativePositiveSignPlacement is already set, we do not overwrite it
        if (!AutoNumericHelper.isNull(settings.negativePositiveSignPlacement)) {
            return;
        }

        if (!AutoNumericHelper.isUndefined(settings) &&
            AutoNumericHelper.isUndefinedOrNullOrEmpty(settings.negativePositiveSignPlacement) &&
            !AutoNumericHelper.isUndefinedOrNullOrEmpty(settings.currencySymbol)) {
            switch (settings.currencySymbolPlacement) {
                case AutoNumeric.options.currencySymbolPlacement.suffix:
                    settings.negativePositiveSignPlacement = AutoNumeric.options.negativePositiveSignPlacement.prefix; // Default -1,234.56 €
                    break;
                case AutoNumeric.options.currencySymbolPlacement.prefix:
                    settings.negativePositiveSignPlacement = AutoNumeric.options.negativePositiveSignPlacement.left; // Default -$1,234.56
                    break;
                default :
                //
            }
        } else {
            // Sets the default value if `negativePositiveSignPlacement` is `null`
            settings.negativePositiveSignPlacement = AutoNumeric.options.negativePositiveSignPlacement.left;
        }
    }

    /**
     * Correct the `caretPositionOnFocus` and `selectOnFocus` options, since setting both leads to a conflict.
     * This method directly modifies the `options` object passed as a parameter, then returns it.
     * It returns `null` if the given option is `null`.
     *
     * @param {object} options The options passed as an argument by the user
     * @returns {object|null}
     * @private
     */
    static _correctCaretPositionOnFocusAndSelectOnFocusOptions(options) {
        if (AutoNumericHelper.isNull(options)) {
            return null;
        }

        // If the user has set the `caretPositionOnFocus` option, do not set `selectOnFocus` to `true` by default
        if (!AutoNumericHelper.isUndefinedOrNullOrEmpty(options.caretPositionOnFocus) && AutoNumericHelper.isUndefinedOrNullOrEmpty(options.selectOnFocus)) {
            options.selectOnFocus = AutoNumeric.options.selectOnFocus.doNotSelect;
        }

        // If the user has set the `selectOnFocus` option to `true`, set `caretPositionOnFocus` to `doNoForceCaretPosition`
        if (AutoNumericHelper.isUndefinedOrNullOrEmpty(options.caretPositionOnFocus) && !AutoNumericHelper.isUndefinedOrNullOrEmpty(options.selectOnFocus) && options.selectOnFocus === AutoNumeric.options.selectOnFocus.select) {
            options.caretPositionOnFocus = AutoNumeric.options.caretPositionOnFocus.doNoForceCaretPosition;
        }

        return options;
    }

    /**
     * Calculate the number de decimal places to be used by the AutoNumeric object, for each of its state, and for its formatted and raw value.
     * By default, the `rawValue` precision is the same as the formatted value one.
     *
     * This method is called during the AutoNumeric object initialization. This assumes some internal variable state.
     *
     * This methods set the following options accordingly to their own value and the mandatory `decimalPlaces` option:
     * - decimalPlacesRawValue     (nullable)
     * - decimalPlacesShownOnBlur  (nullable)
     * - decimalPlacesShownOnFocus (nullable)
     *
     * Note: the `decimalPlaces` option is only used here and only serve to define those three previous options value.
     * AutoNumeric will then *only* use `decimalPlacesRawValue`, `decimalPlacesShownOnBlur` and `decimalPlacesShownOnFocus` from there.
     *
     * This methods directly modifies the `settings` object passed as a parameter.
     *
     * @param {object} settings This is an object with the new settings to use.
     * @private
     */
    static _calculateDecimalPlacesOnInit(settings) {
        // Check the `decimalPlaces*` options and output any warnings as needed, before modifying those options
        this._validateDecimalPlacesRawValue(settings);

        // Initialization phase
        //XXX This assumes at this stage, `settings.decimalPlaces` as been set from the default options

        // Overwrite the `decimalPlaces*` values if the `decimalPlaces*` options are not set in the `settings`
        // Sets `decimalPlacesShownOnBlur` (previously known as `scaleDecimalPlaces`)
        if (settings.decimalPlacesShownOnFocus === AutoNumeric.options.decimalPlacesShownOnFocus.useDefault)  {
            settings.decimalPlacesShownOnFocus = settings.decimalPlaces;
        }

        if (settings.decimalPlacesShownOnBlur === AutoNumeric.options.decimalPlacesShownOnBlur.useDefault)  {
            settings.decimalPlacesShownOnBlur = settings.decimalPlaces;
        }

        if (settings.decimalPlacesRawValue === AutoNumeric.options.decimalPlacesRawValue.useDefault)  {
            settings.decimalPlacesRawValue = settings.decimalPlaces;
        }

        // Add the additional decimal places to the raw value
        let additionalDecimalPlacesRawValue = 0;
        if (settings.rawValueDivisor && settings.rawValueDivisor !== AutoNumeric.options.rawValueDivisor.none) {
            additionalDecimalPlacesRawValue = String(settings.rawValueDivisor).length - 1; // ie. Dividing by '100' adds 2 decimal places to the needed precision
            if (additionalDecimalPlacesRawValue < 0) {
                additionalDecimalPlacesRawValue = 0;
            }
        }

        settings.decimalPlacesRawValue = Math.max(
            Math.max(settings.decimalPlacesShownOnBlur, settings.decimalPlacesShownOnFocus) + additionalDecimalPlacesRawValue,
            Number(settings.originalDecimalPlacesRawValue) + additionalDecimalPlacesRawValue
        );
    }

    /**
     * Recalculate the number de decimal places to be used by the AutoNumeric object, for each of its state, and for its formatted and raw value.
     * By default, the `rawValue` precision is the same as the formatted value one.
     *
     * This method is close to the one called during initialization, `_calculateDecimalPlacesOnInit()`, but with slight difference so that the `decimalPlaces*` options are correctly updated as needed.
     *
     * This methods set the following options accordingly to their own value and the mandatory `decimalPlaces` option:
     * - decimalPlacesRawValue     (nullable)
     * - decimalPlacesShownOnBlur  (nullable)
     * - decimalPlacesShownOnFocus (nullable)
     *
     * Note: the `decimalPlaces` option is only used here and only serve to define those three previous options value.
     * AutoNumeric will then *only* use `decimalPlacesRawValue`, `decimalPlacesShownOnBlur` and `decimalPlacesShownOnFocus` from there.
     *
     * This methods directly modifies the `settings` object passed as a parameter.
     *
     * @param {object} settings This is an object with the new settings to use.
     * @param {object} currentSettings This is the current settings (`this.settings`) used by the element.
     * @private
     */
    static _calculateDecimalPlacesOnUpdate(settings, currentSettings = null) {
        // Check the `decimalPlaces*` options and output any warnings as needed, before modifying those options
        this._validateDecimalPlacesRawValue(settings);

        // Update phase
        if (AutoNumericHelper.isNull(currentSettings)) {
            AutoNumericHelper.throwError(`When updating the settings, the previous ones should be passed as an argument.`);
        }

        const decimalPlacesInOptions = 'decimalPlaces' in settings;
        if (!(decimalPlacesInOptions ||
                'decimalPlacesRawValue' in settings ||
                'decimalPlacesShownOnFocus' in settings ||
                'decimalPlacesShownOnBlur' in settings ||
                'rawValueDivisor' in settings)) {
            // Do Nothing if no decimal places-related options are modified
            return;
        }

        // Overwrite the `decimalPlaces*` values if the `decimalPlaces*` options are not set in the `settings`
        if (decimalPlacesInOptions) {
            if (!('decimalPlacesShownOnFocus' in settings) ||
                settings.decimalPlacesShownOnFocus === AutoNumeric.options.decimalPlacesShownOnFocus.useDefault)  {
                settings.decimalPlacesShownOnFocus = settings.decimalPlaces;
            }

            if (!('decimalPlacesShownOnBlur' in settings) ||
                settings.decimalPlacesShownOnBlur === AutoNumeric.options.decimalPlacesShownOnBlur.useDefault)  {
                settings.decimalPlacesShownOnBlur = settings.decimalPlaces;
            }

            if (!('decimalPlacesRawValue' in settings) ||
                settings.decimalPlacesRawValue === AutoNumeric.options.decimalPlacesRawValue.useDefault)  {
                settings.decimalPlacesRawValue = settings.decimalPlaces;
            }
        } else {
            if (AutoNumericHelper.isUndefined(settings.decimalPlacesShownOnFocus)) {
                settings.decimalPlacesShownOnFocus = currentSettings.decimalPlacesShownOnFocus;
            }

            if (AutoNumericHelper.isUndefined(settings.decimalPlacesShownOnBlur)) {
                settings.decimalPlacesShownOnBlur = currentSettings.decimalPlacesShownOnBlur;
            }
        }

        // Add the additional decimal places to the raw value
        let additionalDecimalPlacesRawValue = 0;
        if (settings.rawValueDivisor && settings.rawValueDivisor !== AutoNumeric.options.rawValueDivisor.none) {
            additionalDecimalPlacesRawValue = String(settings.rawValueDivisor).length - 1; // ie. Dividing by '100' adds 2 decimal places to the needed precision
            if (additionalDecimalPlacesRawValue < 0) {
                additionalDecimalPlacesRawValue = 0;
            }
        }

        if (!settings.decimalPlaces && !settings.decimalPlacesRawValue) {
            settings.decimalPlacesRawValue = Math.max(
                Math.max(settings.decimalPlacesShownOnBlur, settings.decimalPlacesShownOnFocus) + additionalDecimalPlacesRawValue,
                Number(currentSettings.originalDecimalPlacesRawValue) + additionalDecimalPlacesRawValue
            );
        } else {
            settings.decimalPlacesRawValue = Math.max(
                Math.max(settings.decimalPlacesShownOnBlur, settings.decimalPlacesShownOnFocus) + additionalDecimalPlacesRawValue,
                Number(settings.decimalPlacesRawValue) + additionalDecimalPlacesRawValue
            );
        }
    }

    /**
     * Analyze and save the minimumValue and maximumValue integer size for later uses
     */
    _calculateVMinAndVMaxIntegerSizes() {
        let [maximumValueIntegerPart] = this.settings.maximumValue.toString().split('.');
        let [minimumValueIntegerPart] = (!this.settings.minimumValue && this.settings.minimumValue !== 0)?[]:this.settings.minimumValue.toString().split('.');
        maximumValueIntegerPart = maximumValueIntegerPart.replace('-', '');
        minimumValueIntegerPart = minimumValueIntegerPart.replace('-', '');

        this.settings.mIntPos = Math.max(maximumValueIntegerPart.length, 1);
        this.settings.mIntNeg = Math.max(minimumValueIntegerPart.length, 1);
    }
    /**
     * Sets the alternative decimal separator key.
     */
    _setAlternativeDecimalSeparatorCharacter() {
        if (AutoNumericHelper.isNull(this.settings.decimalCharacterAlternative) && Number(this.settings.decimalPlaces) > 0) {
            if (this.settings.decimalCharacter === '.' && this.settings.digitGroupSeparator !== ',') {
                this.settings.decimalCharacterAlternative = ',';
            } else if (this.settings.decimalCharacter === ',' && this.settings.digitGroupSeparator !== '.') {
                this.settings.decimalCharacterAlternative = '.';
            }
        }
    }

    /**
     * Caches regular expressions for _stripAllNonNumberCharacters
     *
     * @param {object} settings
     * @param {object} regex
     */
    static _cachesUsualRegularExpressions(settings, regex) {
        const allNumbersReg = '[0-9]';
        const noAllNumbersReg = '[^0-9]';

        // Test if there is a negative character in the string
        const aNegReg = settings.negativeSignCharacter?`([-\\${settings.negativeSignCharacter}]?)`:'(-?)';
        regex.aNegRegAutoStrip = aNegReg;

        let negativeSignRegPart;
        if (settings.negativeSignCharacter) {
            negativeSignRegPart = `\\${settings.negativeSignCharacter}`;
        } else {
            negativeSignRegPart = '';
        }

        settings.skipFirstAutoStrip = new RegExp(`${aNegReg}[^-${negativeSignRegPart}\\${settings.decimalCharacter}${allNumbersReg}].*?(${allNumbersReg}|\\${settings.decimalCharacter}${allNumbersReg})`);
        settings.skipLastAutoStrip = new RegExp(`(${allNumbersReg}\\${settings.decimalCharacter}?)[^\\${settings.decimalCharacter}${allNumbersReg}]${noAllNumbersReg}*$`);

        const allowed = `-0123456789\\${settings.decimalCharacter}`;
        settings.allowedAutoStrip = new RegExp(`[^${allowed}]`, 'g');
        settings.numRegAutoStrip = new RegExp(`${aNegReg}(?:\\${settings.decimalCharacter}?(${allNumbersReg}+\\${settings.decimalCharacter}${allNumbersReg}+)|(${allNumbersReg}*(?:\\${settings.decimalCharacter}${allNumbersReg}*)?))`);

        // Using this regex version `^${regex.aNegRegAutoStrip}0*(\\d|$)` entirely clear the input on blur
        settings.stripReg = new RegExp(`^${regex.aNegRegAutoStrip}0*(${allNumbersReg})`);
    }

    /**
     * Modify the user settings to make them 'exploitable' later.
     */
    _transformOptionsValuesToDefaultTypes() {
        for (const key in this.settings) {
            if (this.settings.hasOwnProperty(key)) {
                const value = this.settings[key];

                // Convert the strings 'true' and 'false' to booleans
                if (value === 'true' || value === 'false') {
                    this.settings[key] = value === 'true';
                }

                // Convert numbers in options to strings
                //TODO Only transform the values of type 'Number' to 'String' if it's a currency number (so that we can have big numbers). Do not convert other numbers (ie. `historySize`)
                if (typeof value === 'number') {
                    this.settings[key] = value.toString();
                }
            }
        }
    }

    /**
     * Convert the old settings options name to new ones.
     *
     * @param {object} options
     */
    static _convertOldOptionsToNewOnes(options) {
        //TODO Delete this function once the old options are not used anymore
        const oldOptionsConverter = {
            // Old option names, with their corresponding new names
            aSep                              : 'digitGroupSeparator',
            nSep                              : 'showOnlyNumbersOnFocus',
            dGroup                            : 'digitalGroupSpacing',
            aDec                              : 'decimalCharacter',
            altDec                            : 'decimalCharacterAlternative',
            aSign                             : 'currencySymbol',
            pSign                             : 'currencySymbolPlacement',
            pNeg                              : 'negativePositiveSignPlacement',
            aSuffix                           : 'suffixText',
            oLimits                           : 'overrideMinMaxLimits',
            vMax                              : 'maximumValue',
            vMin                              : 'minimumValue',
            mDec                              : 'decimalPlacesOverride',
            eDec                              : 'decimalPlacesShownOnFocus',
            scaleDecimal                      : 'decimalPlacesShownOnBlur',
            aStor                             : 'saveValueToSessionStorage',
            mRound                            : 'roundingMethod',
            aPad                              : 'allowDecimalPadding',
            nBracket                          : 'negativeBracketsTypeOnBlur',
            wEmpty                            : 'emptyInputBehavior',
            lZero                             : 'leadingZero',
            aForm                             : 'formatOnPageLoad',
            sNumber                           : 'selectNumberOnly',
            anDefault                         : 'defaultValueOverride',
            unSetOnSubmit                     : 'unformatOnSubmit',
            outputType                        : 'outputFormat',
            debug                             : 'showWarnings',

            // Current options :
            allowDecimalPadding               : true,
            caretPositionOnFocus              : true,
            createLocalList                   : true,
            currencySymbol                    : true,
            currencySymbolPlacement           : true,
            decimalCharacter                  : true,
            decimalCharacterAlternative       : true,
            decimalPlaces                     : true,
            decimalPlacesRawValue             : true,
            decimalPlacesShownOnBlur          : true,
            decimalPlacesShownOnFocus         : true,
            defaultValueOverride              : true,
            digitalGroupSpacing               : true,
            digitGroupSeparator               : true,
            divisorWhenUnfocused              : true,
            emptyInputBehavior                : true,
            failOnUnknownOption               : true,
            formatOnPageLoad                  : true,
            historySize                       : true,
            isCancellable                     : true,
            leadingZero                       : true,
            maximumValue                      : true,
            minimumValue                      : true,
            modifyValueOnWheel                : true,
            negativeBracketsTypeOnBlur        : true,
            negativePositiveSignPlacement     : true,
            noEventListeners                  : true,
            onInvalidPaste                    : true,
            outputFormat                      : true,
            overrideMinMaxLimits              : true,
            rawValueDivisor                   : true,
            readOnly                          : true,
            roundingMethod                    : true,
            saveValueToSessionStorage         : true,
            selectNumberOnly                  : true,
            selectOnFocus                     : true,
            serializeSpaces                   : true,
            showOnlyNumbersOnFocus            : true,
            showPositiveSign                  : true,
            showWarnings                      : true,
            styleRules                        : true,
            suffixText                        : true,
            symbolWhenUnfocused               : true,
            unformatOnHover                   : true,
            unformatOnSubmit                  : true,
            wheelStep                         : true,

            // Additional information that are added to the `settings` object :
            //FIXME Find a way to exclude those internal data from the settings object (ideally by using another object, or better yet, class attributes) -->
            allowedAutoStrip                  : true,
            mIntNeg                           : true,
            mIntPos                           : true,
            negativeSignCharacter             : true,
            numRegAutoStrip                   : true,
            originalDecimalPlaces             : true,
            originalDecimalPlacesRawValue     : true,
            positiveSignCharacter             : true,
            skipFirstAutoStrip                : true,
            skipLastAutoStrip                 : true,
            stripReg                          : true,
        };

        for (const option in options) {
            if (options.hasOwnProperty(option)) {
                if (oldOptionsConverter[option] === true) {
                    // If the option is a 'new' option, we continue looping
                    continue;
                }

                if (oldOptionsConverter.hasOwnProperty(option)) {
                    // Else we have an 'old' option name
                    AutoNumericHelper.warning(`You are using the deprecated option name '${option}'. Please use '${oldOptionsConverter[option]}' instead from now on. The old option name will be dropped very soon™.`, true);

                    // Then we modify the initial option object to use the new options instead of the old ones
                    options[oldOptionsConverter[option]] = options[option];
                    delete options[option];
                } else if (options.failOnUnknownOption) {
                    // ...or the option name is unknown. This means there is a problem with the options object, therefore we throw an error.
                    AutoNumericHelper.throwError(`Option name '${option}' is unknown. Please fix the options passed to autoNumeric`);
                }
            }
        }

        if ('mDec' in options) {
            AutoNumericHelper.warning('The old `mDec` option has been deprecated in favor of more accurate options ; `decimalPlaces`, `decimalPlacesRawValue`, `decimalPlacesShownOnFocus` and `decimalPlacesShownOnBlur`.', true);
        }
    }

    /**
     * Analyse the settings/options passed by the user, validate and clean them, then set them into `this.settings`.
     * Note: This sets the settings to `null` if somehow the settings objet is undefined or empty
     *       If only `decimalPlaces` is defined in the option, overwrite the other decimalPlaces* options, otherwise, use those options
     *
     * @param {object} options
     * @param {boolean} update - If set to `true`, then the settings already exists and this function only updates them instead of recreating them from scratch
     * @throws
     */
    _setSettings(options, update = false) {
        // If the user used old options, we convert them to new ones
        if (update || !AutoNumericHelper.isNull(options)) {
            this.constructor._convertOldOptionsToNewOnes(options);
        }

        if (update) {
            // The settings are updated
            // Update the original data, if it has changed
            const decimalPlacesRawValueInOptions = 'decimalPlacesRawValue' in options;
            if (decimalPlacesRawValueInOptions) {
                this.settings.originalDecimalPlacesRawValue = options.decimalPlacesRawValue;
            }

            const decimalPlacesInOptions = 'decimalPlaces' in options;
            if (decimalPlacesInOptions) {
                this.settings.originalDecimalPlaces = options.decimalPlaces;
            }

            // Then update all the `decimalPlaces*` options
            this.constructor._calculateDecimalPlacesOnUpdate(options, this.settings);

            // Finally generate the updated settings object to use
            this._mergeSettings(options); //TODO Check that the `styleRules` option is correctly cloned (due to depth cloning limitation)
        } else {
            // The settings are generated for the first time
            this.settings = {};
            // If we couldn't grab any settings, create them from the default ones and combine them with the options passed as a parameter as well as with the HTML5 `data-*` info (via `this.domElement.dataset`), if any.
            this._mergeSettings(this.constructor.getDefaultConfig(), this.domElement.dataset, options, { rawValue : this.defaultRawValue });
            this.caretFix = false;
            this.throwInput = true; // Throw input event
            this.allowedTagList = AutoNumericEnum.allowedTagList;
            this.runOnce = false;
            this.hoveredWithAlt = false; // Keep tracks if the current AutoNumeric element is hovered by the mouse cursor while `Alt` is pressed
            this.androidSelectionStart = null; // If `null`, then we are not on an Android device (the keyCode is not always equal to 229)
        }

        // Modify the user settings to make them 'exploitable'
        this._transformOptionsValuesToDefaultTypes();

        // Immediately run the callbacks that could update the settings object
        this._runCallbacksFoundInTheSettingsObject();

        // Improve the `negativePositiveSignPlacement` option if needed
        this.constructor._correctNegativePositiveSignPlacementOption(this.settings);

        // Set the `caretPositionOnFocus` and `selectOnFocus` options so that they do not conflict, if one of those have been set manually by the user.
        // If order to check that, we take a look at the original options the user passed as an argument, not `this.settings` that have been merged with the default settings. //TODO Check the validity of that comment
        this.constructor._correctCaretPositionOnFocusAndSelectOnFocusOptions(this.settings);

        // Set the negative and positive signs, as needed
        this.settings.negativeSignCharacter = this.settings.minimumValue < 0 ? '-' : '';
        this.settings.positiveSignCharacter = this.settings.maximumValue >= 0 ? '+' : '';

        // Calculate the number of decimal places (during the element initialization)
        if (!update) {
            // Make sure the `originalDecimalPlaces` info is set
            if (AutoNumericHelper.isNull(options) || !options.decimalPlaces) {
                this.settings.originalDecimalPlaces = null;
            } else {
                this.settings.originalDecimalPlaces = options.decimalPlaces;
            }

            // Save the `originalDecimalPlacesRawValue` info
            this.settings.originalDecimalPlacesRawValue = this.settings.decimalPlacesRawValue;

            // Then update all the `decimalPlaces*` options
            this.constructor._calculateDecimalPlacesOnInit(this.settings);
        }

        // Additional changes to the settings object
        this._calculateVMinAndVMaxIntegerSizes();
        this._setAlternativeDecimalSeparatorCharacter();
        this._setTrailingNegativeSignInfo();
        this.regex = {}; // Create the object that will store the regular expressions
        this.constructor._cachesUsualRegularExpressions(this.settings, this.regex);
        this._setBrackets();

        // Validate the settings. Both tests throws if necessary.
        if (AutoNumericHelper.isEmptyObj(this.settings)) {
            AutoNumericHelper.throwError('Unable to set the settings, those are invalid ; an empty object was given.');
        }

        this.constructor.validate(this.settings, false, options);

        // Original settings saved for use when decimalPlacesShownOnFocus, divisorWhenUnfocused & showOnlyNumbersOnFocus options are being used
        this._keepAnOriginalSettingsCopy();
    }

    /**
     * Convert the `value` parameter that can either be :
     * - a real number,
     * - a string representing a real number, or
     * - a string representing a localized number (with specific group separators and decimal character),
     * ...to a string representing a real 'javascript' number (ie. '1234' or '1234.567').
     *
     * This function returns `NaN` if such conversion fails.
     *
     * @param {int|float|string} value
     * @param {object} settings
     * @returns {string|NaN}
     */
    static _toNumericValue(value, settings) {
        //XXX Note; this function is static since we need to pass a `settings` object when calling the static `AutoNumeric.format()` method
        let result;
        if (AutoNumericHelper.isNumber(Number(value))) {
            // The value has either already been stripped, or a 'real' javascript number is passed as a parameter
            result = value;
        } else {
            // Else if it's a string that `Number()` cannot typecast, then we try to convert the localized numeric string to a numeric one
            // Convert the value to a numeric string, stripping unnecessary characters in the process
            result = this._convertToNumericString(value.toString(), settings);

            // If the result is still not a numeric string, then we throw a warning
            if (!AutoNumericHelper.isNumber(Number(result))) {
                AutoNumericHelper.warning(`The value "${value}" being 'set' is not numeric and therefore cannot be used appropriately.`, settings.showWarnings);
                result = NaN;
            }
        }

        return result;
    }

    /**
     * Return the pasted text that will be used.
     *
     * @param {string} text
     * @returns {string|void|XML|*}
     */
    _preparePastedText(text) {
        return this.constructor._stripAllNonNumberCharacters(text, this.settings, true, this.isFocused).replace(this.settings.decimalCharacter, '.');
    }

    /**
     * Return TRUE if the given value (a number as a string) is within the range set in the settings `minimumValue` and `maximumValue`, FALSE otherwise.
     *
     * @param {string} value
     * @param {object} parsedMinValue Parsed via the `parseStr()` function
     * @param {object} parsedMaxValue Parsed via the `parseStr()` function
     * @returns {boolean}
     */
    static _checkIfInRange(value, parsedMinValue, parsedMaxValue) {
        const parsedValue = AutoNumericHelper.parseStr(value);
        return AutoNumericHelper.testMinMax(parsedMinValue, parsedValue) > -1 && AutoNumericHelper.testMinMax(parsedMaxValue, parsedValue) < 1;
    }

    /**
     * Update the selection values as well as resets the internal state of the current AutoNumeric object.
     * This keeps tracks of the current selection and resets the 'processed' and 'formatted' state.
     *
     * Note : Those two can change between the keydown, keypress and keyup events, that's why
     *        this function is called on each event handler.
     *
     * @private
     */
    _updateInternalProperties() {
        this.selection = AutoNumericHelper.getElementSelection(this.domElement);
        this.processed = false;
        this.formatted = false;
    }

    /**
     * Update the `event.key` attribute that triggered the given event.
     *
     * `event.key` describes:
     * - the key name (if a non-printable character),
     * - or directly the character that result from the key press used to trigger the event.
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
     * The key list is described here:
     * @link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
     *
     * @param {Event|KeyboardEvent} e
     * @private
     */
    _updateEventKeyInfo(e) {
        this.eventKey = AutoNumericHelper.character(e);
    }

    /**
     * Save the unformatted element value.
     * This is used in the 'cancellable' feature where the element value is saved on focus and input validation, to be used if the user wants to cancel his modifications by hitting the 'Escape' key.
     *
     * @private
     */
    _saveCancellableValue() {
        this.savedCancellableValue = this.rawValue;
    }

    /**
     * Set the text selection inside the input with the given start and end position.
     *
     * @param {int} start
     * @param {int} end
     * @private
     */
    _setSelection(start, end) {
        //TODO use this function to replace the direct calls to `setElementSelection()`, wherever possible
        start = Math.max(start, 0);
        end = Math.min(end, AutoNumericHelper.getElementValue(this.domElement).length);
        this.selection = {
            start,
            end,
            length: end - start,
        };

        AutoNumericHelper.setElementSelection(this.domElement, start, end);
    }

    /**
     * Set the caret position inside the input at the given position.
     *
     * @param {int} position
     * @private
     */
    _setCaretPosition(position) {
        this._setSelection(position, position);
    }

    /**
     * Return an array containing the string parts located on the left and right side of the caret or selection.
     * Those parts are left 'untouched', ie. formatted by autoNumeric.
     *
     * @returns {[string, string]} The parts on the left and right of the caret or selection
     * @private
     */
    _getLeftAndRightPartAroundTheSelection() {
        const value = AutoNumericHelper.getElementValue(this.domElement);
        const left = value.substring(0, this.selection.start);
        const right = value.substring(this.selection.end, value.length);

        return [left, right];
    }

    /**
     * Return an array containing the string parts located on the left and right side of the caret or selection.
     * Those parts are unformatted (stripped) of any non-numbers characters.
     *
     * @returns {[string, string]} The parts on the left and right of the caret or selection, unformatted.
     * @private
     */
    _getUnformattedLeftAndRightPartAroundTheSelection() {
        let [left, right] = this._getLeftAndRightPartAroundTheSelection();
        if (left === '' && right === '') {
            return ['', ''];
        }

        // If changing the sign and `left` is equal to the number zero, prevent stripping the leading zero(s)
        let stripZeros = true;
        if (this.eventKey === AutoNumericEnum.keyName.Hyphen && Number(left) === 0) {
            stripZeros = false;
        }

        if (this.isTrailingNegative &&
            AutoNumericHelper.isNegative(right) &&
            !AutoNumericHelper.isNegative(left)) {
            // Only set the negative sign if the value is negative
            left = '-' + left;
            right = right.replace(this.settings.negativeSignCharacter, '');
        }

        left = AutoNumeric._stripAllNonNumberCharacters(left, this.settings, stripZeros, this.isFocused);
        right = AutoNumeric._stripAllNonNumberCharacters(right, this.settings, false, this.isFocused);

        return [left, right];
    }

    /**
     * Strip parts from excess characters and leading zeros.
     *
     * @param {string} left
     * @param {string} right
     * @returns {[*,*,*]}
     * @private
     */
    _normalizeParts(left, right) {
        //TODO Refactor with `_getUnformattedLeftAndRightPartAroundTheSelection` which share a lot of similar code
        // If changing the sign and left is equal to the number zero - prevents stripping the leading zeros
        let stripZeros = true;
        if (this.eventKey === AutoNumericEnum.keyName.Hyphen && Number(left) === 0) {
            stripZeros = false;
        }

        if (this.isTrailingNegative &&
            AutoNumericHelper.isNegative(right) &&
            !AutoNumericHelper.isNegative(left)) {
            // Only set the negative sign if the value is negative
            left = '-' + left;
            right = right.replace(this.settings.negativeSignCharacter, '');
        }

        left = AutoNumeric._stripAllNonNumberCharacters(left, this.settings, stripZeros, this.isFocused);
        right = AutoNumeric._stripAllNonNumberCharacters(right, this.settings, false, this.isFocused);

        // Prevents multiple leading zeros from being entered
        if (this.settings.leadingZero === AutoNumeric.options.leadingZero.deny &&
            (this.eventKey === AutoNumericEnum.keyName.num0 || this.eventKey === AutoNumericEnum.keyName.numpad0) &&
            Number(left) === 0 &&
            // If `right` is not empty and the first character is not `decimalCharacter`
            !AutoNumericHelper.contains(left, this.settings.decimalCharacter) && right !== '') {
            left = left.substring(0, left.length - 1);
        }

        // Insert zero there is a leading dot
        let newValue = left + right;
        if (this.settings.decimalCharacter) {
            const m = newValue.match(new RegExp(`^${this.regex.aNegRegAutoStrip}\\${this.settings.decimalCharacter}`));
            if (m) {
                left = left.replace(m[1], m[1] + '0');
                newValue = left + right;
            }
        }

        return [left, right, newValue];
    }

    /**
     * Set the formatted element value as well as the `rawValue`.
     * This returns `true` if the element and raw value have been modified, `false` otherwise.
     * This method also adjust the caret position according to the `leadingZero` option and the normalized value. //TODO What about the cursor *selection*?
     *
     * @param {string} left
     * @param {string} right
     * @param {boolean} isPaste
     * @returns {boolean}
     * @private
     */
    _setValueParts(left, right, isPaste = false) {
        const [normalizedLeft, normalizedRight, normalizedNewValue] = this._normalizeParts(left, right);
        const [minTest, maxTest] = AutoNumeric._checkIfInRangeWithOverrideOption(normalizedNewValue, this.settings);

        if (minTest && maxTest) {
            // First, set the raw value
            const roundedRawValue = AutoNumeric._truncateDecimalPlaces(normalizedNewValue, this.settings, isPaste, this.settings.decimalPlacesRawValue);
            const testValue = roundedRawValue.replace(this.settings.decimalCharacter, '.');

            if (testValue === '' || testValue === this.settings.negativeSignCharacter) {
                let valueToSetOnEmpty;
                switch (this.settings.emptyInputBehavior) {
                    case AutoNumeric.options.emptyInputBehavior.zero:
                        valueToSetOnEmpty = '0';
                        break;
                    case AutoNumeric.options.emptyInputBehavior.null:
                        valueToSetOnEmpty = null;
                        break;
                    default :
                        valueToSetOnEmpty = '';
                }

                this._setRawValue(valueToSetOnEmpty);
            } else {
                this._setRawValue(this._trimLeadingAndTrailingZeros(testValue));
            }

            // Then set the formatted value
            const roundedValueToShow = AutoNumeric._truncateDecimalPlaces(normalizedNewValue, this.settings, isPaste, this.settings.decimalPlacesShownOnFocus);
            let position = normalizedLeft.length;
            if (position > roundedValueToShow.length) {
                position = roundedValueToShow.length;
            }

            // Make sure when the user enter a '0' on the far left with a leading zero option set to 'deny', that the caret does not moves since the input is dropped (fix issue #283)
            if (position === 1 && normalizedLeft === '0' && this.settings.leadingZero === AutoNumeric.options.leadingZero.deny) {
                // If the user enter `0`, then the caret is put on the right side of it (Fix issue #299)
                if (normalizedRight === '' || normalizedLeft === '0' && normalizedRight !== '') {
                    position = 1;
                } else {
                    position = 0;
                }
            }

            AutoNumericHelper.setElementValue(this.domElement, roundedValueToShow);
            this._setCaretPosition(position);

            return true;
        }

        if (!minTest) {
            AutoNumericHelper.triggerEvent(AutoNumeric.events.minRangeExceeded, this.domElement);
        } else if (!maxTest) {
            AutoNumericHelper.triggerEvent(AutoNumeric.events.maxRangeExceeded, this.domElement);
        }

        return false;
    }

    /**
     * Helper function for `_expandSelectionOnSign()`.
     *
     * @returns {Array} Array containing [signPosition, currencySymbolPosition] of a formatted value
     * @private
     */
    _getSignPosition() {
        let result;
        if (this.settings.currencySymbol) {
            const currencySymbolLen = this.settings.currencySymbol.length;
            const value = AutoNumericHelper.getElementValue(this.domElement);
            if (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.prefix) {
                const hasNeg = this.settings.negativeSignCharacter && value && value.charAt(0) === this.settings.negativeSignCharacter;
                if (hasNeg) {
                    result = [1, currencySymbolLen + 1];
                } else {
                    result = [0, currencySymbolLen];
                }
            } else {
                const valueLen = value.length;
                result = [valueLen - currencySymbolLen, valueLen];
            }
        } else {
            result = [1000, -1];
        }

        return result;
    }

    /**
     * Expands selection to cover whole sign
     * Prevents partial deletion/copying/overwriting of a sign
     * @private
     */
    _expandSelectionOnSign() {
        const [signPosition, currencySymbolPosition] = this._getSignPosition();
        const selection = this.selection;

        // If selection catches something except sign and catches only space from sign
        if (selection.start < currencySymbolPosition && selection.end > signPosition) {
            // Then select without empty space
            if ((selection.start < signPosition || selection.end > currencySymbolPosition) &&
                AutoNumericHelper.getElementValue(this.domElement).substring(Math.max(selection.start, signPosition), Math.min(selection.end, currencySymbolPosition))
                    .match(/^\s*$/)) {
                if (selection.start < signPosition) {
                    this._setSelection(selection.start, signPosition);
                } else {
                    this._setSelection(currencySymbolPosition, selection.end);
                }
            } else {
                // Else select with whole sign
                this._setSelection(Math.min(selection.start, signPosition), Math.max(selection.end, currencySymbolPosition));
            }
        }
    }

    /**
     * Try to strip pasted value to digits
     */
    _checkPaste() {
        if (!AutoNumericHelper.isUndefined(this.valuePartsBeforePaste)) {
            const oldParts = this.valuePartsBeforePaste;
            const [left, right] = this._getLeftAndRightPartAroundTheSelection();

            // Try to strip the pasted value first
            delete this.valuePartsBeforePaste;

            const modifiedLeftPart = left.substr(0, oldParts[0].length) + AutoNumeric._stripAllNonNumberCharacters(left.substr(oldParts[0].length), this.settings, true, this.isFocused);
            if (!this._setValueParts(modifiedLeftPart, right, true)) {
                AutoNumericHelper.setElementValue(this.domElement, oldParts.join(''));
                this._setCaretPosition(oldParts[0].length);
            }
        }
    }

    /**
     * Return `true` if the given key should be ignored or not.
     *
     * @param {string} eventKeyName
     * @returns {boolean}
     * @private
     */
    static _shouldSkipEventKey(eventKeyName) {
        const isFnKeys = AutoNumericHelper.isInArray(eventKeyName, AutoNumericEnum.keyName._allFnKeys);
        const isOSKeys = eventKeyName === AutoNumericEnum.keyName.OSLeft || eventKeyName === AutoNumericEnum.keyName.OSRight;
        const isContextMenu = eventKeyName === AutoNumericEnum.keyName.ContextMenu;
        const isSomeNonPrintableKeys = AutoNumericHelper.isInArray(eventKeyName, AutoNumericEnum.keyName._someNonPrintableKeys);
        const isOtherNonPrintableKeys = eventKeyName === AutoNumericEnum.keyName.NumLock ||
            eventKeyName === AutoNumericEnum.keyName.ScrollLock ||
            eventKeyName === AutoNumericEnum.keyName.Insert ||
            eventKeyName === AutoNumericEnum.keyName.Command;
        const isUnrecognizableKeys = eventKeyName === AutoNumericEnum.keyName.Unidentified;

        return isFnKeys || isOSKeys || isContextMenu || isSomeNonPrintableKeys || isUnrecognizableKeys || isOtherNonPrintableKeys;
    }

    /**
     * Process copying, cutting and pasting, as well as undo/redoing and cursor moving.
     * Return `true` if further processing should not be performed.
     *
     * @param {KeyboardEvent} e
     * @returns {boolean}
     * @private
     */
    _processNonPrintableKeysAndShortcuts(e) {
        // Catch the ctrl up on ctrl-v
        if (((e.ctrlKey || e.metaKey) && e.type === 'keyup' && !AutoNumericHelper.isUndefined(this.valuePartsBeforePaste)) || (e.shiftKey && this.eventKey === AutoNumericEnum.keyName.Insert)) {
            //TODO Move this test inside the `onKeyup` handler
            this._checkPaste();

            return false;
        }

        // Skip all function keys (F1-F12), Windows keys, tab and other special keys
        if (this.constructor._shouldSkipEventKey(this.eventKey)) {
            return true;
        }

        // If a "Select all" keyboard shortcut is detected (ctrl + a)
        if ((e.ctrlKey || e.metaKey) && this.eventKey === AutoNumericEnum.keyName.a) {
            if (this.settings.selectNumberOnly) {
                // `preventDefault()` is used here to prevent the browser to first select all the input text (including the currency sign), otherwise we would see that whole selection first in a flash, then the selection with only the number part without the currency sign.
                e.preventDefault();
                //TODO replace `selectNumber` by `select`?
                this.selectNumber();
            }

            return true;
        }

        // If a "Copy", "Paste" or "Cut" keyboard shortcut is detected (respectively 'ctrl + c', 'ctrl + v' or 'ctrl + x')
        if ((e.ctrlKey || e.metaKey) && (this.eventKey === AutoNumericEnum.keyName.c || this.eventKey === AutoNumericEnum.keyName.v || this.eventKey === AutoNumericEnum.keyName.x)) {
            if (e.type === 'keydown') {
                this._expandSelectionOnSign();
            }

            // Try to prevent wrong paste
            if (this.eventKey === AutoNumericEnum.keyName.v || this.eventKey === AutoNumericEnum.keyName.Insert) {
                if (e.type === 'keydown' || e.type === 'keypress') {
                    if (AutoNumericHelper.isUndefined(this.valuePartsBeforePaste)) {
                        this.valuePartsBeforePaste = this._getLeftAndRightPartAroundTheSelection();
                    }
                } else {
                    this._checkPaste();
                }
            }

            return e.type === 'keydown' || e.type === 'keypress' || this.eventKey === AutoNumericEnum.keyName.c;
        }

        if (e.ctrlKey || e.metaKey) {
            if (this.eventKey === AutoNumericEnum.keyName.Z || this.eventKey === AutoNumericEnum.keyName.z) {
                return false;
            } else {
                return true;
            }
        }

        // Jump over the thousand separator
        //TODO Move this test inside the `onKeydown` handler
        if (this.eventKey === AutoNumericEnum.keyName.LeftArrow || this.eventKey === AutoNumericEnum.keyName.RightArrow) {
            if (e.type === 'keydown' && !e.shiftKey) {
                const value = AutoNumericHelper.getElementValue(this.domElement);
                if (this.eventKey === AutoNumericEnum.keyName.LeftArrow &&
                    (value.charAt(this.selection.start - 2) === this.settings.digitGroupSeparator ||
                    value.charAt(this.selection.start - 2) === this.settings.decimalCharacter)) {
                    this._setCaretPosition(this.selection.start - 1);
                } else if (this.eventKey === AutoNumericEnum.keyName.RightArrow &&
                    (value.charAt(this.selection.start + 1) === this.settings.digitGroupSeparator ||
                    value.charAt(this.selection.start + 1) === this.settings.decimalCharacter)) {
                    this._setCaretPosition(this.selection.start + 1);
                }
            }

            return true;
        }

        return AutoNumericHelper.isInArray(this.eventKey, AutoNumericEnum.keyName._directionKeys);
    }

    /**
     * Process deletion of characters when the minus sign is to the right of the numeric characters.
     *
     * @param {string} left The part on the left of the caret or selection
     * @param {string} right The part on the right of the caret or selection
     * @returns {[string, string]}
     * @private
     */
    _processCharacterDeletionIfTrailingNegativeSign([left, right]) {
        const value = AutoNumericHelper.getElementValue(this.domElement);

        if (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.prefix && this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.suffix) {
            if (this.eventKey === AutoNumericEnum.keyName.Backspace) {
                this.caretFix = (this.selection.start >= value.indexOf(this.settings.suffixText) && this.settings.suffixText !== '');
                if (value.charAt(this.selection.start - 1) === '-') {
                    left = left.substring(1);
                } else if (this.selection.start <= value.length - this.settings.suffixText.length) {
                    left = left.substring(0, left.length - 1);
                }
            } else {
                this.caretFix = (this.selection.start >= value.indexOf(this.settings.suffixText) && this.settings.suffixText !== '');
                if (this.selection.start >= value.indexOf(this.settings.currencySymbol) + this.settings.currencySymbol.length) {
                    right = right.substring(1, right.length);
                }
                if (AutoNumericHelper.isNegative(left) && value.charAt(this.selection.start) === '-') {
                    left = left.substring(1);
                }
            }
        }

        if (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix) {
            switch (this.settings.negativePositiveSignPlacement) {
                case AutoNumeric.options.negativePositiveSignPlacement.left:
                    this.caretFix = (this.selection.start >= value.indexOf(this.settings.negativeSignCharacter) + this.settings.negativeSignCharacter.length);
                    if (this.eventKey === AutoNumericEnum.keyName.Backspace) {
                        if (this.selection.start === (value.indexOf(this.settings.negativeSignCharacter) + this.settings.negativeSignCharacter.length) && AutoNumericHelper.contains(value, this.settings.negativeSignCharacter)) {
                            left = left.substring(1);
                        } else if (left !== '-' && ((this.selection.start <= value.indexOf(this.settings.negativeSignCharacter)) || !AutoNumericHelper.contains(value, this.settings.negativeSignCharacter))) {
                            left = left.substring(0, left.length - 1);
                        }
                    } else {
                        if (left[0] === '-') {
                            right = right.substring(1);
                        }
                        if (this.selection.start === value.indexOf(this.settings.negativeSignCharacter) && AutoNumericHelper.contains(value, this.settings.negativeSignCharacter)) {
                            left = left.substring(1);
                        }
                    }
                    break;
                case AutoNumeric.options.negativePositiveSignPlacement.right:
                    this.caretFix = (this.selection.start >= value.indexOf(this.settings.negativeSignCharacter) + this.settings.negativeSignCharacter.length);
                    if (this.eventKey === AutoNumericEnum.keyName.Backspace) {
                        if (this.selection.start === (value.indexOf(this.settings.negativeSignCharacter) + this.settings.negativeSignCharacter.length)) {
                            left = left.substring(1);
                        } else if (left !== '-' && this.selection.start <= (value.indexOf(this.settings.negativeSignCharacter) - this.settings.currencySymbol.length)) {
                            left = left.substring(0, left.length - 1);
                        } else if (left !== '' && !AutoNumericHelper.contains(value, this.settings.negativeSignCharacter)) {
                            left = left.substring(0, left.length - 1);
                        }
                    } else {
                        this.caretFix = (this.selection.start >= value.indexOf(this.settings.currencySymbol) && this.settings.currencySymbol !== '');
                        if (this.selection.start === value.indexOf(this.settings.negativeSignCharacter)) {
                            left = left.substring(1);
                        }

                        right = right.substring(1);
                    }
                    break;
            }
        }

        return [left, right];
    }

    /**
     * Process the deletion of characters.
     */
    _processCharacterDeletion() {
        let left;
        let right;

        if (!this.selection.length) {
            [left, right] = this._getUnformattedLeftAndRightPartAroundTheSelection();
            if (left === '' && right === '') {
                this.throwInput = false;
            }

            if (this.isTrailingNegative && AutoNumericHelper.isNegative(AutoNumericHelper.getElementValue(this.domElement))) {
                [left, right] = this._processCharacterDeletionIfTrailingNegativeSign([left, right]);
            } else {
                if (this.eventKey === AutoNumericEnum.keyName.Backspace) {
                    left = left.substring(0, left.length - 1);
                } else {
                    right = right.substring(1, right.length);
                }
            }
        } else {
            this._expandSelectionOnSign();
            [left, right] = this._getUnformattedLeftAndRightPartAroundTheSelection();
        }

        this._setValueParts(left, right);
    }

    /**
     * Return `true` if a decimal character is allowed to be typed.
     * If the number of decimal places shown on focus is zero, then the decimal character is not allowed.
     *
     * @returns {boolean}
     * @private
     */
    _isDecimalCharacterInsertionAllowed() {
        return this.settings.decimalPlacesShownOnFocus !== AutoNumeric.options.decimalPlacesShownOnFocus.none;
    }

    /**
     * Return `true` if the key is allowed.
     * This function decides if the key pressed should be dropped or accepted, and modify the value 'on-the-fly' accordingly.
     * //TODO This should use another function in order to separate the test and the modification
     *
     * @returns {boolean}
     */
    _processCharacterInsertion() {
        let [left, right] = this._getUnformattedLeftAndRightPartAroundTheSelection();
        if (this.eventKey !== AutoNumericEnum.keyName.AndroidDefault) {
            this.throwInput = true;
        }

        // Start rules when the decimal character key is pressed always use numeric pad dot to insert decimal separator
        // Do not allow decimal character if no decimal part allowed
        if (this.eventKey === this.settings.decimalCharacter ||
            (this.settings.decimalCharacterAlternative && this.eventKey === this.settings.decimalCharacterAlternative) ||
            (this.eventKey === '.' || this.eventKey === ',' || this.eventKey === AutoNumericEnum.keyName.NumpadDot)) {
            if (!this._isDecimalCharacterInsertionAllowed() || !this.settings.decimalCharacter) {
                return true;
            }

            // Do not allow decimal character before negativeSignCharacter character
            if (this.settings.negativeSignCharacter && AutoNumericHelper.contains(right, this.settings.negativeSignCharacter)) {
                return true;
            }

            // Do not allow a decimal character if another decimal character is already present
            if (AutoNumericHelper.contains(left, this.settings.decimalCharacter)) {
                return true;
            }

            if (right.indexOf(this.settings.decimalCharacter) > 0) {
                return true;
            }

            if (right.indexOf(this.settings.decimalCharacter) === 0) {
                right = right.substr(1);
            }

            this._setValueParts(left + this.settings.decimalCharacter, right);

            return true;
        }

        // Prevent entering the minus sign if it's not allowed (Note: `this.settings.negativeSignCharacter` is only set if the minimumValue or maximumValue is lower than zero, allowing negative numbers to be entered)
        if ((this.eventKey === '-' || this.eventKey === '+') && this.settings.negativeSignCharacter === '-') {
            if (left === '' && AutoNumericHelper.contains(right, this.settings.negativeSignCharacter)) {
                // The value is originally negative (with a trailing negative sign)
                right = right.replace(this.settings.negativeSignCharacter, '');
            } else if (AutoNumericHelper.isNegative(left)) {
                // The value is originally negative (with a leading negative sign)
                // Remove the negative sign, effectively converting the value to a positive one
                left = left.replace('-', ''); //TODO replace with '+' if `showPositiveSign`?
            } else {
                // The value is originally positive
                left = this.settings.negativeSignCharacter + left;
            }

            this._setValueParts(left, right);

            return true;
        }

        // If the user tries to insert a digit before the minus sign
        const eventNumber = Number(this.eventKey);
        if (eventNumber >= 0 && eventNumber <= 9) {
            if (this.settings.negativeSignCharacter && left === '' && AutoNumericHelper.contains(right, this.settings.negativeSignCharacter)) {
                left = this.settings.negativeSignCharacter;
                right = right.substring(1, right.length);
            }

            if (this.settings.maximumValue <= 0 && this.settings.minimumValue < this.settings.maximumValue && !AutoNumericHelper.contains(AutoNumericHelper.getElementValue(this.domElement), this.settings.negativeSignCharacter) && this.eventKey !== '0') {
                left = this.settings.negativeSignCharacter + left;
            }

            this._setValueParts(left + this.eventKey, right);

            return true;
        }

        // Prevent any other characters
        this.throwInput = false;

        return false;
    }

    /**
     * Formatting of just processed value while keeping the cursor position
     *
     * @param {Event} e
     * @private
     */
    _formatValue(e) {
        const elementValue = AutoNumericHelper.getElementValue(this.domElement);
        let [left] = this._getUnformattedLeftAndRightPartAroundTheSelection();

        // No grouping separator and no currency sign
        if ((this.settings.digitGroupSeparator  === '' || (this.settings.digitGroupSeparator !== ''  && !AutoNumericHelper.contains(elementValue, this.settings.digitGroupSeparator))) &&
            (this.settings.currencySymbol === '' || (this.settings.currencySymbol !== '' && !AutoNumericHelper.contains(elementValue, this.settings.currencySymbol)))) {
            let [subParts] = elementValue.split(this.settings.decimalCharacter);
            let negativeSign = '';
            if (AutoNumericHelper.isNegative(subParts)) {
                negativeSign = '-';
                subParts = subParts.replace('-', '');
                left = left.replace('-', '');
            }

            // Strip leading zero on positive value if needed
            if (negativeSign === '' && subParts.length > this.settings.mIntPos && left.charAt(0) === '0') {
                left = left.slice(1);
            }

            // Strip leading zero on negative value if needed
            if (negativeSign === '-' && subParts.length > this.settings.mIntNeg && left.charAt(0) === '0') {
                left = left.slice(1);
            }

            left = negativeSign + left;
        }

        const value = this.constructor._addGroupSeparators(elementValue, this.settings, this.isFocused, this.rawValue);
        let position = value.length;
        if (value) {
            // Prepare regexp which searches for cursor position from unformatted left part
            const leftAr = left.split('');

            // Fixes caret position with trailing minus sign
            if ((this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.suffix ||
                (this.settings.negativePositiveSignPlacement !== AutoNumeric.options.negativePositiveSignPlacement.prefix && this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix)) &&
                leftAr[0] === '-' && this.settings.negativeSignCharacter !== '') {
                leftAr.shift();

                if ((this.eventKey === AutoNumericEnum.keyName.Backspace || this.eventKey === AutoNumericEnum.keyName.Delete) &&
                    this.caretFix) {
                    if ((this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix && this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.left) ||
                        (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.prefix && this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.suffix)) {
                        leftAr.push('-');
                        this.caretFix = e.type === 'keydown';
                    }

                    if (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix && this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.right) {
                        const signParts = this.settings.currencySymbol.split('');
                        const escapeChr = ['\\', '^', '$', '.', '|', '?', '*', '+', '(', ')', '['];
                        const escapedParts = [];
                        signParts.forEach((i, miniParts) => {
                            miniParts = signParts[i];
                            if (AutoNumericHelper.isInArray(miniParts, escapeChr)) {
                                escapedParts.push('\\' + miniParts);
                            } else {
                                escapedParts.push(miniParts);
                            }
                        });

                        if (this.eventKey === AutoNumericEnum.keyName.Backspace) {
                            escapedParts.push('-');
                        }

                        // Pushing the escaped sign
                        leftAr.push(escapedParts.join(''));
                        this.caretFix = e.type === 'keydown';
                    }
                }
            }

            for (let i = 0; i < leftAr.length; i++) {
                if (!leftAr[i].match('\\d')) {
                    leftAr[i] = '\\' + leftAr[i];
                }
            }

            const leftReg = new RegExp('^.*?' + leftAr.join('.*?'));

            // Search cursor position in formatted value
            const newLeft = value.match(leftReg);
            if (newLeft) {
                position = newLeft[0].length;

                // If the positive sign is shown, calculate the caret position accordingly
                if (this.settings.showPositiveSign) {
                    if (position === 0 && newLeft.input.charAt(0) === this.settings.positiveSignCharacter) {
                        position = (newLeft.input.indexOf(this.settings.currencySymbol) === 1) ? this.settings.currencySymbol.length + 1 : 1;
                    }

                    if (position === 0 && newLeft.input.charAt(this.settings.currencySymbol.length) === this.settings.positiveSignCharacter) {
                        position = this.settings.currencySymbol.length + 1;
                    }
                }

                // If we are just before the sign which is in prefix position
                if (((position === 0 && value.charAt(0) !== this.settings.negativeSignCharacter) || (position === 1 && value.charAt(0) === this.settings.negativeSignCharacter)) && this.settings.currencySymbol && this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.prefix) {
                    // Place caret after prefix sign
                    //TODO Should the test be 'isNegative' instead of 'isNegativeStrict' in order to search for '-' everywhere in the string?
                    position = this.settings.currencySymbol.length + (AutoNumericHelper.isNegativeStrict(value) ? 1 : 0);
                }
            } else {
                if (this.settings.currencySymbol && this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix) {
                    // If we could not find a place for cursor and have a sign as a suffix
                    // Place caret before suffix currency sign
                    position -= this.settings.currencySymbol.length;
                }

                if (this.settings.suffixText) {
                    // If we could not find a place for cursor and have a suffix
                    // Place caret before suffix
                    position -= this.settings.suffixText.length;
                }
            }
        }

        // Only update the value if it has changed. This prevents modifying the selection, if any.
        if (value !== elementValue ||
            value === elementValue && (this.eventKey === AutoNumericEnum.keyName.num0 || this.eventKey === AutoNumericEnum.keyName.numpad0)) {
            this._setElementValue(value);
            this._setCaretPosition(position);
        }

        if (this.androidSelectionStart !== null) {
            // If an Android browser is detected, fix the caret position
            // Unfortunately this does not fix all android browsers, only Android Chrome currently.
            // This is due to the fact those provide different order of events and/or keycodes thrown (this is a real mess :|).
            this._setCaretPosition(this.androidSelectionStart);
        }

        this.formatted = true; //TODO Rename `this.formatted` to `this._formatExecuted`, since it's possible this function does not need to format anything (in the case where the keycode is dropped for instance)
    }

    /**
     * Serialize the form child <input> element values to a string, or an Array.
     * The output format is defined with the `formatType` argument.
     * This is loosely based upon http://stackoverflow.com/a/40705993/2834898.
     *
     * @param {HTMLFormElement} form
     * @param {boolean} intoAnArray If `true`, instead of generating a string, it generates an Array.
     * @param {string} formatType If `'unformatted'`, then the AutoNumeric elements values are unformatted, if `'localized'`, then the AutoNumeric elements values are localized, and if `'formatted'`, then the AutoNumeric elements values are kept formatted. In either way, this function does not modify the value of each DOM element, but only affect the value that is returned by that serialize function.
     * @param {string} serializedSpaceCharacter Can either be the '+' character, or the '%20' string.
     * @param {string|null} forcedOutputFormat If set, then this is the format that is used for the localization, instead of the default `outputFormat` option.
     * @returns {string|Array}
     * @private
     */
    static _serialize(form, intoAnArray = false, formatType = 'unformatted', serializedSpaceCharacter = '+', forcedOutputFormat = null) {
        const result = [];

        if (typeof form === 'object' && form.nodeName.toLowerCase() === 'form') {
            Array.prototype.slice.call(form.elements).forEach(element => {
                if (element.name &&
                    !element.disabled &&
                    ['file', 'reset', 'submit', 'button'].indexOf(element.type) === -1) {
                    if (element.type === 'select-multiple') {
                        Array.prototype.slice.call(element.options).forEach(option => {
                            if (option.selected) {
                                //TODO Should we unformat/format/localize the selection option (which be default should be read-only)?
                                if (intoAnArray) {
                                    result.push({ name: element.name, value: option.value });
                                } else { // into a string
                                    result.push(`${encodeURIComponent(element.name)}=${encodeURIComponent(option.value)}`);
                                }
                            }
                        });
                    } else if (['checkbox', 'radio'].indexOf(element.type) === -1 || element.checked) {
                        let valueResult;
                        if (this.isManagedByAutoNumeric(element)) {
                            let anObject;
                            switch (formatType) {
                                case 'unformatted':
                                    anObject = this.getAutoNumericElement(element);
                                    if (!AutoNumericHelper.isNull(anObject)) {
                                        valueResult = this.unformat(element, anObject.getSettings());
                                    }
                                    break;
                                case 'localized':
                                    anObject = this.getAutoNumericElement(element);
                                    if (!AutoNumericHelper.isNull(anObject)) {
                                        // Here I need to clone the setting object, otherwise I would modify it when changing the `outputFormat` option value
                                        const currentSettings = AutoNumericHelper.cloneObject(anObject.getSettings());
                                        if (!AutoNumericHelper.isNull(forcedOutputFormat)) {
                                            currentSettings.outputFormat = forcedOutputFormat;
                                        }

                                        valueResult = this.localize(element, currentSettings);
                                    }
                                    break;
                                case 'formatted':
                                default:
                                    valueResult = element.value;
                            }
                        } else {
                            valueResult = element.value;
                        }

                        if (AutoNumericHelper.isUndefined(valueResult)) {
                            AutoNumericHelper.throwError('This error should never be hit. If it has, something really wrong happened!');
                        }

                        if (intoAnArray) {
                            result.push({ name: element.name, value: valueResult });
                        } else { // into a string
                            result.push(`${encodeURIComponent(element.name)}=${encodeURIComponent(valueResult)}`);
                        }
                    }
                }
            });
        }

        let finalResult;

        if (intoAnArray) {
            // Result as an Array
            // Note: `serializedSpaceCharacter` does not affect the array result since we do not change the space character for this one
            finalResult = result;
        } else {
            // Result as a string
            finalResult = result.join('&');

            if ('+' === serializedSpaceCharacter) {
                finalResult = finalResult.replace(/%20/g, '+');
            }
        }

        return finalResult;
    }

    /**
     * Serialize the form values to a string, outputting numeric strings for each AutoNumeric-managed element values.
     *
     * @param {HTMLFormElement} form
     * @param {string} serializedSpaceCharacter
     * @returns {string}
     */
    static _serializeNumericString(form, serializedSpaceCharacter = '+') {
        return this._serialize(form, false, 'unformatted', serializedSpaceCharacter);
    }

    /**
     * Serialize the form values to a string, outputting the formatted value as strings for each AutoNumeric-managed elements.
     *
     * @param {HTMLFormElement} form
     * @param {string} serializedSpaceCharacter
     * @returns {string}
     */
    static _serializeFormatted(form, serializedSpaceCharacter = '+') {
        return this._serialize(form, false, 'formatted', serializedSpaceCharacter);
    }

    /**
     * Serialize the form values to a string, outputting localized strings for each AutoNumeric-managed element values.
     *
     * @param {HTMLFormElement} form
     * @param {string} serializedSpaceCharacter
     * @param {string|null} forcedOutputFormat If set, then this is the format that is used for the localization, instead of the default `outputFormat` option.
     * @returns {string}
     */
    static _serializeLocalized(form, serializedSpaceCharacter = '+', forcedOutputFormat = null) {
        return this._serialize(form, false, 'localized', serializedSpaceCharacter, forcedOutputFormat);
    }

    /**
     * Generate an Array with the form values, outputting numeric strings for each AutoNumeric-managed element values.
     *
     * @param {HTMLFormElement} form
     * @param {string} serializedSpaceCharacter
     * @returns {Array}
     */
    static _serializeNumericStringArray(form, serializedSpaceCharacter = '+') {
        return this._serialize(form, true, 'unformatted', serializedSpaceCharacter);
    }

    /**
     * Generate an Array with the form values, outputting the formatted value as strings for each AutoNumeric-managed elements.
     *
     * @param {HTMLFormElement} form
     * @param {string} serializedSpaceCharacter
     * @returns {Array}
     */
    static _serializeFormattedArray(form, serializedSpaceCharacter = '+') {
        return this._serialize(form, true, 'formatted', serializedSpaceCharacter);
    }

    /**
     * Generate an Array with the form values, outputting localized strings for each AutoNumeric-managed element values.
     *
     * @param {HTMLFormElement} form
     * @param {string} serializedSpaceCharacter
     * @param {string|null} forcedOutputFormat If set, then this is the format that is used for the localization, instead of the default `outputFormat` option.
     * @returns {Array}
     */
    static _serializeLocalizedArray(form, serializedSpaceCharacter = '+', forcedOutputFormat = null) {
        return this._serialize(form, true, 'localized', serializedSpaceCharacter, forcedOutputFormat);
    }
}

/**
 * Initialize multiple DOM elements in one call (and possibly pass multiple values that will be mapped to each DOM element).
 *
 * @example
 * // Init multiple DOM elements in one call (and possibly pass multiple values that will be mapped to each DOM element)
 * [anElement1, anElement2, anElement3] = AutoNumeric.multiple([domElement1, domElement2, domElement3], { options });
 * [anElement1, anElement2, anElement3] = AutoNumeric.multiple([domElement1, domElement2, domElement3], [{ options }, 'euroPos']);
 * [anElement1, anElement2, anElement3] = AutoNumeric.multiple([domElement1, domElement2, domElement3], 12345.789, { options });
 * [anElement1, anElement2, anElement3] = AutoNumeric.multiple([domElement1, domElement2, domElement3], 12345.789, [{ options }, 'euroPos']);
 * [anElement1, anElement2, anElement3] = AutoNumeric.multiple.french([domElement1, domElement2, domElement3], [12345.789, 234.78, null], { options });
 * [anElement1, anElement2, anElement3] = AutoNumeric.multiple.french([domElement1, domElement2, domElement3], [12345.789, 234.78, null], [{ options }, 'euroPos']);
 *
 * // Special case, if a <form> element is passed (or any other 'parent' (or 'root') DOM element), then autoNumeric will initialize each child `<input>` elements recursively, ignoring those referenced in the `exclude` attribute
 * [anElement1, anElement2] = AutoNumeric.multiple({ rootElement: formElement }, { options });
 * [anElement1, anElement2] = AutoNumeric.multiple({ rootElement: formElement, exclude : [hiddenElement, tokenElement] }, { options });
 * [anElement1, anElement2] = AutoNumeric.multiple({ rootElement: formElement, exclude : [hiddenElement, tokenElement] }, [12345.789, null], { options });
 *
 * // If you want to select multiple elements via a css selector, then you must use the `multiple` function. Under the hood `QuerySelectorAll` is used.
 * [anElement1, anElement2] = AutoNumeric.multiple('.myCssClass > input', { options }); // This always return an Array, even if there is only one element selected
 * [anElement1, anElement2] = AutoNumeric.multiple('.myCssClass > input', [null, 12345.789], { options }); // Idem above, but with passing the initial values too
 *
 * @param {string|Array|{ rootElement: HTMLElement }|{ rootElement: HTMLElement, exclude: Array<HTMLInputElement>}} arg1
 * @param {number|Array|object|null} initialValue
 * @param {object|Array|null} options
 * @returns {Array}
 */
AutoNumeric.multiple = (arg1, initialValue = null, options = null) => {
    const result = [];

    // Analyze the arguments and transform them to make them exploitable
    if (AutoNumericHelper.isObject(initialValue)) {
        // If the user gave an option object as the second argument, instead of the initial values
        options = initialValue;
        initialValue = null;
    }

    if (AutoNumericHelper.isString(arg1)) {
        arg1 = [... document.querySelectorAll(arg1)]; // Convert a NodeList to an Array (cf. http://stackoverflow.com/a/37297292/2834898)
    } else if (AutoNumericHelper.isObject(arg1)) {
        if (!arg1.hasOwnProperty('rootElement')) {
            AutoNumericHelper.throwError(`The object passed to the 'multiple' function is invalid ; no 'rootElement' attribute found.`);
        }

        // Retrieve the DOM element list from the given <form> element
        const elements = [... arg1.rootElement.querySelectorAll('input')];
        if (arg1.hasOwnProperty('exclude')) {
            if (!Array.isArray(arg1.exclude)) {
                AutoNumericHelper.throwError(`The 'exclude' array passed to the 'multiple' function is invalid.`);
            }

            // Filter out the excluded elements
            arg1 = AutoNumericHelper.filterOut(elements, arg1.exclude);
        } else {
            arg1 = elements;
        }
    } else if (!AutoNumericHelper.isArray(arg1)) {
        AutoNumericHelper.throwError(`The given parameters to the 'multiple' function are invalid.`);
    }

    if (arg1.length === 0) {
        let showWarnings = true;
        if (!AutoNumericHelper.isNull(options) && AutoNumericHelper.isBoolean(options.showWarnings)) {
            showWarnings = options.showWarnings;
        }

        AutoNumericHelper.warning(`No valid DOM elements were given hence no AutoNumeric object were instantiated.`, showWarnings);

        return [];
    }

    // At this point, we know `arg1` is an array of DOM elements

    // This function can be initialized with two types of array, one for the initial values, and/or one for the options.
    // So we need to find out if an array is detected if the user passed an array of initial values, or an array of options
    // Therefore, we analyze the content of the arrays for the second and third arguments
    // ...for the second parameter :
    const isInitialValueArray = AutoNumericHelper.isArray(initialValue);
    const isInitialValueArrayAndNotEmpty = isInitialValueArray && initialValue.length >= 1;
    let secondArgumentIsInitialValueArray = false;
    let secondArgumentIsOptionArray = false;
    // Any of the arrays can be either an array of initial values, or an array of option object/pre-defined option names
    if (isInitialValueArrayAndNotEmpty) {
        const typeOfFirstArrayElement = typeof Number(initialValue[0]);
        // First we test the second argument
        secondArgumentIsInitialValueArray = typeOfFirstArrayElement === 'number' && !isNaN(Number(initialValue[0]));

        if (!secondArgumentIsInitialValueArray) {
            // If the second argument is an array, but not an array of values, check if it's instead an array of options/pre-defined option names
            if (typeOfFirstArrayElement === 'string' || isNaN(typeOfFirstArrayElement) || typeOfFirstArrayElement === 'object') {
                secondArgumentIsOptionArray = true;
            }
        }
    }

    // ...for the third parameter :
    const isOptionsArrayAndNotEmpty = AutoNumericHelper.isArray(options) && options.length >= 1;
    let thirdArgumentIsOptionArray = false;
    if (isOptionsArrayAndNotEmpty) {
        const typeOfFirstArrayElement = typeof options[0];
        if (typeOfFirstArrayElement === 'string' || typeOfFirstArrayElement === 'object') {
            // If the third argument is an array of options/pre-defined option names
            thirdArgumentIsOptionArray = true;
        }
    }

    // Depending of our findings, we generate the options variable to use `optionsToUse`, either directly, or merged
    let optionsToUse;
    if (secondArgumentIsOptionArray) {
        optionsToUse = AutoNumeric.mergeOptions(initialValue);
    } else if (thirdArgumentIsOptionArray) {
        optionsToUse = AutoNumeric.mergeOptions(options);
    } else {
        optionsToUse = options;
    }


    // Initialize the initial values
    const isInitialValueNumber = AutoNumericHelper.isNumber(initialValue);
    let initialValueArraySize;
    if (secondArgumentIsInitialValueArray) {
        initialValueArraySize = initialValue.length;
    }

    // Instantiate each AutoNumeric objects
    arg1.forEach((domElement, index) => {
        if (isInitialValueNumber) {
            // We set the same value for each elements
            result.push(new AutoNumeric(domElement, initialValue, optionsToUse));
        } else if (secondArgumentIsInitialValueArray && index <= initialValueArraySize) {
            result.push(new AutoNumeric(domElement, initialValue[index], optionsToUse));
        } else {
            result.push(new AutoNumeric(domElement, null, optionsToUse));
        }
    });

    return result;
};

/**
 * Polyfill from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent for obsolete browsers (IE)
 * //TODO Make sure we call that at least once when loading the AutoNumeric library
 */
(function() {
if (typeof window.CustomEvent === 'function') {
    return false;
}

function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: void(0) };
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
}

CustomEvent.prototype = window.Event.prototype;
window.CustomEvent = CustomEvent;
})();


/**
 * //XXX This is needed in order to get direct access to the `AutoNumeric` constructor without having to use `new AutoNumeric.default()` (cf. http://stackoverflow.com/a/36389244/2834898) : using `export var __useDefault = true;` does not work though.
 * //XXX The workaround (using `module.exports = AutoNumeric` instead of `export default class AutoNumeric {}`) comes from https://github.com/webpack/webpack/issues/706#issuecomment-167908576
 * //XXX And the explanation why Babel 6 changed the way Babel 5 worked : http://stackoverflow.com/a/33506169/2834898
 * //XXX Ideally, we should be able to just declare `export default class AutoNumeric {}` in the future, and remove the following `module.exports = AutoNumeric;` line
 *
 * @type {AutoNumeric}
 */
module.exports = AutoNumeric;
