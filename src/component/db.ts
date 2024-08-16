import knex, { Knex } from "knex"
import { Autowired, Component, dbRsu2Vo } from "sgridnode/build/main"
import { getConf } from "../util/index.util"
import LruComponent from "./lru"
import moment from "moment"
import _ from "lodash"
import loggerComponent from "./logger"

@Component()
export class ConnComponent {
  private conn: Knex
  @Autowired(LruComponent) cache: LruComponent
  @Autowired(loggerComponent) logger: loggerComponent
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
    this.conn
      .insert(data)
      .into("trade_money_total")
      .then((res) => {
        this.logger.data("saveTradeTotalTdy success", res)
      })
      .catch((err: Error) => {
        this.logger.error("saveTradeTotalTdy error", err.message)
      })
  }

  syncDeleteSameData() {
    const sql = `
    DELETE t1 FROM trade_money_total t1
        INNER JOIN
    trade_money_total t2 
WHERE
    t1.id < t2.id AND t1.date = t2.date AND t1.total = t2.total; `
    this.conn.raw(sql)
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

    let resp = dbRsu2Vo<trade_money_total[]>(tradeList)
      .map((v) => {
        return {
          name: Number(v.date),
          value: v.total
        }
      })
      .filter((v) => v.value)
    resp.push(tdy)

    resp = _.unionBy(_.orderBy(resp, ["name"], ["asc"]), "name")
    return resp
  }

  async getChooseData(): Promise<Array<ChooseData>> {
    const tradeList = await this.conn
      .select("*")
      .from("choose_stock")
      .orderBy("id", "desc")
    const resp = dbRsu2Vo<ChooseData[]>(tradeList)
    return resp
  }
}
