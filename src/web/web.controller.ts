import { Controller, Get, Autowired, Resp, Post } from "sgridnode/build/main";
import { Request, Response, Express, Router } from "express";
import { getBKHQ, getBkMain, getTradeTotal } from "../util/index.util";
import _ from "lodash";
import ValueComponent from "../component/value";
import LruComponent from "../component/lru";
import { SgridNodeBaseController } from "../decorator";
import { createFileMiddleware } from "../middleware/file";
import path from "path";
import fs from "fs";
import { cwd } from "process";
@Controller("/web")
class WebController extends SgridNodeBaseController {
  @Autowired(ValueComponent) value: ValueComponent;
  @Autowired(LruComponent) cache: LruComponent;

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
      yData: JSON.stringify(
        data.map((v) => {
          if (v.value > 0) {
            return v.value.toFixed(2);
          }
          return {
            value: v.value.toFixed(2),
            itemStyle: {
              color: "#91cc75",
            },
          };
        })
      ),
    });
  }

  @Get("/bk_main")
  async bk_main(req: Request, res: Response) {
    let data = null;
    data = this.cache.getBkMain();
    if (!data) {
      data = (await getBkMain(this.value.HY_MAIN)) as any[];
      this.cache.setBkMain(data);
    } else {
      console.log("击中缓存 ｜ bk_main");
      console.log("data", data);
    }
    res.render("index", {
      title: "板块主力占比涨幅",
      legend: "5日净流入百分比(%)",
      publicPath: this.value.publicPath,
      xData: JSON.stringify(data.map((v) => v.name)),
      yData: JSON.stringify(
        data.map((v) => {
          if (v.value > 0) {
            return v.value.toFixed(2);
          }
          return {
            value: v.value.toFixed(2),
            itemStyle: {
              color: "#91cc75",
            },
          };
        })
      ),
    });
  }

  @Get("/trade_money")
  async trade_money(req: Request, res: Response) {
    let data = null;
    data = this.cache.getTradeMoney();
    if (!data) {
      data = await getTradeTotal(this.value.TRADE_TOTAL);
      this.cache.setTradeMonety(data);
    } else {
      console.log("击中缓存 ｜ trade_money");
      console.log("data", data);
    }
    res.render("trade_money", {
      title: "资金流向统计",
      legend: "资金统计(亿元)",
      publicPath: this.value.publicPath,
      xData: JSON.stringify(_.keys(data)),
      yData: JSON.stringify(
        _.values(data).map((v, i) => {
          if (i % 2 == 0) {
            return (v / 100000000).toFixed(0);
          }
          return {
            value: (v / 100000000).toFixed(0),
            itemStyle: {
              color: "#91cc75",
            },
          };
        })
      ),
    });
  }

  @Post("/uploadPng", createFileMiddleware())
  handleUpload(req: any, res: Response) {
    try {
      // 获取文件信息
      const file = req.file;
      console.log("req.file", req.file);
      if (!file) {
        return res.status(400).send(Resp.Error(-1, "No file received.", null));
      }
      // 文件已成功上传
      res.status(200).json(
        Resp.Ok({
          message: "File uploaded successfully.",
          filename: file.filename,
        })
      );
    } catch (error) {
      console.error("Error processing image:", error);
      res.status(500).send("Server error.");
    }
  }

  @Get("/preview/:filename")
  preview(req: any, res: Response) {
    const filename = req.params.filename;
    res.render("preview", { filename }); // 渲染 EJS 视图
  }

  @Get("/preview_list")
  preview2(req: any, res: Response) {
    const imagesDirectory = path.join(cwd(), "uploads");

    fs.readdir(imagesDirectory, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        return res.status(500).send("Server error.");
      }

      // Filter out only image files
      const imageFiles = files.filter((file) =>
        /\.(jpg|jpeg|png|gif)$/i.test(file)
      );
      res.render("preview_list", {
        images: imageFiles,
        publicPath: this.value.publicPath,
      }); // 渲染 EJS 视图
    });
  }
}

export { WebController };
