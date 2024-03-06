/**
 * Note that ES6 modules cannot directly export class objects.
 * This file should be imported using the CommonJS-style:
 *   import AutoNumeric = require('autonumeric');
 *
 * Alternatively, if --allowSyntheticDefaultImports or
 * --esModuleInterop is turned on, this file can also be
 * imported as a default import:
 *   import AutoNumeric from 'autonumeric';
 *
 * Refer to the TypeScript documentation at
 * https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
 * to understand common workarounds for this limitation of ES6 modules.
 *
 * @packageDocumentation
 */

/**
 * The class constructor function is the exported object from the file
 */
export = AutoNumeric;

import {
    AutoNumericEventInitialized,
    AutoNumericEventInvalidFormula,
    AutoNumericEventRawValueModified,
    AutoNumericEventFormatted,
    AutoNumericEventValidFormula,
    AutoNumericGlobal,
    CallbackOptions,
    GetValueCallback,
    NameValuePair,
    Options,
    OptionsHandler,
    OutputFormatOption,
    PredefinedOptions
} from 'autonumeric';

declare global {
    interface GlobalEventHandlersEventMap {
        /** When an invalid value is corrected. */
        "autoNumeric:correctedValue": CustomEvent<null>;
        /** When the AutoNumeric element is initialized. */
        "autoNumeric:initialized": CustomEvent<AutoNumericEventInitialized>;
        /** When the user tries to validate an invalid math expression. */
        "autoNumeric:invalidFormula": CustomEvent<AutoNumericEventInvalidFormula>;
        /** When an invalid value is entered (ie. when the raw value is out of the min/max range). */
        "autoNumeric:invalidValue": CustomEvent<null>;
        /** When the `rawValue` is modified. */
        "autoNumeric:rawValueModified": CustomEvent<AutoNumericEventRawValueModified>;
        /** When all the formatting is done and the formatted string is modified. */
        "autoNumeric:formatted": CustomEvent<AutoNumericEventFormatted>;
        /** When the `minimumValue` is not respected. */
        "autoNumeric:minExceeded": CustomEvent<null>;
        /** When the `maximumValue` is not respected. */
        "autoNumeric:maxExceeded": CustomEvent<null>;
        /** When the user validates a valid math expression. */
        "autoNumeric:validFormula": CustomEvent<AutoNumericEventValidFormula>;
    }
}

declare class AutoNumeric {
    /**
     * Enables the AutoNumeric feature for the given element.
     * 
     * The DOM element must be one of the allowed elements. Allowed elements are `<input>`, as well as some 
     * other text-containing elements such `<div>`. See the documentation for the full list.
     * 
     * When not an `input` element, the element may have the `contenteditable` set. If it does, all
     * entered values are formatted according to the given options. Otherwise, the formatted value is
     * set once and no further edits are possible. 
     * 
     * @param element Either one of the allowed elements, or a CSS selector string for a single element. 
     * @param initialValue Initial value, when `null`, the value of the DOM element is used.
     * @param options Settings for AutoNumeric.
     */
    constructor(
        element: string | HTMLElement,
        initialValue?: string | number | null,
        options?: CallbackOptions | string | (CallbackOptions | string)[] | null
    );

    /**
     * Enables the AutoNumeric feature for the given element.
     * 
     * The DOM element must be one of the allowed elements. Allowed elements are `<input>`, as well as some 
     * other text-containing elements such `<div>`. See the documentation for the full list.
     * 
     * When not an `input` element, the element may have the `contenteditable` set. If it does, all
     * entered values are formatted according to the given options. Otherwise, the formatted value is
     * set once and no further edits are possible. 
     * 
     * @param element Either one of the allowed elements, or a CSS selector string for a single element. 
     * @param options Settings for AutoNumeric.
     */
    constructor(
        element: string | HTMLElement,
        options: CallbackOptions | (CallbackOptions | string)[]
    );

    /**
     * Enables the AutoNumeric feature for the given elements.
     * 
     * The DOM element must be one of the allowed elements. Allowed elements are `<input>`, as well as some 
     * other text-containing elements such `<div>`. See the documentation for the full list.
     * 
     * When not an `input` element, the element may have the `contenteditable` set. If it does, all
     * entered values are formatted according to the given options. Otherwise, the formatted value is
     * set once and no further edits are possible. 
     * @param elements A list of elements, which may be a CSS selector string.
     * @param initialValue Initial value to set. Can be an array to set a different value for each element. When `null`, the
     * value of the DOM element is used.
     * @param options AutoNumeric options. Can be an array to use a different set of options for each element.
     */
    static multiple(
        elements: string | HTMLElement[] | { rootElement: HTMLElement; exclude?: HTMLInputElement[] },
        initialValue?: number | string | (number | string | null)[] | null,
        options?: CallbackOptions | string | (CallbackOptions | string)[] | null
    ): AutoNumeric[];

    /**
     * Enables the AutoNumeric feature for the given elements.
     * 
     * The DOM element must be one of the allowed elements. Allowed elements are `<input>`, as well as some 
     * other text-containing elements such `<div>`. See the documentation for the full list.
     * 
     * When not an `input` element, the element may have the `contenteditable` set. If it does, all
     * entered values are formatted according to the given options. Otherwise, the formatted value is
     * set once and no further edits are possible. 
     * @param elements A list of elements, which may be a CSS selector string.
     * @param options AutoNumeric options. Can be an array to use a different set of options for each element.
     */
    static multiple(
        elements: string | HTMLElement[] | { rootElement: HTMLElement; exclude?: HTMLInputElement[] },
        options: CallbackOptions | (CallbackOptions | string)[]
    ): AutoNumeric[];

    /**
     * Return true in the settings are valid
     */
    static areSettingsValid(options: Options): boolean;

    /**
     * Format the given number with the given options. This returns the formatted value as a string.
     * @param domElement An element with a value to format.
     * @param options Options to use instead of the default options.
     * @return The formatted string.
     */
    static format(value: number | string | HTMLElement, ...options: Options[]): string;

    /**
     * Format the value of the DOM element with the given options and returns the formatted value as a string.
     * @param domElement An element with a value to format.
     * @param options Options to use instead of the default options.
     * @return The formatted string.
     */
    static formatAndSet(domElement: HTMLElement, options?: Options | null): string;

    /**
     * Return the AutoNumeric object that manages the given DOM element
     */
    static getAutoNumericElement(domElement: HTMLElement): AutoNumeric;

    /**
     * Return the default AutoNumeric settings
     */
    static getDefaultConfig(): Required<Options>;

    /**
     * Return all the predefined options in one object
     */
    static getPredefinedOptions(): PredefinedOptions;

    /**
     * Returns the unformatted value following the `outputFormat` setting, from the given DOM element or query selector.
     * 
     * See the non-static `getLocalized` method documentation for more details.
     *
     * @param value A string to localize, or a DOM element with a value to localize.
     * @param forcedOutputFormat Override for the `outputFormat` option.
     * @param callback Callback to invoke with the localized value.
     * @returns The localized value.
     */
    static getLocalized(value: string | HTMLElement, forcedOutputFormat?: OutputFormatOption | null, callback?: ((value: string | number) => void) | null): string | number;

    /**
     * Returns the unformatted value following the `outputFormat` setting, from the given DOM element or query selector.
     * 
     * See the non-static `getLocalized` method documentation for more details.
     *
     * @param value A string to localize, or a DOM element with a value to localize.
     * @param callback Callback to invoke with the localized value.
     * @returns The localized value.
     */
    static getLocalized(value: string | HTMLElement, callback: (value: string | number) => void): string | number;

    /**
     * Return true if the given DOM element has an AutoNumeric object that manages it.
     */
    static isManagedByAutoNumeric(domElement: HTMLElement): boolean;

    /**
     * Unformats and localizes the given formatted string with the given options.
     * 
     * This basically allows to get the localized value without first having to initialize an AutoNumeric object.
     * 
     * The returned value may be either a string or a number, depending on the `outputFormat` option.
     * 
     * @param value A string to unformat and localize, or an input element with a value to unformat and localize.
     * @param options Optional options to use instead of the current options of this instance.
     * @returns The localized value.
     */
    static localize(value: number | string | HTMLElement, options?: Options | null): number | string;

    /**
     * Unformats and localizes the value of the given element with the given options, then sets the localized
     * value on the element.
     * 
     * This basically allows to set the localized value without first having to initialize an AutoNumeric object.
     * 
     * The returned value may be either a string or a number, depending on the `outputFormat` option.
     * 
     * @param value A string to unformat and localize, or an input element with a value to unformat and localize.
     * @param options Optional options to use instead of the current options of this instance.
     * @returns The localized value.
     */
    static localizeAndSet(domElement: HTMLElement, options?: Options | null): number | string;

