import { Autowired, Component } from "sgridnode/build/main"
import { ConnComponent } from "../../component/db"

@Component()
export class TradeService {
  @Autowired(ConnComponent)
  db: ConnComponent
  async trade(data: T_trade) {
    await this.db.saveTradeData(data)
    return data
  }
}
