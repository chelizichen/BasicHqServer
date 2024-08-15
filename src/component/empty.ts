import { Autowired, Component } from "sgridnode/build/main"
import { ConnComponent } from "./db"
import { ScheduleServer } from "./schedule"

@Component()
class EmptyComponent {
  @Autowired(ConnComponent) conn: ConnComponent
  @Autowired(ScheduleServer) schedule: ScheduleServer
}

export default new EmptyComponent()
