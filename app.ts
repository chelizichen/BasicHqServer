import { NewSgridServer, NewSgridServerCtx } from "sgridnode/build/main";
import { CherrioController } from "./src/web/index.controller";
import express from "express";
import path from "path";
import _ from "lodash";
import { WebController } from "./src/web/web.controller";
function boost() {
  const ctx = NewSgridServerCtx();
  const f = new CherrioController(ctx);
  const webMvc = new WebController(ctx);
  ctx.set("view engine", "ejs");
  ctx.use("/api", f.router);
  ctx.use("/static", express.static("./public"));
  ctx.use("/preview", express.static("./uploads"));
  ctx.set("views", path.join(__dirname, "views"));
  ctx.use(webMvc.router);
  NewSgridServer(ctx);
}

boost();