    /**
     * Merge the current options with the given list of options.
     * 
     * If a `string` is given, then we try to get the related pre-defined option using that string as its name.
     * 
     * When merging the options, the latest option overwrite any previously set. This allows to fine tune a pre-defined option for instance.
     *
     * @param options List of options to set.
     * @returns The merged options.
     */
    static mergeOptions(options: (Options | string)[]): Options;

    /**
     * Test if the given DOM element, or the element selected by the given selector string is already managed by AutoNumeric
     * (if it has been initialized on the current page).
     *
     * @param domElementOrSelector The DOM element to test. A string is interpreted as a CSS selector that should return one element, if any.
     * @returns Whether the element is managed by AutoNumeric.
     */
    static test(domElement: HTMLElement | string): boolean;

    /**
     * Unformats the given formatted string with the given options. This returns a numeric string.
     * 
     * It can also unformat the given DOM element value with the given options and returns the unformatted numeric string.
     * 
     * Note: This does *not* update that element value.
     * 
     * This basically allows to get the unformatted value without first having to initialize an AutoNumeric object.
     *
     * The returned value might be a string or a number, depending on the `outputFormat` option.
     * @param value A number, or a string that represent a JavaScript number, or a DOM element with a value.
     * @param options Optional to use instead of the default options.
     * @returns The unformatted value.
     */
    static unformat(value: string | number | HTMLElement, ...options: Options[]): number | string;

    /**
     * Unformats the given DOM element value, and set the resulting value back as the element value.
     *
     * The returned value might be a string or a number, depending on the `outputFormat` option.
     * @param domElement DOM element with a value to unformat and set.
     * @param options Optional to use instead of the default options.
     * @returns The unformatted value.
     */
    static unformatAndSet(value: HTMLElement, options?: Options | null): number | string;

    /**
     * Set the given value on the AutoNumeric object that manages the given DOM element, if any.
     * @param element DOM element with a value to unformat and set. Can be a CSS selector string.
     * @param newValue The new value to set. Can be `null` when `emptyInputBehavior` is set to `null`.
     * @param options A settings object that will override the current settings. Note: the update is done only if the `newValue` is defined.
     * @param saveChangeToHistory If set to `true`, then the change is recorded in the history table. Defaults to `true`.
     * @returns The AutoNumeric instance of the given element, or `null` if no such instance was found.
     */
    static set(element: HTMLElement | string, newValue: number | string | null, options?: CallbackOptions | null, saveChangeToHistory?: boolean): AutoNumeric | null;

    /**
     * Validate the given option object.
     * 
     * If the options are valid, this function returns nothing, otherwise if the options are invalid, this function throws an error.
     *
     * This tests if the options are not conflicting and are well formatted.
     * 
     * This function is lenient since it only tests the settings properties ; it ignores any other properties the options object could have.
     *
     * @param options Options to validate.
     * @param shouldExtendDefaultOptions If `true`, then this function will extend the `userOptions` passed by the user, with the default options.
     * @param originalOptions The user can pass the original options (and not the one that are generated from the default settings
     * and the various usability corrections), in order to add compatibility and conflicts checks.
     * @throws If the given options are not valid.
     */
    static validate(options: Options, shouldExtendDefaultOptions?: boolean, originalOptions?: Options | null): void;

    /**
     * Returns the AutoNumeric version number (for debugging purpose).
     *
     * @returns The current AutoNumeric version.
     */
    static version(): string;

    /**
     * Contains convenience methods to update individual options, and also allows the options to be reset.
     */
    readonly options: OptionsHandler;

    /**
     * Whenever {@link init} is used to initialize other DOM elements, a shared local `init` list of those elements is stored in
     * the AutoNumeric instances.
     * 
     * This allows for neat things like modifying all those linked AutoNumeric elements globally, with only one call.
     * 
     * Use this property to access the handler that provides methods to modify all linked elements.
     */
    readonly global: AutoNumericGlobal;

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
     * @param newValue The value must be a Number, a numeric string or `null` (if `emptyInputBehavior` is set to `null`)
     * @param options A settings object that will override the current settings. Note: the update is done only if the `newValue` is defined.
     * @param saveChangeToHistory If set to `true`, then the change is recorded in the history table
     * @returns This instance for chaining method calls.
     */
    set(
        newValue: number | string | null,
        options?: CallbackOptions,
        saveChangeToHistory?: boolean
    ): AutoNumeric;

    /**
     * Set the given value directly as the DOM element value, without formatting it beforehand.
     * 
     * You can also set the value and update the setting in one go (the value will again not be formatted immediately).
     * @param value New value to set.
     * @param options New options to set.
     * @returns This instance for chaining method calls.
     */
    setUnformatted(value: number | string | null, options?: CallbackOptions): AutoNumeric;

    // The get() function is deprecated and should not be used. Omitted from TS def for that reason.

    /**
     * Return the current formatted value of the AutoNumeric element as a string.
     * @param callback Optional callback that, when given, is called with the value and the AutoNumeric instance.
     * @returns The formatted value.
     */
    getFormatted(
        callback?: GetValueCallback<string> | null
    ): string;

    /**
     * Return the element unformatted value as a real JavaScript number.
     * @param callback Optional callback that, when given, is called with the value and the AutoNumeric instance.
     * @returns The number value.
     */
    getNumber(
        callback?: GetValueCallback<number | null> | null
    ): number | null;

    /**
     * Return the unformatted value as a string.
     * This can also return `null` if `rawValue` is null.
     * @param callback Optional callback that, when given, is called with the value and the AutoNumeric instance.
     * @returns The numerical value.
     */
    getNumericString(
        callback?: GetValueCallback<string | null> | null
    ): string | null;

    /**
     * Returns the unformatted value, but following the `outputFormat` setting, which means the output can either be:
     *
     * - a string (that could or could not represent a number, ie. "12345,67-"), or
     * - a plain number (if the setting `'number'` is used).
     *
     * By default the returned values are an ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period.
     *
     * Check the `outputFormat` option definition for more details.
     * @param forcedOutputFormat Override for the `outputFormat` option.
     * @param callback Optional callback that, when given, is called with the value and the AutoNumeric instance.
     * @returns The localized value.
     */
    getLocalized(forcedOutputFormat?: OutputFormatOption | null, callback?: GetValueCallback<string | number> | null): string | number;

    /**
     * Returns the unformatted value, but following the `outputFormat` setting, which means the output can either be:
     *
     * - a string (that could or could not represent a number, ie. "12345,67-"), or
     * - a plain number (if the setting `'number'` is used).
     *
     * By default the returned values are an ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period.
     * 
     * Check the `outputFormat` option definition for more details.
     * @param callback Optional callback that, when given, is called with the value and the AutoNumeric instance.
     * @returns The localized value.
     */
    getLocalized(callback: GetValueCallback<string | number>): string | number;

    /**
     * Returns the options object containing all the current autoNumeric settings in effect.
     * You can then directly access each option by using its name:
     * 
     * > anElement.getSettings().optionNameAutoCompleted
     * @returns The current settings for this instance.
     */
    getSettings(): Required<Options>;

    /**
     * Force each element of the local AutoNumeric element list to reformat its value
     * @returns This instance for chaining method calls.
     */
    reformat(): AutoNumeric;

    /**
     * Remove the formatting and keep only the raw unformatted value (as a numericString) in each element of the local AutoNumeric element list
     * @returns This instance for chaining method calls.
     */
    unformat(): AutoNumeric;

    /**
     * Remove the formatting and keep only the localized unformatted value in the element, with the option to override the default outputFormat if needed
     *
     * @param forcedOutputFormat If set to something different from `null`, then this is used as an overriding outputFormat option
     * @returns This instance for chaining method calls.
     */
    unformatLocalized(forcedOutputFormat?: OutputFormatOption): AutoNumeric;

    /**
     * Return `true` if *all* the autoNumeric-managed elements are pristine, if their raw value hasn't changed.
     * 
     * By default, this returns `true` if the raw unformatted value is still the same even if the formatted one has changed (due to a configuration update for instance).
     *
     * @param checkOnlyRawValue If set to `true`, the pristine value is done on the raw unformatted value, not the formatted one. If set to `false`, this also checks that the formatted value hasn't changed.
     * @returns If this instance is pristine.
     */
    isPristine(checkOnlyRawValue?: boolean): boolean;

    /**
     * Select the formatted element content, based on the `selectNumberOnly` option
     *
     * @returns This instance for chaining method calls.
     */
    select(): AutoNumeric;

