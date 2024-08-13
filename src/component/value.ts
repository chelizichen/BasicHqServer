import { Autowired, Component, Value } from "sgridnode/build/main";
import { ScheduleServer } from "../schedule";

@Component()
class ValueComponent {
  @Value("server.name")
  serverName: string;

  @Value("config.HY_FILE")
  HY_FILE: string;

  @Value("config.TRADE_TOTAL")
  TRADE_TOTAL: string;

  @Value("config.HY_MAIN")
  HY_MAIN: string;

  @Value("config.publicPath", "/")
  publicPath: string;

  @Autowired(ScheduleServer)
  schedule: ScheduleServer;
}

export default ValueComponent;
