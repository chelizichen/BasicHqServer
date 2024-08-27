import { Component } from "sgridnode/build/main"

interface T_trade {
  userId: number
  code: string
  type: "1" | "2"
  createTime: string
  price: string
  total: number
}

@Component()
export class TradeService {
  async trade(data: T_trade) {
    return data
  }
}
