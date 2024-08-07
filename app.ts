import { NewSgridServer, NewSgridServerCtx } from "sgridnode/build/main";
import { CherrioController } from "./src/index.controller";
import express from "express";
import path from "path";
import { getBKHQ, getConf } from "./src/index.util";
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
      xData: JSON.stringify(data.map((v) => v.name)),
      yData: JSON.stringify(data.map((v) => v.value)),
    });
  });

  NewSgridServer(ctx);
}

boost();
