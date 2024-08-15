import { NewSgridServer, NewSgridServerCtx } from "sgridnode/build/main"
import express from "express"
import path from "path"
import { WebController } from "./src/web/web.controller"
import "./src/component/empty"
function boost() {
  const ctx = NewSgridServerCtx()
  const webMvc = new WebController(ctx)
  ctx.set("view engine", "ejs")
  ctx.use("/static", express.static("./public"))
  ctx.use("/preview", express.static("./uploads"))
  ctx.set("views", path.join(__dirname, "views"))
  ctx.use(webMvc.router)
  NewSgridServer(ctx)
}

boost()