    /**
     * Select only the numbers in the formatted element content, leaving out the currency symbol, whatever the value of the `selectNumberOnly` option
     *
     * @returns This instance for chaining method calls.
     */
    selectNumber(): AutoNumeric;

    /**
     * Select only the integer part in the formatted element content, whatever the value of `selectNumberOnly`
     *
     * @returns This instance for chaining method calls.
     */
    selectInteger(): AutoNumeric;

    /**
     * Select only the decimal part in the formatted element content, whatever the value of `selectNumberOnly`
     * Multiple cases are possible:
     * 
     * - +1.234,57suffixText
     * - € +1.234,57suffixText
     * - +€ 1.234,57suffixText
     * - € 1.234,57+suffixText
     * - 1.234,57+ €suffixText
     * - 1.234,57 €+suffixText
     * - +1.234,57 €suffixText
     * @returns This instance for chaining method calls.
     */
    selectDecimal(): AutoNumeric;

    /**
     * Reset the element value either to the empty string '', or the currency sign, depending on the `emptyInputBehavior` option value.
     * If you set the `forceClearAll` argument to `true`, then the `emptyInputBehavior` option is overridden
     * and the whole input is cleared, including any currency sign.
     *
     * @param forceClearAll `true` to clear the the entire input, including the currency sign.
     * @returns This instance for chaining method calls.
     */
    clear(forceClearAll?: boolean): AutoNumeric;

    /**
     * Updates the AutoNumeric settings, and immediately format the element accordingly.
     * @param options New options to set. When multiple options are specified, later options override previous options.
     * @returns This instance for chaining method calls.
     */
    update(...options: CallbackOptions[]): AutoNumeric;

    /**
     * Remove the autoNumeric data and event listeners from the element, but keep the element content intact.
     * 
     * This also clears the value from sessionStorage (or cookie, depending on browser supports).
     * 
     * Note: this does not remove the formatting.
     */
    remove(): void;

    /**
     * Remove the autoNumeric data and event listeners from the element, and reset its value to the empty string.
     * This also clears the value from sessionStorage (or cookie, depending on browser supports).
     */
    wipe(): void;

    /**
     * Remove the autoNumeric data and event listeners from the element, and delete the DOM element altogether
     */
    nuke(): void;

    /**
     * Return the DOM element reference of the autoNumeric-managed element. The exact type depends
     * on the element that on which AutoNumeric was initialized - AutoNumeric supports input elements
     * as well as other content editable elements such as div elements.
     */
    node(): HTMLElement;

    /**
     * Return the DOM element reference of the parent node of the AutoNumeric managed element
     *
     * @returns The parent of the AutoNumeric element.
     */
    parent(): HTMLElement;

    /**
     * Detach the current AutoNumeric element from the shared local `init` list.
     * 
     * This means any changes made on that local shared list will not be transmitted to that element anymore.
     * 
     * Note: The user can provide another AutoNumeric element, and detach this one instead of the current one.
     *
     * @param otherAnElement Element to detach.
     * @returns This instance for chaining method calls.
     */
    detach(otherAnElement?: AutoNumeric | null): AutoNumeric;

    /**
     * Attach the given AutoNumeric element to the shared local `init` list.
     * 
     * When doing that, by default the DOM content is left untouched.
     * 
     * The user can force a reformat with the new shared list options by passing a second argument to `true`.
     *
     * @param otherAnElement Element to attach.
     * @param reFormat Whether to reformat the value after the element was attached. Defaults to `true`.
     * @returns This instance for chaining method calls.
     */
    attach(otherAnElement: AutoNumeric, reFormat?: boolean): AutoNumeric;

    /**
     * Use the current AutoNumeric element settings to initialize the DOM element(s) given as a parameter.
     * 
     * Doing so will *link* the AutoNumeric elements together since they will share the same local AutoNumeric element list.
     * 
     * (cf. prototype pattern : https://en.wikipedia.org/wiki/Prototype_pattern)
     *
     * You can `init` either a single DOM element (in that case an AutoNumeric object will be returned), or an array of DOM elements or a string that will be used as a CSS selector. In the latter cases, an array of AutoNumeric objects will then be returned (or an empty array if nothing gets selected by the CSS selector).
     *
     * Use case : Once you have an AutoNumeric element already setup correctly with the right options, you can use it as many times you want to initialize as many other DOM elements as needed.
     * 
     * Note: this works only on elements that can be managed by autoNumeric.
     *
     * @param domElement A single element to initialize.
     * @param attached If set to `false`, then the newly generated AutoNumeric element will not share the same local element list.
     * @returns The initialized AutoNumeric instance.
     */
    init(domElement: HTMLElement, attached?: boolean): AutoNumeric;
    /**
     * Use the current AutoNumeric element settings to initialize the DOM element(s) given as a parameter.
     * 
     * Doing so will *link* the AutoNumeric elements together since they will share the same local AutoNumeric element list.
     * 
     * (cf. prototype pattern : https://en.wikipedia.org/wiki/Prototype_pattern)
     *
     * You can `init` either a single DOM element (in that case an AutoNumeric object will be returned), or an array of DOM elements or a string that will be used as a CSS selector. In the latter cases, an array of AutoNumeric objects will then be returned (or an empty array if nothing gets selected by the CSS selector).
     *
     * Use case : Once you have an AutoNumeric element already setup correctly with the right options, you can use it as many times you want to initialize as many other DOM elements as needed.
     * 
     * Note: this works only on elements that can be managed by autoNumeric.
     *
     * @param domElement A list of elements, or a string representing a CSS selector.
     * @param attached If set to `false`, then the newly generated AutoNumeric element will not share the same local element list.
     * @returns The initialized AutoNumeric instances.
     */
    init(domElement: HTMLElement[] | string, attached?: boolean): AutoNumeric[];

    /**
     * Return a reference to the parent <form> element if it exists, otherwise return `null`.
     * 
     * If the parent form element as already been found, this directly return a reference to it.
     * 
     * However, you can force AutoNumeric to search again for its reference by passing `true` as a parameter to this method.
     * 
     * This method updates the `this.parentForm` attribute.
     *
     * In either case, whenever a new parent form is set for the current AutoNumeric element, we make sure to update the anCount and anFormHandler attributes on both the old form and the new one (for instance in case the user moved the input elements with `appendChild()` since AutoNumeric cannot not detect that).
     *
     * @param forceSearch Whether to force a new search for the parent `<form>` element, discarding any previously found one. Defaults to `false`.
     *
     * @returns The form element containing this AutoNumeric element, if any.
     */
    form(forceSearch?: boolean): HTMLFormElement | null;

    /**
     * Return a string in standard URL-encoded notation with the form input values being unformatted.
     * 
     * This string can be used as a query for instance.
     *
     * @returns The formatted string.
     */
    formNumericString(): string;

    /**
     * Return a string in standard URL-encoded notation with the form input values being formatted.
     *
     * @returns The  formatted string.
     */
    formFormatted(): string;

    /**
     * Return a string in standard URL-encoded notation with the form input values, with localized values.
     * 
     * The default output format can be overridden by passing the option as a parameter.
     *
     * @param forcedOutputFormat If set to something different from `null`, then this is used as an override for the `outputFormat` option
     * @returns The localized string.
     */
    formLocalized(forcedOutputFormat?: OutputFormatOption | null): string;

    /**
     * Return an array containing an object for each form <input> element. The name of each pair is the name of the DOM elements.
     * The value is is stringified numeric value of each AutoNumeric input.
     * @returns The numerical values.
     */
    formArrayNumericString(): NameValuePair<number | string>[];

    /**
     * Return an array containing an object for each form <input> element. The name of each pair is the name of the DOM elements.
     * The value is is formatted value of each AutoNumeric input.
     * @returns The formatted values.
     */
    formArrayFormatted(): NameValuePair<string>[];

    /**
     * Return an array containing an object for each form <input> element. The name of each pair is the name of the DOM elements.
     * 
     * The value is is localized value of each AutoNumeric input.
     * 
     * Values might be a string or a number, depending on the `outputFormat` option.
     *
     * @param forcedOutputFormat If set to something different from `null`, then this is used as an override for the `outputFormat` option
     * @returns The localized values.
     */
    formArrayLocalized(forcedOutputFormat?: OutputFormatOption | null): NameValuePair<number | string>[];

    /**
     * Return an array containing an object for each form <input> element, stringified as a JSON string.
     * The name of each pair is the name of the DOM elements. The value is is localized value of each AutoNumeric input.
     * @returns The numerical values.
     */
    formJsonNumericString(): string;

