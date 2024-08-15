import { Controller, Get, Autowired, Resp, Post } from "sgridnode/build/main"
import { Request, Response } from "express"
import { SgridNodeBaseController } from "../decorator"
import { createFileMiddleware } from "../middleware/file"
import path from "path"
import fs from "fs"
import { cwd } from "process"
import WebService from "./web.service"
import ValueComponent from "../component/value"
import loggerComponent from "../component/logger"
@Controller("/web")
class WebController extends SgridNodeBaseController {
  @Autowired(WebService) service: WebService
  @Autowired(ValueComponent) value: ValueComponent
  @Autowired(loggerComponent) logger: loggerComponent

  @Get("/bk")
  async bk(req: Request, res: Response) {
    const render_data = await this.service.getBkData()
    res.render("index", render_data)
  }

  @Get("/bk_main")
  async bk_main(req: Request, res: Response) {
    const render_data = await this.service.getBkMain()
    res.render("index", render_data)
  }

  @Get("/trade_money")
  async trade_money(req: Request, res: Response) {
    const render_data = await this.service.getTradeMoney()
    res.render("trade_money", render_data)
  }

  @Get("/trade_his")
  async trade_his(req: Request, res: Response) {
    const render_data = await this.service.getTradeHis()
    this.logger.info("trade_his.render_data", render_data)
    res.render("trade_his", render_data)
  }

  @Post("/uploadPng", createFileMiddleware())
  handleUpload(req: Request, res: Response) {
    try {
      // 获取文件信息
      const file = req.file
      console.log("req.file", req.file)
      if (!file) {
        return res.status(400).send(Resp.Error(-1, "No file received.", null))
      }
      // 文件已成功上传
      res.status(200).json(
        Resp.Ok({
          message: "File uploaded successfully.",
          filename: file.filename
        })
      )
    } catch (error) {
      console.error("Error processing image:", error)
      res.status(500).send("Server error.")
    }
  }

  @Get("/preview/:filename")
  preview(req: any, res: Response) {
    const filename = req.params.filename
    res.render("preview", { filename }) // 渲染 EJS 视图
  }

  @Get("/preview_list")
  preview2(req: any, res: Response) {
    const imagesDirectory = path.join(cwd(), "uploads")

    fs.readdir(imagesDirectory, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err)
        return res.status(500).send("Server error.")
      }

      // Filter out only image files
      const imageFiles = files.filter((file) =>
        /\.(jpg|jpeg|png|gif)$/i.test(file)
      )
      res.render("preview_list", {
        HEAD_TITLE: this.value.HEAD_TITLE,
        images: imageFiles,
        publicPath: this.value.publicPath
      }) // 渲染 EJS 视图
    })
  }
}

export { WebController }
