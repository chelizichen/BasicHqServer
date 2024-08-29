import { Autowired, Controller, Get, Resp } from "sgridnode/build/main"
import { SgridNodeBaseController } from "../../decorator"
import {
  getKlineByCode,
  getStockBaseInfo,
  klineChineseKeys,
  klineKeys
} from "../../util/index.util"
import { NextFunction, Request, Response } from "express"
import _ from "lodash"
import loggerComponent from "../../component/logger"

function EmptyFiledInterceptor(filedName: string, errorText: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (_.get(req, filedName)) {
      next()
    } else {
      res.status(400).send(Resp.Error(-1, errorText, null))
    }
  }
}

function FiledLengthInterceptor(filedName: string, errorText: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    const val = _.get(req, filedName)
    if (val && val.length == 6) {
      next()
    } else {
      res.status(400).send(Resp.Error(-1, errorText, null))
    }
  }
}

@Controller("/stockBaseInfo")
class StockBaseController extends SgridNodeBaseController {
  @Autowired(loggerComponent)
  logger: loggerComponent
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
}

export default StockBaseController