    /**
     * Return an array containing an object for each form <input> element, stringified as a JSON string.
     * The name of each pair is the name of the DOM elements. The value is is formatted value of each AutoNumeric input.
     * @returns The formatted values.
     */
    formJsonFormatted(): string;

    /**
     * Return an array containing an object for each form <input> element, stringified as a JSON string.
     * The name of each pair is the name of the DOM elements. The value is is localized value of each AutoNumeric input.
     * @param forcedOutputFormat If set to something different from `null`, then this is used as an override for the `outputFormat` option.
     * @returns The localized values.
     */
    formJsonLocalized(forcedOutputFormat?: OutputFormatOption | null): string;

    /**
     * Unformat all the autoNumeric-managed elements that are a child of the parent <form> element of this DOM element, to numeric strings
     *
     * @returns This instance for chaining method calls.
     */
    formUnformat(): AutoNumeric;

    /**
     * Unformat all the autoNumeric-managed elements that are a child of the parent `<form>` element of
     * this DOM element, to localized strings
     * 
     * @returns This instance for chaining method calls.
     */
    formUnformatLocalized(): AutoNumeric;

    /**
     * Reformat all the autoNumeric-managed elements that are a child of the parent <form> element of this DOM element
     *
     * @returns This instance for chaining method calls.
     */
    formReformat(): AutoNumeric;

    /**
     * Generate an array of numeric strings from the `<input>` elements, and pass it to the given callback.
     * Under the hood, the array is generated via a call to `formArrayNumericString()`.
     *
     * @param callback Callback to invoke with the values.
     * @returns This instance for chaining method calls.
     */
    formSubmitArrayNumericString(callback: (pairs: NameValuePair<number | string>[]) => void): AutoNumeric;

    /**
     * Generate an array of the current formatted values from the `<input>` elements, and pass it to the given callback.
     * Under the hood, the array is generated via a call to `formArrayFormatted()`.
     *
     * @param callback Callback to invoke with the values.
     * @returns This instance for chaining method calls.
     */
    formSubmitArrayFormatted(callback: (pairs: NameValuePair<string>[]) => void): AutoNumeric;

    /**
     * Generate an array of localized strings from the `<input>` elements, and pass it to the given callback.
     * 
     * Under the hood, the array is generated via a call to `formArrayLocalized()`.
     * 
     * Values might be a string or a number, depending on the `outputFormat` option.
     * @param callback Callback to invoke with the values.
     * @param forcedOutputFormat If set to something different from `null`, then this is used as an override for the `outputFormat` option.
     * @returns This instance for chaining method calls.
     */
    formSubmitArrayLocalized(callback: (pairs: NameValuePair<number | string>[]) => void, forcedOutputFormat?: OutputFormatOption | null): AutoNumeric;

    /**
     * Generate a JSON string with the numeric strings values from the `<input>` elements, and pass it to the given callback.
     * Under the hood, the array is generated via a call to `formJsonNumericString()`.
     *
     * @param callback Callback to invoke with the values.
     * @returns This instance for chaining method calls.
     */
    formSubmitJsonNumericString(callback: (values: string) => void): AutoNumeric;

    /**
     * Generate a JSON string with the current formatted values from the `<input>` elements, and pass it to the given callback.
     * Under the hood, the array is generated via a call to `formJsonFormatted()`.
     *
     * @param callback Callback to invoke with the values.
     * @returns This instance for chaining method calls.
     */
    formSubmitJsonFormatted(callback: (values: string) => void): AutoNumeric;

    /**
     * Generate a JSON string with the localized strings values from the `<input>` elements, and pass it to the given callback.
     * Under the hood, the array is generated via a call to `formJsonLocalized()`.
     *
     * @param callback Callback to invoke with the values.
     * @param forcedOutputFormat If set to something different from `null`, then this is used as an override for the `outputFormat` option.
     * @returns This instance for chaining method calls.
     */
    formSubmitJsonLocalized(callback: (values: string) => void, forcedOutputFormat?: null | string): AutoNumeric;

    /**
     * Update the settings to use the Brazilian pre-defined language options.
     * Those pre-defined options can be overridden by passing an option object as a parameter.
     *
     * @param optionOverride Optional options to override the pre-defined options.
     * @returns This instance for chaining method calls.
     */
    brazilian(optionOverride?: CallbackOptions | null): AutoNumeric;

    /**
     * Update the settings to use the British pre-defined language options.
     * Those pre-defined options can be overridden by passing an option object as a parameter.
     *
     * @param optionOverride Optional options to override the pre-defined options.
     * @returns This instance for chaining method calls.
     */
    british(optionOverride?: CallbackOptions | null): AutoNumeric;

    /**
     * Update the settings to use the Chinese pre-defined language options.
     * Those pre-defined options can be overridden by passing an option object as a parameter.
     *
     * @param optionOverride Optional options to override the pre-defined options.
     * @returns This instance for chaining method calls.
     */
    chinese(optionOverride?: CallbackOptions | null): AutoNumeric;

    /**
     * Update the settings to use the French pre-defined language options.
     * Those pre-defined options can be overridden by passing an option object as a parameter.
     *
     * @param optionOverride Optional options to override the pre-defined options.
     * @returns This instance for chaining method calls.
     */
    french(optionOverride?: CallbackOptions | null): AutoNumeric;

    /**
     * Update the settings to use the Japanese pre-defined language options.
     * Those pre-defined options can be overridden by passing an option object as a parameter.
     *
     * @param optionOverride Optional options to override the pre-defined options.
     * @returns This instance for chaining method calls.
     */
    japanese(optionOverride?: CallbackOptions | null): AutoNumeric;

    /**
     * Update the settings to use the North American pre-defined language options.
     * Those pre-defined options can be overridden by passing an option object as a parameter.
     *
     * @param optionOverride Optional options to override the pre-defined options.
     * @returns This instance for chaining method calls.
     */
    northAmerican(optionOverride?: CallbackOptions | null): AutoNumeric;

    /**
     * Update the settings to use the Spanish pre-defined language options.
     * Those pre-defined options can be overridden by passing an option object as a parameter.
     *
     * @param optionOverride Optional options to override the pre-defined options.
     * @returns This instance for chaining method calls.
     */
    spanish(optionOverride?: CallbackOptions | null): AutoNumeric;

    /**
     * Update the settings to use the Swiss pre-defined language options.
     * Those pre-defined options can be overridden by passing an option object as a parameter.
     *
     * @param optionOverride Optional options to override the pre-defined options.
     * @returns This instance for chaining method calls.
     */
    swiss(optionOverride?: CallbackOptions | null): AutoNumeric;
}

/**
 * Exposes the types used in that definitions file
 */
declare namespace AutoNumeric {
    /**
     * Callback that can optionally be passed to the various `get*` methods. Receives
     * the value as well as the current AutoNumeric instance.
     * @typeParam T Type of the value returned by the get method.
     */
    export type GetValueCallback<T> = (value: T, instance: AutoNumeric) => void;

    export type OutputFormatOption =
        | "string"
        | "number"
        | "."
        | "-."
        | ","
        | "-,"
        | ".-"
        | ",-"
        | null;

    export type CaretPositionOption =
        | "start"
        | "end"
        | "decimalLeft"
        | "decimalRight"
        | "doNoForceCaretPosition";

    export type CurrencySymbolPlacementOption = "p" | "s";

    export type EmptyInputBehaviorOption =
        | "null"
        | "focus"
        | "press"
        | "always"
        | "min"
        | "max"
        | "zero"
        | number
        | string /* representing a number */;

    export type LeadingZeroOption = "allow" | "deny" | "keep";

    export type NegativePositiveSignPlacementOption =
        | "p"
        | "s"
        | "l"
        | "r"
        | null;

    export type OnInvalidPasteOption =
        | "error"
        | "ignore"
        | "clamp"
        | "truncate"
        | "replace";

    export type OverrideMinMaxLimitsOption =
        | "ceiling"
        | "floor"
        | "ignore"
        | "invalid"
        | null;

    export type RoundingMethodOption =
        | "S"
        | "A"
        | "s"
        | "a"
        | "B"
        | "U"
        | "D"
        | "C"
        | "F"
        | "N05"
        | "CHF"
        | "U05"
        | "D05";

    export type DigitalGroupSpacingOption =
        | "2"
        | "2t"
        | "2s"
        | "3"
        | "4"

    export type NegativeBracketsTypeOnBlurOption =
        | "(,)"
        | "[,]"
        | "<,>"
        | "{,}"
        | "〈,〉"
        | "｢,｣"
        | "⸤,⸥"
        | "⟦,⟧"
        | "‹,›"
        | "«,»";

    export type SerializeSpacesOption = "+" | "%20";

