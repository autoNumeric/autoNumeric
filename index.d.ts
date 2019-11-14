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
 * If this module is a UMD module that exposes a global variable 'myClassLib' when
 * loaded outside a module loader environment, declare that global here:
 * export as namespace myClassLib;
 */

/**
 * The class constructor function is the exported object from the file
 */
export = AutoNumeric;

declare class AutoNumeric {
  constructor(
    elementOrSelector: string | HTMLInputElement | HTMLElement,
    initialValue: string | number = null,
    options: Options | string = null
  ): AutoNumeric;

  static multiple(
    elementsOrSelector:
      | string
      | HTMLElement[]
      | { rootElement: HTMLElement; exclude?: HTMLInputElement[] },
    initialValue: number | Array<number | null> = null,
    options: Options | Options[] = null
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
  static getAutoNumericElement(domElement: HTMLElement): Input;

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
   * Set the value, but do not save the new state in the history table (used for undo/redo actions)
   */
  set(
    value: number | string | null,
    options?: Options,
    saveChangeToHistory?: boolean
  ): void;


  remove(): void;

  getNumber(
    callback: (value: number | null, instance: AutoNumeric) => void = null
  ): number | null;

  getNumericString(
    callback: (value: string | null, instance: AutoNumeric) => void = null
  ): string | null;

}

/**
 * Expose types as well
 */
declare namespace AutoNumeric {
  export type OutputFormat = 'string' | 'number';

  export interface Options {
    allowDecimalPadding?: boolean | 'floats';
    suffixText?: string;
    currencySymbol?: string;
    currencySymbolPlacement?: string;
    decimalCharacter?: string;
    decimalCharacterAlternative?: string | null;
    decimalPlaces?: number; // 0 or positive integer
    digitGroupSeparator?: string;
    emptyInputBehavior?:
      | 'null'
      | 'focus'
      | 'press'
      | 'always'
      | 'min'
      | 'max'
      | 'zero'
      | number
      | string /* representing a number */;
    modifyValueOnWheel?: boolean;
    outputFormat?: AutoNumericOutputFormat;
    readOnly?: boolean;
    negativePositiveSignPlacement?: 'p';
    styleRules?: {
      positive: string;
      negative: string;
    };
    minimumValue?: string;
    maximumValue?: string;
  }
}
