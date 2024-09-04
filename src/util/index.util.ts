import axios from "axios"
import _ from "lodash"
import { loadSgridConf } from "sgridnode/build/main"

export function generateRandomCallbackName() {
  const randomPart = Math.floor(Math.random() * 10000000000000000).toString() // 生成一个 16 位的随机数
  const timestamp = Date.now() // 获取当前时间戳
  return `jQuery${randomPart}_${timestamp}`
}

export function replaceTarget(URL, MARKET: number = 0, CODE: string = "") {
  const PARAMS = "[JSONPCALLBACK]"
  const PARAMS2 = "[TIME]"
  const PARAMS3 = "[MARKET]"
  const PARAMS4 = "[CODE]"
  const NAME = generateRandomCallbackName()
  const NAME2 = Date.now() // 获取当前时间戳
  return {
    URL: URL.replace(PARAMS, NAME)
      .replace(PARAMS2, NAME2)
      .replace(PARAMS3, MARKET)
      .replace(PARAMS4, CODE),
    NAME: NAME
  }
}

export function getMarket(stockCode: string): number {
  if (stockCode.startsWith("11")) {
    return 1
  } else if (stockCode.startsWith("12")) {
    return 0
  } else {
    return ["6", "9", "5", "7"].includes(String(stockCode).slice(0, 1)) ? 1 : 0
  }
}

export function getBKHQ(TARGET: string) {
  return new Promise((resolve) => {
    const T = replaceTarget(TARGET)
    axios.get(T.URL).then((res) => {
      const data = res.data
      const ret = eval(data.replace(T.NAME, ""))
      const diff = _.get(ret, "data.diff", []) || []
      const charts = _.map(diff, (item) => {
        const [bkmc, jrzf] = [item.f14, item.f3]
        return {
          name: bkmc,
          value: jrzf
        }
      })
      const sortChartsData = _.orderBy(charts, "value", "desc")
      resolve(sortChartsData)
    })
  })
}

export function getBkMain(TARGET: string) {
  return new Promise((resolve) => {
    const T = replaceTarget(TARGET)
    axios.get(T.URL).then((res) => {
      const data = res.data
      const ret = eval(data.replace(T.NAME, ""))
      const diff = _.get(ret, "data.diff", []) || []
      const charts = _.map(diff, (item) => {
        const [bkmc, a1, a2, a3] = [item.f14, item.f165, item.f167, item.f169]
        const v = a1 + a2 + a3
        console.log("bkmc", bkmc, v, "|", a1, a2, a3)

        return {
          name: bkmc,
          value: v
        }
      })
      const sortChartsData = _.orderBy(charts, "value", "desc")
      resolve(sortChartsData)
    })
  })
}

export function getTradeTotal(TARGET: string) {
  console.log("target", TARGET)

  function getTradeVal(data) {
    return [
      { value: data["f64"], name: "超大单流入" },
      { value: data["f65"], name: "超大单流出" },
      { value: data["f70"], name: "大单流入" },
      { value: data["f71"], name: "大单流出" },
      { value: data["f76"], name: "中单流入" },
      { value: data["f77"], name: "中单流出" },
      { value: data["f82"], name: "小单流入" },
      { value: data["f83"], name: "小单流出" }
    ]
  }
  return new Promise((resolve) => {
    const T = replaceTarget(TARGET)
    axios.get(T.URL).then((res) => {
      const data = res.data
      const ret = eval(data.replace(T.NAME, ""))
      const diff = _.get(ret, "data.diff", []) || []
      const resp = diff
        .map((v) => getTradeVal(v))
        .reduce((pre, curr) => {
          for (let i = 0; i < curr.length; i++) {
            const item = curr[i]
            if (pre[item.name]) {
              pre[item.name] = pre[item.name] + item.value
            } else {
              pre[item.name] = item.value
            }
          }
          return pre
        }, {})
      resolve(resp)
    })
  })
}

export function getKlineByCode(stockCode: string) {
  return new Promise((resolve) => {
    const market = getMarket(stockCode)
    const T = replaceTarget(getConf("config.KLINE_DATA"), market, stockCode)
    axios.get(T.URL).then((res) => {
      const data = res.data
      const ret = eval(data.replace(T.NAME, ""))
      let klines = _.get(ret, "data.klines", [])
      klines = klines.map((v) => v.split(","))
      resolve({
        data: klines,
        name: `${ret.data.name}(${ret.data.code})`
      })
    })
  })
}

/**
 * @description 最近几次价格
 * @param stockCode
 * @returns
 */
export function getLastPrice(stockCode: string) {
  return new Promise((resolve) => {
    const market = getMarket(stockCode)
    const T = replaceTarget(getConf("config.LAST_PRICE"), market, stockCode)
    axios.get(T.URL).then((res) => {
      const data = res.data
      const ret = eval(data.replace(T.NAME, ""))
      resolve(ret)
    })
  })
}

export function getKlineDataToday(stockCode: string = "600733") {
  return new Promise((resolve) => {
    const market = getMarket(stockCode)
    const T = replaceTarget(
      getConf("config.KLINE_TODAY_HISTORY"),
      market,
      stockCode
    )
    axios.get(T.URL).then((res) => {
      const data = res.data
      const ret = eval(data.replace(T.NAME, ""))
      console.log("ret", ret)

      let klines = _.get(ret, "data.trends", [])
      klines = klines.map((v) => v.split(","))
      resolve({
        data: klines,
        name: `${ret.data.name}(${ret.data.code})`
      })
    })
  })
}

export async function getStockBaseInfo(code: string = "600733") {
  const kLineData = await getKlineByCode(code as string)
  kLineData.data = kLineData.data.map((item) => {
    const dataset = item
    const dataObject = {}
    klineKeys.forEach((key, index) => {
      dataObject[key] = dataset[index]
    })
    return dataObject
  })
  const current = kLineData.data[kLineData.data.length - 1]
  current.code = code
  current.name = kLineData.name
  const fNowData = await getLastPrice(code)
  current.fNow = _.last(fNowData.data.details).split(",")[1]
  return current
}

export function getConf(key: string) {
  try {
    return _.get(loadSgridConf(), key, "")
  } catch (e) {
    console.log("e", e)
    return ""
  }
}

export const klineKeys = [
  "date",
  "fOpen",
  "fClose",
  "fMax",
  "fMin",
  "volume",
  "turnover",
  "amplitude",
  "rate",
  "diff",
  "turnOverRate"
]

export const klineChineseKeys = [
  "日期",
  "开盘",
  "收盘",
  "最高",
  "最低",
  "成交量",
  "成交额",
  "振幅",
  "涨跌幅",
  "涨跌额",
  "换手率"
]