    export type ValueOrCallback<T> = T | ((instance: AutoNumeric, key: string) => T);

    export type OptionsHandler = {
        [K in keyof Options]-?: (value: Required<Options[K]>) => AutoNumeric
    } & {
        /**
         * Reset any options set previously, by overwriting them with the default settings
         * @returns This AutoNumeric instance for chaining method calls.
         */
        reset: () => AutoNumeric;
    };

    /**
     * A pair with a name and a string value.
     * @typeParam T Type of the value.
     */
    export interface NameValuePair<T> {
        /** The name of this pair. */
        name: string;
        /** The value of this pair. */
        value: T;
    }

    export interface Options {
        /**
         * Allow padding the decimal places with zeros.
         * @default true
         */
        allowDecimalPadding?: boolean | number | string | "floats";

        /**
         * Determine where should be positioned the caret on focus
         * @default null
         */
        caretPositionOnFocus?: CaretPositionOption | null;

        /**
         * Defines if the decimal character or decimal character alternative should be accepted when there is already a
         * decimal character shown in the element.
         * 
         * If set to `true`, any decimal character input will be accepted and will subsequently modify the decimal character
         * position, as well as the `rawValue`.
         * 
         * If set to `false`, the decimal character and its alternative key will be dropped as before. This is the default setting.
         * @default false
         */
        alwaysAllowDecimalCharacter?: boolean;

        /**
         * Determine if a local list of AutoNumeric objects must be kept when initializing the elements and others
         * @default true
         */
        createLocalList?: boolean;

        /**
         * Currency symbol
         * @default ''
         */
        currencySymbol?: string;

        /**
         * Placement of the currency sign, relative to the number (as a prefix or a suffix)
         * @default 'p'
         */
        currencySymbolPlacement?: CurrencySymbolPlacementOption;

        /**
         * Decimal separator character
         * @default '.'
         */
        decimalCharacter?: string;

        /**
         * Allow to declare alternative decimal separator which is automatically replaced by the real decimal character
         * @default null
         */
        decimalCharacterAlternative?: string | null;

        /**
         * Defines the default number of decimal places to show on the formatted value, and to keep as the precision for the rawValue
         * 0 or positive integer
         * @default 2
         */
        decimalPlaces?: number | string;

        /**
         * Defines how many decimal places should be kept for the raw value.
         * @default null
         */
        decimalPlacesRawValue?: number | string | null;

        /**
         * The number of decimal places to show when unfocused
         * @default null
         */
        decimalPlacesShownOnBlur?: number | string | null;

        /**
         * The number of decimal places to show when focused
         * @default null
         */
        decimalPlacesShownOnFocus?: number | string | null;

        /**
         * Helper option for ASP.NET postback
         * 
         * This should be set as the value of the unformatted default value
         * 
         * Examples:
         * - no default value="" {defaultValueOverride: ""}
         * - value=1234.56 {defaultValueOverride: '1234.56'}
         * @default null
         */
        defaultValueOverride?: string | { doNotOverride: null } | null;

        /* Defines how many numbers should be grouped together (usually for the thousand separator)
         * - `2`,  results in 99,99,99,99 Group by two
         * - `2t`, results in 99,99,99,999 India's lakhs
         * - `2s`, results in 99,999,99,99,999 India's lakhs scaled
         * - `3`,  results in 999,999,999 (default)
         * - `4`,  results in 9999,9999,9999 used in some Asian countries
         * Note: This option does not accept other grouping choice.
         * @default '3'
         */
        digitalGroupSpacing?: DigitalGroupSpacingOption;

        /**
         * Thousand separator character
         * @default ','
         */
        digitGroupSeparator?: string;

        /**
         * Define the number that will divide the current value shown when unfocused
         * @default null
         */
        divisorWhenUnfocused?: number | string | null;

        /**
         *  Defines what should be displayed in the element if the raw value is an empty string.
         * - `focus`: The currency sign is displayed when the input receives focus (default)
         * - `press`: The currency sign is displayed whenever a key is being pressed
         * - `always`: The currency sign is always displayed
         * - `zero`: A zero is displayed (`rounded` with or without a currency sign) if the input has no value on focus out
         * - `min`: The minimum value is displayed if the input has no value on focus out
         * - `max`: The maximum value is displayed if the input has no value on focus out
         * - `null`: When the element is empty, the `rawValue` and the element value/text is set to `null`. This also allows to set the value to `null` using `anElement.set(null)`.
         */
        emptyInputBehavior?: EmptyInputBehaviorOption;

        /**
         * Defines if the custom and native events triggered by AutoNumeric should bubble up or not.
         */
        eventBubbles?: boolean;

        /**
         * Defines if the custom and native events triggered by AutoNumeric should be cancelable.
         * @default true
         */
        eventIsCancelable?: boolean;

        /**
         * This option is the `strict mode` (aka `debug` mode), which allows autoNumeric to strictly analyze the options passed, and fails if an unknown options is used in the settings object.
         * 
         * You should set that to `true` if you want to make sure you are only using pure autoNumeric settings objects in your code.
         * 
         * If you see uncaught errors in the console and your code starts to fail, this means somehow those options gets polluted by another program (which usually happens when using frameworks).
         */
        failOnUnknownOption?: boolean;

        /**
         *  Determine if the default value will be formatted on initialization.
         */
        formatOnPageLoad?: boolean;

        /**
         * Defines if the `formula mode` can be activated by the user.
         *
         * If set to `true`, then the user can enter the formula mode by entering the `=` character.
         * 
         * He will then be allowed to enter any simple math formula using numeric characters as well as the following operators +, -, *, /, ( and ).
         * 
         * The formula mode is closed when the user either validate their math expression using the `Enter` key, or when the element is blurred.
         * 
         * If the formula is invalid, the previous valid `rawValue` is set back, and the `autoNumeric:invalidFormula` event is sent.
         * 
         * When a valid formula is accepted, then its result is {@link AutoNumeric.prototype.set set}, and the `autoNumeric:validFormula` event is sent.
         *
         * By default, this mode is disabled.
         */
        formulaMode?: boolean;

        /**
         * Set the undo/redo history table size.
         *
         * Each record keeps the raw value as well and the last known caret/selection positions.
         */
        historySize?: number | string;

        /**
         * Defines the name of the CSS class to use on `contenteditable`-enabled elements when the value is invalid
         * 
         * This is not used when the HTML element used is an input.
         */
        invalidClass?: string;

        /**
         * Allow the user to `cancel` and undo the changes he made to the given AutoNumeric-managed element, by pressing the `Escape` key.
         * 
         * Whenever the user validates the input (either by hitting `Enter`, or blurring the element), the new value is saved for subsequent cancellations.
         *
         * The process :
         *   - save the input value on focus
         *   - if the user change the input value, and hit `Escape`, then the initial value saved on focus is set back
         *   - on the other hand if the user either have used `Enter` to validate (`Enter` throws a change event) his entries, or if the input value has been changed by another script in the mean time, then we save the new input value
         *   - on a successful `cancel`, select the whole value (while respecting the `selectNumberOnly` option)
         *   - bonus; if the value has not changed, hitting `Esc` just select all the input value (while respecting the `selectNumberOnly` option)
         */
        isCancellable?: boolean;

        /**
         * Controls the leading zero behavior
         * - `allow` : allows leading zeros to be entered. Zeros will be truncated when entering additional digits. On focusout zeros will be deleted
         * - `deny`  : allows only one leading zero on values that are between 1 and -1
         * - `keep`  : allows leading zeros to be entered. on focusout zeros will be retained
         */
        leadingZero?: LeadingZeroOption;

        /**
         * Defines the maximum possible value a user can enter.
         * 
         * Notes:
         * - this value must be a string and use the period for the decimal point
         * - this value needs to be larger than `minimumValue`
         */
        maximumValue?: string;

        /**
         * Defines the minimum possible value a user can enter.
         *
         * Notes:
         * - this value must be a string and use the period for the decimal point
         * - this value needs to be smaller than `maximumValue`
         * - if this is superior to 0, then you'll effectively prevent your user to entirely delete the content of your element
         */
        minimumValue?: string;

        /**
         * Determine if the element value can be incremented / decremented with the up and down arrow keys.
         */
        modifyValueOnUpDownArrow?: boolean;

        /**
         * Determine if the element value can be incremented / decremented with the mouse wheel.
         */

        modifyValueOnWheel?: boolean;

        /**
         * Adds brackets on negative values (ie. transforms `-$ 999.99` to `($999.99)`)
         * 
         * Those brackets are visible only when the field does NOT have the focus.
         * 
         * The left and right symbols should be enclosed in quotes and separated by a comma.
         */
        negativeBracketsTypeOnBlur?: NegativeBracketsTypeOnBlurOption | null;

