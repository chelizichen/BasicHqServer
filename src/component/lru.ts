import { Component } from "sgridnode/build/main";
import { LRUCache } from "lru-cache";

@Component()
class LruComponent {
  rds: LRUCache<any, any, any>;
  constructor() {
    this.rds = new LRUCache({
      max: 500,
    });
  }

  getBkKey() {
    return "LRU|BK";
  }
  getBkMainKey() {
    return "LRU|BK|MAIN";
  }
  getTradeMoneyKey() {
    return "LRU|TRADE|MONEY";
  }

  getBk() {
    return this.rds.get(this.getBkKey());
  }

  getBkMain() {
    return this.rds.get(this.getBkMainKey());
  }

  getTradeMoney() {
    return this.rds.get(this.getTradeMoneyKey());
  }
  setBk(v) {
    if (this.rds.get(this.getBkKey())) {
      return true;
    }
    this.rds.set(this.getBkKey(), v, { ttl: 1000 * 60 });
  }

  setBkMain(v) {
    if (this.rds.get(this.getBkMainKey())) {
      return true;
    }
    this.rds.set(this.getBkMainKey(), v, { ttl: 1000 * 60 * 5 });
  }

  setTradeMonety(v) {
    if (this.rds.get(this.getTradeMoneyKey())) {
      return true;
    }
    this.rds.set(this.getTradeMoneyKey(), v, { ttl: 1000 * 30 });
  }
}

export default LruComponent;
