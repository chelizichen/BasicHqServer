import { Autowired, Controller, Get, Post, Resp } from "sgridnode/build/main"
import { SgridNodeBaseController } from "../../decorator"
import { Request, Response } from "express"
import moment from "moment"
import { TradeService } from "./trade.service"

@Controller("/stockBaseInfo")
class TradeController extends SgridNodeBaseController {
  @Autowired(TradeService)
  private tradeService: TradeService
  @Post("/trade")
  async tradeIO(req: Request, res: Response) {
    const { userId, code, price, total, type } = req.body
    const createTime = moment().format("YYYY-MM-DD HH:mm:ss")
    const body = {
      userId,
      code,
      price,
      createTime,
      type,
      total
    }
    this.tradeService.trade(body)
    res.json(Resp.Ok(body))
  }
}

export default TradeController