        /**
         * Placement of negative/positive sign relative to the currency symbol (possible options are l (left), r (right), p (prefix) and s (suffix))
         * @default null
         */
        negativePositiveSignPlacement?: NegativePositiveSignPlacementOption;

        /**
         * Defines if the negative sign should be toggled when hitting the negative or positive key multiple times.
         * 
         * When `toggle` is used, using the same `-` on `+` key will toggle between a positive and negative value.
         * 
         * When `doNotToggle` is used, using `-` will always set the value negative, and `+` will always set the value positive.
         */
        negativeSignCharacter?: string;

        /** 
         * Defines if the element should have event listeners activated on it.
         * 
         * By default, those event listeners are only added to <input> elements and html element with the `contenteditable` attribute set to `true`, but not on the other html tags.
         * 
         * This allows to initialize elements without any event listeners.
         * 
         * Warning: Since AutoNumeric will not check the input content after its initialization, using some autoNumeric methods afterwards *will* probably leads to formatting problems.
         */
        noEventListeners?: boolean;

        /**
         * Manage how autoNumeric react when the user tries to paste an invalid number.
         * - `error`    : (This is the default behavior) The input value is not changed and an error is output in the console.
         * - `ignore`   : idem than `error`, but fail silently without outputting any error/warning in the console.
         * - `clamp`    : if the pasted value is either too small or too big regarding the minimumValue and maximumValue range, then the result is clamped to those limits.
         * - `truncate` : autoNumeric will insert as many pasted numbers it can at the initial caret/selection, until everything is pasted, or the range limit is hit.
         *                The non-pasted numbers are dropped and therefore not used at all.
         * - `replace`  : autoNumeric will first insert as many pasted numbers it can at the initial caret/selection, then if the range limit is hit, it will try
         *                to replace one by one the remaining initial numbers (on the right side of the caret) with the rest of the pasted numbers.
         *
         * Note 1 : A paste content starting with a negative sign `-` will be accepted anywhere in the input, and will set the resulting value as a negative number
         * 
         * Note 2 : A paste content starting with a number will be accepted, even if the rest is gibberish (ie. `123foobar456`).
         *          Only the first number will be used (here `123`).
         * 
         * Note 3 : The paste event works with the `decimalPlacesShownOnFocus` option too.
         */
        onInvalidPaste?: OnInvalidPasteOption;

        /**
         * Defines how the value should be formatted when wanting a `localized` version of it.
         * - `null` or `string` => `nnnn.nn` or `-nnnn.nn` as text type. This is the default behavior.
         * - `number` => nnnn.nn or -nnnn.nn as a Number (Warning: this works only for integers inferior to Number.MAX_SAFE_INTEGER)
         * - `,` or `-,` => `nnnn,nn` or `-nnnn,nn`
         * - `.-` => `nnnn.nn` or `nnnn.nn-`
         * - `,-` => `nnnn,nn` or `nnnn,nn-`
         *
         * Note: The hyphen `-` is translated to the custom negative sign defined in `negativeSignCharacter`
         */
        outputFormat?: OutputFormatOption;

        /**
         * Defines if AutoNumeric should let the user override the minimum and/or maximum limits when he types numbers in the element.
         * - `ceiling` Strictly adheres to `maximumValue` and ignores the `minimumValue` settings
         *             It allows the user to enter anything between -∞ `and maximumValue`
         *             If `maximumValue` is less than 0, then it will prevent the user emptying the field or typing value above `maximumValue`, making sure the value entered is always valid
         * - `floor`   Strictly adheres to `minimumValue` and ignores the `maximumValue` settings
         *             It allows the user to enter anything between `minimumValue` and +∞
         *             If `minimumValue` is higher than 0, then it will prevent the user emptying the field or typing value below `minimumValue`, making sure the value entered is always valid
         * - `ignore`  Ignores both the `minimumValue` and `maximumValue` settings
         *             When using this option, the field will always be valid range-wise
         * - `invalid` The user can temporarily type out-of-bound values. In doing so, the invalid state is set on the field.
         *             Whenever an invalid value is typed, an `autoNumeric:invalidValue` event is sent
         *             When the value is correctly set back within the limit boundaries, the invalid state is removed, and the `autoNumeric:correctedValue` event is sent
         * - `null` Strictly adheres to the `maximumValue` and `minimumValue` settings
         *          This is the default behavior
         *          If `0` is out of the min/max range, this will prevent the user clearing the input field, making sure the value entered is always valid
         */
        overrideMinMaxLimits?: OverrideMinMaxLimitsOption;

        /**
         * Defines the positive sign symbol.
         * 
         * It can be a string of only one character.
         * 
         * This is shown only if `showPositiveSign` is set to `true`.
         */
        positiveSignCharacter?: string;

        /**
         * The `rawValueDivisor` divides the formatted value shown in the AutoNumeric element and store the result in `rawValue`.
         * 
         * Given the `0.01234` raw value, the formatted value will be displayed as `1.234`.
         * 
         * This is useful when displaying percentage for instance, and avoid the need to divide/multiply by 100 between the number shown and the raw value.
         */
        rawValueDivisor?: number | string | null;

        /**
         * Defines if the element (`<input>` or another allowed html tag) should be set as read-only on initialization.
         * 
         * When set to `true`, then:
         * 
         * - the `readonly` html property is added to the <input> element on initialization, or
         * 
         * - the `contenteditable` attribute is set to `false` on non-input elements.
         */
        readOnly?: boolean;

        /**
         * Defines the rounding method to use.
         * - `S`, Round-Half-Up Symmetric (default)
         * - `A"` Round-Half-Up Asymmetric
         * - `s`, Round-Half-Down Symmetric (lower case s)
         * - `a`, Round-Half-Down Asymmetric (lower case a)
         * - `B`, Round-Half-Even "Bankers Rounding"
         * - `U`, Round Up "Round-Away-From-Zero"
         * - `D`, Round Down "Round-Toward-Zero" - same as truncate
         * - `C", Round to Ceiling "Toward Positive Infinity"
         * - `F`, Round to Floor "Toward Negative Infinity"
         * - `N05` Rounds to the nearest .05 => same as "CHF" used in 1.9X and still valid
         * - `U05` Rounds up to next .05
         * - `D05` Rounds down to next .05
         */
        roundingMethod?: RoundingMethodOption;

        /**
         * Set to `true` to allow the `decimalPlacesShownOnFocus` value to be saved with sessionStorage
         * 
         * If IE 6 or 7 is detected, the value will be saved as a session cookie.
         */
        saveValueToSessionStorage?: boolean;

        /**
         * Determine if the select all keyboard command will select the complete input text, or only the input numeric value
         * 
         * Note : If the currency symbol is between the numeric value and the negative sign, only the numeric value will be selected
         */
        selectNumberOnly?: boolean;

        /**
         * Defines if the element value should be selected on focus.
         * 
         * Note: The selection is done using the `selectNumberOnly` option.
         */
        selectOnFocus?: boolean;

        /**
         * Defines how the serialize functions should treat the spaces.
         * 
         * Those spaces ` ` can either be converted to the plus sign `+`, which is the default, or to `%20`.
         * 
         * Both values being valid per the spec (http://www.w3.org/Addressing/URL/uri-spec.html).
         * 
         * Also see the summed up answer on http://stackoverflow.com/a/33939287.
         *
         * tl;dr : Spaces should be converted to `%20` before the `?` sign, then converted to `+` after.
         * 
         * In our case since we serialize the query, we use `+` as the default (but allow the user to get back the old *wrong* behavior).
         */
        serializeSpaces?: SerializeSpacesOption;

        /**
         * Defines if the element value should be converted to the raw value on focus (and back to the formatted on blur).
         * 
         * If set to `true`, then autoNumeric remove the thousand separator, currency symbol and suffix on focus.
         * 
         * Example:
         * 
         * If the input value is `$ 1,999.88 suffix`, on focus it becomes `1999.88` and back to `$ 1,999.88 suffix` on blur.
         */
        showOnlyNumbersOnFocus?: boolean;

        /**
         * Allow the positive sign symbol `+` to be displayed for positive numbers.
         * By default, this positive sign is not shown.
         * The sign placement is controlled by the `negativePositiveSignPlacement` option, mimicking the negative sign placement rules.
         */
        showPositiveSign?: boolean;

        /**
         * Defines if warnings should be shown in the console.
         * 
         * Those warnings can be ignored, but are usually printed when something could be improved by the user (ie. option conflicts).
         */
        showWarnings?: boolean;

