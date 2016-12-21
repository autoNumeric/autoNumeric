interface AutoNumericOptions {
  digitGroupSeparator?: string
  noSeparatorOnFocus?: boolean
  digitalGroupSpacing?: number
  decimalCharacter?: string
  decimalCharacterAlternative?: string
  currencySymbol?: string
  currencySymbolPlacement?: "p" | "s"
  negativePositiveSignPlacement?: "l" | "r" | "p" | "s"
  suffixText?: string
  overrideMinMaxLimits?: 'ceiling' | 'floor' | 'ignore'
  maximumValue?: number
  minimumValue?: number
  decimalPlacesOverride?: number
  decimalPlacesShownOnFocus?: number
  scaleDivisor?: number
  scaleDecimalPlaces?: number
  scaleSymbol?: string
  saveValueToSessionStorage?: boolean
  roundingMethod?: "S" | "A" | "s" | "a" | "B" | "U" | "D" | "C" | "F" | "CHF"
  allowDecimalPadding?: boolean
  negativeBracketsTypeOnBlur?: string
  emptyInputBehavior?: "focus" | "press" | "always" | "zero"
  leadingZero?: "allow" | "deny" | "keep"
  formatOnPageLoad?: boolean
  selectNumberOnly?: boolean
  defaultValueOverride?: string
  unformatOnSubmit?: boolean
  outputFormat?: string
  showWarnings?: boolean
}

interface Serialized {
  name: string
  value: string
}

type AutoNumericMethod = "init" | "destroy" | "wipe" | "update" | "set" | "unSet" | "reSet" | "get" | "getLocalized" | "getFormatted" | "getString" | "getArray" | "getSettings"

interface JQuery {
  autoNumeric(): JQuery
  autoNumeric(options: AutoNumericOptions): JQuery
  autoNumeric(method: AutoNumericMethod, options?: AutoNumericOptions): JQuery
    | string | Serialized[] | AutoNumericOptions
  autoNumeric(method: "init", options?: AutoNumericOptions): JQuery
  autoNumeric(method: "destroy"): JQuery
  autoNumeric(method: "update", options: AutoNumericOptions): JQuery
  autoNumeric(method: "set", value: string): JQuery
  autoNumeric(method: "get"): string
  autoNumeric(method: "getString"): string
  autoNumeric(method: "getArray"): Serialized[]
  autoNumeric(method: "getSettings"): AutoNumericOptions
}
