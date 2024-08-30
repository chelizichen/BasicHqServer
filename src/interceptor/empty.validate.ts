import { NextFunction, Request, Response } from "express"
import _ from "lodash"
import { Resp } from "sgridnode/build/main"
function EmptyFiledInterceptor(filedName: string, errorText: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (_.get(req, filedName)) {
      next()
    } else {
      res.status(400).send(Resp.Error(-1, errorText, null))
    }
  }
}

function FiledLengthInterceptor(filedName: string, errorText: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    const val = _.get(req, filedName)
    if (val && val.length == 6) {
      next()
    } else {
      res.status(400).send(Resp.Error(-1, errorText, null))
    }
  }
}

export { EmptyFiledInterceptor, FiledLengthInterceptor }
