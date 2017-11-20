declare let AutoNumeric: AutoNumeric.Static;

export = AutoNumeric;
export as namespace AutoNumeric;

declare module AutoNumeric {

    interface Static {
        new (selector: string | HTMLInputElement, options?: Options): Input;
        new (selector: string | HTMLInputElement, defaultValue: number, options?: Options): Input;

        multiple(selector: string | HTMLInputElement[], options?: Options): Input;
        multiple(selector: string | HTMLInputElement[], defaultValue: number, options?: Options): Input;

        /**
         * Return true in the settings are valid
         */
        areSettingsValid(options: Options): boolean;

        /**
         * Format the given number with the given options. This returns the formatted value as a string.
         */
        format(value: number | string | HTMLElement, options: Options): string;

        /**
         * Format the domElement value with the given options and returns the formatted value as a string. 
         */
        formatAndSet(domElement: HTMLElement, options: Options): string;

        /**
         * Return the AutoNumeric object that manages the given DOM element
         */
        getAutoNumericElement(domElement: HTMLElement): Input;

        /**
         * Return the default autoNumeric settings
         */
        getDefaultConfig(): Options;

        /**
         * Return all the predefined options in one object
         */
        getPredefinedOptions(): PredefinedLanguage;

        /**
         * Return true if the given DOM element has an AutoNumeric object that manages it.
         */
        isManagedByAutoNumeric(domElement: HTMLElement): boolean;

        /**
         * Unformat and localize the given formatted string with the given options.
         */
        localize(value: string | HTMLElement, options: Options): string;

        localizeAndSet(domElement: HTMLElement, options: Options): string;

        mergeOptions(...options: Options[]): Options;

        reformatAndSet(referenceToTheDomElement: HTMLElement): void;

        test(domElement: HTMLElement): boolean;

        validate(options: Options): boolean;

        version(): string;
    }

    interface Input {
        /**
         * Set the value, but do not save the new state in the history table (used for undo/redo actions)
         */
        set(value: number, options?: Options, save?: boolean): void;

        setUnformatted(value: number, options?: Options): void;

        getNumericString(callback?: Function): string;

        get(callback?: Function): string;

        getFormatted(callback?: Function): string;

        /**
         * Returns a plain number value without formatting
         */
        getNumber(callback?: Function): number;

        getLocalized(format?: PredefinedLanguage): string;
        getLocalized(callback: Function): string;

        reformat(): void;

        unformat(): void;

        unformatLocalized(format?: PredefinedLanguage): void;

        isPristine(): boolean;

        select(): void;

        selectNumber(): void;

        selectInteger(): void;

        selectDecimal(): void;

        clear(reset?: boolean): void;

        update(...options: Options[]): Input;
        update(locale: PredefinedLanguage): Input;

        /**
         * Remove the autoNumeric listeners from the element (previous name : 'destroy'). Keep the element content intact.
         */
        remove(): void;

        /**
         * Remove the autoNumeric listeners from the element, and reset its value to ''
         */
        wipe(): void;

        /**
         * Remove the autoNumeric listeners from the element, and delete the DOM element altogether
         */
        nuke(): void;

        /**
         * Return the DOM element reference of the autoNumeric-managed element
         */
        node(): HTMLInputElement;

        parent(): HTMLElement;

        detach(): void;

        attach(otherAnElement: HTMLElement, reFormat?: boolean): void;

        init(domeElement2: HTMLElement): Input;

        form(forcedSearch?: boolean): HTMLFormElement;

        formNumericString(): string;

        formFormatted(): string;

        formLocalized(forcedOutputFormat?: PredefinedLanguage): string;

        formArrayNumericString(): HTMLInputElement[];

        formArrayFormatted(): HTMLInputElement[];

        formArrayLocalized(): HTMLInputElement[];

        formJsonNumericString(): string;

        formJsonFormatted(): string;

        formJsonLocalized(): string;

        formUnformat(): void;

        formReformat(): void;

        formSubmitArrayNumericString(callback: Function): Input;

        formSubmitArrayFormatted(callback: Function): Input;

        formSubmitArrayLocalized(callback: Function): Input;

        formSubmitJsonNumericString(callback: Function): Input;

        formSubmitJsonFormatted(callback: Function): Input;

        formSubmitJsonLocalized(callback: Function): Input;
    }

    interface Options {

        /**
         * Allow padding the decimal places with zeros.
         * @default true
         */
        allowDecimalPadding?: boolean;

        /**
         * Determine where should be positioned the caret on focus
         * @default null
         */
        caretPositionOnFocus?: string;

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
        currencySymbolPlacement?: string;

        /**
         * Decimal separator character
         * @default '.'
         */
        decimalCharacter?: string;

        /**
         * Allow to declare alternative decimal separator which is automatically replaced by the real decimal character
         * @default null
         */
        decimalCharacterAlternative?: string;

        /**
         * Defines the default number of decimal places to show on the formatted value, and to keep as the precision for the rawValue
         * @default 2
         */
        decimalPlaces?: number;

        /**
         * Defines how many decimal places should be kept for the raw value.
         * @default null
         */
        decimalPlacesRawValue?: number;

        /**
         * The number of decimal places to show when unfocused
         * @default null
         */
        decimalPlacesShownOnBlur?: number;

        /**
         * The number of decimal places to show when focused
         * @default null
         */
        decimalPlacesShownOnFocus?: number;

        /**
         * Helper option for the ASP.NET-specific postback issue
         * @default null
         */
        defaultValueOverride?: string;

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
        divisorWhenUnfocused?: number;

        emptyInputBehavior?: string;

        failOnUnknownOption?: boolean;

        formatOnPageLoad?: boolean;

        historySize?: number;

        isCancellable?: boolean;

        leadingZero?: string;

        minimumValue?: number;

        maximumValue?: number;

        /**
         * Determine if the element value can be incremented / decremented with the mouse wheel.
         */
        modifyValueOnWheel?: boolean;

        negativeBracketsTypeOnBlur?: string;

        /**
         * Placement of negative/positive sign relative to the currency symbol (possible options are l (left), r (right), p (prefix) and s (suffix))
         * @default null
         */
        negativePositiveSignPlacement?: string;
        
        noEventListeners?: boolean;

        onInvalidPaste?: string;

        outputFormat?: any;

        overrideMinMaxLimits?: string;

        rawValueDivisor?: string;

        readOnly?: boolean;
        
        roundingMethod?: string;

        saveValueToSessionStorage?: boolean;

        selectNumberOnly?: boolean;

        selectOnFocus?: boolean;

        serializeSpaces?: string;

        showOnlyNumbersOnFocus?: boolean;

        showPositiveSign?: boolean;

        showWarnings?: boolean;

        styleRules?: any;

        suffixText?: string;

        symbolWhenUnfocused?: string;

        unformatOnHover?: boolean;

        unformatOnSubmit?: boolean;

        wheelStep?: string;
    }

    interface PredefinedLanguage {
        French: any;
        Spanish: any;
        NorthAmerican: any;
        British: any;
        Swiss: any;
        Japanese: any;
        Chinese: any;
        Brazilian: any;
    }
}
