import { Autowired, Controller, Get, Resp } from "sgridnode/build/main"
import { SgridNodeBaseController } from "../../decorator"
import {
  getKlineByCode,
  getKlineDataToday,
  getLastPrice,
  getMarket,
  getStockBaseInfo,
  klineChineseKeys,
  klineKeys
} from "../../util/index.util"
import { NextFunction, Request, Response } from "express"
import _ from "lodash"
import loggerComponent from "../../component/logger"
import {
  EmptyFiledInterceptor,
  FiledLengthInterceptor
} from "../../interceptor/empty.validate"
import stockBaseService from "./stockBase.service"

@Controller("/stockBaseInfo")
class StockBaseController extends SgridNodeBaseController {
  @Autowired(loggerComponent)
  logger: loggerComponent

  @Autowired(stockBaseService)
  service: stockBaseService

  @Get("/klineChineseKeys")
  async getklineChineseKeys(req: Request, res: Response) {
    res.json(Resp.Ok(klineChineseKeys))
  }
  @Get(
    "/get",
    EmptyFiledInterceptor("query.code", "error:股票代码不能为空"),
    FiledLengthInterceptor("query.code", "error:必须为6位小数")
  )
  async getStockBaseInfo(req: Request, res: Response) {
    const { code } = req.query
    const current = await getStockBaseInfo(code)
    this.logger.info(
      "name %s code %s nowInfo %s",
      current.name,
      current.code,
      current
    )
    res.json(Resp.Ok(current))
  }

  @Get(
    "/getKlineData",
    EmptyFiledInterceptor("query.code", "error:股票代码不能为空"),
    FiledLengthInterceptor("query.code", "error:必须为6位小数")
  )
  async getKlineData(req: Request, res: Response) {
    const { code } = req.query
    const kLineData = await getKlineByCode(code as string)
    kLineData.data = kLineData.data.map((item) => {
      const dataset = item
      const dataObject = {}
      klineKeys.forEach((key, index) => {
        dataObject[key] = dataset[index]
      })
      return dataObject
    })
    res.json(Resp.Ok(kLineData))
  }

  @Get(
    "/getLastPrice",
    EmptyFiledInterceptor("query.code", "error:股票代码不能为空"),
    FiledLengthInterceptor("query.code", "error:必须为6位小数")
  )
  async getLastPrice(req: Request, res: Response) {
    const { code } = req.query
    const kLineData = await getLastPrice(code as string)
    res.json(Resp.Ok(kLineData))
  }

  @Get("/getKlineDataToday")
  async getKlineDataToday(req: Request, res: Response) {
    const { code } = req.query
    const kLineData = await getKlineDataToday(code as string)
    res.json(Resp.Ok(kLineData))
  }

  @Get("/v2/getStockHq")
  async getStockHq(req: Request, res: Response) {
    const { code } = req.query
    const market = getMarket(code as string) == 1 ? "sh" : "sz"
    const target = `http://qt.gtimg.cn/q=s_${market}${code}`
    this.logger.info("target %s", target)
    this.service.getStockHq(target).then((data) => {
      res.json(Resp.Ok(data))
    })
  }
}

export default StockBaseController
