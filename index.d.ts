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
 */

/**
 * The class constructor function is the exported object from the file
 */
export = AutoNumeric;

import { Options, OutputFormatOption, PredefinedOptions, PredefinedLanguages } from 'autonumeric';

declare class AutoNumeric {
    constructor(
        elementOrSelector: string | HTMLInputElement | HTMLElement,
        initialValue?: string | number | null,
        options?: Options | string | null
    );

    static multiple(
        elementsOrSelector:
            | string
            | HTMLElement[]
            | { rootElement: HTMLElement; exclude?: HTMLInputElement[] },
        initialValue?: number | Array<number | null> | null,
        options?: Options | Options[] | null
    ): AutoNumeric[];

    /**
     * Return true in the settings are valid
     */
    static areSettingsValid(options: Options): boolean;

    /**
     * Format the given number with the given options. This returns the formatted value as a string.
     */
    static format(value: number | string | HTMLElement, options: Options): string;

    /**
     * Format the domElement value with the given options and returns the formatted value as a string.
     */
    static formatAndSet(domElement: HTMLElement, options: Options): string;

    /**
     * Return the AutoNumeric object that manages the given DOM element
     */
    static getAutoNumericElement(domElement: HTMLElement): AutoNumeric;

    /**
     * Return the default autoNumeric settings
     */
    static getDefaultConfig(): Options;

    /**
     * Return all the predefined options in one object
     */
    static getPredefinedOptions(): PredefinedOptions;

    /**
     * Return true if the given DOM element has an AutoNumeric object that manages it.
     */
    static isManagedByAutoNumeric(domElement: HTMLElement): boolean;

    /**
     * Unformat and localize the given formatted string with the given options.
     */
    static localize(value: string | HTMLElement, options: Options): string;

    static localizeAndSet(domElement: HTMLElement, options: Options): string;

    static mergeOptions(...options: Options[]): Options;

    static reformatAndSet(referenceToTheDomElement: HTMLElement): void;

    static test(domElement: HTMLElement): boolean;

    static validate(options: Options): boolean;

    static version(): string;

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
    set(
        newValue: number | string | null,
        options?: Options,
        saveChangeToHistory?: boolean
    ): void;

    /**
     * Set the given value directly as the DOM element value, without formatting it beforehand.
     * You can also set the value and update the setting in one go (the value will again not be formatted immediately).
     */
    setUnformatted(value: number, options?: Options): void;

    /**
     * The get() function is deprecated and should not be used. Omitted from TS def for that reason.
     * get(callback?: (value: string, instance: AutoNumeric) => void): string;
     */

    /**
     * Return the current formatted value of the AutoNumeric element as a string.
     */
    getFormatted(
        callback?: (value: string, instance: AutoNumeric) => void
    ): string;

    /**
     * Return the element unformatted value as a real JavaScript number.
     */
    getNumber(
        callback?: (value: number | null, instance: AutoNumeric) => void | null
    ): number | null;

    /**
     * Return the unformatted value as a string.
     * This can also return `null` if `rawValue` is null.
     */
    getNumericString(
        callback?: (value: string | null, instance: AutoNumeric) => void | null
    ): string | null;

    /**
     * Returns the unformatted value, but following the `outputFormat` setting, which means the output can either be:
     *
     * - a string (that could or could not represent a number, ie. "12345,67-"), or
     * - a plain number (if the setting 'number' is used).
     *
     * By default the returned values are an ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period.
     * Check the `outputFormat` option definition for more details.
     */
    getLocalized(forcedOutputFormat?: OutputFormatOption, callback?: (value: string) => void): string;
    getLocalized(callback: (value: string) => void): string;

    reformat(): void;

    unformat(): void;

    unformatLocalized(forcedOutputFormat?: OutputFormatOption): void;

    isPristine(): boolean;

    select(): void;

    selectNumber(): void;

    selectInteger(): void;

    selectDecimal(): void;

    clear(reset?: boolean): void;

    /**
     * Updates the AutoNumeric settings, and immediately format the element accordingly.
     */
    update(...options: Options[]): AutoNumeric;

    /**
     * Remove the autoNumeric data and event listeners from the element, but keep the element content intact.
     * This also clears the value from sessionStorage (or cookie, depending on browser supports).
     * Note: this does not remove the formatting.
     */
    remove(): void;

    /**
     * Remove the autoNumeric data and event listeners from the element, and reset its value to the empty string ''.
     * This also clears the value from sessionStorage (or cookie, depending on browser supports).
     */
    wipe(): void;

    /**
     * Remove the autoNumeric data and event listeners from the element, and delete the DOM element altogether
     */
    nuke(): void;

    /**
     * Return the DOM element reference of the autoNumeric-managed element
     */
    node(): HTMLInputElement;

    parent(): HTMLElement;

    detach(): void;

    attach(otherAnElement: HTMLElement, reFormat?: boolean): void;

    init(domeElement2: HTMLElement): AutoNumeric|AutoNumeric[];

