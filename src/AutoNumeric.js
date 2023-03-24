/**
 *               AutoNumeric.js
 *
 * @version      4.8.1
 * @date         2023-03-24 UTC 07:46
 *
 * @authors      2016-2023 Alexandre Bonneau <alexandre.bonneau@linuxfr.eu>
 *               2009-2016 Bob Knothe <bob.knothe@gmail.com>
 * @contributors Sokolov Yura and others, cf. AUTHORS
 * @copyright    2009 Robert J. Knothe
 * @since        2009-08-09
 *
 * @summary      autoNumeric is a standalone Javascript library
 *               that provides live *as-you-type* formatting for
 *               international numbers and currencies.
 *
 * @link         http://autonumeric.org
 * @docs         https://docs.autonumeric.org
 *
 *               Note : Some functions are borrowed from big.js
 * @see          https://github.com/MikeMcl/big.js/
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

//TODO Prevent having to enter relative path in the js files (i.e. using `./AutoNumericHelper` instead of just `AutoNumericHelper`) (cf. http://moduscreate.com/es6-es2015-import-no-relative-path-webpack/)
import AutoNumericHelper from './AutoNumericHelper';
import AutoNumericEnum   from './AutoNumericEnum';
import Evaluator         from './maths/Evaluator';
import Parser            from './maths/Parser';

/**
 * Class declaration for the AutoNumeric object.
 *
 * An AutoNumeric element is an object wrapper that keeps a reference to the DOM element it manages (usually an <input> one), and provides autoNumeric-specific variables and functions.
 */
export default class AutoNumeric {
    static options; // Those static declarations are only used by the IDE, to prevent error messages not finding those fields declarations
    static events;
    static defaultSettings;
    static predefinedOptions;

    /**
     * Return the autoNumeric version number (for debugging purpose)
     *
     * @returns {string}
     */
    static version() {
        return '4.8.1';
    }

    /**
     * Initialize the AutoNumeric object onto the given DOM element, and attach the settings and related event listeners to it.
     * The options passed as a parameter is an object that contains the settings (i.e. {digitGroupSeparator: ".", decimalCharacter: ",", currencySymbol: '€ '})
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
        // Note: This variable is needed and not a duplicate of `initialValueOnFirstKeydown` nor `valueOnFocus` since it serves a different purpose and has a different lifecycle
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
        } else {
            // Otherwise set the `rawValue` and the element value, but do not format the latter yet
            let valueToSet;
            if (AutoNumericHelper.isNull(initialValue)) {
                switch (this.settings.emptyInputBehavior) {
                    case AutoNumeric.options.emptyInputBehavior.min:
                        valueToSet = this.settings.minimumValue;
                        break;
                    case AutoNumeric.options.emptyInputBehavior.max:
                        valueToSet = this.settings.maximumValue;
                        break;
                    case AutoNumeric.options.emptyInputBehavior.zero:
                        valueToSet = '0';
                        break;
                    // In order to stay consistent when `formatOnPageLoad` is set to `true`, it's still impossible to set the `null` value as the initial value
                    case AutoNumeric.options.emptyInputBehavior.focus:
                    case AutoNumeric.options.emptyInputBehavior.press:
                    case AutoNumeric.options.emptyInputBehavior.always:
                    case AutoNumeric.options.emptyInputBehavior.null:
                        valueToSet = '';
                        break;
                    // When `emptyInputBehavior` is a number or a string representing a number
                    default :
                        valueToSet = this.settings.emptyInputBehavior;
                }
            } else {
                valueToSet = initialValue;
            }

            this._setElementAndRawValue(valueToSet);
        }

        this.runOnce = true;

        // Add the events listeners only on input or editable elements
        this.hasEventListeners = false;
        if (this.isInputElement || this.isContentEditable) {
            if (!this.settings.noEventListeners) {
                //XXX Here we make sure the global list is created after creating the event listeners, to only create the event listeners on `document` once
                this._createEventListeners();
            }

            this._setWritePermissions(true);
        }

        // Save the initial values (html attribute + element.value) for the pristine test
        this._saveInitialValues(initialValue);
        
        // Set up the data for the persistent storage solution (i.e. sessionStorage or cookies)
        this.sessionStorageAvailable = this.constructor._storageTest();
        this.storageNamePrefix = 'AUTO_'; // The prefix for the raw value storage name variable can be modified here
        this._setPersistentStorageName();

        // --------------------------------------------------------
        // -------------- Tracking
        this.validState = true; // Keep track if the element is in the valid state
        this.isFocused = false; // Keep track if the element is currently focused
        this.isWheelEvent = false; // Keep track if a mouse wheel event is currently ongoing
        this.isDropEvent = false; // Keep track if a drop event is currently ongoing
        this.isEditing = false; // Keep track if the user is currently editing the element
        this.rawValueOnFocus = void(0); // Keep track of the rawValue (needed to define if a change event must be sent on blur or enter key)
        // Watch any external changes to the element value/textContent/nodeValue and `set()` the new value so that it gets formatted/saved in the history
        this.internalModification = false; // This is temporarily set to `true` only when the AutoNumeric object does update the element value
        this.attributeToWatch = this._getAttributeToWatch();
        this.getterSetter = Object.getOwnPropertyDescriptor(this.domElement.__proto__, this.attributeToWatch);
        this._addWatcher();

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
             * Set the same given element value for each element in the local AutoNumeric element list, and format those elements immediately
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
             * This sets the same unformatted value for each element in the local AutoNumeric element list.
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
             * Remove the formatting and keep only the raw unformatted value (as a numericString) in each element of the local AutoNumeric element list
             */
            unformat: () => {
                this.autoNumericLocalList.forEach(aNObject => {
                    aNObject.unformat();
                });
            },

            /**
             * Remove the formatting and keep only the localized unformatted value in the element, with the option to override the default outputFormat if needed
             *
             * @param {null|string} forcedOutputFormat If set to something different from `null`, then this is used as an overriding outputFormat option
             */
            unformatLocalized: (forcedOutputFormat = null) => {
                this.autoNumericLocalList.forEach(aNObject => {
                    aNObject.unformatLocalized(forcedOutputFormat);
                });
            },

