import { Autowired, Component } from "sgridnode/build/main"
import ValueComponent from "../component/value"
import LruComponent from "../component/lru"
import { getBKHQ, getBkMain, getTradeTotal } from "../util/index.util"
import _ from "lodash"
import { ConnComponent } from "../component/db"

interface ChartData {
  name: string
  value: number
}

@Component()
export default class WebService {
  @Autowired(ValueComponent) value: ValueComponent
  @Autowired(LruComponent) cache: LruComponent
  @Autowired(ConnComponent) db: ConnComponent

  async getBkData() {
    let data = null
    data = this.cache.getBk()
    if (!data) {
      data = (await getBKHQ(this.value.HY_FILE)) as ChartData[]
      this.cache.setBk(data)
      console.log("设置缓存")
    } else {
      console.log("击中缓存")
    }

    const render_Data = {
      HEAD_TITLE: this.value.HEAD_TITLE,
      title: "板块涨幅",
      legend: "百分比(%)",
      publicPath: this.value.publicPath,
      xData: JSON.stringify(data.map((v) => v.name)),
      yData: JSON.stringify(
        data.map((v) => {
          if (v.value > 0) {
            return v.value.toFixed(2)
          }
          return {
            value: v.value.toFixed(2),
            itemStyle: {
              color: "#91cc75"
            }
          }
        })
      )
    }

    return render_Data
  }

  async getBkMain() {
    let data = null
    data = this.cache.getBkMain()
    if (!data) {
      data = (await getBkMain(this.value.HY_MAIN)) as ChartData[]
      this.cache.setBkMain(data)
    } else {
      console.log("击中缓存 ｜ bk_main")
      console.log("data", data)
    }
    const render_data = {
      HEAD_TITLE: this.value.HEAD_TITLE,
      title: "板块主力占比涨幅",
      legend: "5日净流入百分比(%)",
      publicPath: this.value.publicPath,
      xData: JSON.stringify(data.map((v) => v.name)),
      yData: JSON.stringify(
        data.map((v) => {
          if (v.value > 0) {
            return v.value.toFixed(2)
          }
          return {
            value: v.value.toFixed(2),
            itemStyle: {
              color: "#91cc75"
            }
          }
        })
      )
    }
    return render_data
  }

  async getTradeMoney() {
    let data = null
    data = this.cache.getTradeMoney()
    if (!data) {
      data = await getTradeTotal(this.value.TRADE_TOTAL)
      this.cache.setTradeMonety(data)
    } else {
      console.log("击中缓存 ｜ trade_money")
      console.log("data", data)
    }
    let totalMoney = 0
    const render_data = {
      HEAD_TITLE: this.value.HEAD_TITLE,
      title: "资金流向统计",
      legend: "资金统计(亿元)",
      publicPath: this.value.publicPath,
      xData: JSON.stringify(_.keys(data)),
      yData: JSON.stringify(
        _.values(data).map((v, i) => {
          if (i % 2 == 0) {
            totalMoney += Number((v / 100000000).toFixed(0))
            return (v / 100000000).toFixed(0)
          }
          return {
            value: (v / 100000000).toFixed(0),
            itemStyle: {
              color: "#91cc75"
            }
          }
        })
      ),
      totalMoney: 0
    }
    render_data.totalMoney = totalMoney
    this.cache.setCurrTradeTotal(totalMoney)
    return render_data
  }

  async getTradeHis() {
    const data = await this.db.getRecentlyTradeTotalList()
    console.log("data", data)
    const render_data = {
      HEAD_TITLE: this.value.HEAD_TITLE,
      title: "历史成交",
      legend: "成交总额(亿)",
      publicPath: this.value.publicPath,
      xData: JSON.stringify(data.map((v) => v.name)),
      yData: JSON.stringify(
        data.map((v) => {
          return Number(v.value).toFixed(0)
        })
      )
    }
    return render_data
  }
}
