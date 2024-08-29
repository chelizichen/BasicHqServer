import { Autowired } from "sgridnode/build/main"
import { Cron, Schedule } from "../decorator"
import { ConnComponent } from "./db"
import { getTradeTotal } from "../util/index.util"
import ValueComponent from "./value"
import _ from "lodash"
import moment from "moment"
@Schedule
export class ScheduleServer {
  @Autowired(ConnComponent) conn: ConnComponent
  @Autowired(ValueComponent) value: ValueComponent

  @Cron("config.schedule.dailyTradeTotal", false)
  async dailyTradeTotal() {
    console.log("run : dailyTradeTotal")
    const data = await getTradeTotal(this.value.TRADE_TOTAL)
    let totalMoney = 0
    _.values(data).map((v, i) => {
      if (i % 2 == 0) {
        totalMoney += Number((v / 100000000).toFixed(0))
      }
    })
    console.log("totalMoney", totalMoney)
    this.conn.syncSaveTradeTotalTdy({
      date: Number(moment().format("YYYYMMDD")),
      total: totalMoney
    })
  }
}
