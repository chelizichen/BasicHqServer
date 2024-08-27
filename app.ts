import { NewSgridServer, NewSgridServerCtx } from "sgridnode/build/main"
import express from "express"
import path from "path"
import { WebController } from "./src/web/web.controller"
import "./src/component/empty"
import StockBaseController from "./src/modules/stockBase/stockBase.controller"
function boost() {
  const ctx = NewSgridServerCtx()
  const webMvc = new WebController(ctx)
  ctx.set("view engine", "ejs")
  ctx.use("/static", express.static("./public"))
  ctx.use("/preview", express.static("./uploads"))
  ctx.set("views", path.join(__dirname, "views"))
  ctx.use(webMvc.router)
  ctx.use(new StockBaseController(ctx).router)
  NewSgridServer(ctx)
}

boost()
