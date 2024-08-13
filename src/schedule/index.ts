import { Cron, Schedule } from "../decorator";

@Schedule
export class ScheduleServer {
  @Cron("* * */5 * *", false)
  test() {
    console.log("Schedule Server Run");
  }
}
