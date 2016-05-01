interface AutoNumericOptions {
  aSep?: string
  dGroup?: number
  aDec?: string
  altDec?: string
  aSign?: string
  pSign?: "p" | "s"
  vMin?: number
  vMax?: number
  mDec?: number
  mRound?: "S" | "A" | "s" | "a" | "B" | "U" | "D" | "C" | "F" | "CHF"
  aPad?: boolean
  nBracket?: string
  wEmpty?: "empty" | "zero" | "sign"
  lZero?: "allow" | "deny" | "keep"
  aForm?: boolean
  anDefault?: string
}

interface Serialized {
  name: string
  value: string
}

type AutoNumericMethod = "init" | "destroy" | "update" | "set" | "get"
  | "getString" | "getArray" | "getSettings"

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
