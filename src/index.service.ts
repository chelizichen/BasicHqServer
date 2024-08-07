import { Autowired, Component, Value } from "sgridnode/build/main";
import loggerComponent from "./logger.component";
import { getBKHQ, getTradeTotal, replaceTarget } from "./index.util";
import axios from "axios";
import _ from "lodash";

@Component()
export class CherrioService {
  @Autowired(loggerComponent) logger: loggerComponent;

  constructor() {
    console.log("framework service init");
  }

  msg = "greet";

  greet() {
    // this.createError();
    this.logger.data("data :: ", this.msg);
    return this.msg;
  }

  GetBKHQ(TARGET: string) {
    return getBKHQ(TARGET);
  }

  tradeTotal(TARGET: string) {
    return getTradeTotal(TARGET);
  }
}