        //FIXME
        /**
         * Defines the rules that calculate the CSS class(es) to apply on the element, based on the raw unformatted value.
         * 
         * This can also be used to call callbacks whenever the `rawValue` is updated.
         */
        styleRules?: {
            positive?: string | null;
            negative?: string;
            ranges?: Array<{
                min: number;
                max: number;
                class: string;
            }>;
            userDefined?: Array<| {
                callback: (rawValue: number) => boolean;
                classes: [string] | [string, string];
            }
                | {
                    callback: (rawValue: number) => number | number[] | null;
                    classes: string[];
                }
                | { callback: (autoNumericInstance: AutoNumeric) => void }>;
        } | null;

        /**
          * Add a text on the right hand side of the element value.
          * 
          * This suffix text can have any characters in its string, except numeric characters and the negative/positive sign.
          * 
          * Example: ` dollars`
          */
        suffixText?: string;

        /**
         * The `symbolWhenUnfocused` option is a symbol placed as a suffix when not in focus.
         */
        symbolWhenUnfocused?: string | null;

        /**
         * Defines if the element value should be unformatted when the user hover his mouse over it while holding the `Alt` key.
         * Unformatting there means that this removes any non-number characters and displays the *raw* value, as understood by Javascript (ie. `12.34` is a valid number, while `12,34` is not).
         *
         * We reformat back before anything else if :
         * - the user focus on the element by tabbing or clicking into it,
         * - the user releases the `Alt` key, and
         * - if we detect a mouseleave event.
         *
         * We unformat again if:
         * - while the mouse is over the element, the user hit `Alt` again
         */
        unformatOnHover?: boolean;

        /**
         * When a submit event is detected in the parent form element, temporarily removes the formatting and set the `rawValue`
         * in each AutoNumeric child element.
         * 
         * The output format is a numeric string (`nnnn.nn` or `-nnnn.nn`).
         * The formatted values are immediately set back after the submit event.
         */
        unformatOnSubmit?: boolean;

        /**
          * That option is linked to the `modifyValueOnUpDownArrow` one and will only be used if the latter is set to `true`.
          * This option will modify the up/down arrow behavior and can be used in two ways, either by setting :
          * - a `fixed` step value (a positive float or integer number (ex: `1000`)), or
          * - the `progressive` string.
          *
          * The `fixed` mode always increment/decrement the element value by that amount, while respecting the `minimumValue` and `maximumValue` settings.
          * 
          * The `progressive` mode will increment/decrement the element value based on its current value. The bigger the number, the bigger the step, and vice versa.
          */
        upDownStep?: number | string | "progressive";

        /**
         * Provides a way for automatically replacing the formatted value with a pre-defined string,
         * when the raw value is equal to a specific value.
         */
        valuesToStrings?: object;

        /**
         * Defines if the AutoNumeric element should watch external changes made without using `.set()`, but by using the basic `aNElement.node().value = 42` notation.
         * 
         * If set to `watch`, then AutoNumeric will format the new value using `.set()` internally.
         * 
         * Otherwise it will neither format it, nor save it in the history.
         */
        watchExternalChanges?: boolean;

        /**
         * Defines when the wheel event will increment or decrement the element value.
         * - `focus` will only modify the value if the element is focused, and
         * - `hover` will modify the value if the element is hovered (focused or not).
         */
        wheelOn?: "focus" | "hover";

        /**
         * That option is linked to the `modifyValueOnWheel` one and will only be used if the latter is set to `true`.
         * This option will modify the wheel behavior and can be used in two ways, either by setting :
         * - a `fixed` step value (a positive float or integer (ex: number `1000`)), or
         * - the ``progressive` string.
         *
         * The `fixed` mode always increment/decrement the element value by that amount, while respecting the `minimumValue` and `maximumValue` settings.
         * 
          * The `progressive` mode will increment/decrement the element value based on its current value. The bigger the number, the bigger the step, and vice versa.
        */
        wheelStep?: number | string | "progressive";
    }

    /**
     * Similar to {@link Options}, but each property can be either the value itself, or a function that
     * returns the value.
     */
    export type CallbackOptions = { [K in keyof Options]: ValueOrCallback<Required<Options>[K]> };

    /**
     * Whenever {@link init} is used to initialize other DOM elements, a shared local `init` list of those elements is stored in
     * the AutoNumeric instances.
     * 
     * This allows for neat things like modifying all those linked AutoNumeric elements globally, with only one call.
     * 
     * Use the {@link AutoNumeric.global} property to access the handler that provides methods to modify all linked elements.
     */
    export interface AutoNumericGlobal {
        /**
         * Add an existing AutoNumeric object (or DOM element) to the local AutoNumeric element list, using the DOM element as the key.
         * This manages the case where `addObject` is used on an AutoNumeric object that already has multiple elements in its local list.
         * @param element The AutoNumeric element to add.
         */
        readonly addObject: (element: HTMLElement | AutoNumeric) => void;

        /**
         * Execute the {@link AutoNumeric.prototype.clear} method on each AutoNumeric object in the local AutoNumeric element list
         *
         * @param forceClearAll `true` to clear the the entire input, including the currency sign.
         */
        readonly clear: (forceClearAll?: boolean) => void;

        /**
         * Gets an array containing all the AutoNumeric DOM elements that have been initialized by each other.
         * @returns An array with all AutoNumeric DOM elements.
         */
        readonly elements: () => HTMLElement[];

        /**
         * Remove all elements from the shared list, effectively emptying it.
         * This is the equivalent of calling {@link AutoNumeric.detach} on each of its elements.
         * @param keepEachAnObjectInItsOwnList If set to `true`, then instead of completely emptying the local list
         * of each AutoNumeric objects, each one of those keeps itself in its own local list.
         */
        readonly empty: (keepEachAnObjectInItsOwnList?: boolean) => void;

        // The get() function is deprecated and should not be used. Omitted from TS def for that reason.

        /**
         * Gets a map containing all the AutoNumeric DOM elements that have been initialized by each other.
         * The key is the DOM element, the value the corresponding AutoNumeric instance.
         * @returns A map with all AutoNumeric instances.
         */
        readonly getList: () => Map<HTMLElement, AutoNumeric>;

        /**
         * Execute the {@link AutoNumeric.prototype.getNumericString} method on each AutoNumeric object in the local AutoNumeric element list.
         * 
         * Return an array of the unformatted values of each AutoNumeric element of the local AutoNumeric element list
         * This can also return `null` if `rawValue` is null.
         * @param callback Optional callback that, when given, is called with the value and the AutoNumeric instance.
         * @returns The numeric value for each linked AutoNumeric instance.
         */
        readonly getNumericString: (callback?: GetValueCallback<Array<string | null>> | null) => Array<string | null>;

        /**
         * Execute the {@link AutoNumeric.prototype.getFormatted} method on each AutoNumeric object in the local AutoNumeric element list.
         * 
         * Return an array of the current formatted values of each AutoNumeric element of the local AutoNumeric element list
         * @param callback Optional callback that, when given, is called with the value and the AutoNumeric instance.
         * @returns The formatted value for each linked AutoNumeric instance.
         */
        readonly getFormatted: (
            callback?: GetValueCallback<Array<string>> | null
        ) => Array<string>;

        /**
         * Execute the {@link AutoNumeric.prototype.getNumber} method on each AutoNumeric object in the local AutoNumeric element list.
         * 
         * Return an array of the element unformatted values (as a real Javascript number), for
         * each element of the local AutoNumeric element list.
         * @param callback Optional callback that, when given, is called with the value and the AutoNumeric instance.
         * @returns The number value for each linked AutoNumeric instance.
         */
        readonly getNumber: (callback?: GetValueCallback<Array<number | null>> | null) => Array<number | null>;

        /**
         * Execute the {@link AutoNumeric.prototype.getLocalized} method on each AutoNumeric object in the local AutoNumeric element list.
         * 
         * Returns the unformatted values (following the `outputFormat`) setting of each element
         * of the local AutoNumeric element list into an array.
         * @param callback Optional callback that, when given, is called with the value and the AutoNumeric instance.
         * @returns The localized value for each linked AutoNumeric instance.
         */
        readonly getLocalized: (callback: GetValueCallback<Array<string | number>>) => Array<string | number>;

        /**
         * Return `true` if the given AutoNumeric instance (or DOM element) is in the local AutoNumeric element list.
         * @param element The element to check.
         * @returns Whether the given element is in the local AutoNumeric element list.
         */
        readonly has: (element: HTMLElement | AutoNumeric) => unknown;

