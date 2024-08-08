import { Controller, Get, Autowired, Value, Resp } from "sgridnode/build/main";
import { Request, Response, Express, Router } from "express";
import { getBKHQ, getBkMain, getConf, getTradeTotal } from "./index.util";
import _ from "lodash";

@Controller("/web")
class WebController {
  public ctx: Express;
  public router: Router | undefined;

  constructor(ctx: Express) {
    this.ctx = ctx;
  }

  @Get("/bk")
  async bk(req: Request, res: Response) {
    const data = await getBKHQ(getConf("config.HY_FILE"));
    console.log("data", data);
    res.render("index", {
      title: "板块涨幅",
      legend: "百分比(%)",
      publicPath: getConf("config.publicPath"),
      xData: JSON.stringify(data.map((v) => v.name)),
      yData: JSON.stringify(data.map((v) => v.value)),
    });
  }

  @Get("/trade_money")
  async trade_money(req: Request, res: Response) {
    const data = await getTradeTotal(getConf("config.TRADE_TOTAL"));
    console.log("data", data);
    res.render("index", {
      title: "资金流向统计",
      legend: "资金统计(亿元)",
      publicPath: getConf("config.publicPath"),
      xData: JSON.stringify(_.keys(data)),
      yData: JSON.stringify(
        _.values(data).map((v) => (v / 100000000).toFixed(0))
      ),
    });
  }

  @Get("/bk_main")
  async bk_main(req: Request, res: Response) {
    const data = await getBkMain(getConf("config.HY_MAIN"));
    console.log("data", data);
    res.render("index", {
      title: "板块主力占比涨幅",
      legend: "5日净流入百分比(%)",
      publicPath: getConf("config.publicPath"),
      xData: JSON.stringify(data.map((v) => v.name)),
      yData: JSON.stringify(data.map((v) => v.value.toFixed(2))),
    });
  }
}

export { WebController };
