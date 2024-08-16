import multer from "multer"
import moment from "moment"
import path from "path"
import { cwd } from "process"
import { Request } from "express"
// 生成唯一的文件名
const generateFileName = (req: Request, file, cb) => {
  const uniqueSuffix = moment().format("YYYYMMDD_HH_mm_ss")
  cb(null, req.query.name + "-" + uniqueSuffix + ".png") // 这里假设上传的是PNG文件
}

// 创建文件存储引擎
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(cwd(), "uploads/"))
  },
  filename: generateFileName
})

// 创建 Multer 中间件
export const createFileMiddleware = () => {
  return multer({ storage: storage }).single("image")
}