        /**
         * Return `true` if *all* the AutoNumeric-managed elements are pristine, i.e. if their raw value hasn't changed.
         * By default, this returns `true` if the raw unformatted value is still the same even if the formatted one has changed
         * (due to a configuration update for instance).
         * @param checkOnlyRawValue If set to `true`, the pristine value is done on the raw unformatted value, not the
         * formatted one. If set to `false`, this also checks that the formatted value hasn't changed.
         * @returns Whether all AutoNumeric-managed elements are pristine.
         */
        readonly isPristine: (checkOnlyRawValue?: boolean) => boolean;

        /**
         * Execute the {@link AutoNumeric.prototype.nuke} method on each AutoNumeric object in the local AutoNumeric element list.
         */
        readonly nuke: () => void;

        /**
         * Execute the {@link AutoNumeric.prototype.reformat} method on each AutoNumeric object in the local AutoNumeric element list.
         * 
         * Force each element of the local AutoNumeric element list to reformat its value.
         */
        readonly reformat: () => void;

        /**
         * Execute the {@link AutoNumeric.prototype.remove} method on each AutoNumeric object in the local AutoNumeric element list.
         */
        readonly remove: () => void;

        /**
         * Remove the given AutoNumeric object (or DOM element) from the local AutoNumeric element list, using the DOM element as the key.
         * If this function attempts to remove the current AutoNumeric object from the local list, a warning is shown, but the deletion is still done.
         *
         * Special cases :
         * - If the current object removes itself, then it's removed from the shared local list, then a new empty local list is used/created
         * - If another object remove this object, then a local list with only this object is used/created
         * @param element The AutoNumeric element to remove.
         * @param keepCurrentAnObject If set to `false`, then the function will also remove the current AutoNumeric object if asked,
         * otherwise it will ignore it and print a warning message.
         */
        readonly removeObject: (element: HTMLElement | AutoNumeric, keepCurrentAnObject?: boolean) => void;

        /**
         * Execute the {@link AutoNumeric.prototype.set} method on each AutoNumeric object in the local AutoNumeric element list.
         * 
         * Set the same given element value for each element in the local AutoNumeric element list, and format those elements immediately.
         * @param newValue The new value to set.
         * @param options A settings object that will override the current settings. Note: the update is done only if the `newValue` is defined.
         */
        readonly set: (newValue: number | string | null, options?: CallbackOptions) => void;

        /**
         * Return the number of element in the local AutoNumeric element list.
         * @returns The number of linked AutoNumeric elements. 
         */
        readonly size: () => number;

        /**
         * Execute the {@link AutoNumeric.prototype.setUnformatted} method on each AutoNumeric object in the local AutoNumeric element list.
         * 
         * Set the value given value directly as the DOM element value, without formatting it beforehand.
         * This sets the same unformatted value for each element in the local AutoNumeric element list.
         * @param value The new value to set.
         * @param options A settings object that will override the current settings. Note: the update is done only if the `newValue` is defined.
         */
        readonly setUnformatted: (value: number | string | null, options?: CallbackOptions) => void;

        /**
         * Execute the {@link AutoNumeric.prototype.unformat} method on each AutoNumeric object in the local AutoNumeric element list.
         * 
         * Remove the formatting and keep only the raw unformatted value (as a numericString) in each element
         * of the local AutoNumeric element list
         */
        readonly unformat: () => void;

        /**
         * Execute the {@link AutoNumeric.prototype.unformatLocalized} method on each AutoNumeric object in the local AutoNumeric element list.
         * 
         * Remove the formatting and keep only the localized unformatted value in the element.
         * @param forcedOutputFormat Optional override for the default `outputFormat` setting if needed.
         */
        readonly unformatLocalized: (forcedOutputFormat?: OutputFormatOption) => void;

        /**
         * Execute the {@link AutoNumeric.prototype.update} method on each AutoNumeric object in the local AutoNumeric element list.
         * 
         * Updates the AutoNumeric settings, and immediately format the elements accordingly, for each element of
         * the local AutoNumeric element list.
         * @param newOptions New options to set. When multiple options are specified, later options override previous options.
         */
        readonly update: (...newOptions: CallbackOptions[]) => void;

        /**
         * Execute the {@link AutoNumeric.prototype.wipe} method on each AutoNumeric object in the local AutoNumeric element list.
         */
        readonly wipe: () => void;
    }

    /**
     * A custom event details object with either the given properties and `error` set to `null`, or all
     * properties `null` and a string error message.
     * @typeParam T Properties available when there is no error. 
     */
    export type AutoNumericEventSuccessOrError<T> = (AutoNumericEventFormattedData & {
        /** The error message, `null` if there are no errors. */
        error: null;
    }) | ({ [K in keyof T]: null } & {
        /** The error message, `null` if there are no errors. */
        error: string;
    });

    export interface AutoNumericEventFormattedData {
        /** The AutoNumeric instance emitting this event */
        aNElement: AutoNumeric;
        /** Is the element value still pristine? In other words, has its value changed since its initialization? */
        isPristine: boolean;
        /** The new raw value. */
        newRawValue: number | null;
        /** The new formatted value. */
        newValue: string;
        /** The previous raw value. */
        oldRawValue: number | null;
        /** The previous formatted value. */
        oldValue: string;
    }

    export interface AutoNumericEventRawValueModifiedData {
        /** The AutoNumeric instance emitting this event */
        aNElement: AutoNumeric;
        /** Is the element value still pristine? In other words, has its value changed since its initialization? */
        isPristine: boolean;
        /** The new raw value. */
        newRawValue: number | null;
        /** The previous raw value. */
        oldRawValue: number | null;
    }

    export interface AutoNumericEventInitializedData {
        /** The AutoNumeric instance emitting this event */
        aNElement: AutoNumeric;
        /** The new raw value. */
        newRawValue: number | null;
        /** The new formatted value. */
        newValue: string;
    }

    export type AutoNumericEventFormatted = AutoNumericEventSuccessOrError<AutoNumericEventFormattedData>;

    export type AutoNumericEventRawValueModified = AutoNumericEventSuccessOrError<AutoNumericEventRawValueModifiedData>;

    export type AutoNumericEventInitialized = AutoNumericEventSuccessOrError<AutoNumericEventInitializedData>;

    export interface AutoNumericEventInvalidFormula {
        /** The AutoNumeric instance emitting this event. */
        aNElement: AutoNumeric;
        /** The invalid formula. */
        formula: string;
    }

    export interface AutoNumericEventValidFormula {
        /** The AutoNumeric instance emitting this event. */
        aNElement: AutoNumeric;
        /** The valid formula. */
        formula: string;
        /** The math expression result. */
        result: number;
    }

    export interface PredefinedLanguages {
        French: Partial<Options>;
        Spanish: Partial<Options>;
        NorthAmerican: Partial<Options>;
        British: Partial<Options>;
        Swiss: Partial<Options>;
        Japanese: Partial<Options>;
        Chinese: Partial<Options>;
        Brazilian: Partial<Options>;
        Turkish: Partial<Options>;
    }

    export interface PredefinedCurrencies {
        euro: Partial<Options>;
        euroPos: Partial<Options>;
        euroNeg: Partial<Options>;
        euroSpace: Partial<Options>;
        euroSpacePos: Partial<Options>;
        euroSpaceNeg: Partial<Options>;
        percentageEU2dec: Partial<Options>;
        percentageEU2decPos: Partial<Options>;
        percentageEU2decNeg: Partial<Options>;
        percentageEU3dec: Partial<Options>;
        percentageEU3decPos: Partial<Options>;
        percentageEU3decNeg: Partial<Options>;
        dollar: Partial<Options>;
        dollarPos: Partial<Options>;
        dollarNeg: Partial<Options>;
        dollarNegBrackets: Partial<Options>;
        percentageUS2dec: Partial<Options>;
        percentageUS2decPos: Partial<Options>;
        percentageUS2decNeg: Partial<Options>;
        percentageUS3dec: Partial<Options>;
        percentageUS3decPos: Partial<Options>;
        percentageUS3decNeg: Partial<Options>;
    }

    export interface PredefinedNumbers {
        dotDecimalCharCommaSeparator: Partial<Options>;
        commaDecimalCharDotSeparator: Partial<Options>;
        integer: Partial<Options>;
        integerPos: Partial<Options>;
        integerNeg: Partial<Options>;
        float: Partial<Options>;
        floatPos: Partial<Options>;
        floatNeg: Partial<Options>;
        numeric: Partial<Options>;
        numericPos: Partial<Options>;
        numericNeg: Partial<Options>;
    }

    export type PredefinedOptions = Partial<Options> & PredefinedLanguages & PredefinedCurrencies & PredefinedNumbers;
}
