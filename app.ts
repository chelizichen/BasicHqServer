import { NewSgridServer, NewSgridServerCtx } from "sgridnode/build/main";
import { CherrioController } from "./src/index.controller";
import express from "express";
import path from "path";
import { getBKHQ, getBkMain, getConf, getTradeTotal } from "./src/index.util";
import _ from "lodash";
function boost() {
  const ctx = NewSgridServerCtx();
  const f = new CherrioController(ctx);
  ctx.set("view engine", "ejs");
  ctx.use("/api", f.router);
  ctx.use("/static", express.static("./public"));
  ctx.set("views", path.join(__dirname, "views"));
  ctx.get("/web/bk", async (req, res) => {
    const data = await getBKHQ(getConf("config.HY_FILE"));
    console.log("data", data);
    res.render("index", {
      title: "板块涨幅",
      legend: "百分比(%)",
      publicPath: getConf("config.publicPath"),
      xData: JSON.stringify(data.map((v) => v.name)),
      yData: JSON.stringify(data.map((v) => v.value)),
    });
  });

  ctx.get("/web/trade_money", async (req, res) => {
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
  });

  ctx.get("/web/bk_main", async (req, res) => {
    const data = await getBkMain(getConf("config.HY_MAIN"));
    console.log("data", data);
    res.render("index", {
      title: "板块主力占比涨幅",
      legend: "5日净流入百分比(%)",
      publicPath: getConf("config.publicPath"),
      xData: JSON.stringify(data.map((v) => v.name)),
      yData: JSON.stringify(data.map((v) => v.value.toFixed(2))),
    });
  });

  NewSgridServer(ctx);
}

boost();
