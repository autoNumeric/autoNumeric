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

  setUnformatted(value: number, options?: Options): void;

  get(callback?: (value: string, instance: AutoNumeric) => void): string;

  getFormatted(
    callback?: (value: string, instance: AutoNumeric) => void
  ): string;

  /**
   * Returns a plain number value without formatting
   */
  getNumber(
    callback: (value: number | null, instance: AutoNumeric) => void = null
  ): number | null;

  getNumericString(
    callback: (value: string | null, instance: AutoNumeric) => void = null
  ): string | null;

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

  update(...options: Options[]): Input;

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

  formLocalized(forcedOutputFormat?: PredefinedLanguages): string;

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
