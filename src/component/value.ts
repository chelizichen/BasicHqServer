import { Component, Value } from "sgridnode/build/main"

@Component()
class ValueComponent {
  @Value("server.name")
  serverName: string

  @Value("config.HY_FILE")
  HY_FILE: string

  @Value("config.TRADE_TOTAL")
  TRADE_TOTAL: string

  @Value("config.HY_MAIN")
  HY_MAIN: string

  @Value("config.publicPath", "/")
  publicPath: string

  @Value("config.HEAD_TITLE", "")
  HEAD_TITLE: string

  @Value("config.FILTER_BK", "[]")
  FILTER_BK: string[]
}

export default ValueComponent
