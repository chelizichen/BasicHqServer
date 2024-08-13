import { Controller, Get, Autowired, Value, Resp } from "sgridnode/build/main";
import { Request, Response, Express, Router } from "express";
import loggerComponent from "../component/logger";
import { CherrioService } from "./index.service";
import ValueComponent from "../component/value";

@Controller("/cherrio")
class CherrioController {
  public ctx: Express;
  public router: Router | undefined;

  @Autowired(loggerComponent) logger: loggerComponent;
  @Autowired(CherrioService) service: CherrioService;
  @Autowired(ValueComponent) value: ValueComponent;

  constructor(ctx: Express) {
    this.ctx = ctx;
  }

  @Get("/hello")
  async hello(req: Request, res: Response) {
    res.json(
      Resp.Ok(this.value.serverName + " :: hello ::" + this.service.greet())
    );
  }

  @Get("/getBKHQ")
  async GetBKHQ(req: Request, res: Response) {
    const data = await this.service.GetBKHQ(this.value.HY_FILE);
    res.json(Resp.Ok(data));
  }

  @Get("/tradeTotal")
  async tradeTotal(req: Request, res: Response) {
    const data = await this.service.tradeTotal(this.value.TRADE_TOTAL);
    res.json(Resp.Ok(data));
  }
}

export { CherrioController };