            /**
             * Updates the AutoNumeric settings, and immediately format the elements accordingly, for each element of the local AutoNumeric element list
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
                    otherAutoNumericObject = AutoNumeric.getAutoNumericElement(domElement);
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
                    otherAutoNumericObject = AutoNumeric.getAutoNumericElement(domElement);
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
         * For each option, we define if we need to reformat the element content (does changing the options should change the way its value is displayed?).
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
            alwaysAllowDecimalCharacter  : alwaysAllowDecimalCharacter => { //FIXME Test this
                this.update({ alwaysAllowDecimalCharacter });

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
            eventBubbles                 : eventBubbles => {
                this.settings.eventBubbles = eventBubbles;

                return this;
            },
            eventIsCancelable            : eventIsCancelable => {
                this.settings.eventIsCancelable = eventIsCancelable;

                return this;
            },
            failOnUnknownOption          : failOnUnknownOption => {
                this.settings.failOnUnknownOption = failOnUnknownOption; //TODO test this with unit tests

                return this;
            },
            formatOnPageLoad             : formatOnPageLoad => {
                this.settings.formatOnPageLoad = formatOnPageLoad; //TODO test this with unit tests

                return this;
            },
            formulaMode                  : formulaMode => {
                this.settings.formulaMode = formulaMode; //TODO test this with unit tests

                return this;
            },
            historySize                  : historySize => {
                this.settings.historySize = historySize;

                return this;
            },
            invalidClass                 : invalidClass => {
                this.settings.invalidClass = invalidClass; //TODO test this with unit tests

                return this;
            },
            isCancellable                : isCancellable => {
                this.settings.isCancellable = isCancellable; //TODO test this with unit tests

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
            modifyValueOnUpDownArrow     : modifyValueOnUpDownArrow => {
                this.settings.modifyValueOnUpDownArrow = modifyValueOnUpDownArrow; //TODO test this with unit tests

                return this;
            },
            modifyValueOnWheel           : modifyValueOnWheel => {
                this.settings.modifyValueOnWheel = modifyValueOnWheel; //TODO test this with unit tests

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
            negativeSignCharacter        : negativeSignCharacter => {
                this.update({ negativeSignCharacter });

                return this;
            },
            negativePositiveSignBehavior : negativePositiveSignBehavior => {
                this.settings.negativePositiveSignBehavior = negativePositiveSignBehavior; //TODO test this with unit tests

                return this;
            },
            noEventListeners             : noEventListeners => { //TODO test this with unit tests
                if (noEventListeners === AutoNumeric.options.noEventListeners.noEvents && this.settings.noEventListeners === AutoNumeric.options.noEventListeners.addEvents) {
                    // Remove the events once
                    this._removeEventListeners();
                }

                this.update({ noEventListeners });

                return this;
            },
            onInvalidPaste               : onInvalidPaste => {
                this.settings.onInvalidPaste = onInvalidPaste; //TODO test this with unit tests

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
            positiveSignCharacter        : positiveSignCharacter => {
                this.update({ positiveSignCharacter });

                return this;
            },
            rawValueDivisor              : rawValueDivisor => {
                this.update({ rawValueDivisor });

                return this;
            },
            readOnly                     : readOnly => {
                // When changing the readOnly attribute, the raw and formatted values do not change, so no need to call the costly 'update()` method
                this.settings.readOnly = readOnly;
                this._setWritePermissions();

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
                this.settings.selectNumberOnly = selectNumberOnly; //TODO test this with unit tests

                return this;
            },
            selectOnFocus                : selectOnFocus => {
                this.settings.selectOnFocus = selectOnFocus; //TODO test this with unit tests

                return this;
            },
            serializeSpaces              : serializeSpaces => {
                this.settings.serializeSpaces = serializeSpaces; //TODO test this with unit tests

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
                this.settings.showWarnings = showWarnings; //TODO test this with unit tests

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
                this.settings.unformatOnHover = unformatOnHover; //TODO test this with unit tests

                return this;
            },
            unformatOnSubmit             : unformatOnSubmit => {
                this.settings.unformatOnSubmit = unformatOnSubmit; //TODO test this with unit tests

                return this;
            },
            upDownStep                   : upDownStep => {
                this.settings.upDownStep = upDownStep; //TODO test this with unit tests

                return this;
            },
            valuesToStrings              : valuesToStrings => {
                this.update({ valuesToStrings });

                return this;
            },
            watchExternalChanges         : watchExternalChanges => { //TODO test this with unit tests
                this.update({ watchExternalChanges });

                return this;
            },
            wheelOn                      : wheelOn => {
                this.settings.wheelOn = wheelOn; //TODO test this with unit tests

                return this;
            },
            wheelStep                    : wheelStep => {
                this.settings.wheelStep = wheelStep; //TODO test this with unit tests

                return this;
            },
        };

        // Once the autoNumeric element has been initialized, broadcast that message with additional info.
        // Note: When using `AutoNumeric.multiple()`, one event is sent *per* element initialized
        this._triggerEvent(AutoNumeric.events.initialized, this.domElement, {
            newValue   : AutoNumericHelper.getElementValue(this.domElement),
            newRawValue: this.rawValue,
            error      : null,
            aNElement  : this,
        });
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
        } else if (isArg1String && isArg2Number && isArg3Array) {
            // new AutoNumeric('.myCssClass > input', 12345.789, [{ options1 }, 'euroPos', { options2 }]);
            // new AutoNumeric('.myCssClass > input', '12345.789', [{ options1 }, 'euroPos', { options2 }]);
            // new AutoNumeric('.myCssClass > input', '', [{ options1 }, 'euroPos', { options2 }]);
            domElement = document.querySelector(arg1);
            initialValue = arg2;
            userOptions = this.mergeOptions(arg3);
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
        return Object.prototype.hasOwnProperty.call(AutoNumeric.predefinedOptions, preDefinedOptionName);
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
     * - the html attribute (i.e. <input value='42'>), and
     * - the script `value` (i.e. `let domElement.value`)
     *
     * @param {null|number|string} initialValue
     * @private
     */
    _saveInitialValues(initialValue) {
        // Keep the very first initial values (in the html attribute and set by the script). This is needed to check if the element is pristine.
        // Save the html attribute 'value'
        this.initialValueHtmlAttribute = AutoNumericHelper.scientificToDecimal(this.domElement.getAttribute('value'));
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
        this.formulaMode = false;
        // Create references to the event handler functions, so we can then cleanly remove those listeners if needed
        // That would not be possible if we used closures directly in the event handler declarations
        this._onFocusInFunc = e => { this._onFocusIn(e); };
        this._onFocusInAndMouseEnterFunc = e => { this._onFocusInAndMouseEnter(e); };
        this._onFocusFunc = () => { this._onFocus(); };
        this._onKeydownFunc = e => { this._onKeydown(e); };
        this._onKeypressFunc = e => { this._onKeypress(e); };
        this._onKeyupFunc = e => { this._onKeyup(e); };
        this._onFocusOutAndMouseLeaveFunc = e => { this._onFocusOutAndMouseLeave(e); };
        this._onPasteFunc = e => { this._onPaste(e); };
        this._onWheelFunc = e => { this._onWheel(e); };
        this._onDropFunc = e => { this._onDrop(e); };
        this._onKeydownGlobalFunc = e => { this._onKeydownGlobal(e); };
        this._onKeyupGlobalFunc = e => { this._onKeyupGlobal(e); };

        // Add the event listeners
        this.domElement.addEventListener('focusin', this._onFocusInFunc, false);
        this.domElement.addEventListener('focus', this._onFocusInAndMouseEnterFunc, false);
        this.domElement.addEventListener('focus', this._onFocusFunc, false);
        this.domElement.addEventListener('mouseenter', this._onFocusInAndMouseEnterFunc, false);
        this.domElement.addEventListener('keydown', this._onKeydownFunc, false);
        this.domElement.addEventListener('keypress', this._onKeypressFunc, false);
        this.domElement.addEventListener('keyup', this._onKeyupFunc, false);
        this.domElement.addEventListener('blur', this._onFocusOutAndMouseLeaveFunc, false);
        this.domElement.addEventListener('mouseleave', this._onFocusOutAndMouseLeaveFunc, false);
        this.domElement.addEventListener('paste', this._onPasteFunc, false);
        this.domElement.addEventListener('wheel', this._onWheelFunc, false);
        this.domElement.addEventListener('drop', this._onDropFunc, false);
        this._setupFormListener();

        // Keep track if the event listeners have been initialized on this object
        this.hasEventListeners = true;

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
    _removeEventListeners() {
        this.domElement.removeEventListener('focusin', this._onFocusInFunc, false);
        this.domElement.removeEventListener('focus', this._onFocusInAndMouseEnterFunc, false);
        this.domElement.removeEventListener('focus', this._onFocusFunc, false);
        this.domElement.removeEventListener('mouseenter', this._onFocusInAndMouseEnterFunc, false);
        this.domElement.removeEventListener('blur', this._onFocusOutAndMouseLeaveFunc, false);
        this.domElement.removeEventListener('mouseleave', this._onFocusOutAndMouseLeaveFunc, false);
        this.domElement.removeEventListener('keydown', this._onKeydownFunc, false);
        this.domElement.removeEventListener('keypress', this._onKeypressFunc, false);
        this.domElement.removeEventListener('keyup', this._onKeyupFunc, false);
        this.domElement.removeEventListener('paste', this._onPasteFunc, false);
        this.domElement.removeEventListener('wheel', this._onWheelFunc, false);
        this.domElement.removeEventListener('drop', this._onDropFunc, false);
        this._removeFormListener();

        // Keep track if the event listeners have been initialized on this object
        this.hasEventListeners = false;

        document.removeEventListener('keydown', this._onKeydownGlobalFunc, false);
        document.removeEventListener('keyup', this._onKeyupGlobalFunc, false);
    }

    /**
     * Toggle the event listeners according to the `noEventListeners` option, if those were not activated/deactivated before
     * @private
     */
    _updateEventListeners() {
        if (!this.settings.noEventListeners && !this.hasEventListeners) {
            // Special case where an update is done on an element that did not activate its event listeners in the first place
            // i.e. when an element is first created with `contenteditable="false"`, then an update is done with `anElement.french()`
            this._createEventListeners();
        }

        if (this.settings.noEventListeners && this.hasEventListeners) {
            this._removeEventListeners();
        }
    }

    /**
     * Mark the parent <form> so that other AutoNumeric object will not add more listeners.
     * Add a counter so that when removing the AutoNumeric object, we only remove the submit listener if that count is equal to 0.
     * Also keep a reference to the 'submit' event handler function to be able to remove that handler later if the `_removeFormListener()` function is called from another AutoNumeric object.
     *
     * @private
     */
    _setupFormListener() {
        if (!AutoNumericHelper.isNull(this.parentForm)) {
            // Set up the handler function
            this._onFormSubmitFunc = () => { this._onFormSubmit(); };
            this._onFormResetFunc = () => { this._onFormReset(); };

            // Check if the parent form already has the AutoNumeric mark
            if (this._hasParentFormCounter()) {
                this._incrementParentFormCounter();
            } else {
                // If not, add the counter
                this._initializeFormCounterToOne();
                // And add the submit and reset event listeners
                this.parentForm.addEventListener('submit', this._onFormSubmitFunc, false);
                this.parentForm.addEventListener('reset', this._onFormResetFunc, false);
                // Also keep a reference to the handler function so that we can remove it later
                this._storeFormHandlerFunction();
            }
        }
    }

    /**
     * Remove the form 'submit' event listener, as well as the `dataset` info (`anCount` and `anFormHandler`) from the parent form, only when there are only one AutoNumeric child element left in that <form>.
     * Otherwise, decrement the `anCount`.
     *
     * @private
     */
    _removeFormListener() {
        if (!AutoNumericHelper.isNull(this.parentForm)) {
            // Check the parent form counter value
            const anCount = this._getParentFormCounter();

            if (anCount === 1) {
                // If it's 1, remove the listeners
                this.parentForm.removeEventListener('submit', this._getFormHandlerFunction().submitFn, false);
                this.parentForm.removeEventListener('reset', this._getFormHandlerFunction().resetFn, false);
                // Also remove the dataset info
                this._removeFormDataSetInfo();
            } else if (anCount > 1) {
                // Otherwise if it's >1 decrement the counter
                this._decrementParentFormCounter();
            } else {
                // If it's <1, throw an error
                AutoNumericHelper.throwError(`The AutoNumeric object count on the form is incoherent.`);
            }
        }
    }

    /**
     * Return `true` if the parent form has the form counter attribute
     *
     * @returns {boolean}
     * @private
     */
    _hasParentFormCounter() {
        return 'anCount' in this.parentForm.dataset;
    }

    /**
     * Return the count of AutoNumeric form children
     *
     * @returns {number}
     * @private
     */
    _getParentFormCounter() {
        return Number(this.parentForm.dataset.anCount);
    }

    /**
     * Set the count of AutoNumeric form children to 1 for the given form element, or if none are passed, the current `this.parentForm` one.
     *
     * @param {HTMLFormElement|null} formElement
     * @private
     */
    _initializeFormCounterToOne(formElement = null) {
        this._getFormElement(formElement).dataset.anCount = 1;
    }

    /**
     * Increment the AutoNumeric form children count for the given form element, or if none are passed, the current `this.parentForm` one.
     *
     * @param {HTMLFormElement|null} formElement
     * @private
     */
    _incrementParentFormCounter(formElement = null) {
        this._getFormElement(formElement).dataset.anCount++;
    }

    /**
     * Decrement the AutoNumeric form children count for the current `this.parentForm` form element.
     *
     * @private
     */
    _decrementParentFormCounter() {
        this.parentForm.dataset.anCount--;
    }

    /**
     * Return `true` if the global form handler list exists on the `window` object.
     *
     * @returns {boolean}
     * @private
     */
    static _doesFormHandlerListExists() {
        const type = typeof window.aNFormHandlerMap;

        return type !== 'undefined' && type === 'object';
    }

    /**
     * Create the global form handler list on the `window` object.
     *
     * @private
     */
    static _createFormHandlerList() {
        window.aNFormHandlerMap = new Map(); // I would have used a `WeakMap` here, but that does not allow using non-object for keys
    }

    /**
     * Return `true` if the given form element, or if none are passed, the current `this.parentForm` one has a form handler name.
     *
     * @param {HTMLFormElement|null} formElement
     * @returns {boolean}
     * @private
     */
    _hasFormHandlerFunction(formElement = null) {
        return 'anFormHandler' in this._getFormElement(formElement).dataset;
    }

    /**
     * Return the given form element, or defaults to `this.parentForm` if no argument is passed.
     *
     * @param {HTMLFormElement|null} formElement
     * @returns {*}
     * @private
     */
    _getFormElement(formElement = null) {
        let formElementToUse;
        if (!AutoNumericHelper.isNull(formElement)) {
            formElementToUse = formElement;
        } else {
            formElementToUse = this.parentForm;
        }

        return formElementToUse;
    }

    /**
     * Generate a form handler unique name and store it in the global form handler list.
     * This also save that name in the dataset of the given form element.
     *
     * @param {HTMLFormElement|null} formElement
     * @private
     */
    _storeFormHandlerFunction(formElement = null) {
        // Create the weakMap if it does not exist
        if (!this.constructor._doesFormHandlerListExists()) {
            this.constructor._createFormHandlerList();
        }

        // Generate a unique name and save it in the form dataset
        const formHandlerName = AutoNumericHelper.randomString();
        this._getFormElement(formElement).dataset.anFormHandler = formHandlerName;

        // Add the form handler name and handle function reference to the WeakMap
        window.aNFormHandlerMap.set(formHandlerName, { submitFn: this._onFormSubmitFunc, resetFn: this._onFormResetFunc });
    }

    /**
     * Return the form handler key name from the parent form element, for the global form handler list.
     *
     * @returns {string|*}
     * @private
     */
    _getFormHandlerKey() {
        if (!this._hasFormHandlerFunction()) {
            AutoNumericHelper.throwError(`Unable to retrieve the form handler name`);
        }

        const formHandlerName = this.parentForm.dataset.anFormHandler;
        if (formHandlerName === '') {
            AutoNumericHelper.throwError(`The form handler name is invalid`);
        }

        return formHandlerName;
    }

    /**
     * Return the 'submit' event handler function used for the parent form.
     *
     * @returns {function}
     * @private
     */
    _getFormHandlerFunction() {
        const formHandlerName = this._getFormHandlerKey();

        return window.aNFormHandlerMap.get(formHandlerName);
    }

    /**
     * Remove the dataset attributes `data-an-count` and `data-an-form-handler` from the parent form element.
     *
     * @private
     */
    _removeFormDataSetInfo() {
        // Just in case, set the counter to 0
        this._decrementParentFormCounter();
        // Remove the form handler function from the FormHandlerFunction Map
        window.aNFormHandlerMap.delete(this._getFormHandlerKey());
        // Lastly, remove the dataset attributes
        this.parentForm.removeAttribute('data-an-count');
        this.parentForm.removeAttribute('data-an-form-handler');
    }

    /**
     * Set the DOM element write permissions according to the current settings, by setting the `readonly` or `contenteditable` attributes depending on its tag type.
     * If the `useHtmlAttribute` parameter is set to `true`, then the `readonly` html attribute is used and has precedence over the `readOnly` option to set the element as read-only.
     *
     * @param {boolean} useHtmlAttribute If set to `true`, then the write permissions are set by taking into account the html 'readonly' attribute, even if the `readOnly` option is set to false
     * @private
     */
    _setWritePermissions(useHtmlAttribute = false) {
        if ((useHtmlAttribute && this.domElement.readOnly) || this.settings.readOnly) {
            this._setReadOnly();
        } else {
            this._setReadWrite();
        }
    }

    /**
     * Set the element to be read-only.
     * If the DOM element tag is not an `input`, then it `contenteditable` attribute is set to `false`.
     *
     * @private
     */
    _setReadOnly() {
        if (this.isInputElement) {
            this.domElement.readOnly = true;
        } else {
            this.domElement.setAttribute('contenteditable', false);
        }
    }

    /**
     * Set the element to be read-write.
     *
     * @private
     */
    _setReadWrite() {
        if (this.isInputElement) {
            this.domElement.readOnly = false;
        } else {
            this.domElement.setAttribute('contenteditable', true);
        }
    }

    /**
     * Add a watcher so that any external change to the AutoNumeric-managed element would be detected.
     * As soon as such change is detected, AutoNumeric then tries to `set()` the value so that it gets formatted and stored in the history.
     * //XXX For now, this only works when watching the `value` attribute, not the `textContent` one
     * @private
     */
    _addWatcher() {
        // `getterSetter` can be undefined when a non-input element is used
        if (!AutoNumericHelper.isUndefined(this.getterSetter)) {
            const { set: setter, get: getter } = this.getterSetter;
            Object.defineProperty(this.domElement, this.attributeToWatch, {
                configurable: true, // This is needed in some rare cases
                get         : () => getter.call(this.domElement),
                set         : val => {
                    setter.call(this.domElement, val);
                    // Only `set()` the value if the modification comes from an external source
                    if (this.settings.watchExternalChanges && !this.internalModification) {
                        this.set(val);
                    }
                },
            });
        }

        //FIXME The code above fails for the `textContent` attribute since `this.getterSetter` is undefined when using `getOwnPropertyDescriptor()`
        /* //XXX The code below *almost* work for the textContent, but breaks some unit tests
        this.valueWatched = this.domElement[this.attributeToWatch];
        Object.defineProperty(this.domElement, this.attributeToWatch, {
            configurable: true, // This is needed in some rare cases
            get         : () => this.valueWatched,
            set         : val => {
                this.valueWatched = val;
                // Only `set()` the value if the modification comes from an external source
                if (this.settings.watchExternalChanges && !this.internalModification) {
                    this.set(val);
                }
            },
        });
        */
    }

    /**
     * Remove the watcher on the AutoNumeric-managed element
     * Note: This needs to be called when the AutoNumeric element is 'removed', otherwise the getter/setter stays on the DOM element and that can lead to problem if the user initialize another AutoNumeric object on it.
     * @private
     */
    _removeWatcher() {
        // `getterSetter` can be undefined when a non-input element is used
        if (!AutoNumericHelper.isUndefined(this.getterSetter)) {
            const { set: setter, get: getter } = this.getterSetter;
            Object.defineProperty(this.domElement, this.attributeToWatch, {
                configurable: true, // This is needed in some rare cases
                get         : () => getter.call(this.domElement),
                set         : val => {
                    setter.call(this.domElement, val);
                },
            });
        }

        //FIXME The code above fails for the `textContent` attribute since `this.getterSetter` is undefined when using `getOwnPropertyDescriptor()`
        /* //XXX The code below *almost* work for the textContent, but breaks some unit tests
        this.valueWatched = this.domElement[this.attributeToWatch];
        Object.defineProperty(this.domElement, this.attributeToWatch, {
            configurable: true, // This is needed in some rare cases
            get         : () => this.valueWatched,
            set         : val => {
                this.valueWatched = val;
            },
        });
        */
    }

    /**
     * Return the name of the object attribute that store the current formatted data in the DOM element.
     *
     * @returns {string}
     * @private
     */
    _getAttributeToWatch() {
        let attributeToWatch;
        if (this.isInputElement) {
            attributeToWatch = 'value';
        } else {
            const nodeType = this.domElement.nodeType;
            if (nodeType === Node.ELEMENT_NODE ||
                nodeType === Node.DOCUMENT_NODE ||
                nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                attributeToWatch = 'textContent';
            } else if (nodeType === Node.TEXT_NODE) {
                attributeToWatch = 'nodeValue';
            }
        }

        return attributeToWatch;
    }

    /**
     * Save the current raw value into the history table, along with the selection information.
     *
     * If the user has done some undos and tries to enter:
     * - a new and different number than the 'next' state, this drops the rest of the history table
     * - the very same number that result in the same rawValue as the 'next' state, we only move the history table pointer to the next state
     *
     * @private
     */
    _historyTableAdd() {
        //TODO Add a `this.settings.saveSelectionsIntoHistory` option to prevent saving the selections (in order to gain performance)
        const isEmptyHistoryTable = this.historyTable.length === 0;
        // Only add a new value if it's different from the previous one (to prevent infinitely adding values on mouseover for instance)
        if (isEmptyHistoryTable || this.rawValue !== this._historyTableCurrentValueUsed()) {
            // Trim the history table if the user changed the value of an intermediary state
            let addNewHistoryState = true;
            if (!isEmptyHistoryTable) {
                // If some undo has been done and the user type the exact same data than the next entry after the current history pointer, do not drop the rest of the 'redo' list, and just advance the historyTableIndex
                const nextHistoryStateIndex = this.historyTableIndex + 1;
                if (nextHistoryStateIndex < this.historyTable.length && this.rawValue === this.historyTable[nextHistoryStateIndex].value) {
                    // If the character input result in the same state as the next one, do not remove the next history states nor add a new one
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
                    // That way, we are always sure we save the last caret or selection positions just before the value is changed. Otherwise, we would only save those positions when the value is first changed, and would not take into account that the user could move the caret around afterward.
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
                    AutoNumericHelper.warning(`The given \`styleRules\` callback is not a function, ${typeof userObject.callback} given.`, this.settings.showWarnings);
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

    // Those are the public function available on each autoNumeric-managed element

    /**
     * Method that updates the AutoNumeric settings, and immediately format the element accordingly.
     * The options passed as parameter(s) is either one or many objects that each contains some settings, i.e. :
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
     * @example anElement.update([{ options1 }, { options2 }]) // Updates the settings with multiple option objects in a single array
     *
     * @param {object|string|array} newOptions
     * @returns {AutoNumeric}
     */
    update(...newOptions) {
        if (Array.isArray(newOptions) && Array.isArray(newOptions[0])) {
            // Allows to pass a single array of options
            newOptions = newOptions[0];
        }

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
                if (this.constructor._isPreDefinedOptionValid(optionObject)) {
                    // The option object is a predefined option name (i.e. 'euro')
                    optionObject = this.constructor._getOptionObject(optionObject);
                }

                Object.assign(optionsToUse, optionObject);
            });
        }

        // Update the settings
        try {
            this._setSettings(optionsToUse, true);
            this._setWritePermissions(); // Update the read/write permissions
            this._updateEventListeners();

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
     * @param {number|string|null} newValue The value must be a Number, a numeric string or `null` (if `emptyInputBehavior` is set to `'null'`)
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

        if (value === '') {
            switch (this.settings.emptyInputBehavior) {
                case AutoNumeric.options.emptyInputBehavior.zero:
                    value = 0;
                    break;
                case AutoNumeric.options.emptyInputBehavior.min:
                    value = this.settings.minimumValue;
                    break;
                case AutoNumeric.options.emptyInputBehavior.max:
                    value = this.settings.maximumValue;
                    break;
                default:
                    if (AutoNumericHelper.isNumber(this.settings.emptyInputBehavior)) {
                        value = Number(this.settings.emptyInputBehavior);
                    }
            }
        }

        if (value !== '') {
            const [minTest, maxTest] = this.constructor._checkIfInRangeWithOverrideOption(value, this.settings);

            // Modify the formatted value if the rawValue is found in the `valuesToStrings` option
            if (minTest && maxTest && this.settings.valuesToStrings && this._checkValuesToStrings(value)) {
                // Set the raw value normally, and the formatted value with the corresponding string
                this._setElementAndRawValue(this.settings.valuesToStrings[value], value, saveChangeToHistory);
                this._saveValueToPersistentStorage();

                return this;
            }

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

                // Special case when the user is allowed to enter invalid numbers outside the min/max range
                this._setValidOrInvalidState(forcedRawValue);

                return this;
            } else {
                this._triggerRangeEvents(minTest, maxTest);
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
        const normalizedValue = this.constructor._stripAllNonNumberCharacters(strippedValue, this.settings, true, this.isFocused);
        if (!AutoNumericHelper.isNumber(normalizedValue)) {
            AutoNumericHelper.throwError(`The value is not a valid one, it's not a numeric string nor a recognized currency.`);
        }

        if (this.constructor._isWithinRangeWithOverrideOption(normalizedValue, this.settings)) {
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
        // Only set the raw value if the given value is different from the current one
        if (this.rawValue !== rawValue) { //TODO Manage the case where one value is a string while the other is a number?
            const oldRawValue = this.rawValue;
            // Update the raw value
            this.rawValue = rawValue; // By default, if the `rawValue` is changed programmatically

            if ((!AutoNumericHelper.isNull(this.settings.rawValueDivisor) && this.settings.rawValueDivisor !== 0) && // Only divide if the `rawValueDivisor` option is set
                rawValue !== '' && rawValue !== null && // Do not modify the `rawValue` if it's an empty string or null
                this._isUserManuallyEditingTheValue()) { // If the user is manually changing the element value
                this.rawValue /= this.settings.rawValueDivisor;
            }

            // Broadcast the `rawValueModified` event since the `rawValue` has been modified
            this._triggerEvent(AutoNumeric.events.rawValueModified, this.domElement, {
                oldRawValue,
                newRawValue: this.rawValue,
                isPristine : this.isPristine(true),
                error      : null,
                aNElement  : this,
            });

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
     * This sends an 'autoNumeric:formatted' event if the new value is different from the old one.
     *
     * @param {number|string} newElementValue
     * @param {boolean} sendFormattedEvent If set to `true`, then the `AutoNumeric.events.formatted` event is sent if the value has changed
     * @returns {AutoNumeric}
     * @private
     */
    _setElementValue(newElementValue, sendFormattedEvent = true) {
        //TODO Use an internal attribute to track the current value of the element `formattedValue` (like its counterpart `rawValue`). This would allow us to avoid calling `getElementValue` many times
        const oldElementValue = AutoNumericHelper.getElementValue(this.domElement);

        // Only update the value if it's different from the current one
        if (newElementValue !== oldElementValue) {
            this.internalModification = true;
            AutoNumericHelper.setElementValue(this.domElement, newElementValue);
            this.internalModification = false;

            if (sendFormattedEvent) {
                this._triggerEvent(AutoNumeric.events.formatted, this.domElement, {
                    oldValue   : oldElementValue,
                    newValue   : newElementValue,
                    oldRawValue: this.rawValue,
                    newRawValue: this.rawValue,
                    isPristine : this.isPristine(false),
                    error      : null,
                    aNElement  : this,
                });
            }
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
     * Check if the given value has a corresponding key in the `valuesToStrings` option object.
     *
     * @param {number|string} value
     * @returns {boolean} Returns `true` if such a key is found.
     * @private
     */
    _checkValuesToStrings(value) {
        return this.constructor._checkValuesToStringsArray(value, this.valuesToStringsKeys);
    }

    /**
     * Check if the given value has a corresponding key in the `stringsArray` array.
     *
     * @param {number|string} key
     * @param {array} stringsArray Array where the `key` is checked against its keys
     * @returns {boolean} Returns `true` if such a key is found.
     * @private
     */
    static _checkValuesToStringsArray(key, stringsArray) {
        return AutoNumericHelper.isInArray(String(key), stringsArray);
    }

    /**
     * Static helper for checking if the given `key` is found in the settings' `valuesToStrings` option object.
     *
     * @param {number|string} key
     * @param {object} settings
     * @returns {boolean}
     * @private
     */
    static _checkValuesToStringsSettings(key, settings) {
        return this._checkValuesToStringsArray(key, Object.keys(settings.valuesToStrings));
    }

    /**
     * Static helper for checking if the given `value` is found in the settings' `valuesToStrings` option object.
     *
     * @param {number|string} value
     * @param {object} settings
     * @returns {boolean}
     * @private
     */
    static _checkStringsToValuesSettings(value, settings) {
        return this._checkValuesToStringsArray(value, Object.values(settings.valuesToStrings));
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
     * Trigger the given event on the given element with the given detail.
     * This takes into account the `eventBubbles` and `eventIsCancelable` options.
     *
     * @param {string} eventName
     * @param {HTMLElement|HTMLDocument|EventTarget} element
     * @param {object} detail
     * @private
     */
    _triggerEvent(eventName, element = document, detail = null) {
        AutoNumericHelper.triggerEvent(eventName, element, detail, this.settings.eventBubbles, this.settings.eventIsCancelable);
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
            // Make sure `.value` or `.textContent` exists before trying to access those properties
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
            result = this.constructor._toLocale(this.getNumericString(), 'number', this.settings);
        }

        this._executeCallback(result, callback);

        return result;
    }

    /**
     * Returns the unformatted value, but following the `outputFormat` setting, which means the output can either be :
     * - a string (that could or could not represent a number (i.e. "12345,67-")), or
     * - a plain number (if the setting 'number' is used).
     *
     * By default, the returned values are an ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period.
     * Check the "outputFormat" option definition for more details.
     *
     * @usage anElement.getLocalized();
     *
     * @param {null|string|function} forcedOutputFormat If set to something different from `null`, then this is used as an overriding outputFormat option
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
            // Here I use `this.rawValue` instead of `this.getNumericString()` since the current input value could be unformatted with a localization (i.e. '1234567,89-').
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

        const result = this.constructor._toLocale(value, outputFormatToUse, this.settings);
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
     * By default, values are returned as ISO numeric strings (i.e. "1234.56" or "-1234.56"), where the decimal character is a period.
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
     * @param {null|string} forcedOutputFormat If set to something different from `null`, then this is used as an overriding outputFormat option
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
        const negLen = (!AutoNumericHelper.isNegative(unformattedValue, this.settings.negativeSignCharacter))?0:1;
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
                (!isPositive && this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.prefix && this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.left)) { // And this excludes the negative sign from being selected in this special case : '-€ 1.234,57suffixText'
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
                // Temporary variable to know if we should create the local list during the initialization (since we'll remove it afterward)
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
        this._removeWatcher();

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
        this._setElementValue('', false); // Do not send the 'AutoNumeric.events.formatted' event when wiping an AutoNumeric object
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
     * In either case, whenever a new parent form is set for the current AutoNumeric element, we make sure to update the anCount and anFormHandler attributes on both the old form and the new one (for instance in case the user moved the input elements with `appendChild()` since AutoNumeric cannot not detect that).
     *
     * @param {boolean} forceSearch If set to `true`, the parent form is searched again, even if `this.parentForm` is already set.
     *
     * @returns {HTMLFormElement|null}
     */
    form(forceSearch = false) {
        if (forceSearch || AutoNumericHelper.isUndefinedOrNullOrEmpty(this.parentForm)) {
            const newParentForm = this._getParentForm();
            if (!AutoNumericHelper.isNull(newParentForm) && newParentForm !== this.parentForm) {
                // If the current parent form exists and is different from the previous parent form

                // Search for all the AutoNumeric elements in the old parent form
                const oldANChildren = this._getFormAutoNumericChildren(this.parentForm);
                // Update the anCount with the correct number of AutoNumeric elements
                this.parentForm.dataset.anCount = oldANChildren.length;

                // Check if the new parent form already has a anFormHandler name
                if (this._hasFormHandlerFunction(newParentForm)) {
                    this._incrementParentFormCounter(newParentForm); // Increment its counter
                } else {
                    // Create one and set the anCount to 1
                    this._storeFormHandlerFunction(newParentForm);
                    this._initializeFormCounterToOne(newParentForm);
                }
            }

            this.parentForm = newParentForm;
        }

        return this.parentForm;
    }

    /**
     * Return an array of the AutoNumeric-managed elements for the given form element is passed, otherwise for the current `this.parentForm` element.
     *
     * @param {HTMLFormElement|null} formElement
     *
     * @returns {Array.<HTMLInputElement>}
     * @private
     */
    _getFormAutoNumericChildren(formElement) {
        // Search for all the child AutoNumeric elements in that parent form
        //TODO This only search for <input> elements, not contenteditable non-input tag ones, for now. Add a parameter to allow this function to search on every tags.
        const inputList = [... formElement.querySelectorAll('input')];

        return inputList.filter(input => this.constructor.isManagedByAutoNumeric(input));
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
     * @param {null|string} forcedOutputFormat If set to something different from `null`, then this is used as an overriding outputFormat option
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
     * @param {null|string} forcedOutputFormat If set to something different from `null`, then this is used as an overriding outputFormat option
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
     * @param {null|string} forcedOutputFormat If set to something different from `null`, then this is used as an overriding outputFormat option
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
     * @param {null|string} forcedOutputFormat If set to something different from `null`, then this is used as an overriding outputFormat option
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
     * @param {null|string} forcedOutputFormat If set to something different from `null`, then this is used as an overriding outputFormat option
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
     * @param {null|string} forcedOutputFormat If set to something different from `null`, then this is used as an overriding outputFormat option
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
     * Test if the given DOM element, or the element selected by the given selector string is already managed by AutoNumeric (if it has been initialized on the current page).
     *
     * @param {HTMLElement|string} domElementOrSelector Accepts either directly a DOM element to test, or a string selector (that will return one and only one element, if any)
     * @returns {boolean}
     */
    static test(domElementOrSelector) {
        return this._isInGlobalList(AutoNumericHelper.domElement(domElementOrSelector));
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
        // The check that this global list does not exist already is done in the add and remove functions already
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
     * Create a `Map` that will store all the autoNumeric elements that are initialized from this current element.
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
     * @param {Boolean} shouldExtendDefaultOptions If `true`, then this function will extend the `userOptions` passed by the user, with the default options.
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
            AutoNumericHelper.throwError(`The debug option 'showWarnings' is invalid ; it should be either 'true' or 'false', [${options.showWarnings}] given.`);
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
            options.allowDecimalPadding !== AutoNumeric.options.allowDecimalPadding.floats &&
            !(AutoNumericHelper.isNumber(options.allowDecimalPadding) && options.allowDecimalPadding > 0)) {
            AutoNumericHelper.throwError(`The decimal padding option 'allowDecimalPadding' is invalid ; it should either be \`false\`, \`true\`, \`'floats'\` or a positive integer superior to 0, [${options.allowDecimalPadding}] given.`);
        }
     
        if (AutoNumericHelper.isNumber(options.allowDecimalPadding) && options.allowDecimalPadding > options.decimalPlaces) {
            AutoNumericHelper.warning(`Setting 'allowDecimalPadding' to a number [${options.allowDecimalPadding}] superior to the current 'decimalPlaces' settings [${options.decimalPlaces}] is useless, since the padding will not be shown.`, options.showWarnings);
        }

        if ((options.allowDecimalPadding === AutoNumeric.options.allowDecimalPadding.never ||
            options.allowDecimalPadding === 'false') &&
            (options.decimalPlaces !== AutoNumeric.options.decimalPlaces.none ||
            options.decimalPlacesShownOnBlur !== AutoNumeric.options.decimalPlacesShownOnBlur.none ||
            options.decimalPlacesShownOnFocus !== AutoNumeric.options.decimalPlacesShownOnFocus.none)) {
            AutoNumericHelper.warning(`Setting 'allowDecimalPadding' to [${options.allowDecimalPadding}] will override the current 'decimalPlaces*' settings [${options.decimalPlaces}, ${options.decimalPlacesShownOnBlur} and ${options.decimalPlacesShownOnFocus}].`, options.showWarnings);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.alwaysAllowDecimalCharacter) &&
            !AutoNumericHelper.isBoolean(options.alwaysAllowDecimalCharacter)) {
            AutoNumericHelper.throwError(`The option 'alwaysAllowDecimalCharacter' is invalid ; it should either be \`true\` or \`false\`, [${options.alwaysAllowDecimalCharacter}] given.`);
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
            AutoNumeric.options.digitGroupSeparator.privateUseTwo,
        ])) {
            AutoNumericHelper.throwError(`The thousand separator character option 'digitGroupSeparator' is invalid ; it should be ',', '.', '٬', '˙', "'", '\u0092', ' ', '\u2009', '\u202f', '\u00a0' or empty (''), [${options.digitGroupSeparator}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.showOnlyNumbersOnFocus) && !AutoNumericHelper.isBoolean(options.showOnlyNumbersOnFocus)) {
            AutoNumericHelper.throwError(`The 'showOnlyNumbersOnFocus' option is invalid ; it should be either 'true' or 'false', [${options.showOnlyNumbersOnFocus}] given.`);
        }

        if (!AutoNumericHelper.isInArray(options.digitalGroupSpacing, [
            AutoNumeric.options.digitalGroupSpacing.two,
            AutoNumeric.options.digitalGroupSpacing.twoScaled,
            AutoNumeric.options.digitalGroupSpacing.three,
            AutoNumeric.options.digitalGroupSpacing.four,
        ]) && !(options.digitalGroupSpacing >= 2 && options.digitalGroupSpacing <= 4)) {
            AutoNumericHelper.throwError(`The grouping separator option for thousands 'digitalGroupSpacing' is invalid ; it should be '2', '2s', '3', or '4', [${options.digitalGroupSpacing}] given.`);
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
            AutoNumericHelper.throwError(`The show positive sign option 'showPositiveSign' is invalid ; it should be either 'true' or 'false', [${options.showPositiveSign}] given.`);
        }

        if (!AutoNumericHelper.isString(options.suffixText) || (options.suffixText !== '' && (AutoNumericHelper.isNegative(options.suffixText, options.negativeSignCharacter) || testNumericalCharacters.test(options.suffixText)))) {
            AutoNumericHelper.throwError(`The additional suffix option 'suffixText' is invalid ; it should not contains the negative sign '${options.negativeSignCharacter}' nor any numerical characters, [${options.suffixText}] given.`);
        }

        if (!AutoNumericHelper.isString(options.negativeSignCharacter) ||
            options.negativeSignCharacter.length !== 1 ||
            AutoNumericHelper.isUndefinedOrNullOrEmpty(options.negativeSignCharacter) ||
            testNumericalCharacters.test(options.negativeSignCharacter)) {
            AutoNumericHelper.throwError(`The negative sign character option 'negativeSignCharacter' is invalid ; it should be a single character, and cannot be any numerical characters, [${options.negativeSignCharacter}] given.`);
        }

        if (!AutoNumericHelper.isString(options.positiveSignCharacter) ||
            options.positiveSignCharacter.length !== 1 ||
            AutoNumericHelper.isUndefinedOrNullOrEmpty(options.positiveSignCharacter) ||
            testNumericalCharacters.test(options.positiveSignCharacter)) {
            AutoNumericHelper.throwError(`The positive sign character option 'positiveSignCharacter' is invalid ; it should be a single character, and cannot be any numerical characters, [${options.positiveSignCharacter}] given.\nIf you want to show the positive sign character, you need to set the \`showPositiveSign\` option to \`true\`.`);
        }

        if (options.negativeSignCharacter === options.positiveSignCharacter) {
            AutoNumericHelper.throwError(`The positive 'positiveSignCharacter' and negative 'negativeSignCharacter' sign characters cannot be identical ; [${options.negativeSignCharacter}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.negativePositiveSignBehavior) && !AutoNumericHelper.isBoolean(options.negativePositiveSignBehavior)) {
            AutoNumericHelper.throwError(`The option 'negativePositiveSignBehavior' is invalid ; it should be either 'true' or 'false', [${options.negativePositiveSignBehavior}] given.`);
        }

        const [leftBracket, rightBracket] = AutoNumericHelper.isNull(options.negativeBracketsTypeOnBlur)?['', '']:options.negativeBracketsTypeOnBlur.split(',');
        if (AutoNumericHelper.contains(options.digitGroupSeparator, options.negativeSignCharacter) ||
            AutoNumericHelper.contains(options.decimalCharacter, options.negativeSignCharacter) ||
            AutoNumericHelper.contains(options.decimalCharacterAlternative, options.negativeSignCharacter) ||
            AutoNumericHelper.contains(leftBracket, options.negativeSignCharacter) ||
            AutoNumericHelper.contains(rightBracket, options.negativeSignCharacter) ||
            AutoNumericHelper.contains(options.suffixText, options.negativeSignCharacter)) {
            AutoNumericHelper.throwError(`The negative sign character option 'negativeSignCharacter' is invalid ; it should not be equal or a part of the digit separator, the decimal character, the decimal character alternative, the negative brackets or the suffix text, [${options.negativeSignCharacter}] given.`);
        }

        if (AutoNumericHelper.contains(options.digitGroupSeparator, options.positiveSignCharacter) ||
            AutoNumericHelper.contains(options.decimalCharacter, options.positiveSignCharacter) ||
            AutoNumericHelper.contains(options.decimalCharacterAlternative, options.positiveSignCharacter) ||
            AutoNumericHelper.contains(leftBracket, options.positiveSignCharacter) ||
            AutoNumericHelper.contains(rightBracket, options.positiveSignCharacter) ||
            AutoNumericHelper.contains(options.suffixText, options.positiveSignCharacter)) {
            AutoNumericHelper.throwError(`The positive sign character option 'positiveSignCharacter' is invalid ; it should not be equal or a part of the digit separator, the decimal character, the decimal character alternative, the negative brackets or the suffix text, [${options.positiveSignCharacter}] given.`);
        }

        if (!AutoNumericHelper.isNull(options.overrideMinMaxLimits) && !AutoNumericHelper.isInArray(options.overrideMinMaxLimits, [
            AutoNumeric.options.overrideMinMaxLimits.ceiling,
            AutoNumeric.options.overrideMinMaxLimits.floor,
            AutoNumeric.options.overrideMinMaxLimits.ignore,
            AutoNumeric.options.overrideMinMaxLimits.invalid,
        ])) {
            AutoNumericHelper.throwError(`The override min & max limits option 'overrideMinMaxLimits' is invalid ; it should either be 'ceiling', 'floor', 'ignore' or 'invalid', [${options.overrideMinMaxLimits}] given.`);
        }

        if ((options.overrideMinMaxLimits !== AutoNumeric.options.overrideMinMaxLimits.invalid && options.overrideMinMaxLimits !== AutoNumeric.options.overrideMinMaxLimits.ignore) &&
            (options.minimumValue > 0 || options.maximumValue < 0)) {
            AutoNumericHelper.warning(`You've set a \`minimumValue\` or a \`maximumValue\` excluding the value \`0\`. AutoNumeric will force the users to always have a valid value in the input, hence preventing them to clear the field. If you want to allow for temporary invalid values (i.e. out-of-range), you should use the 'invalid' option for the 'overrideMinMaxLimits' setting.`);
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
            AutoNumericHelper.throwError(`The save to session storage option 'saveValueToSessionStorage' is invalid ; it should be either 'true' or 'false', [${options.saveValueToSessionStorage}] given.`);
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

        if (!(AutoNumericHelper.isString(options.emptyInputBehavior) || AutoNumericHelper.isNumber(options.emptyInputBehavior)) ||
            !(AutoNumericHelper.isInArray(options.emptyInputBehavior, [
                AutoNumeric.options.emptyInputBehavior.focus,
                AutoNumeric.options.emptyInputBehavior.press,
                AutoNumeric.options.emptyInputBehavior.always,
                AutoNumeric.options.emptyInputBehavior.min,
                AutoNumeric.options.emptyInputBehavior.max,
                AutoNumeric.options.emptyInputBehavior.zero,
                AutoNumeric.options.emptyInputBehavior.null,
            ]) || testFloatOrIntegerAndPossibleNegativeSign.test(options.emptyInputBehavior))) {
            AutoNumericHelper.throwError(`The display on empty string option 'emptyInputBehavior' is invalid ; it should either be 'focus', 'press', 'always', 'min', 'max', 'zero', 'null', a number, or a string that represents a number, [${options.emptyInputBehavior}] given.`);
        }

        if (options.emptyInputBehavior === AutoNumeric.options.emptyInputBehavior.zero &&
            (options.minimumValue > 0 || options.maximumValue < 0)) {
            AutoNumericHelper.throwError(`The 'emptyInputBehavior' option is set to 'zero', but this value is outside of the range defined by 'minimumValue' and 'maximumValue' [${options.minimumValue}, ${options.maximumValue}].`);
        }

        if (testFloatOrIntegerAndPossibleNegativeSign.test(String(options.emptyInputBehavior))) {
            if (!this._isWithinRangeWithOverrideOption(options.emptyInputBehavior, options)) {
                AutoNumericHelper.throwError(`The 'emptyInputBehavior' option is set to a number or a string that represents a number, but its value [${options.emptyInputBehavior}] is outside of the range defined by the 'minimumValue' and 'maximumValue' options [${options.minimumValue}, ${options.maximumValue}].`);
            }
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.eventBubbles) && !AutoNumericHelper.isBoolean(options.eventBubbles)) {
            AutoNumericHelper.throwError(`The event bubbles option 'eventBubbles' is invalid ; it should be either 'true' or 'false', [${options.eventBubbles}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.eventIsCancelable) && !AutoNumericHelper.isBoolean(options.eventIsCancelable)) {
            AutoNumericHelper.throwError(`The event is cancelable option 'eventIsCancelable' is invalid ; it should be either 'true' or 'false', [${options.eventIsCancelable}] given.`);
        }

        if (AutoNumericHelper.isBoolean(options.invalidClass) || !/^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/.test(options.invalidClass)) { //TODO Make sure this covers all the CSS class names
            AutoNumericHelper.throwError(`The name of the 'invalidClass' option is not a valid CSS class name ; it should not be empty, and should follow the '^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$' regex, [${options.invalidClass}] given.`);
        }

        if (!AutoNumericHelper.isInArray(options.leadingZero, [
            AutoNumeric.options.leadingZero.allow,
            AutoNumeric.options.leadingZero.deny,
            AutoNumeric.options.leadingZero.keep,
        ])) {
            AutoNumericHelper.throwError(`The leading zero behavior option 'leadingZero' is invalid ; it should either be 'allow', 'deny' or 'keep', [${options.leadingZero}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.formatOnPageLoad) && !AutoNumericHelper.isBoolean(options.formatOnPageLoad)) {
            AutoNumericHelper.throwError(`The format on initialization option 'formatOnPageLoad' is invalid ; it should be either 'true' or 'false', [${options.formatOnPageLoad}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.formulaMode) && !AutoNumericHelper.isBoolean(options.formulaMode)) {
            AutoNumericHelper.throwError(`The formula mode option 'formulaMode' is invalid ; it should be either 'true' or 'false', [${options.formulaMode}] given.`);
        }

        if (!testPositiveInteger.test(options.historySize) || options.historySize === 0) {
            AutoNumericHelper.throwError(`The history size option 'historySize' is invalid ; it should be a positive integer, [${options.historySize}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.selectNumberOnly) && !AutoNumericHelper.isBoolean(options.selectNumberOnly)) {
            AutoNumericHelper.throwError(`The select number only option 'selectNumberOnly' is invalid ; it should be either 'true' or 'false', [${options.selectNumberOnly}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.selectOnFocus) && !AutoNumericHelper.isBoolean(options.selectOnFocus)) {
            AutoNumericHelper.throwError(`The select on focus option 'selectOnFocus' is invalid ; it should be either 'true' or 'false', [${options.selectOnFocus}] given.`);
        }

        if (!AutoNumericHelper.isNull(options.defaultValueOverride) && (options.defaultValueOverride !== '' && !testFloatOrIntegerAndPossibleNegativeSign.test(options.defaultValueOverride))) {
            AutoNumericHelper.throwError(`The unformatted default value option 'defaultValueOverride' is invalid ; it should be a string that represents a positive or negative number, [${options.defaultValueOverride}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.unformatOnSubmit) && !AutoNumericHelper.isBoolean(options.unformatOnSubmit)) {
            AutoNumericHelper.throwError(`The remove formatting on submit option 'unformatOnSubmit' is invalid ; it should be either 'true' or 'false', [${options.unformatOnSubmit}] given.`);
        }

        if (!AutoNumericHelper.isNull(options.valuesToStrings) &&
            !(AutoNumericHelper.isObject(options.valuesToStrings))) {
            AutoNumericHelper.throwError(`The option 'valuesToStrings' is invalid ; it should be an object, ideally with 'key -> value' entries, [${options.valuesToStrings}] given.`);
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
            AutoNumericHelper.throwError(`The cancellable behavior option 'isCancellable' is invalid ; it should be either 'true' or 'false', [${options.isCancellable}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.modifyValueOnUpDownArrow) && !AutoNumericHelper.isBoolean(options.modifyValueOnUpDownArrow)) {
            AutoNumericHelper.throwError(`The increment/decrement on up and down arrow keys 'modifyValueOnUpDownArrow' is invalid ; it should be either 'true' or 'false', [${options.modifyValueOnUpDownArrow}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.modifyValueOnWheel) && !AutoNumericHelper.isBoolean(options.modifyValueOnWheel)) {
            AutoNumericHelper.throwError(`The increment/decrement on mouse wheel option 'modifyValueOnWheel' is invalid ; it should be either 'true' or 'false', [${options.modifyValueOnWheel}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.watchExternalChanges) && !AutoNumericHelper.isBoolean(options.watchExternalChanges)) {
            AutoNumericHelper.throwError(`The option 'watchExternalChanges' is invalid ; it should be either 'true' or 'false', [${options.watchExternalChanges}] given.`);
        }

        if (!AutoNumericHelper.isInArray(options.wheelOn, [
            AutoNumeric.options.wheelOn.focus,
            AutoNumeric.options.wheelOn.hover,
        ])) {
            AutoNumericHelper.throwError(`The wheel behavior option 'wheelOn' is invalid ; it should either be 'focus' or 'hover', [${options.wheelOn}] given.`);
        }

        if (!(AutoNumericHelper.isString(options.upDownStep) || AutoNumericHelper.isNumber(options.upDownStep)) ||
            (options.upDownStep !== 'progressive' && !testPositiveFloatOrInteger.test(options.upDownStep)) ||
            Number(options.upDownStep) === 0) {
            // A step equal to '0' is rejected
            AutoNumericHelper.throwError(`The up/down arrow step value option 'upDownStep' is invalid ; it should either be the string 'progressive', or a number or a string that represents a positive number (excluding zero), [${options.upDownStep}] given.`);
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
            AutoNumericHelper.throwError(`The option 'noEventListeners' that prevent the creation of event listeners is invalid ; it should be either 'true' or 'false', [${options.noEventListeners}] given.`);
        }

        if (!AutoNumericHelper.isNull(options.styleRules) &&
            !(AutoNumericHelper.isObject(options.styleRules) &&
            ((Object.prototype.hasOwnProperty.call(options.styleRules, 'positive') ||
            Object.prototype.hasOwnProperty.call(options.styleRules, 'negative') ||
            Object.prototype.hasOwnProperty.call(options.styleRules, 'ranges') ||
            Object.prototype.hasOwnProperty.call(options.styleRules, 'userDefined'))))) {
            AutoNumericHelper.throwError(`The option 'styleRules' is invalid ; it should be a correctly structured object, with one or more 'positive', 'negative', 'ranges' or 'userDefined' attributes, [${options.styleRules}] given.`);
        }

        // Deeper tests of the `styleRules` object : Check that the callback, if defined, is a function
        if (!AutoNumericHelper.isNull(options.styleRules) &&
            Object.prototype.hasOwnProperty.call(options.styleRules, 'userDefined') &&
            !AutoNumericHelper.isNull(options.styleRules.userDefined)) {
            options.styleRules.userDefined.forEach(rule => {
                if (Object.prototype.hasOwnProperty.call(rule, 'callback') && !AutoNumericHelper.isFunction(rule.callback)) {
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
            AutoNumericHelper.throwError(`The option 'readOnly' is invalid ; it should be either 'true' or 'false', [${options.readOnly}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.unformatOnHover) && !AutoNumericHelper.isBoolean(options.unformatOnHover)) {
            AutoNumericHelper.throwError(`The option 'unformatOnHover' is invalid ; it should be either 'true' or 'false', [${options.unformatOnHover}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.failOnUnknownOption) && !AutoNumericHelper.isBoolean(options.failOnUnknownOption)) {
            AutoNumericHelper.throwError(`The debug option 'failOnUnknownOption' is invalid ; it should be either 'true' or 'false', [${options.failOnUnknownOption}] given.`);
        }

        if (!AutoNumericHelper.isTrueOrFalseString(options.createLocalList) && !AutoNumericHelper.isBoolean(options.createLocalList)) {
            AutoNumericHelper.throwError(`The debug option 'createLocalList' is invalid ; it should be either 'true' or 'false', [${options.createLocalList}] given.`);
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
        settings.isNegativeSignAllowed = value < 0;
        settings.isPositiveSignAllowed = value >= 0;
        this._setBrackets(settings);

        const regex = {};
        this._cachesUsualRegularExpressions(settings, regex); // This is needed by `_stripAllNonNumberCharactersExceptCustomDecimalChar` that uses those regex

        // Check the validity of the `value` parameter
        // Convert the value to a numeric string, stripping unnecessary characters in the process
        let valueString = this._toNumericValue(value, settings);
        if (isNaN(Number(valueString))) {
            AutoNumericHelper.throwError(`The value [${valueString}] that you are trying to format is not a recognized number.`);
        }

        // Check if the given valueString is valid
        if (!this._isWithinRangeWithOverrideOption(valueString, settings)) {
            // Throw a custom event
            AutoNumericHelper.triggerEvent(AutoNumeric.events.formatted, document, {
                oldValue   : null,
                newValue   : null,
                oldRawValue: null,
                newRawValue: null,
                isPristine : null,
                error      : 'Range test failed',
                aNElement  : null,
            }, true, true);
            AutoNumericHelper.throwError(`The value [${valueString}] being set falls outside of the minimumValue [${settings.minimumValue}] and maximumValue [${settings.maximumValue}] range set for this element`);
        }

        // Directly format any `valuesToStrings` values, if found
        if (settings.valuesToStrings && this._checkValuesToStringsSettings(value, settings)) {
            return settings.valuesToStrings[value];
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

        if (value === '') {
            // This allows to be coherent when serializing forms with empty inputs. Fix issue #512.
            return '';
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
        settings.isNegativeSignAllowed = false;
        settings.isPositiveSignAllowed = true;
        value = value.toString();

        // Directly unformat any `valuesToStrings` values, if found
        if (settings.valuesToStrings && this._checkStringsToValuesSettings(value, settings)) {
            return AutoNumericHelper.objectKeyLookup(settings.valuesToStrings, value);
        }

        // This checks if a negative sign is anywhere in the `value`, not just on the very first character (i.e. '12345.67-')
        if (AutoNumericHelper.isNegative(value, settings.negativeSignCharacter)) {
            settings.isNegativeSignAllowed = true;
            settings.isPositiveSignAllowed = false;
        } else if (!AutoNumericHelper.isNull(settings.negativeBracketsTypeOnBlur)) {
            [settings.firstBracket, settings.lastBracket] = settings.negativeBracketsTypeOnBlur.split(',');
            if (value.charAt(0) === settings.firstBracket &&
                value.charAt(value.length - 1) === settings.lastBracket) {
                settings.isNegativeSignAllowed = true;
                settings.isPositiveSignAllowed = false;
                value = this._removeBrackets(value, settings, false);
            }
        }

        value = this._convertToNumericString(value, settings);
        if (AutoNumericHelper.isNumber(Number(value))) { // In case of numbers with the scientific notation (#757)
            value = AutoNumericHelper.scientificToDecimal(value);
        }

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
        value = this._toLocale(value, settings.outputFormat, settings);

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
     * @param {object} settings
     * @returns {*}
     */
    static localize(numericStringOrDomElement, settings = null) {
        let value;
        if (AutoNumericHelper.isElement(numericStringOrDomElement)) {
            value = AutoNumericHelper.getElementValue(numericStringOrDomElement);
        } else {
            value = numericStringOrDomElement;
        }

        if (value === '') {
            // This allows to be coherent when serializing forms with empty inputs. Fix issue #512.
            return '';
        }

        if (AutoNumericHelper.isNull(settings)) {
            settings = AutoNumeric.defaultSettings;
        }

        value = this.unformat(value, settings);

        //XXX The following code is pretty close to the one you can find in `getLocalized()`, but different enough so we won't refactor it.
        if (Number(value) === 0 && settings.leadingZero !== AutoNumeric.options.leadingZero.keep) {
            value = '0';
        }

        let outputFormatToUse;
        if (AutoNumericHelper.isNull(settings)) {
            outputFormatToUse = settings.outputFormat;
        } else {
            outputFormatToUse = AutoNumeric.defaultSettings.outputFormat;
        }

        return this._toLocale(value, outputFormatToUse, settings);
    }

    static localizeAndSet(domElement, options = null) { //FIXME test this
        const localizedValue = this.localize(domElement, options);
        AutoNumericHelper.setElementValue(domElement, localizedValue);

        return localizedValue;
    }

    /**
     * Return `true` if the given DOM element has an AutoNumeric object that manages it.
     * This function also accepts a selector string.
     *
     * @param {HTMLElement|string} domElementOrSelector Accepts either directly a DOM element to test, or a string selector (that will return one and only one element, if any)
     * @returns {boolean}
     */
    static isManagedByAutoNumeric(domElementOrSelector) { //FIXME test this
        return this._isInGlobalList(AutoNumericHelper.domElement(domElementOrSelector));
    }

    /**
     * Return the AutoNumeric object that manages the given DOM element.
     * This function also accepts a selector string.
     *
     * @param {HTMLElement|string} domElementOrSelector Accepts either directly a DOM element to test, or a string selector (that will return one and only one element, if any)
     * @returns {null|AutoNumeric}
     */
    static getAutoNumericElement(domElementOrSelector) {
        const domElement = AutoNumericHelper.domElement(domElementOrSelector);

        if (!this.isManagedByAutoNumeric(domElement)) {
            return null;
        }

        return this._getFromGlobalList(domElement);
    }

    /**
     * Set the given element value, and format it immediately.
     * Return `null` if no AutoNumeric object is found, else, return the AutoNumeric object.
     *
     * @param {HTMLElement|string} domElementOrSelector Either a DOM element reference, or a selector string can be used
     * @param {number|string|null} newValue The value must be a Number, a numeric string or `null` (if `emptyInputBehavior` is set to `'null'`)
     * @param {object} options A settings object that will override the current settings. Note: the update is done only if the `newValue` is defined.
     * @param {boolean} saveChangeToHistory If set to `true`, then the change is recorded in the history table
     * @returns {AutoNumeric|null}
     */
    static set(domElementOrSelector, newValue, options = null, saveChangeToHistory = true) {
        const domElement = AutoNumericHelper.domElement(domElementOrSelector);

        if (!this.isManagedByAutoNumeric(domElement)) {
            let showWarnings;
            if (!AutoNumericHelper.isNull(options) && Object.prototype.hasOwnProperty.call(options, 'showWarnings')) {
                showWarnings = options.showWarnings;
            } else {
                showWarnings = true;
            }

            AutoNumericHelper.warning(`Impossible to find an AutoNumeric object for the given DOM element or selector.`, showWarnings);

            return null;
        }

        return this.getAutoNumericElement(domElement).set(newValue, options, saveChangeToHistory);
    }

    /**
     * Return the unformatted value as a string from the given DOM element or query selector.
     * This can also return `null` if `rawValue` is null.
     *
     * @param {HTMLElement|string} domElementOrSelector
     * @param {function|null} callback
     * @returns {string|null}
     */
    static getNumericString(domElementOrSelector, callback = null) {
        return this._get(domElementOrSelector, 'getNumericString', callback);
    }

    /**
     * Return the current formatted value of the AutoNumeric element as a string, from the given DOM element or query selector.
     *
     * @param {HTMLElement|string} domElementOrSelector
     * @param {function|null} callback
     * @returns {string}
     */
    static getFormatted(domElementOrSelector, callback = null) {
        return this._get(domElementOrSelector, 'getFormatted', callback);
    }

    /**
     * Return the element unformatted value as a real Javascript number, from the given DOM element or query selector.
     * Warning: This can lead to precision problems with big numbers that should be stored as strings.
     *
     * @param {HTMLElement|string} domElementOrSelector
     * @param {function|null} callback
     * @returns {number|null}
     */
    static getNumber(domElementOrSelector, callback = null) {
        return this._get(domElementOrSelector, 'getNumber', callback);
    }

    /**
     * DRY the code between the static `get*` functions
     *
     * @param {HTMLElement|string} domElementOrSelector
     * @param {string} getFunction The name of the non-static `get*` function as a string
     * @param {function|null} callback
     * @returns {*}
     * @private
     */
    static _get(domElementOrSelector, getFunction, callback = null) {
        const domElement = AutoNumericHelper.domElement(domElementOrSelector);

        if (!this.isManagedByAutoNumeric(domElement)) {
            AutoNumericHelper.throwError(`Impossible to find an AutoNumeric object for the given DOM element or selector.`);
        }

        return this.getAutoNumericElement(domElement)[getFunction](callback);
    }

    /**
     * Returns the unformatted value following the `outputFormat` setting, from the given DOM element or query selector.
     * See the non-static `getLocalized()` method documentation for more details.
     *
     * @param {HTMLElement|string} domElementOrSelector
     * @param {null|string|function} forcedOutputFormat
     * @param {function|null} callback
     * @returns {*}
     */
    static getLocalized(domElementOrSelector, forcedOutputFormat = null, callback = null) {
        const domElement = AutoNumericHelper.domElement(domElementOrSelector);

        if (!this.isManagedByAutoNumeric(domElement)) {
            AutoNumericHelper.throwError(`Impossible to find an AutoNumeric object for the given DOM element or selector.`);
        }

        return this.getAutoNumericElement(domElement).getLocalized(forcedOutputFormat, callback);
    }

    // Pre-defined options can be called to update the current default options with their specificities
    //XXX A better way would be to not initialize first, but that's not possible since `new` is called first and we do not pass the language options (i.e. `French`) to the constructor

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
            if (Object.prototype.hasOwnProperty.call(this.settings, key)) {
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
     * Strip all the unwanted non-number characters.
     * However, it does not reorder the localized negative sign.
     *
     * @param {string} s
     * @param {object} settings
     * @param {boolean} stripZeros If set to `false`, then the leading zero(s) are not stripped, otherwise if set to `true`, the `leadingZero` option is followed
     * @param {boolean} isFocused If the element is focused, then this is `true`
     * @returns {string}
     * @private
     */
    static _stripAllNonNumberCharacters(s, settings, stripZeros, isFocused) {
        return this._stripAllNonNumberCharactersExceptCustomDecimalChar(s, settings, stripZeros, isFocused).replace(settings.decimalCharacter, '.');
    }

    /**
     * Strip all unwanted non-number characters except the custom decimal character.
     *
     * It converts the custom negative sign and removes the positive sign (custom or not).
     * This keeps :
     * - the numbers,
     * - the normal negative sign '-' if any,
     * - and the *custom* decimal character.
     *
     * @param {string} s
     * @param {object} settings
     * @param {boolean} stripZeros If set to `false`, then the leading zero(s) are not stripped, otherwise if set to `true`, the `leadingZero` option is followed
     * @param {boolean} isFocused If the element is focused, then this is `true`
     * @returns {string|*}
     */
    static _stripAllNonNumberCharactersExceptCustomDecimalChar(s, settings, stripZeros, isFocused) {
        //XXX Note; this function is static since we need to pass a `settings` object when calling the static `AutoNumeric.format()` method
        //TODO This function is called 10 times (sic!) on each key input, couldn't we lower that number? cf. issue #325
        s = this._normalizeCurrencySuffixAndNegativeSignCharacters(s, settings);

        // Then remove all the characters that are not numbers, the normal negative sign '-', or the custom decimal character (note: this also remove any custom positive sign)
        s = s.replace(settings.allowedAutoStrip, '');

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

            // Strip leading zero on positive value if needed
            if (negativeSign === '' && modifiedIntegerPart.length > settings.mIntPos && modifiedIntegerPart.charAt(0) === '0') {
                modifiedIntegerPart = modifiedIntegerPart.slice(1);
            }

            // Strip leading zero on negative value if needed
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
        if (AutoNumericHelper.isNull(settings.negativeBracketsTypeOnBlur)) {
            return value;
        }

        return `${settings.firstBracket}${value.replace(settings.negativeSignCharacter, '')}${settings.lastBracket}`;
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
                result = `${settings.negativeSignCharacter}${result}`;
            }
        } else {
            result = value;
        }

        return result;
    }

    /**
     * Analyze the `negativeBracketsTypeOnBlur` options and keep track of the first and last bracket characters to use.
     *
     * @param {object} settings
     * @private
     */
    static _setBrackets(settings) {
        if (AutoNumericHelper.isNull(settings.negativeBracketsTypeOnBlur)) {
            settings.firstBracket = '';
            settings.lastBracket  = '';
        } else {
            // Use temporary variables to fix the MS Edge destructuring issue (see pull request #564)
            const [firstBracket, lastBracket] = settings.negativeBracketsTypeOnBlur.split(',');
            settings.firstBracket = firstBracket;
            settings.lastBracket = lastBracket;
        }
    }

    /**
     * Return a number as a numeric string that can be typecast to a Number that Javascript will understand.
     *
     * This function returns the given string by stripping:
     * - the currency sign (currencySymbol),
     * - the grouping separators (digitalGroupSpacing),
     * - the suffix text (suffixText),
     * - the positive sign (positiveSignCharacter),
     * - the brackets if any,
     * - by replacing the negative sign character with a hyphen,
     * - and by replacing the decimal character (decimalCharacter) by a dot.
     *
     * Lastly, it also put the negative sign back to its normal position if needed.
     * Bonus; it converts any arabic numbers found to the latin ones.
     *
     * @param {string} s
     * @param {object} settings
     * @returns {string|void|*}
     */
    static _convertToNumericString(s, settings) {
        // Remove the custom brackets
        s = this._removeBrackets(s, settings, false);
        s = this._normalizeCurrencySuffixAndNegativeSignCharacters(s, settings);

        // Remove the grouping separators (thousands separators usually)
        s = s.replace(new RegExp(`[${settings.digitGroupSeparator}]`, 'g'), '');

        // Replace the decimal character by a dot
        if (settings.decimalCharacter !== '.') {
            s = s.replace(settings.decimalCharacter, '.');
        }

        // Move the trailing negative sign, if any, to the usual leftmost position
        if (AutoNumericHelper.isNegative(s) && s.lastIndexOf('-') === s.length - 1) {
            s = s.replace('-', '');
            s = `-${s}`;
        }

        // Replace the custom positive sign
        if (settings.showPositiveSign) {
            s = s.replace(settings.positiveSignCharacter, '');
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
     * Removes the currency symbol and the suffix text from the given string, and replace the custom negative sign with a hyphen.
     *
     * @param {string} s
     * @param {object} settings
     * @returns {string | *}
     * @private
     */
    static _normalizeCurrencySuffixAndNegativeSignCharacters(s, settings) {
        s = String(s); // Typecast to a string, in case that the given value is a number

        // Remove the currency symbol
        if (settings.currencySymbol !== AutoNumeric.options.currencySymbol.none) {
            s = s.replace(settings.currencySymbol, '');
        }

        // Remove the suffixText
        if (settings.suffixText !== AutoNumeric.options.suffixText.none) {
            s = s.replace(settings.suffixText, '');
        }

        // Replace the custom negative sign with a hyphen
        if (settings.negativeSignCharacter !== AutoNumeric.options.negativeSignCharacter.hyphen) {
            s = s.replace(settings.negativeSignCharacter, '-');
        }

        return s;
    }

    /**
     * Converts the ISO numeric string to the locale decimal and minus sign placement.
     * See the "outputFormat" option definition for more details.
     * Note: If the `outputFormat` is set to a number, the custom `negativeSignCharacter` is ignored.
     *
     * @param {string|null} value The unformatted value
     * @param {string|null} locale
     * @param {object} settings
     * @returns {*}
     */
    static _toLocale(value, locale, settings) {
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

        if (locale !== AutoNumeric.options.outputFormat.number && settings.negativeSignCharacter !== '-') {
            // Modify the default minus sign with the custom one, if any
            result = result.replace('-', settings.negativeSignCharacter);
        }

        return result;
    }

    /**
     * Modify the negative sign and the decimal character of the given string value to a hyphen (-) and a dot (.) in order to make that value 'typecastable' to a real number.
     *
     * @param {string} s The formatted value
     * @returns {string} The value with the 'normal' minus sign and decimal character
     */
    _modifyNegativeSignAndDecimalCharacterForRawValue(s) {
        if (this.settings.decimalCharacter !== '.') {
            s = s.replace(this.settings.decimalCharacter, '.');
        }

        if (this.settings.negativeSignCharacter !== '-' && this.settings.isNegativeSignAllowed) {
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
        if (settings.negativeSignCharacter !== '-') {
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
            switch (settings.negativePositiveSignPlacement) {
                case AutoNumeric.options.negativePositiveSignPlacement.left:
                case AutoNumeric.options.negativePositiveSignPlacement.prefix:
                case AutoNumeric.options.negativePositiveSignPlacement.none:
                    result = value + settings.currencySymbol + settings.suffixText;
                    break;
                default :
                    result = settings.currencySymbol + value + settings.suffixText;
            }
        } else {
            result = value;
        }

        return result;
    }

    /**
     * Modify the input value by adding the group separators, as defined in the settings, and the negative brackets if needed.
     *
     * @param {string} inputValue The formatted value (i.e. with the `decimalCharacter` defined in the settings, not the raw value)
     * @param {object} settings
     * @param {boolean} isFocused
     * @param {number|string|null} currentRawValue The object current raw value (`this.rawValue`)
     * @param {number|string|null} forcedRawValue If this is set, then this rawValue is used instead of the one passed through the `settings` object. This is useful is some very specific cases where we need to set the raw value *after* settings the formatted value, using the `_addGroupSeparators()` method.
     * @returns {*}
     */
    static _addGroupSeparators(inputValue, settings, isFocused, currentRawValue, forcedRawValue = null) {
        //TODO Test if `inputValue` === '', and return '' directly if that's the case,
        //XXX Note; this function is static since we need to pass a `settings` object when calling the static `AutoNumeric.format()` method
        let isValueNegative;
        if (!AutoNumericHelper.isNull(forcedRawValue)) {
            // Prefer directly testing if the raw value is negative in order for the test to be more performant than manipulating the formatted value
            isValueNegative = forcedRawValue < 0;
        } else {
            isValueNegative = AutoNumericHelper.isNegative(inputValue, settings.negativeSignCharacter) || AutoNumericHelper.isNegativeWithBrackets(inputValue, settings.firstBracket, settings.lastBracket); // Test if the value is negative before removing the negative sign
        }

        inputValue = this._stripAllNonNumberCharactersExceptCustomDecimalChar(inputValue, settings, false, isFocused);

        if (this._isElementValueEmptyOrOnlyTheNegativeSign(inputValue, settings)) {
            return this._orderValueCurrencySymbolAndSuffixText(inputValue, settings, true);
        }

        const isZeroOrHasNoValue = AutoNumericHelper.isZeroOrHasNoValue(inputValue);

        // Temporarily remove the negative sign if present
        if (isValueNegative) {
            inputValue = inputValue.replace('-', ''); // At this point the `inputValue` has been normalized with a 'normal' negative sign `'-'` //TODO Check that comment validity, since `_stripAllNonNumberCharactersExceptCustomDecimalChar` *does not* convert the negative sign
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
        if (settings.negativeBracketsTypeOnBlur !== null && (forcedRawValue < 0 || AutoNumericHelper.isNegativeStrict(inputValue, settings.negativeSignCharacter))) {
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
        if (AutoNumericHelper.isNull(this.settings.caretPositionOnFocus) &&
            this.settings.selectOnFocus === AutoNumeric.options.selectOnFocus.doNotSelect) {
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
            value = value.replace(this.settings.negativeSignCharacter, '');
            value = value.replace(this.settings.positiveSignCharacter, '');
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
     * Round the given `value` with the number of decimal places to show for the element if focused.
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
     * Round the given `value` with the number of decimal places to show for the element if unfocused.
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
     * Round the given `value` with the number of decimal places to show for the element based on the value of isFocused.
     *
     * @param {string|null} value An unformatted numeric value
     * @param {object} settings
     * @param {boolean} isFocused
     * @returns {*}
     * @private
     */
    static _roundFormattedValueShownOnFocusOrBlur(value, settings, isFocused) {
        if (isFocused) {
            return this._roundFormattedValueShownOnFocus(value, settings);
        } else {
            return this._roundFormattedValueShownOnBlur(value, settings);
        }
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
        const [integerPart, decimalPart] = inputValue.split('.'); // Here the decimal character is always a period '.'
        const hasDecimals = decimalPart > 0;

        // If no decimals are detected
        if (!hasDecimals &&
            (settings.allowDecimalPadding === AutoNumeric.options.allowDecimalPadding.never ||
            settings.allowDecimalPadding === AutoNumeric.options.allowDecimalPadding.floats)) {
            // If the value decimalPart is only one or more zeroes, then it needs to be removed from the resulting string (cf. issue #652)
            return (Number(inputValue) === 0) ? integerPart : `${negativeSign}${integerPart}`;
        }

        // Else there are some decimal places that may need to be rounded
        // Sets the truncate zero method
        let temporaryDecimalPlacesOverride;
        if (settings.allowDecimalPadding === AutoNumeric.options.allowDecimalPadding.always ||
            settings.allowDecimalPadding === AutoNumeric.options.allowDecimalPadding.floats) {
            temporaryDecimalPlacesOverride = decimalPlacesToRoundTo;
        } else if (settings.allowDecimalPadding > 0) {
            temporaryDecimalPlacesOverride = settings.allowDecimalPadding;
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
     * This convert the `value` to a positive one, trim any leading zeros and make sure it does not start with a leading dot.
     *
     * @param {string} value The unformatted value
     * @param {object} settings
     * @returns {[string, string]}
     * @private
     */
    static _prepareValueForRounding(value, settings) {
        // Checks if `inputValue` is a negative value
        let negativeSign = '';
        if (AutoNumericHelper.isNegativeStrict(value, '-')) { // The value being unformatted, we check for the minus sign
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
     * @param {string} negativeSign This variable comes from `_prepareValueForRounding()`, which return `'-'` if the initial value was negative
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
     * Check if the given value is within the `minimumValue` and `maximumValue` range, while using the override options set with `overrideMinMaxLimits`.
     * The minimum and maximum limit test results are returned in an array like `[isMinimumLimitRespected, isMaximumLimitRespected]`.
     *
     * @param {string} value
     * @param {object} settings
     * @returns {[boolean, boolean]}
     */
    static _checkIfInRangeWithOverrideOption(value, settings) {
        if ((AutoNumericHelper.isNull(value) && settings.emptyInputBehavior === AutoNumeric.options.emptyInputBehavior.null) || // When the `null` value is accepted as the `rawValue`, the limits are ignored
            settings.overrideMinMaxLimits === AutoNumeric.options.overrideMinMaxLimits.ignore ||
            settings.overrideMinMaxLimits === AutoNumeric.options.overrideMinMaxLimits.invalid) {
            return [true, true];
        }

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
            default:
                result = [AutoNumericHelper.testMinMax(minParse, valParse) > -1, AutoNumericHelper.testMinMax(maxParse, valParse) < 1];
        }

        return result;
    }

    /**
     * Returns `true` if the given value is within the `minimumValue` and `maximumValue` limits, while using the override options set with `overrideMinMaxLimits`, `false` otherwise
     *
     * @param {string} value
     * @param {object} settings
     * @returns {boolean}
     * @private
     */
    static _isWithinRangeWithOverrideOption(value, settings) {
        const [minTest, maxTest] = this._checkIfInRangeWithOverrideOption(value, settings);

        return minTest && maxTest;
    }

    /**
     * Helper function that prepares the value string for the min/max test
     *
     * @param {string} value
     * @returns {{}}
     * @private
     */
    static _cleanValueForRangeParse(value) {
        value = value.toString().replace(',', '.');

        return AutoNumericHelper.parseStr(value);
    }

    /**
     * Returns `true` is the value is superior or equal to the `minimumValue` limit, discarding any override options
     *
     * @param {string} value
     * @param {object} settings
     * @returns {boolean}
     * @private
     */
    static _isMinimumRangeRespected(value, settings) {
        return AutoNumericHelper.testMinMax(AutoNumericHelper.parseStr(settings.minimumValue), this._cleanValueForRangeParse(value)) > -1;
    }

    /**
     * Returns `true` is the value is inferior or equal to the `maximumValue` limit, discarding any override options
     *
     * @param {string} value
     * @param {object} settings
     * @returns {boolean}
     * @private
     */
    static _isMaximumRangeRespected(value, settings) {
        return AutoNumericHelper.testMinMax(AutoNumericHelper.parseStr(settings.maximumValue), this._cleanValueForRangeParse(value)) < 1;
    }

    /**
     * Helper function that triggers the range events if they are needed
     *
     * @param {boolean} minTest
     * @param {boolean} maxTest
     * @private
     */
    _triggerRangeEvents(minTest, maxTest) {
        if (!minTest) {
            this._triggerEvent(AutoNumeric.events.minRangeExceeded, this.domElement);
        }

        if (!maxTest) {
            this._triggerEvent(AutoNumeric.events.maxRangeExceeded, this.domElement);
        }
    }

    /**
     * Set the invalid state on the AutoNumeric element.
     * If the element is not an input, and therefore a contenteditable-enabled element, its validity state cannot be changed.
     * In that case, the invalid css class defined with the `settings.invalidClass` option is added to the element.
     * The 'autoNumeric:invalidValue' event is always sent when this function is called.
     *
     * @private
     */
    _setInvalidState() {
        if (this.isInputElement) {
            AutoNumericHelper.setInvalidState(this.domElement);
        } else {
            this._addCSSClass(this.settings.invalidClass);
        }

        this._triggerEvent(AutoNumeric.events.invalidValue, this.domElement);
        this.validState = false;
    }

    /**
     * Set the valid state on the AutoNumeric element.
     * If the element is not an input, and therefore a contenteditable-enabled element, its validity state cannot be changed.
     * In that case, the invalid css class defined with the `settings.invalidClass` option is removed.
     * The 'autoNumeric:correctedValue' event is sent if the element state is invalid when this is called.
     *
     * @private
     */
    _setValidState() {
        if (this.isInputElement) {
            AutoNumericHelper.setValidState(this.domElement);
        } else {
            this._removeCSSClass(this.settings.invalidClass);
        }

        if (!this.validState) {
            this._triggerEvent(AutoNumeric.events.correctedValue, this.domElement);
        }

        this.validState = true;
    }

    /**
     * Sets the valid or invalid state on the DOM element, if the value is within the range set by the minimum and maximum value
     *
     * @param {string} value
     * @private
     */
    _setValidOrInvalidState(value) {
        if (this.settings.overrideMinMaxLimits === AutoNumeric.options.overrideMinMaxLimits.invalid) {
            const minRangeOk = this.constructor._isMinimumRangeRespected(value, this.settings);
            const maxRangeOk = this.constructor._isMaximumRangeRespected(value, this.settings);

            if (minRangeOk && maxRangeOk) {
                this._setValidState();
            } else {
                this._setInvalidState();
            }

            this._triggerRangeEvents(minRangeOk, maxRangeOk);
        }
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
        // Return the empty string is the value is already empty. This prevents converting that value to '0'.
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
        // Trim the trailing zeros after the last decimal place not being a zero (i.e. 1.2300 -> 1.23)
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
                // Use cookies for obsolete browsers that do not support sessionStorage (i.e. IE 6 & 7)
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
                result = this.constructor._readCookie(this.rawValueStorageName);
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
     * Get the default value from the html `value` attribute.
     * Return the empty string if such attribute is not found.
     *
     * @param {HTMLElement} domElement
     *
     * @returns {string}
     * @private
     */
    _getDefaultValue(domElement) {
        // Get the default html value
        // Note: we do not use the simpler `return domElement.defaultValue;` code since the given domElement can sometime be a `contenteditable` element which does not support the `defaultValue` attribute.
        const value = domElement.getAttribute('value');

        if (AutoNumericHelper.isNull(value)) {
            return '';
        }

        return value;
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
     * @param {KeyboardEvent|MouseEvent} e
     * @private
     */
    _onFocusInAndMouseEnter(e) {
        //TODO Create separate handlers for the focus and mouseenter events
        this.isEditing = false; // Just in case no `keyUp` event have been sent (i.e. if the user lost the focus from the current window while typing)

        if (!this.formulaMode && this.settings.unformatOnHover && e.type === 'mouseenter' && e.altKey) {
            this.constructor._unformatAltHovered(this);

            return;
        }

        if (e.type === 'focus') { //TODO Move that back to the 'focus' event handler when the separation between the 'focus' and 'mouseenter' handler will be done
            // Keep track if the element is currently focused
            this.isFocused = true;
            this.rawValueOnFocus = this.rawValue; // Keep track of the initial rawValue. This is needed to define if a change event must be dispatched later
        }

        if (e.type === 'focus' && this.settings.unformatOnHover && this.hoveredWithAlt) {
            this.constructor._reformatAltHovered(this);
        }

        if (e.type === 'focus' || e.type === 'mouseenter' && !this.isFocused) {
            let elementValueToSet = null; // Store the value we want to set on the element, and only call `_setElementValue()` once

            if (this.settings.emptyInputBehavior === AutoNumeric.options.emptyInputBehavior.focus &&
                this.rawValue < 0 && this.settings.negativeBracketsTypeOnBlur !== null && this.settings.isNegativeSignAllowed) { //FIXME this is called a second time in _addGroupSeparators too. Prevent this, if possible.
                // Only remove the brackets if the value is negative
                elementValueToSet = this.constructor._removeBrackets(AutoNumericHelper.getElementValue(this.domElement), this.settings);
                //FIXME The element value is set here, why continue and set it again later in that same parent logic block?
            }

            // Use the `rawValue`, multiplied by `rawValueDivisor` if defined
            const rawValueToFormat = this._getRawValueToFormat(this.rawValue);

            // Modify the element value according to the number of decimal places to show on focus or the `showOnlyNumbersOnFocus` option
            if (rawValueToFormat !== '') {
                // Round the given value according to the object state (focus/unfocused)
                const roundedValue = this.constructor._roundFormattedValueShownOnFocusOrBlur(rawValueToFormat, this.settings, this.isFocused);

                if (this.settings.showOnlyNumbersOnFocus === AutoNumeric.options.showOnlyNumbersOnFocus.onlyNumbers) {
                    //TODO Use a `this.settingsOverride` object instead of modifying the `this.settings` object
                    this.settings.digitGroupSeparator = '';
                    this.settings.currencySymbol      = '';
                    this.settings.suffixText          = '';
                    elementValueToSet = roundedValue.replace('.', this.settings.decimalCharacter);
                } else {
                    let formattedValue;
                    if (AutoNumericHelper.isNull(roundedValue)) {
                        formattedValue = '';
                    } else {
                        formattedValue = this.constructor._addGroupSeparators(roundedValue.replace('.', this.settings.decimalCharacter), this.settings, this.isFocused, rawValueToFormat);
                    }

                    elementValueToSet = formattedValue;
                }
            }

            // In order to send a 'native' change event when blurring the input, we need to first store the initial input value on focus.
            if (AutoNumericHelper.isNull(elementValueToSet)) {
                this.valueOnFocus = '';
            } else {
                this.valueOnFocus = elementValueToSet;
            }

            this.lastVal = this.valueOnFocus;
            const isEmptyValue = this.constructor._isElementValueEmptyOrOnlyTheNegativeSign(this.valueOnFocus, this.settings);
            const orderedValue = this.constructor._orderValueCurrencySymbolAndSuffixText(this.valueOnFocus, this.settings, true); // This displays the currency sign on hover even if the rawValue is empty
            const orderedValueTest = (isEmptyValue && orderedValue !== '') && this.settings.emptyInputBehavior === AutoNumeric.options.emptyInputBehavior.focus;
            if (orderedValueTest) {
                elementValueToSet = orderedValue;
            }

            if (!AutoNumericHelper.isNull(elementValueToSet)) {
                this._setElementValue(elementValueToSet);
            }

            if (orderedValueTest && orderedValue === this.settings.currencySymbol && this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix) {
                // If there is a currency symbol and its on the right hand side, then we place the caret accordingly on the far left side
                AutoNumericHelper.setElementSelection(e.target, 0);
            }
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
            if (!AutoNumericHelper.isNull(this.settings.caretPositionOnFocus)) {
                AutoNumericHelper.setElementSelection(e.target, this._initialCaretPosition(AutoNumericHelper.getElementValue(this.domElement)));
            }
        }
    }

    /**
     * Enter the special 'formula mode' where users can enter a math expression that will be evaluated on blur and `enter`
     * @private
     */
    _enterFormulaMode() {
        if (this.settings.formulaMode) {
            this.formulaMode = true; // 'Deactivate' the normal event listeners behavior
            // Clear the input and add a '=' sign to it
            AutoNumericHelper.setElementValue(this.domElement, '=');
            // Put the caret after the `=` character
            AutoNumericHelper.setElementSelection(this.domElement, 1);
        }
    }

    /**
     * Exit the formula mode
     * Tries to parse and evaluate the math expression, then `set()` the result if it's correct, otherwise reformat with the previous `rawValue`
     * @private
     */
    _exitFormulaMode() {
        // Parse the formula
        let formula = AutoNumericHelper.getElementValue(this.domElement);
        formula     = formula.replace(/^\s*=/, ''); // Remove all the leading whitespaces and the equal sign from the formula
        let result;
        try {
            const ast = new Parser(formula, this.settings.decimalCharacter);
            result    = (new Evaluator()).evaluate(ast);
        } catch (e) {
            // Error when parsing the math expression
            this._triggerEvent(AutoNumeric.events.invalidFormula, this.domElement, {
                formula,
                aNElement: this,
            });
            this.reformat();
            this.formulaMode = false;

            return;
        }

        // The math expression is correctly parsed
        this._triggerEvent(AutoNumeric.events.validFormula, this.domElement, {
            formula,
            result,
            aNElement: this,
        });
        this.set(result); // Note: we can have a valid formula, but an invalid value (i.e. out of the min/max range)
        this.formulaMode = false;
    }

    /**
     * Returns `true` if the non-printable key is accepted in formula mode
     *
     * @returns {boolean}
     * @private
     */
    _acceptNonPrintableKeysInFormulaMode() {
        return this.eventKey === AutoNumericEnum.keyName.Backspace || this.eventKey === AutoNumericEnum.keyName.Delete ||
            this.eventKey === AutoNumericEnum.keyName.LeftArrow || this.eventKey === AutoNumericEnum.keyName.RightArrow ||
            this.eventKey === AutoNumericEnum.keyName.Home || this.eventKey === AutoNumericEnum.keyName.End;
    }

    /**
     * Handler for 'keydown' events.
     * The user just started pushing any key, hence one event is sent.
     *
     * Note :
     * By default a 'normal' input output those events in the right order when inputting a character key (i.e. 'a') :
     * - keydown
     * - keypress
     * - input
     * - keyup
     *
     * ...when inputting a modifier key (i.e. 'ctrl') :
     * - keydown
     * - keyup
     *
     * If 'delete' or 'backspace' are entered 'normally', the following events are sent :
     * - keydown
     * - input
     * - keyup
     *
     * If 'delete' or 'backspace' are entered continuously (with the key still pressed), the following events are sent :
     * - keydown
     * - input
     * [- keydown
     * - input] x times
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
        this.formatted = false; // Keep track if the element has been formatted already. If that's the case, prevent further format calculations.
        this.isEditing = true; // Keep track if the user is currently editing the element manually

        if (!this.formulaMode && !this.isFocused && this.settings.unformatOnHover && e.altKey && this.domElement === AutoNumericHelper.getHoveredElement()) {
            // Here I prevent calling _unformatAltHovered if the element is already focused, since the global 'keydown' listener will pick it up as well
            this.constructor._unformatAltHovered(this);

            return;
        }

        this._updateEventKeyInfo(e);

        this.keydownEventCounter += 1; // Every time the keydown event is caught, increment the counter to keep track if the key is continuously pressed
        if (this.keydownEventCounter === 1) {
            this.initialValueOnFirstKeydown = AutoNumericHelper.getElementValue(e.target); // This is needed in `onKeyup()` to check if the value as changed during the key press
            this.initialRawValueOnFirstKeydown = this.rawValue;
        }

        if (this.formulaMode) {
            if (this.eventKey === AutoNumericEnum.keyName.Esc) { // Cancel the formula
                this.formulaMode = false;
                this.reformat();

                return;
            }

            if (this.eventKey === AutoNumericEnum.keyName.Enter) { // Calculate the formula
                this._exitFormulaMode();

                return;
            }

            // Accept the backspace, delete, arrow, home and end keys
            if (this._acceptNonPrintableKeysInFormulaMode()) {
                return;
            }

            //TODO Manage the undo/redo events *while* editing a math expression
            //TODO Manage the cut/paste events *while* editing a math expression
        } else {
            if (this.eventKey === AutoNumericEnum.keyName.Equal) {
                this._enterFormulaMode();

                return;
            }

            if (this.settings.modifyValueOnUpDownArrow &&
                (this.eventKey === AutoNumericEnum.keyName.UpArrow || this.eventKey === AutoNumericEnum.keyName.DownArrow)) {
                this.upDownArrowAction(e);

                return;
            }
        }

        if (this.domElement.readOnly || this.settings.readOnly || this.domElement.disabled) {
            this.processed = true;

            return;
        }

        if (this.eventKey === AutoNumericEnum.keyName.Esc) {
            //XXX The default 'Escape' key behavior differs between Firefox and Chrome, Firefox already having a built-in 'cancellable-like' feature. This is why we call `e.preventDefault()` here instead of just when `isCancellable` is set to `true`. This allow us to keep the same behavior across browsers.
            e.preventDefault();

            if (this.settings.isCancellable) {
                // If the user wants to cancel his modifications:
                // We set back the saved value
                if (this.rawValue !== this.savedCancellableValue) {
                    // Do not set the value again if it has not changed
                    this.set(this.savedCancellableValue);
                    // And we need to send an 'input' event when setting back the initial value in order to make other scripts aware of the value change...
                    this._triggerEvent(AutoNumeric.events.native.input, e.target);
                }
            }

            // ...and lastly we update the caret selection, even if the option `isCancellable` is false
            this.select();
            //TODO Add an option to select either the integer or decimal part with `Esc`
        }

        // The "enter" key throws a `change` event if the raw value has changed since the `focus` event
        let targetValue = AutoNumericHelper.getElementValue(e.target);
        if (this.eventKey === AutoNumericEnum.keyName.Enter && this.rawValue !== this.rawValueOnFocus) {
            this._triggerEvent(AutoNumeric.events.native.change, e.target);
            this.valueOnFocus = targetValue;
            this.rawValueOnFocus = this.rawValue;

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
            const isDeletionAllowed = this._processCharacterDeletion(e); // Because backspace and delete only triggers keydown and keyup events, not keypress
            this.processed = true;
            if (!isDeletionAllowed) {
                // Prevent the deletion if `overrideMinMaxLimits` option is `doNotOverride` and the result goes out of the allowed range
                e.preventDefault();

                return;
            }

            this._formatValue(e);

            // If and only if the resulting value has changed after that backspace/delete, then we have to send an 'input' event like browsers normally do.
            targetValue = AutoNumericHelper.getElementValue(e.target); // Update the value since it could have been changed during the deletion
            if ((targetValue !== this.lastVal) && this.throwInput) {
                // Throw an input event when a character deletion is detected
                this._triggerEvent(AutoNumeric.events.native.input, e.target);
                e.preventDefault(); // ...and immediately prevent the browser to delete a second character
            }

            this.lastVal = targetValue;
            this.throwInput = true;
        }
    }

    /**
     * Handler for 'keypress' events.
     * The user is still pressing the key, which will output a character (i.e. '2') continuously until he releases the key.
     * Note: 'keypress' events are not sent for delete keys like Backspace/Delete.
     *
     * @param {KeyboardEvent} e
     */
    _onKeypress(e) {
        if (this.formulaMode) {
            // Accept the backspace, delete, arrow, home and end keys
            if (this._acceptNonPrintableKeysInFormulaMode()) {
                return;
            }

            //TODO Prevent keys to be entered on the left-hand side of the '=' sign?...Or just let the user see what they are wrongly doing?
            if (this.settings.formulaChars.test(this.eventKey)) { // Accept the custom decimal character too
                return; // Accept the key in the formula (and do not accept the '=' character here again)
            } else {
                e.preventDefault(); // Reject the key
            }

            return;
        }

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
                this._triggerEvent(AutoNumeric.events.native.input, e.target);
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

            this._setValidOrInvalidState(this.rawValue); // Updates the valid state as soon as the number is entered (in the case where the user keeps pressing the number key)

            return;
        }

        e.preventDefault();
    }

    /**
     * Handler for 'keyup' events.
     * The user just released any key, hence one event is sent.
     *
     * @param {KeyboardEvent} e
     */
    _onKeyup(e) {
        this.isEditing = false;
        this.keydownEventCounter = 0; // Reset the keydown events counter

        if (this.formulaMode) {
            return;
        }

        if (this.settings.isCancellable && this.eventKey === AutoNumericEnum.keyName.Esc) {
            // If the user wants to cancel its modifications, we drop the 'keyup' event for the Esc key
            e.preventDefault();

            return;
        }

        // Manage the undo/redo events
        this._updateEventKeyInfo(e); // Fixes #761, where the Ctrl key is not correctly detected during undo/redo since this.eventKey was not updated from 'Z' to 'Control'
        if (this.eventKey === AutoNumericEnum.keyName.Z || this.eventKey === AutoNumericEnum.keyName.z) {
            if (e.ctrlKey && e.shiftKey) {
                // Redo
                e.preventDefault();
                this._historyTableRedo();
                this._triggerEvent(AutoNumeric.events.native.input, e.target); //TODO instead of adding the event here, generate it from the `_historyTableRedo()` function?
                this.onGoingRedo = true;

                return;
            } else if (e.ctrlKey && !e.shiftKey) {
                if (this.onGoingRedo) {
                    // Prevent an 'undo' to be launched when releasing the shift key before the ctrl key after a 'redo' shortcut
                    this.onGoingRedo = false;
                } else {
                    e.preventDefault();
                    // Undo
                    this._historyTableUndo();
                    this._triggerEvent(AutoNumeric.events.native.input, e.target); //TODO instead of adding the event here, generate it from the `_historyTableRedo()` function?

                    return;
                }
            }
        } else if ((this.eventKey === AutoNumericEnum.keyName.Y || this.eventKey === AutoNumericEnum.keyName.y) && e.ctrlKey) {
            // Redo
            e.preventDefault();
            this._historyTableRedo();
            this._triggerEvent(AutoNumeric.events.native.input, e.target); //TODO instead of adding the event here, generate it from the `_historyTableRedo()` function?
            this.onGoingRedo = true;

            return;
        }

        if (this.onGoingRedo && (e.ctrlKey || e.shiftKey)) {
            // Special case where if the user has entered `Control+Shift+z`, then release `z`, keeping `Control` or `Shift` pressed, then `this.onGoingRedo` is never changed back to `false` when the user release `Control` or `Shift`
            this.onGoingRedo = false;
        }

        // Manage the Cut event
        if ((e.ctrlKey || e.metaKey) && this.eventKey === AutoNumericEnum.keyName.x) {
            // Save the caret position at the start of the selection
            const caretPosition = AutoNumericHelper.getElementSelection(this.domElement).start;
            // Convert the remaining 'formatted' numbers in a Js number
            const cutNumber = this.constructor._toNumericValue(AutoNumericHelper.getElementValue(e.target), this.settings);
            // Try to set that value with `set()`
            this.set(cutNumber);
            // Set back the initial caret position
            this._setCaretPosition(caretPosition);
        }

        // Manage the reformat when hovered with the Alt key pressed
        if (this.eventKey === AutoNumericEnum.keyName.Alt && this.settings.unformatOnHover && this.hoveredWithAlt) {
            this.constructor._reformatAltHovered(this);

            return;
        }

        // Manage the Backspace and Delete keys when used in combination with the control key (fix #656)
        if ((e.ctrlKey || e.metaKey) && (this.eventKey === AutoNumericEnum.keyName.Backspace || this.eventKey === AutoNumericEnum.keyName.Delete)) {
            const targetValue = AutoNumericHelper.getElementValue(e.target);
            this._setRawValue(this._formatOrUnformatOther(false, targetValue));

            return;
        }

        this._updateInternalProperties(e);

        const skip = this._processNonPrintableKeysAndShortcuts(e);
        delete this.valuePartsBeforePaste;
        const targetValue = AutoNumericHelper.getElementValue(e.target);
        if (skip || targetValue === '' && this.initialValueOnFirstKeydown === '') { // If the user enters skippable keys, or keeps deleting/backspacing into the empty input, no 'formatted' event are sent (cf. issue #621)
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

        this._setValidOrInvalidState(this.rawValue);

        // Force the `rawValue` update on Android Chrome
        this._saveRawValueForAndroid();

        // If the input value has changed during the key press event chain, an event is sent to alert that a formatting has been done (cf. Issue #187)
        if (targetValue !== this.initialValueOnFirstKeydown) { // Checking the value that were saved after the very first keydown event ensure that the 'formatted' event will be sent even if the user continuously press the Delete/Backspace key
            this._triggerEvent(AutoNumeric.events.formatted, e.target, {
                oldValue   : this.initialValueOnFirstKeydown,
                newValue   : targetValue,
                oldRawValue: this.initialRawValueOnFirstKeydown,
                newRawValue: this.rawValue,
                isPristine : this.isPristine(false),
                error      : null,
                aNElement  : this,
            });
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
     * On Android Chrome, the `rawValue` is not updated when the user changes the input value.
     * This function updates the `rawValue` accordingly.
     * @private
     */
    _saveRawValueForAndroid() {
        if (this.eventKey === AutoNumericEnum.keyName.AndroidDefault) {
            let normalizedValue = this.constructor._stripAllNonNumberCharactersExceptCustomDecimalChar(this.getFormatted(), this.settings, true, this.isFocused);
            normalizedValue = this.constructor._convertToNumericString(normalizedValue, this.settings);

            this._setRawValue(normalizedValue);
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
        //TODO Create separate handlers for blur and mouseleave
        this.isEditing = false; // Just in case no `keyUp` event have been sent (if the user lost the focus on the window while typing)

        if (e.type === 'mouseleave' && this.formulaMode) {
            return;
        }

        //FIXME Do not call `set()` if the current raw value is the same as the one we are trying to set (currently, on focus out, `set()` is always called, even if the value has not changed
        if (this.settings.unformatOnHover && e.type === 'mouseleave' && this.hoveredWithAlt) {
            this.constructor._reformatAltHovered(this);

            return;
        }

        if ((e.type === 'mouseleave' && !this.isFocused) || e.type === 'blur') {
            if (e.type === 'blur' && this.formulaMode) {
                this._exitFormulaMode();
            }

            this._saveValueToPersistentStorage();
            if (this.settings.showOnlyNumbersOnFocus === AutoNumeric.options.showOnlyNumbersOnFocus.onlyNumbers) {
                this.settings.digitGroupSeparator = this.originalDigitGroupSeparator;
                this.settings.currencySymbol = this.originalCurrencySymbol;
                this.settings.suffixText = this.originalSuffixText;
            }

            // Use the rawValue, multiplied by `rawValueDivisor` if defined
            const rawValueToFormat = this._getRawValueToFormat(this.rawValue);
            const isRawValueNull = AutoNumericHelper.isNull(rawValueToFormat);
            const [minTest, maxTest] = this.constructor._checkIfInRangeWithOverrideOption(rawValueToFormat, this.settings);

            // Directly set the formatted value if the `rawValue` is found in `valuesToStrings`
            let elementValueIsAlreadySet = false;
            if (rawValueToFormat !== '' && !isRawValueNull) {
                this._triggerRangeEvents(minTest, maxTest);

                if (this.settings.valuesToStrings && this._checkValuesToStrings(rawValueToFormat)) {
                    // Set the formatted value with the corresponding string
                    this._setElementValue(this.settings.valuesToStrings[rawValueToFormat]);
                    elementValueIsAlreadySet = true;
                }
            }

            // Only generate the formatted value if no `valuesToStrings` have been found
            if (!elementValueIsAlreadySet) {
                let value;
                if (isRawValueNull || rawValueToFormat === '') {
                    value = rawValueToFormat;
                } else {
                    value = String(rawValueToFormat);
                }

                if (rawValueToFormat !== '' && !isRawValueNull) {
                    if (minTest && maxTest && !this.constructor._isElementValueEmptyOrOnlyTheNegativeSign(rawValueToFormat, this.settings)) {
                        value = this._modifyNegativeSignAndDecimalCharacterForRawValue(value);

                        if (this.settings.divisorWhenUnfocused && !AutoNumericHelper.isNull(value)) {
                            value = value / this.settings.divisorWhenUnfocused;
                            value = value.toString();
                        }

                        value = this.constructor._roundFormattedValueShownOnBlur(value, this.settings);
                        value = this.constructor._modifyNegativeSignAndDecimalCharacterForFormattedValue(value, this.settings);
                    } else {
                        this._triggerRangeEvents(minTest, maxTest);
                    }
                } else if (rawValueToFormat === '') {
                    switch (this.settings.emptyInputBehavior) {
                        case AutoNumeric.options.emptyInputBehavior.zero:
                            this._setRawValue('0');
                            value = this.constructor._roundValue('0', this.settings, 0); 
                            break;
                        case AutoNumeric.options.emptyInputBehavior.min:
                            this._setRawValue(this.settings.minimumValue);
                            value = this.constructor._roundFormattedValueShownOnFocusOrBlur(this.settings.minimumValue, this.settings, this.isFocused); 
                            break;
                        case AutoNumeric.options.emptyInputBehavior.max:
                            this._setRawValue(this.settings.maximumValue);
                            value = this.constructor._roundFormattedValueShownOnFocusOrBlur(this.settings.maximumValue, this.settings, this.isFocused); 
                            break;
                        default:
                            if (AutoNumericHelper.isNumber(this.settings.emptyInputBehavior)) {
                                this._setRawValue(this.settings.emptyInputBehavior);
                                value = this.constructor._roundFormattedValueShownOnFocusOrBlur(this.settings.emptyInputBehavior, this.settings, this.isFocused);
                            }
                    }
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
            }

            this._setValidOrInvalidState(this.rawValue);

            if (e.type === 'blur') {
                //TODO Create separate handlers for blur and mouseleave, really.
                this._onBlur(e);
            }
        }
    }

    /**
     * Handler for 'paste' event
     *
     * @param {Event|ClipboardEvent} e
     */
    _onPaste(e) {
        //FIXME When pasting '000' on a thousand group selection, the whole selection gets deleted, and only one '0' is pasted (cf. issue #302)
        // The event is prevented by default, since otherwise the user would be able to paste invalid characters into the input
        e.preventDefault();

        if (this.settings.readOnly || this.domElement.readOnly || this.domElement.disabled) {
            // Do not allow pasting in a readonly element (fix issue #505)
            return;
        }

        let rawPastedText;
        if (window.clipboardData && window.clipboardData.getData) {
            // Special case for the obsolete and non-standard IE browsers 10 and 11
            rawPastedText = window.clipboardData.getData('Text');
        } else if (e.clipboardData && e.clipboardData.getData) {
            // Normal case with modern browsers
            rawPastedText = e.clipboardData.getData('text/plain');
        } else {
            AutoNumericHelper.throwError('Unable to retrieve the pasted value. Please use a modern browser (i.e. Firefox or Chromium).');
        }

        // Fix for firefox paste handling on `contenteditable` elements where `e.target` is the text node, not the element
        let eventTarget;
        if (!e.target.tagName) {
            eventTarget = e.explicitOriginalTarget;
        } else {
            eventTarget = e.target;
        }

        // 0. Special case if the user has selected all the input text before pasting
        const initialFormattedValue = AutoNumericHelper.getElementValue(eventTarget);
        const selectionStart = eventTarget.selectionStart || 0;
        const selectionEnd = eventTarget.selectionEnd || 0;
        const selectionSize = selectionEnd - selectionStart;

        if (selectionSize === initialFormattedValue.length) { // If all the element text is selected
            //TODO Refactor this with the tests below
            // Since the whole element content will be replaced, no need to complicate things and directly test for the validity of the pasted content, then set the `rawValue` and caret position (fix issue #482)
            // 1. Strip all thousand separators, brackets and currency sign, and convert the decimal character to a dot
            const untranslatedPastedText = this._preparePastedText(rawPastedText);
            const pastedRawValue = AutoNumericHelper.arabicToLatinNumbers(untranslatedPastedText, false, false, false); // Allow pasting arabic numbers

            // 2. Check that the paste is a valid number once it has been normalized to a raw value
            if (pastedRawValue === '.' || pastedRawValue === '' || (pastedRawValue !== '.' && !AutoNumericHelper.isNumber(pastedRawValue))) {
                this.formatted = true; // This prevents the `keyup` event on the `v` key during a paste to try to format an empty value.
                // If the user tries to paste a single decimal character (that has been translated to '.' already) or the empty value, ignore the paste
                if (this.settings.onInvalidPaste === AutoNumeric.options.onInvalidPaste.error) {
                    AutoNumericHelper.throwError(`The pasted value '${rawPastedText}' is not a valid paste content.`);
                }

                return;
            }

            // 3. Then try to set it as the new value. The `set()` method will run the additional tests (i.e. limits) as needed.
            this.set(pastedRawValue);
            this.formatted = true;

            // 4. On a 'normal' non-autoNumeric input, an `input` event is sent when a paste is done. We mimic that.
            this._triggerEvent(AutoNumeric.events.native.input, eventTarget);

            // 5. Return since the job is done
            return;
        }

        // 1. Check if the paste has a negative sign (only if it's the first character), and store that information for later use
        const isPasteNegative = AutoNumericHelper.isNegativeStrict(rawPastedText, this.settings.negativeSignCharacter);
        if (isPasteNegative) {
            // 1a. Remove the negative sign from the pasted text
            rawPastedText = rawPastedText.slice(1, rawPastedText.length); //TODO This can lead to an empty rawPastedText if only the negative sign character is pasted. This then complains about not being a valid paste content. Define which behaviour we want when this happens, then implement the solution.
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
            this.formatted = true; // This prevents the `keyup` event on the `v` key during a paste to try to format an empty value (fix issue #484)
            if (this.settings.onInvalidPaste === AutoNumeric.options.onInvalidPaste.error) {
                AutoNumericHelper.throwError(`The pasted value '${rawPastedText}' is not a valid paste content.`);
            }

            return;
        }

        // 4. Calculate the paste result
        let caretPositionOnInitialTextAfterPasting;
        let isInitialValueNegative = AutoNumericHelper.isNegativeStrict(this.getNumericString(), this.settings.negativeSignCharacter);
        let isPasteNegativeAndInitialValueIsPositive;
        let result;

        // If the pasted content is negative, then the result will be negative too
        if (isPasteNegative && !isInitialValueNegative) {
            isInitialValueNegative = true;
            isPasteNegativeAndInitialValueIsPositive = true;
        }
        else {
            isPasteNegativeAndInitialValueIsPositive = false;
        }

        // 1. Generate the unformatted result
        const leftFormattedPart  = initialFormattedValue.slice(0, selectionStart);
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
            //TODO Quid if the positive sign is shown?
        }

        let leftPart  = result.slice(0, caretPositionOnInitialTextAfterPasting);
        let rightPart = result.slice(caretPositionOnInitialTextAfterPasting, result.length);
        let leftPartContainedADot = false;
        if (pastedText === '.') {
            if (AutoNumericHelper.contains(leftPart, '.')) {
                // If I remove a dot here, then I need to update the caret position (decrement it by 1) when positioning it
                // To do so, we keep that info in order to modify the caret position later
                leftPartContainedADot = true;
                leftPart              = leftPart.replace('.', '');
            }

            rightPart = rightPart.replace('.', '');
        }

        // Manage the case where a negative number is pasted onto another negative number that is entirely selected (cf. issue #593)
        let negativePasteOnNegativeNumber = false;
        if (leftPart === '' && rightPart === '-') {
            leftPart = '-';
            rightPart = '';
            // When pasting a negative number on a negative number, we need to offset the caret position one place to the right to take into account the negative sign
            negativePasteOnNegativeNumber = true;
        }

        // -- Here, we are good to go to continue on the same basis for each value of the `onInvalidPaste` option

        switch (this.settings.onInvalidPaste) {
            /* 4a. Truncate paste behavior:
             * Insert as many numbers as possible on the right hand side of the caret from the pasted text content, until the input reach its range limit.
             * If there is more characters in the clipboard once a limit is reached, drop the extraneous characters.
             * Otherwise paste all the numbers from the clipboard.
             * While doing so, we check if the result is within the minimum and maximum values allowed, and stop as soon as we encounter one of those.
             *
             * 4b. Replace paste behavior:
             * Idem than the 'truncate' paste behavior, except that when a range limit is hit, we try to replace the subsequent initial numbers with the pasted ones, until we hit the range limit a second (and last) time, or we run out of numbers to paste
             */
            /* eslint no-case-declarations: 0 */
            case AutoNumeric.options.onInvalidPaste.truncate:
            case AutoNumeric.options.onInvalidPaste.replace:
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
                if (negativePasteOnNegativeNumber) caretPositionOnInitialTextAfterPasting++;

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

                    // This replaces one character at a time
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
             * Insert the pasted number inside the current unformatted text, at the correct caret position or selection
             */
            case AutoNumeric.options.onInvalidPaste.error:
            case AutoNumeric.options.onInvalidPaste.ignore:
            case AutoNumeric.options.onInvalidPaste.clamp:
            default:
                // Generate the unformatted result
                result = `${leftPart}${pastedText}${rightPart}`;

                // 2. Calculate the caret position in the unformatted value, for later use
                if (selectionStart === selectionEnd) {
                    // There is no selection, then the caret position is set after the pasted text
                    const indexWherePastedTextHasBeenInserted = AutoNumericHelper.convertCharacterCountToIndexPosition(AutoNumericHelper.countNumberCharactersOnTheCaretLeftSide(initialFormattedValue, selectionStart, this.settings.decimalCharacter));
                    caretPositionOnInitialTextAfterPasting = indexWherePastedTextHasBeenInserted + pastedText.length; // I must not count the characters that have been removed from the pasted text (i.e. '.')
                } else if (rightPart === '') {
                    // If the user selected from the caret position to the end of the input (on the far right)
                    caretPositionOnInitialTextAfterPasting = AutoNumericHelper.convertCharacterCountToIndexPosition(AutoNumericHelper.countNumberCharactersOnTheCaretLeftSide(initialFormattedValue, selectionStart, this.settings.decimalCharacter)) + pastedText.length;
                    if (negativePasteOnNegativeNumber) caretPositionOnInitialTextAfterPasting++;
                } else {
                    // Usual case
                    const indexSelectionEndInRawValue = AutoNumericHelper.convertCharacterCountToIndexPosition(AutoNumericHelper.countNumberCharactersOnTheCaretLeftSide(initialFormattedValue, selectionEnd, this.settings.decimalCharacter));

                    // Here I must not count the characters that have been removed from the pasted text (i.e. '.'), or the thousand separators in the initial selected text
                    const selectedText = AutoNumericHelper.getElementValue(eventTarget).slice(selectionStart, selectionEnd);
                    caretPositionOnInitialTextAfterPasting = indexSelectionEndInRawValue - selectionSize + AutoNumericHelper.countCharInText(this.settings.digitGroupSeparator, selectedText) + pastedText.length;
                }

                // Modify the caret position for special cases, only if the whole input has not been selected
                if (isPasteNegativeAndInitialValueIsPositive) {
                    // If the pasted value has a negative sign ('-'), but the initial value does not, offset the index by one
                    caretPositionOnInitialTextAfterPasting++;
                }

                if (leftPartContainedADot) {
                    // If a dot has been removed for the part on the left of the caret, we decrement the caret index position
                    caretPositionOnInitialTextAfterPasting--;
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
         *      - Then try to replace as many numbers as possible with the pasted ones. Once it fails, keep the last known non-failing result.
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
                // Fall through
                case AutoNumeric.options.onInvalidPaste.ignore:
                // Do nothing
                // Fall through
                default :
                    return; // ...and nothing else should be changed
            }
        }

        // 7. Then lastly, set the caret position at the right logical place
        const targetValue = AutoNumericHelper.getElementValue(eventTarget);
        let caretPositionInFormattedNumber;
        if (valueHasBeenSet) {
            switch (this.settings.onInvalidPaste) {
                case AutoNumeric.options.onInvalidPaste.clamp:
                    if (valueHasBeenClamped) {
                        if (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix) {
                            AutoNumericHelper.setElementSelection(eventTarget, targetValue.length - this.settings.currencySymbol.length); // This puts the caret on the right of the last decimal place
                        } else {
                            AutoNumericHelper.setElementSelection(eventTarget, targetValue.length); // ...and this on the far right
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
                    AutoNumericHelper.setElementSelection(eventTarget, caretPositionInFormattedNumber);
            }
        }

        // 8. We make sure we send an input event only if the result is different from the initial value before the paste
        if (valueHasBeenSet && initialFormattedValue !== targetValue) {
            // On a 'normal' non-autoNumeric input, an `input` event is sent when a paste is done. We mimic that.
            this._triggerEvent(AutoNumeric.events.native.input, eventTarget);
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

        // Send a `change` event if the raw value has been changed since the last focus or 'enter' validation
        if (AutoNumericHelper.trimPaddedZerosFromDecimalPlaces(this.rawValue) !== AutoNumericHelper.trimPaddedZerosFromDecimalPlaces(this.rawValueOnFocus)) {
            this._triggerEvent(AutoNumeric.events.native.change, e.target);
        }

        this.rawValueOnFocus = void(0); // Reset the tracker
    }

    /**
     * Helper function that DRY the similar behaviors of the mousewheel and up/down arrow keys, which increment/decrement the element value, either by a fixed value, or using the 'progressive' heuristic
     *
     * @param {WheelEvent|KeyboardEvent} e The `wheel` or keyboard event
     * @param {boolean} isUp Defines if the event should increment the value
     * @param {boolean} isDown Defines if the event should decrement the value
     * @param {string|number} step The step to be applied to the increment/decrement action
     * @private
     */
    _wheelAndUpDownActions(e, isUp, isDown, step) {
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
                if (isUp) {
                    result = this.settings.minimumValue;
                } else {
                    result = this.settings.maximumValue;
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
        if (AutoNumericHelper.isNumber(step)) {
            const stepToUse = +step; // Typecast to a number needed for the following addition/subtraction
            // Fixed method
            // This is the simplest method, where a fixed offset in added/subtracted from the current value
            if (isUp) { // Increment
                result += stepToUse;
            } else if (isDown) { // Decrement
                result -= stepToUse;
            }
        } else {
            // Progressive method
            // For this method, we calculate an offset that is in relation to the size of the current number (using only the integer part size).
            // The bigger the number, the bigger the offset (usually the number count in the integer part minus 3, except for small numbers where a different behavior is better for the user experience).
            //TODO Known limitation : The progressive method does not play well with numbers between 0 and 1 where to modify the decimal places the rawValue first has to go from '1' to '0'
            if (isUp) { // Increment
                result = AutoNumericHelper.addAndRoundToNearestAuto(result, this.settings.decimalPlacesRawValue);
            } else if (isDown) { // Decrement
                result = AutoNumericHelper.subtractAndRoundToNearestAuto(result, this.settings.decimalPlacesRawValue);
            }
        }

        // 3) Set the new value so it gets formatted
        // First clamp the result if needed
        result = AutoNumericHelper.clampToRangeLimits(result, this.settings);
        if (result !== +currentUnformattedValue) {
            // Only 'set' the value if it has changed. For instance 'set' should not happen if the user hits a limit and continue to try to go past it since we clamp the value.
            this.set(result);

            // Since we changed the input value, we send a native `input` event
            this._triggerEvent(AutoNumeric.events.native.input, e.target);
        }

        //XXX Do not prevent if the value is not modified? From a UX point of view, preventing the wheel event when the user use it on top of an autoNumeric element should always be done, even if the value does not change. Perhaps that could affect other scripts relying on this event to be sent though.
        e.preventDefault(); // We prevent the page to scroll while we increment/decrement the value

        // 4) Finally, we set back the caret position/selection
        // There is no need to take into account the fact that the number count could be different at the end of the wheel event ; it would be too complex and most of the time unreliable
        this._setSelection(selectionStart, selectionEnd);
    }

    /**
     * Handler for up and down arrow keys
     * Increment or decrement the element value according to the `upDownStep` option chosen
     *
     * @param {KeyboardEvent} e
     */
    upDownArrowAction(e) {
        if (this.formulaMode ||
            this.settings.readOnly || this.domElement.readOnly || this.domElement.disabled) {
            return;
        }

        let isUp = false;
        let isDown = false;
        if (this.eventKey === AutoNumericEnum.keyName.UpArrow) {
            isUp = true;
        } else if (this.eventKey === AutoNumericEnum.keyName.DownArrow) {
            isDown = true;
        } else {
            AutoNumericHelper.throwError('Something has gone wrong since neither an Up or Down arrow key is detected, but the function was still called!');
        }

        this._wheelAndUpDownActions(e, isUp, isDown, this.settings.upDownStep);
    }

    /**
     * Handler for 'wheel' event
     *
     * @param {WheelEvent} e
     */
    _onWheel(e) {
        if (this.formulaMode) {
            return;
        }

        if (this.settings.readOnly || this.domElement.readOnly || this.domElement.disabled) {
            // Do not allow scrolling in a readonly element (fix issue #541)
            return;
        }

        if (this.settings.modifyValueOnWheel) {
            if (this.settings.wheelOn === AutoNumeric.options.wheelOn.focus) {
                if (this.isFocused) {
                    if (!e.shiftKey) {
                        this.wheelAction(e);
                    }
                } else if (e.shiftKey) {
                    this.wheelAction(e);
                }
            } else if (this.settings.wheelOn === AutoNumeric.options.wheelOn.hover) {
                if (!e.shiftKey) {
                    this.wheelAction(e);
                } else {
                    // Note: When not `defaultPrevented`, Shift + mouse wheel is reserved by the browsers for horizontal scrolling.
                    // Hence, using the Shift key with the `wheelOn` 'hover' option will only scroll the page if we prevent the default behavior
                    e.preventDefault(); // Do not scroll horizontally

                    // Scroll vertically
                    window.scrollBy(0, AutoNumericHelper.isNegativeStrict(String(e.deltaY))?-50:50); // `e.deltaY` is usually too small compared to how the page is scrolled. That's why we use a fixed offset.
                }
            } else {
                AutoNumericHelper.throwError('Unknown `wheelOn` option.');
            }
        }
    }

    /**
     * Increment or decrement the element value according to the `wheelStep` option chosen
     *
     * @param {WheelEvent} e The `wheel` event
     */
    wheelAction(e) {
        this.isWheelEvent = true; // Keep the info that we are currently managing a mouse wheel event

        let isUp = false;
        let isDown = false;
        if (AutoNumericHelper.isWheelUpEvent(e)) {
            isUp = true;
        } else if (AutoNumericHelper.isWheelDownEvent(e)) {
            isDown = true;
        } else {
            AutoNumericHelper.throwError(`The event is not a 'wheel' event.`);
        }

        this._wheelAndUpDownActions(e, isUp, isDown, this.settings.wheelStep);

        this.isWheelEvent = false; // Set back the mouse wheel indicator to its default
    }

    /**
     * Handler for 'drop' event
     *
     * @param {DragEvent} e
     */
    _onDrop(e) {
        if (this.formulaMode) { // Dropping while in formula mode shouldn't be possible. This is done 'just in case'
            return;
        }

        // Note: by default browsers already prevent the drop on readOnly and disabled elements
        this.isDropEvent = true;
        e.preventDefault();
        let format;
        if (AutoNumericHelper.isIE11()) {
            format = 'text';
        } else {
            format = 'text/plain';
        }

        const droppedText = e.dataTransfer.getData(format);
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
        // Search for all the AutoNumeric children of the form element and call the `_unformatOnSubmit()` function
        const inputElements = this._getFormAutoNumericChildren(this.parentForm);
        const aNElements = inputElements.map(aNElement => this.constructor.getAutoNumericElement(aNElement));
        aNElements.forEach(aNElement => aNElement._unformatOnSubmit());

        return true;
    }

    /**
     * Handler for 'reset' events caught on the parent <form> element.
     * When such event is detected, then every child AutoNumeric elements must format their default value that the browser is forcing upon them.
     *
     * @private
     */
    _onFormReset() {
        const inputElements = this._getFormAutoNumericChildren(this.parentForm);
        const aNElements = inputElements.map(aNElement => this.constructor.getAutoNumericElement(aNElement));
        // Tell all the AutoNumeric children to format their default value
        aNElements.forEach(aNElement => {
            const val = this._getDefaultValue(aNElement.node());
            // aNElement.set(val); //XXX If I use that line, the format is first correctly done, but the form reset is still not finished and will overwrite the formatting. This is why we need to use the following setTimeout line.
            setTimeout(() => aNElement.set(val), 0); //XXX This is an ugly hack, but it seems to be the accepted answer to this problem (https://stackoverflow.com/a/8152960/2834898). This is sad. Do note that I use '0ms' here since using `setTimeout` will push that code on the event stack, and as soon as the reset will be finished, this will be run (see https://stackoverflow.com/a/23987283/2834898).
        });
    }

    /**
     * Unformat the element value according to the `unformatOnSubmit` option
     *
     * @private
     */
    _unformatOnSubmit() {
        if (this.settings.unformatOnSubmit) {
            this._setElementValue(this.rawValue);
        }
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
                if (!anElement.formulaMode && anElement.settings.unformatOnHover) {
                    this.constructor._unformatAltHovered(anElement);
                }
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
                if (anElement.formulaMode || !anElement.settings.unformatOnHover) {
                    return;
                }

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
     * A supported element is either an <input> element with the correct 'type' attribute, or a tag whitelisted in the `allowedTagList` array.
     * If the check fails, this method throws.
     * This function also sets the info `this.isInputElement` which keep tracks if the DOM element is an <input> or not, and the `this.isContentEditable` if the element has the `contenteditable` attribute set to `true` initially.
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
            // Make sure the initial value does not have any superfluous whitespaces around it (Fix issue #479)
            currentValue = AutoNumericHelper.getElementValue(this.domElement).trim();
            // Correct the DOM attribute in case some whitespaces were present
            this.domElement.setAttribute('value', currentValue);
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
                        const toStrip = this.constructor._removeBrackets(currentValue, this.settings);
                        if ((this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.suffix ||
                            (this.settings.negativePositiveSignPlacement !== AutoNumeric.options.negativePositiveSignPlacement.prefix && this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix)) &&
                            this.settings.negativeSignCharacter !== '' &&
                            AutoNumericHelper.isNegative(currentValue, this.settings.negativeSignCharacter)) {
                            this._setRawValue(`-${this.constructor._stripAllNonNumberCharacters(toStrip, this.settings, true, this.isFocused)}`);
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
                    case AutoNumeric.options.emptyInputBehavior.null:
                    case AutoNumeric.options.emptyInputBehavior.press:
                        break;
                    case AutoNumeric.options.emptyInputBehavior.always:
                        this._setElementValue(this.settings.currencySymbol);
                        break;
                    case AutoNumeric.options.emptyInputBehavior.min:
                        this.set(this.settings.minimumValue);
                        break;
                    case AutoNumeric.options.emptyInputBehavior.max:
                        this.set(this.settings.maximumValue);
                        break;
                    case AutoNumeric.options.emptyInputBehavior.zero:
                        this.set('0');
                        break;
                    // When `emptyInputBehavior` is a number or a string representing a number
                    default:
                        this.set(this.settings.emptyInputBehavior);
                }
            } else if (setValue && currentValue === this.domElement.getAttribute('value')) {
                this.set(currentValue);
            }
        } else if (this.settings.defaultValueOverride === null ||
            this.settings.defaultValueOverride === currentValue) {
            this.set(currentValue);
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
     * This method set the following options accordingly to their own value and the mandatory `decimalPlaces` option:
     * - decimalPlacesRawValue     (nullable)
     * - decimalPlacesShownOnBlur  (nullable)
     * - decimalPlacesShownOnFocus (nullable)
     *
     * Note: the `decimalPlaces` option is only used here and only serve to define those three previous options value.
     * AutoNumeric will then *only* use `decimalPlacesRawValue`, `decimalPlacesShownOnBlur` and `decimalPlacesShownOnFocus` from there.
     *
     * This method directly modifies the `settings` object passed as a parameter.
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
            additionalDecimalPlacesRawValue = String(settings.rawValueDivisor).length - 1; // i.e. Dividing by '100' adds 2 decimal places to the needed precision
            if (additionalDecimalPlacesRawValue < 0) {
                additionalDecimalPlacesRawValue = 0;
            }
        }

        settings.decimalPlacesRawValue = Math.max(
            Math.max(settings.decimalPlacesShownOnBlur, settings.decimalPlacesShownOnFocus) + additionalDecimalPlacesRawValue,
            Number(settings.originalDecimalPlacesRawValue) + additionalDecimalPlacesRawValue,
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
            additionalDecimalPlacesRawValue = String(settings.rawValueDivisor).length - 1; // i.e. Dividing by '100' adds 2 decimal places to the needed precision
            if (additionalDecimalPlacesRawValue < 0) {
                additionalDecimalPlacesRawValue = 0;
            }
        }

        if (!settings.decimalPlaces && !settings.decimalPlacesRawValue) {
            settings.decimalPlacesRawValue = Math.max(
                Math.max(settings.decimalPlacesShownOnBlur, settings.decimalPlacesShownOnFocus) + additionalDecimalPlacesRawValue,
                Number(currentSettings.originalDecimalPlacesRawValue) + additionalDecimalPlacesRawValue,
            );
        } else {
            settings.decimalPlacesRawValue = Math.max(
                Math.max(settings.decimalPlacesShownOnBlur, settings.decimalPlacesShownOnFocus) + additionalDecimalPlacesRawValue,
                Number(settings.decimalPlacesRawValue) + additionalDecimalPlacesRawValue,
            );
        }
    }

    /**
     * Analyze and save the minimumValue and maximumValue integer size for later uses
     * @private
     */
    _calculateVMinAndVMaxIntegerSizes() {
        let [maximumValueIntegerPart] = this.settings.maximumValue.toString().split('.');
        let [minimumValueIntegerPart] = (!this.settings.minimumValue && this.settings.minimumValue !== 0)?[]:this.settings.minimumValue.toString().split('.');
        maximumValueIntegerPart = maximumValueIntegerPart.replace(this.settings.negativeSignCharacter, '');
        minimumValueIntegerPart = minimumValueIntegerPart.replace(this.settings.negativeSignCharacter, '');

        this.settings.mIntPos = Math.max(maximumValueIntegerPart.length, 1);
        this.settings.mIntNeg = Math.max(minimumValueIntegerPart.length, 1);
    }

    /**
     * Calculate once what are the `valuesToStrings` option keys.
     * @private
     */
    _calculateValuesToStringsKeys() {
        if (this.settings.valuesToStrings) {
            this.valuesToStringsKeys = Object.keys(this.settings.valuesToStrings);
        } else {
            this.valuesToStringsKeys = [];
        }
    }

    /**
     * Caches regular expressions for _stripAllNonNumberCharactersExceptCustomDecimalChar
     *
     * @param {object} settings
     * @param {object} regex
     */
    static _cachesUsualRegularExpressions(settings, regex) {
        // Test if there is a negative character in the string
        let negativeSignReg;
        if (settings.negativeSignCharacter !== AutoNumeric.options.negativeSignCharacter.hyphen) {
            negativeSignReg = `([-\\${settings.negativeSignCharacter}]?)`;
        } else {
            negativeSignReg = '(-?)';
        }

        regex.aNegRegAutoStrip = negativeSignReg;
        settings.allowedAutoStrip = new RegExp(`[^-0123456789\\${settings.decimalCharacter}]`, 'g');
        settings.numRegAutoStrip = new RegExp(`${negativeSignReg}(?:\\${settings.decimalCharacter}?([0-9]+\\${settings.decimalCharacter}[0-9]+)|([0-9]*(?:\\${settings.decimalCharacter}[0-9]*)?))`);

        // Using this regex version `^${regex.aNegRegAutoStrip}0*(\\d|$)` entirely clear the input on blur
        settings.stripReg = new RegExp(`^${regex.aNegRegAutoStrip}0*([0-9])`);

        // All the characters that are accepted during the formula mode
        settings.formulaChars = new RegExp(`[0-9${settings.decimalCharacter}+\\-*/() ]`);
    }

    /**
     * Modify the user settings to make them 'exploitable' later.
     */
    _transformOptionsValuesToDefaultTypes() {
        for (const key in this.settings) {
            if (Object.prototype.hasOwnProperty.call(this.settings, key)) {
                const value = this.settings[key];

                // Convert the strings 'true' and 'false' to booleans
                if (value === 'true' || value === 'false') {
                    this.settings[key] = value === 'true';
                }

                // Convert numbers in options to strings
                //TODO Only transform the values of type 'Number' to 'String' if it's a currency number (so that we can have big numbers). Do not convert other numbers (i.e. `historySize`)
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
            alwaysAllowDecimalCharacter       : true,
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
            eventBubbles                      : true,
            eventIsCancelable                 : true,
            failOnUnknownOption               : true,
            formatOnPageLoad                  : true,
            formulaMode                       : true,
            historySize                       : true,
            isCancellable                     : true,
            leadingZero                       : true,
            maximumValue                      : true,
            minimumValue                      : true,
            modifyValueOnUpDownArrow          : true,
            modifyValueOnWheel                : true,
            negativeBracketsTypeOnBlur        : true,
            negativePositiveSignPlacement     : true,
            negativeSignCharacter             : true,
            negativePositiveSignBehavior      : true,
            noEventListeners                  : true,
            onInvalidPaste                    : true,
            outputFormat                      : true,
            overrideMinMaxLimits              : true,
            positiveSignCharacter             : true,
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
            upDownStep                        : true,
            unformatOnHover                   : true,
            unformatOnSubmit                  : true,
            valuesToStrings                   : true,
            watchExternalChanges              : true,
            wheelOn                           : true,
            wheelStep                         : true,

            // Additional information that are added to the `settings` object :
            //TODO Find a way to exclude those internal data from the settings object (ideally by using another object, or better yet, class attributes) -->
            allowedAutoStrip                  : true,
            formulaChars                      : true,
            isNegativeSignAllowed             : true,
            isPositiveSignAllowed             : true,
            mIntNeg                           : true,
            mIntPos                           : true,
            numRegAutoStrip                   : true,
            originalDecimalPlaces             : true,
            originalDecimalPlacesRawValue     : true,
            stripReg                          : true,
        };

        for (const option in options) {
            if (Object.prototype.hasOwnProperty.call(options, option)) {
                if (oldOptionsConverter[option] === true) {
                    // If the option is a 'new' option, we continue looping
                    continue;
                }

                if (Object.prototype.hasOwnProperty.call(oldOptionsConverter, option)) {
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

        // Define if the negative or positive signs are allowed
        this.constructor._setNegativePositiveSignPermissions(this.settings);

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
        this._setTrailingNegativeSignInfo();
        this.regex = {}; // Create the object that will store the regular expressions
        this.constructor._cachesUsualRegularExpressions(this.settings, this.regex);
        this.constructor._setBrackets(this.settings);
        this._calculateValuesToStringsKeys();

        // Validate the settings. Both tests throws if necessary.
        if (AutoNumericHelper.isEmptyObj(this.settings)) {
            AutoNumericHelper.throwError('Unable to set the settings, those are invalid ; an empty object was given.');
        }

        this.constructor.validate(this.settings, false, options);

        // Original settings saved for use when decimalPlacesShownOnFocus, divisorWhenUnfocused & showOnlyNumbersOnFocus options are being used
        this._keepAnOriginalSettingsCopy();
    }

    /**
     * Define if the negative or positive signs are allowed, and update the given settings object directly.
     *
     * @param {object} settings
     * @private
     */
    static _setNegativePositiveSignPermissions(settings) {
        settings.isNegativeSignAllowed = settings.minimumValue < 0;
        settings.isPositiveSignAllowed = settings.maximumValue >= 0;
    }

    /**
     * Convert the `value` parameter that can either be :
     * - a real number,
     * - a number represented in the scientific notation (i.e. -123.4567e-6)
     * - a string representing a real number, or
     * - a string representing a localized number (with specific group separators and decimal character),
     * ...to a string representing a real 'javascript' number (i.e. '1234' or '1234.567').
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
        if (AutoNumericHelper.isNumber(Number(value))) { // if (settings.decimalCharacter === '.' && AutoNumericHelper.isNumber(Number(value))) {
            // The value has either already been stripped, or a 'real' javascript number is passed as a parameter
            if (!AutoNumericHelper.isNumberStrict(value)) {
                value = String(value).trim(); // cf. issue #721
            }
            result = AutoNumericHelper.scientificToDecimal(value);
        } else {
            // Else if it's a string that `Number()` cannot typecast, then we try to convert the localized numeric string to a numeric one
            // Convert the value to a numeric string, stripping unnecessary characters in the process
            result = this._convertToNumericString(value.toString(), settings);

            // If the result is still not a numeric string, then we throw a warning
            if (!AutoNumericHelper.isNumber(Number(result))) {
                AutoNumericHelper.warning(`The given value "${value}" cannot be converted to a numeric one and therefore cannot be used appropriately.`, settings.showWarnings);
                result = NaN;
            }
        }

        return result;
    }

    /**
     * Return the pasted text that will be used, by stripping most non-numeric characters
     *
     * @param {string} text
     * @returns {string}
     */
    _preparePastedText(text) {
        return this.constructor._stripAllNonNumberCharacters(text, this.settings, true, this.isFocused);
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
     * This keeps tracks of the current selection and resets the 'processed' state.
     *
     * Note : This state can change between the keydown, keypress and keyup events, that's why
     *        this function is called on each event handler.
     *
     * @private
     */
    _updateInternalProperties() {
        this.selection = AutoNumericHelper.getElementSelection(this.domElement);
        this.processed = false;
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
     * Those parts are left 'untouched', i.e. formatted by autoNumeric.
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
     * Those parts are unformatted (stripped) of any non-numbers characters, and any trailing negative character is put back on the left hand side of the number.
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
        if ((this.eventKey === AutoNumericEnum.keyName.Hyphen || this.eventKey === AutoNumericEnum.keyName.Minus) && Number(left) === 0) {
            stripZeros = false;
        }

        //TODO DRY that with `_normalizeParts()` -->
        if (this.isTrailingNegative &&
            ((AutoNumericHelper.isNegative(right, this.settings.negativeSignCharacter) && // The caret is placed on the left of the negative sign
            !AutoNumericHelper.isNegative(left, this.settings.negativeSignCharacter)) ||
            (right === '' && // ...or the caret is placed on the far right of the input (Fix issue #481)
            AutoNumericHelper.isNegative(left, this.settings.negativeSignCharacter, true)))) {
            left = left.replace(this.settings.negativeSignCharacter, '');
            right = right.replace(this.settings.negativeSignCharacter, '');
            // This is done here because `_getUnformattedLeftAndRightPartAroundTheSelection()` is called multiple times during the same key event, and at one point the left/right value has been normalized already..
            left = left.replace('-', '');
            right = right.replace('-', '');

            // Then finally set back the normalized minus character at the right place
            left = `-${left}`;
        }

        left = AutoNumeric._stripAllNonNumberCharactersExceptCustomDecimalChar(left, this.settings, stripZeros, this.isFocused);
        right = AutoNumeric._stripAllNonNumberCharactersExceptCustomDecimalChar(right, this.settings, false, this.isFocused);

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
        if ((this.eventKey === AutoNumericEnum.keyName.Hyphen || this.eventKey === AutoNumericEnum.keyName.Minus) && Number(left) === 0) {
            stripZeros = false;
        }

        if (this.isTrailingNegative &&
            AutoNumericHelper.isNegative(right, this.settings.negativeSignCharacter) &&
            !AutoNumericHelper.isNegative(left, this.settings.negativeSignCharacter)) {
            // Only set the negative sign if the value is negative
            left = `-${left}`;
            right = right.replace(this.settings.negativeSignCharacter, '');
        }

        left = AutoNumeric._stripAllNonNumberCharactersExceptCustomDecimalChar(left, this.settings, stripZeros, this.isFocused);
        right = AutoNumeric._stripAllNonNumberCharactersExceptCustomDecimalChar(right, this.settings, false, this.isFocused);

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
                    case AutoNumeric.options.emptyInputBehavior.focus:
                    case AutoNumeric.options.emptyInputBehavior.press:
                    case AutoNumeric.options.emptyInputBehavior.always:
                        valueToSetOnEmpty = '';
                        break;
                    case AutoNumeric.options.emptyInputBehavior.min:
                        valueToSetOnEmpty = this.settings.minimumValue;
                        break;
                    case AutoNumeric.options.emptyInputBehavior.max:
                        valueToSetOnEmpty = this.settings.maximumValue;
                        break;
                    case AutoNumeric.options.emptyInputBehavior.zero:
                        valueToSetOnEmpty = '0';
                        break;
                    case AutoNumeric.options.emptyInputBehavior.null:
                        valueToSetOnEmpty = null;
                        break;
                    // When `emptyInputBehavior` is a number or a string representing a number
                    default:
                        valueToSetOnEmpty = this.settings.emptyInputBehavior;
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

            // Make sure when the user enter a '0' on the far left with a leading zero option set to 'deny', that the caret does not move since the input is dropped (fix issue #283)
            if (position === 1 && normalizedLeft === '0' && this.settings.leadingZero === AutoNumeric.options.leadingZero.deny) {
                // If the user enter `0`, then the caret is put on the right side of it (Fix issue #299)
                if (normalizedRight === '' || normalizedLeft === '0' && normalizedRight !== '') {
                    position = 1;
                } else {
                    position = 0;
                }
            }

            this._setElementValue(roundedValueToShow, false);
            this._setCaretPosition(position);

            return true;
        }

        this._triggerRangeEvents(minTest, maxTest);

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
        // Do not process anything if the value has already been formatted
        if (this.formatted) {
            return;
        }

        if (!AutoNumericHelper.isUndefined(this.valuePartsBeforePaste)) {
            const oldParts = this.valuePartsBeforePaste;
            const [left, right] = this._getLeftAndRightPartAroundTheSelection();

            // Try to strip the pasted value first
            delete this.valuePartsBeforePaste;

            const modifiedLeftPart = left.substr(0, oldParts[0].length) + AutoNumeric._stripAllNonNumberCharactersExceptCustomDecimalChar(left.substr(oldParts[0].length), this.settings, true, this.isFocused);
            if (!this._setValueParts(modifiedLeftPart, right, true)) {
                this._setElementValue(oldParts.join(''), false);
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
        if ((e.ctrlKey || e.metaKey) &&
            (this.eventKey === AutoNumericEnum.keyName.c ||
             this.eventKey === AutoNumericEnum.keyName.v ||
             this.eventKey === AutoNumericEnum.keyName.x)) {
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


        // If the ctrl/meta key is used (during the undo shortcut for instance)
        if (e.ctrlKey || e.metaKey) {
            return !(this.eventKey === AutoNumericEnum.keyName.Z || this.eventKey === AutoNumericEnum.keyName.z);
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
     * @param {string[]} leftAndRight The parts on the left and on the right of the caret or selection as an array with [left, right]
     * @returns {string[]} Processed left and right as an array with [left, right]
     * @private
     */
    _processCharacterDeletionIfTrailingNegativeSign([left, right]) {
        const value = AutoNumericHelper.getElementValue(this.domElement);
        const isValNegative = AutoNumericHelper.isNegative(value, this.settings.negativeSignCharacter);

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
                if (AutoNumericHelper.isNegative(left, this.settings.negativeSignCharacter) && value.charAt(this.selection.start) === '-') {
                    left = left.substring(1);
                }
            }
        }

        if (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix) {
            switch (this.settings.negativePositiveSignPlacement) {
                case AutoNumeric.options.negativePositiveSignPlacement.left:
                    this.caretFix = (this.selection.start >= value.indexOf(this.settings.negativeSignCharacter) + this.settings.negativeSignCharacter.length);
                    if (this.eventKey === AutoNumericEnum.keyName.Backspace) {
                        if (this.selection.start === (value.indexOf(this.settings.negativeSignCharacter) + this.settings.negativeSignCharacter.length) && isValNegative) {
                            left = left.substring(1);
                        } else if (left !== '-' && ((this.selection.start <= value.indexOf(this.settings.negativeSignCharacter)) || !isValNegative)) {
                            left = left.substring(0, left.length - 1);
                        }
                    } else {
                        if (left[0] === '-') {
                            right = right.substring(1);
                        }
                        if (this.selection.start === value.indexOf(this.settings.negativeSignCharacter) && isValNegative) {
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
                        } else if (left !== '' && !isValNegative) {
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
     * Returns `true` if the deletion is allowed (within the min and max range, according to the `overrideMinMaxLimits` option), `false` otherwise.
     *
     * @param {Event} e
     * @returns {boolean}
     */
    _processCharacterDeletion(e) {
        let left;
        let right;

        if (!this.selection.length) {
            [left, right] = this._getUnformattedLeftAndRightPartAroundTheSelection();
            if (left === '' && right === '') {
                this.throwInput = false;
            }

            if (this.isTrailingNegative && AutoNumericHelper.isNegative(AutoNumericHelper.getElementValue(this.domElement), this.settings.negativeSignCharacter)) {
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

        if (!this.constructor._isWithinRangeWithOverrideOption(`${left}${right}`, this.settings)) {
            // If the result with the deletion would be out of the range, we prevent it
            return false;
        }
        if (AutoNumericHelper.getElementValue(e.target) === this.settings.currencySymbol) {
            return false;
        }

        this._setValueParts(left, right);

        return true;
    }

    /**
     * Return `true` if a decimal character is allowed to be typed.
     * If the number of decimal places shown on focus is zero, then the decimal character is not allowed.
     *
     * @returns {boolean}
     * @private
     */
    _isDecimalCharacterInsertionAllowed() {
        return String(this.settings.decimalPlacesShownOnFocus) !== String(AutoNumeric.options.decimalPlacesShownOnFocus.none) &&
            String(this.settings.decimalPlaces) !== String(AutoNumeric.options.decimalPlaces.none);
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
            (this.settings.decimalCharacterAlternative && this.eventKey === this.settings.decimalCharacterAlternative)) {
            if (!this._isDecimalCharacterInsertionAllowed() || !this.settings.decimalCharacter) {
                return false;
            }

            if (this.settings.alwaysAllowDecimalCharacter) {
                // Remove any previous decimal character
                left = left.replace(this.settings.decimalCharacter, '');
                right = right.replace(this.settings.decimalCharacter, '');
            } else {
                // Do not allow a decimal character if another decimal character is already present
                if (AutoNumericHelper.contains(left, this.settings.decimalCharacter)) {
                    return true;
                }

                // Prevent adding a decimal character at the far right of the number
                if (right.indexOf(this.settings.decimalCharacter) > 0) {
                    return true;
                }

                // Remove the decimal character if found on the far left of the right part
                if (right.indexOf(this.settings.decimalCharacter) === 0) {
                    right = right.substr(1);
                }
            }

            // If the user is trying to add a decimal character on the far left of the number, we allow it
            if (this.settings.negativeSignCharacter && AutoNumericHelper.contains(right, this.settings.negativeSignCharacter)) {
                // We need however to move the negative sign from the right to the left part
                left = `${this.settings.negativeSignCharacter}${left}`;
                right = right.replace(this.settings.negativeSignCharacter, '');
            }

            this._setValueParts(left + this.settings.decimalCharacter, right);

            return true;
        }

        // Prevent entering the minus sign if it's not allowed (Note: `this.settings.isNegativeSignAllowed` is only set to `true` if the minimumValue is lower than zero, allowing negative numbers to be entered)
        if ((this.eventKey === '-' || this.eventKey === '+') && this.settings.isNegativeSignAllowed) {
            // Here, the left and right parts have been normalized already, hence the minus sign usage
            if (left === '' && AutoNumericHelper.contains(right, '-')) {
                // The value is originally negative (with a trailing negative sign)
                if (this.settings.negativePositiveSignBehavior || (!this.settings.negativePositiveSignBehavior && this.eventKey === '+')) {
                    right = right.replace('-', '');
                }
            } else if (AutoNumericHelper.isNegativeStrict(left, '-')) {
                // The value is originally negative (with a leading negative sign)
                // Remove the negative sign, effectively converting the value to a positive one
                if (this.settings.negativePositiveSignBehavior || (!this.settings.negativePositiveSignBehavior && this.eventKey === '+')) {
                    left = left.replace('-', '');
                }
            } else if (this.settings.negativePositiveSignBehavior || (!this.settings.negativePositiveSignBehavior && this.eventKey === '-')) {
                // The value is originally positive, so we toggle the state to a negative one (unformatted, which means even with a trailing negative sign, we add the minus sign on the far left)
                left = `${this.settings.negativeSignCharacter}${left}`;
            }

            this._setValueParts(left, right);

            return true;
        }

        const eventNumber = Number(this.eventKey);
        if (eventNumber >= 0 && eventNumber <= 9) {
            // If the user tries to insert a digit
            if (this.settings.isNegativeSignAllowed && left === '' && AutoNumericHelper.contains(right, '-')) {
                // ...and that digit is before the minus sign
                left = '-';
                right = right.substring(1, right.length);
            }

            if (this.settings.maximumValue <= 0 &&
                this.settings.minimumValue < this.settings.maximumValue &&
                !AutoNumericHelper.contains(AutoNumericHelper.getElementValue(this.domElement), this.settings.negativeSignCharacter) &&
                this.eventKey !== '0') {
                left = `-${left}`;
            }

            this._setValueParts(`${left}${this.eventKey}`, right);

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
        //TODO Break apart and simplify this really long function
        const elementValue = AutoNumericHelper.getElementValue(this.domElement);
        let [left] = this._getUnformattedLeftAndRightPartAroundTheSelection();

        // No grouping separator and no currency sign
        if ((this.settings.digitGroupSeparator  === '' || (this.settings.digitGroupSeparator !== ''  && !AutoNumericHelper.contains(elementValue, this.settings.digitGroupSeparator))) &&
            (this.settings.currencySymbol === '' || (this.settings.currencySymbol !== '' && !AutoNumericHelper.contains(elementValue, this.settings.currencySymbol)))) {
            let [subParts] = elementValue.split(this.settings.decimalCharacter);
            let negativeSign = '';
            if (AutoNumericHelper.isNegative(subParts, this.settings.negativeSignCharacter)) {
                negativeSign = this.settings.negativeSignCharacter;
                subParts = subParts.replace(this.settings.negativeSignCharacter, '');
                left = left.replace('-', ''); // Here we modify the unformatted value (with the 'normal' minus sign)
            }

            // Strip leading zero on positive value if needed
            if (negativeSign === '' && subParts.length > this.settings.mIntPos && left.charAt(0) === '0') {
                left = left.slice(1);
            }

            // Strip leading zero on negative value if needed
            if (negativeSign === this.settings.negativeSignCharacter && subParts.length > this.settings.mIntNeg && left.charAt(0) === '0') {
                left = left.slice(1);
            }

            if (!this.isTrailingNegative) { // Only add the minus sign if it's needed on that side of the numbers
                left = `${negativeSign}${left}`;
            }
        }

        const value = this.constructor._addGroupSeparators(elementValue, this.settings, this.isFocused, this.rawValue);
        let position = value.length;
        if (value) {
            // Prepare regexp which searches for cursor position from unformatted left part
            const leftAr = left.split('');

            // Fixes caret position with trailing minus sign
            if ((this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.suffix ||
                (this.settings.negativePositiveSignPlacement !== AutoNumeric.options.negativePositiveSignPlacement.prefix && this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix)) &&
                leftAr[0] === this.settings.negativeSignCharacter && !this.settings.isNegativeSignAllowed) {
                leftAr.shift(); // Remove the negative sign character

                if ((this.eventKey === AutoNumericEnum.keyName.Backspace || this.eventKey === AutoNumericEnum.keyName.Delete) &&
                    this.caretFix) {
                    if ((this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix && this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.left) ||
                        (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.prefix && this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.suffix)) {
                        leftAr.push(this.settings.negativeSignCharacter);
                        this.caretFix = e.type === 'keydown';
                    }

                    if (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix &&
                        this.settings.negativePositiveSignPlacement === AutoNumeric.options.negativePositiveSignPlacement.right) {
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

                        if (this.eventKey === AutoNumericEnum.keyName.Backspace && this.settings.negativeSignCharacter === '-') {
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
                    leftAr[i] = '\\' + leftAr[i]; // Escapes the decimal character
                }
            }

            // Generates the regex that will search for the cursor position in the formatted value
            let leftReg;
            if (this.settings.currencySymbolPlacement === AutoNumeric.options.currencySymbolPlacement.suffix) {
                leftReg = new RegExp(`^.*?${leftAr.join('.*?')}`);
            } else { // prefix is assumed
                leftReg = new RegExp(`^.*?[${this.settings.currencySymbol}]*${leftAr.join('.*?')}`); // Fixes issue #647 when using a currency that has some characters in it that matches the value we just entered (i.e. numbers in the currency)
            }

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
                    position = this.settings.currencySymbol.length + (AutoNumericHelper.isNegativeStrict(value, this.settings.negativeSignCharacter) ? 1 : 0);
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
        if (value !== elementValue) {
            this._setElementValue(value, false);
            this._setCaretPosition(position);
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
        if (!Object.prototype.hasOwnProperty.call(arg1, 'rootElement')) {
            AutoNumericHelper.throwError(`The object passed to the 'multiple' function is invalid ; no 'rootElement' attribute found.`);
        }

        // Retrieve the DOM element list from the given <form> element
        const elements = [... arg1.rootElement.querySelectorAll('input')];
        if (Object.prototype.hasOwnProperty.call(arg1, 'exclude')) {
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

        AutoNumericHelper.warning(`No valid DOM elements were given hence no AutoNumeric objects were instantiated.`, showWarnings);

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

    // Depending on our findings, we generate the options variable to use `optionsToUse`, either directly, or merged
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
            // We set the same value for each element
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
 * Polyfill for obsolete browsers like IE
 */
(function() {
// Polyfill for `Array.from()` (Fix issue #495)
if (!Array.from) {
    Array.from = object => [].slice.call(object);
}

// Polyfill for `CustomEvent` (cf. https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)
if (typeof window === 'undefined' || typeof window.CustomEvent === 'function') {
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
