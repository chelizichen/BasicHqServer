type CamelizeString<T extends PropertyKey> = T extends string
  ? string extends T
    ? string
    : T extends `${infer F}_${infer R}`
      ? `${F}${Capitalize<CamelizeString<R>>}`
      : T
  : T

type Camelize<T> = { [K in keyof T as CamelizeString<K>]: T[K] }

type UnderlineCase<Str extends string> =
  Str extends `${infer First}${infer Upper}${infer Rest}`
    ? `${UnderlineChar<First>}${UnderlineChar<Upper>}${UnderlineCase<Rest>}`
    : Str

interface trade_money_total {
  date: number
  total: number
  id: number
}

interface ChartData {
  name: string
  value: number
}

interface ChooseData {
  name: string
  code: string
  createTime: string
  id: number
}

interface T_trade {
  id?: number
  userId: number
  code: string
  type: "1" | "2"
  createTime: string
  price: string
  total: number
}
