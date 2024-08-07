import { Controller, Get, Autowired, Value, Resp } from "sgridnode/build/main";
import { Request, Response, Express, Router } from "express";
import { CherrioService } from "./index.service";
import loggerComponent from "./logger.component";

@Controller("/cherrio")
class CherrioController {
  public ctx: Express;
  public router: Router | undefined;

  @Autowired(loggerComponent) logger: loggerComponent;
  @Autowired(CherrioService) CherrioService: CherrioService;

  @Value("server.name") serverName: string;
  @Value("config.HY_FILE") HY_FILE: string;
  constructor(ctx: Express) {
    this.ctx = ctx;
  }

  @Get("/hello")
  async hello(req: Request, res: Response) {
    res.json(
      Resp.Ok(this.serverName + " :: hello ::" + this.CherrioService.greet())
    );
  }

  @Get("/getBKHQ")
  async GetBKHQ(req: Request, res: Response) {
    const data = await this.CherrioService.GetBKHQ(this.HY_FILE);
    res.json(Resp.Ok(data));
  }
}

export { CherrioController };
