import { Controller, Get, Autowired, Value, Resp } from "sgridnode/build/main";
import { Request, Response, Express, Router } from "express";
import { getBKHQ, getBkMain, getTradeTotal } from "../util/index.util";
import _ from "lodash";
import ValueComponent from "../component/value";
import LruComponent from "../component/lru";

@Controller("/web")
class WebController {
  public ctx: Express;
  public router: Router | undefined;
  @Autowired(ValueComponent) value: ValueComponent;
  @Autowired(LruComponent) cache: LruComponent;

  constructor(ctx: Express) {
    this.ctx = ctx;
  }

  @Get("/bk")
  async bk(req: Request, res: Response) {
    let data = null;
    data = this.cache.getBk();
    if (!data) {
      data = (await getBKHQ(this.value.HY_FILE)) as any[];
      this.cache.setBk(data);
      console.log("设置缓存");
    } else {
      console.log("击中缓存");
    }
    res.render("index", {
      title: "板块涨幅",
      legend: "百分比(%)",
      publicPath: this.value.publicPath,
      xData: JSON.stringify(data.map((v) => v.name)),
      yData: JSON.stringify(data.map((v) => v.value)),
    });
  }

  @Get("/trade_money")
  async trade_money(req: Request, res: Response) {
    let data = null;
    data = this.cache.getTradeMoney();
    if (!data) {
      data = await getTradeTotal(this.value.TRADE_TOTAL);
      this.cache.setTradeMonety(data);
    }
    res.render("index", {
      title: "资金流向统计",
      legend: "资金统计(亿元)",
      publicPath: this.value.publicPath,
      xData: JSON.stringify(_.keys(data)),
      yData: JSON.stringify(
        _.values(data).map((v) => (v / 100000000).toFixed(0))
      ),
    });
  }

  @Get("/bk_main")
  async bk_main(req: Request, res: Response) {
    let data = null;
    data = this.cache.getTradeMoney();
    if (!data) {
      data = (await getBkMain(this.value.HY_MAIN)) as any[];
      this.cache.setBkMain(data);
    }
    console.log("data", data);
    res.render("index", {
      title: "板块主力占比涨幅",
      legend: "5日净流入百分比(%)",
      publicPath: this.value.publicPath,
      xData: JSON.stringify(data.map((v) => v.name)),
      yData: JSON.stringify(data.map((v) => v.value.toFixed(2))),
    });
  }
}

export { WebController };
