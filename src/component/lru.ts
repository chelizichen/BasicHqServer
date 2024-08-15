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

  getCurrTradeTotal() {
    return this.rds.get("LRU|TRADE|CURR")
  }

  getBk() {
    return this.rds.get("LRU|BK")
  }

  getBkMain() {
    return this.rds.get("LRU|BK|MAIN")
  }

  getTradeMoney() {
    return this.rds.get("LRU|TRADE|MONEY")
  }
  setBk(v) {
    if (this.rds.get("LRU|BK")) {
      return true
    }
    this.rds.set("LRU|BK", v, { ttl: 1000 * 60 })
  }

  setBkMain(v) {
    if (this.rds.get("LRU|BK|MAIN")) {
      return true
    }
    this.rds.set("LRU|BK|MAIN", v, { ttl: 1000 * 60 * 5 })
  }

  setTradeMonety(v) {
    if (this.rds.get("LRU|TRADE|MONEY")) {
      return true
    }
    this.rds.set("LRU|TRADE|MONEY", v, { ttl: 1000 * 30 })
  }

  setCurrTradeTotal(v) {
    this.rds.set("LRU|TRADE|CURR", v)
  }
}

export default LruComponent
