import { Component } from "sgridnode/build/main"
import { LRUCache } from "lru-cache"

@Component()
class LruComponent {
  rds: LRUCache<unknown, unknown, unknown>
  constructor() {
    this.rds = new LRUCache({
      max: 500
    })
  }

  private getBkKey() {
    return "LRU|BK"
  }
  private getBkMainKey() {
    return "LRU|BK|MAIN"
  }
  private getTradeMoneyKey() {
    return "LRU|TRADE|MONEY"
  }

  private getCurrTradeTotalKey() {
    return "LRU|TRADE|CURR"
  }

  getCurrTradeTotal() {
    return this.rds.get(this.getCurrTradeTotalKey())
  }

  getBk() {
    return this.rds.get(this.getBkKey())
  }

  getBkMain() {
    return this.rds.get(this.getBkMainKey())
  }

  getTradeMoney() {
    return this.rds.get(this.getTradeMoneyKey())
  }
  setBk(v) {
    if (this.rds.get(this.getBkKey())) {
      return true
    }
    this.rds.set(this.getBkKey(), v, { ttl: 1000 * 60 })
  }

  setBkMain(v) {
    if (this.rds.get(this.getBkMainKey())) {
      return true
    }
    this.rds.set(this.getBkMainKey(), v, { ttl: 1000 * 60 * 5 })
  }

  setTradeMonety(v) {
    if (this.rds.get(this.getTradeMoneyKey())) {
      return true
    }
    this.rds.set(this.getTradeMoneyKey(), v, { ttl: 1000 * 30 })
  }

  setCurrTradeTotal(v) {
    if (this.rds.get(this.getCurrTradeTotalKey())) {
      return true
    }
    this.rds.set(this.getCurrTradeTotalKey(), v)
  }
}

export default LruComponent
