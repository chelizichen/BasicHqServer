import axios from "axios"
import { Component } from "sgridnode/build/main"

@Component()
export default class stockBaseService {
  getStockHq(target: string) {
    return new Promise((resolve) => {
      axios.get(target).then((res) => {
        const data = res.data.split("~")
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, name, code, price, change, changePercent] = data
        const obj = {
          name,
          code,
          price,
          change,
          changePercent
        }
        resolve(obj)
      })
    })
  }
}
