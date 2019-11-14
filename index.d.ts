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
    options: AutoNumericOptions | string = null
  ): AutoNumeric;

  multiple(
    elementsOrSelector:
      | string
      | HTMLElement[]
      | { rootElement: HTMLElement; exclude?: HTMLInputElement[] },
    initialValue: number | Array<number | null> = null,
    options: AutoNumericOptions | AutoNumericOptions[] = null
  ): Input;

  /**
   * Set the value, but do not save the new state in the history table (used for undo/redo actions)
   */
  set(
    value: number | string | null,
    options?: AutoNumericOptions,
    saveChangeToHistory?: boolean
  ): void;

  update(...options: AutoNumericOptions[]): void;

  remove(): void;

  getNumber(
    callback: (value: number | null, instance: AutoNumeric) => void = null
  ): number | null;

  getNumericString(
    callback: (value: string | null, instance: AutoNumeric) => void = null
  ): string | null;

  static getPredefinedOptions(): AutoNumericOptions;
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
