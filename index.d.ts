declare let AutoNumeric: AutoNumeric.Static;

export = AutoNumeric;
export as namespace AutoNumeric;

declare module AutoNumeric {

    interface Input {
      /**
       * Returns a plain number value without formatting
       */
        getNumber(): number;

        /**
         * Set the value, but do not save the new state in the history table (used for undo/redo actions)
         */
        set(value: number, options?: Options, save?: boolean): void;

        /**
         * Original DOM element the autonumeric is bound to
         */
        domElement: HTMLInputElement;
    }

    interface Static {
        new (selector: string | HTMLInputElement, options?: Options): Input;
        multiple(selector: string | HTMLInputElement[], options?: any): Input;
    }

    interface Options {
        digitGroupSeparator?: string;
        decimalCharacter?: string;

        /**
         * Determine if the element value can be incremented / decremented with the mouse wheel.
         */
        modifyValueOnWheel?: boolean;

        /**
         * Defines the default number of decimal places to show on the formatted value, and to keep as the precision for the rawValue
         * @default 2
         */
        decimalPlaces?: number;
        decimalCharacterAlternative?: string;
        currencySymbol?: string;
        currencySymbolPlacement?: string;
        roundingMethod?: string;

        minimumValue?: number;
        maximumValue?: number;
    }
}