    form(forcedSearch?: boolean): HTMLFormElement;

    formNumericString(): string;

    formFormatted(): string;

    formLocalized(forcedOutputFormat?: PredefinedLanguages): string;

    formArrayNumericString(): HTMLInputElement[];

    formArrayFormatted(): HTMLInputElement[];

    formArrayLocalized(): HTMLInputElement[];

    formJsonNumericString(): string;

    formJsonFormatted(): string;

    formJsonLocalized(): string;

    formUnformat(): void;

    formReformat(): void;

    formSubmitArrayNumericString(callback: Function): AutoNumeric;

    formSubmitArrayFormatted(callback: Function): AutoNumeric;

    formSubmitArrayLocalized(callback: Function): AutoNumeric;

    formSubmitJsonNumericString(callback: Function): AutoNumeric;

    formSubmitJsonFormatted(callback: Function): AutoNumeric;

    formSubmitJsonLocalized(callback: Function): AutoNumeric;
}

/**
 * Exposes the types used in that definitions file
 */
declare namespace AutoNumeric {
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

    export type SerializeSpacesOption = "+" | "%20";

    export interface Options {
        /**
         * Allow padding the decimal places with zeros.
         * @default true
         */
        allowDecimalPadding?: boolean | "floats";

        /**
         * Determine where should be positioned the caret on focus
         * @default null
         */
        caretPositionOnFocus?: CaretPositionOption;

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
        decimalPlaces?: number;

        /**
         * Defines how many decimal places should be kept for the raw value.
         * @default null
         */
        decimalPlacesRawValue?: number | null;

        /**
         * The number of decimal places to show when unfocused
         * @default null
         */
        decimalPlacesShownOnBlur?: number | null;

        /**
         * The number of decimal places to show when focused
         * @default null
         */
        decimalPlacesShownOnFocus?: number | null;

        /**
         * Helper option for ASP.NET postback
         * This should be set as the value of the unformatted default value
         * examples:
         * no default value="" {defaultValueOverride: ""}
         * value=1234.56 {defaultValueOverride: '1234.56'}
         * @default null
         */
        defaultValueOverride?: string | { doNotOverride: null };

        /**
         * Digital grouping for the thousand separator
         * @default '3'
         */
        digitalGroupSpacing?: string;

        /**
         * Thousand separator character
         * @default ','
         */
        digitGroupSeparator?: string;

        /**
         * Define the number that will divide the current value shown when unfocused
         * @default null
         */
        divisorWhenUnfocused?: number | null;

        emptyInputBehavior?: EmptyInputBehaviorOption;

        eventBubbles?: boolean;

        eventIsCancelable?: boolean;

        failOnUnknownOption?: boolean;

        formatOnPageLoad?: boolean;

        formulaMode?: boolean;

        historySize?: number;

        invalidClass?: string;

        isCancellable?: boolean;

        leadingZero?: LeadingZeroOption;

        maximumValue?: string;

        minimumValue?: string;

        /**
         * Determine if the element value can be incremented / decremented with the up and down arrow keys.
         */
        modifyValueOnUpDownArrow?: boolean;

        /**
         * Determine if the element value can be incremented / decremented with the mouse wheel.
         */

        modifyValueOnWheel?: boolean;

        negativeBracketsTypeOnBlur?: string | null;

        /**
         * Placement of negative/positive sign relative to the currency symbol (possible options are l (left), r (right), p (prefix) and s (suffix))
         * @default null
         */
        negativePositiveSignPlacement?: NegativePositiveSignPlacementOption;

        negativeSignCharacter?: string;

        noEventListeners?: boolean;

        onInvalidPaste?: OnInvalidPasteOption;

        outputFormat?: OutputFormatOption;

        overrideMinMaxLimits?: OverrideMinMaxLimitsOption;

        positiveSignCharacter?: string;

        rawValueDivisor?: number | null;

        readOnly?: boolean;

        roundingMethod?: RoundingMethodOption;

        saveValueToSessionStorage?: boolean;

        selectNumberOnly?: boolean;

        selectOnFocus?: boolean;

        serializeSpaces?: SerializeSpacesOption;

        showOnlyNumbersOnFocus?: boolean;

        showPositiveSign?: boolean;

        showWarnings?: boolean;

        //FIXME
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

        suffixText?: string;

        symbolWhenUnfocused?: string | null;

        unformatOnHover?: boolean;

        unformatOnSubmit?: boolean;

        upDownStep?: number | "progressive";

        valuesToStrings?: object;

        watchExternalChanges?: boolean;

        wheelOn?: "focus" | "hover";

        wheelStep?: number | "progressive";
    }

    interface PredefinedLanguages {
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

    interface PredefinedCurrencies {
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
    
    interface PredefinedNumbers {
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
    
    type PredefinedOptions = Partial<Options> & PredefinedLanguages & PredefinedCurrencies & PredefinedNumbers;
}
