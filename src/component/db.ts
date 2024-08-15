import knex, { Knex } from "knex"
import { Autowired, Component, dbRsu2Vo } from "sgridnode/build/main"
import { getConf } from "../util/index.util"
import LruComponent from "./lru"
import moment from "moment"
import _ from "lodash"

@Component()
export class ConnComponent {
  private conn: Knex
  @Autowired(LruComponent) cache: LruComponent
  constructor() {
    const storageConf = getConf("config.db")
    console.log("storageConf", storageConf)
    this.conn = knex({
      client: "mysql2",
      connection: {
        database: storageConf.database!,
        host: storageConf.host,
        port: Number(storageConf.port),
        user: storageConf.username,
        password: String(storageConf.password)
      }
    })
    console.log("database  init success")
  }

  saveTradeTotalTdy(data: Omit<trade_money_total, "id">) {
    this.conn.insert(data).into("trade_money_total")
  }

  async getRecentlyTradeTotalList() {
    const tdy = {
      name: Number(moment().format("YYYYMMDD")),
      value: (this.cache.getCurrTradeTotal() || 0) as number
    }
    const tradeList = await this.conn
      .select("*")
      .from("trade_money_total")
      .orderBy("id", "desc")

    console.log("tradeList", tradeList)

    let resp = _.unionBy(dbRsu2Vo<trade_money_total[]>(tradeList), "name").map(
      (v) => {
        return {
          name: Number(v.date),
          value: v.total
        }
      }
    )
    resp.push(tdy)

    resp = _.orderBy(resp, ["name"], ["asc"])
    return resp
  }
}
