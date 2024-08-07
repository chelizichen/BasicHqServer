import axios from "axios";
import _ from "lodash";
export function generateRandomCallbackName() {
  const randomPart = Math.floor(Math.random() * 10000000000000000).toString(); // 生成一个 16 位的随机数
  const timestamp = Date.now(); // 获取当前时间戳
  return `jQuery${randomPart}_${timestamp}`;
}

export function replaceTarget(URL) {
  const PARAMS = "[JSONPCALLBACK]";
  const PARAMS2 = "[TIME]";
  const NAME = generateRandomCallbackName();
  const NAME2 = Date.now(); // 获取当前时间戳
  return {
    URL: URL.replace(PARAMS, NAME).replace(PARAMS2, NAME2),
    NAME: NAME,
  };
}

export function getBKHQ(TARGET: string) {
  return new Promise((resolve) => {
    const T = replaceTarget(TARGET);
    axios.get(T.URL).then((res) => {
      const data = res.data;
      const ret = eval(data.replace(T.NAME, ""));
      const diff = _.get(ret, "data.diff", []) || [];
      const charts = _.map(diff, (item) => {
        const [bkmc, jrzf] = [item.f14, item.f3];
        return {
          name: bkmc,
          value: jrzf,
        };
      });
      const sortChartsData = _.orderBy(charts, "value", "desc");
      resolve(sortChartsData);
    });
  });
}

export function getTradeTotal(TARGET: string) {
  function getTradeVal(data) {
    return [
      { value: data["f65"], name: "超大单流出" },
      { value: data["f71"], name: "大单流出" },
      { value: data["f77"], name: "中单流出" },
      { value: data["f83"], name: "小单流出" },
      { value: data["f82"], name: "小单流入" },
      { value: data["f76"], name: "中单流入" },
      { value: data["f70"], name: "大单流入" },
      { value: data["f64"], name: "超大单流入" },
    ];
  }
  return new Promise((resolve) => {
    const T = replaceTarget(TARGET);
    axios.get(T.URL).then((res) => {
      const data = res.data;
      const ret = eval(data.replace(T.NAME, ""));
      const diff = _.get(ret, "data.diff", []) || [];
      const resp = diff
        .map((v) => getTradeVal(v))
        .reduce((pre, curr) => {
          for (let i = 0; i < curr.length; i++) {
            const item = curr[i];
            if (pre[item.name]) {
              pre[item.name] = pre[item.name] + item.value;
            } else {
              pre[item.name] = item.value;
            }
          }
          return pre;
        }, {});
      const inKeys = ["小单流入", "中单流入", "大单流入", "超大单流入"];
      const TOTAL = {
        value: 0,
        name: "两市总成交额",
      };
      for (let key in resp) {
        if (inKeys.includes(key)) {
          TOTAL.value = resp[key] + TOTAL.value;
        }
      }
      resp[TOTAL.name] = TOTAL.value;
      resolve(resp);
    });
  });
}

export function getConf(key: string) {
  try {
    return _.get(JSON.parse(process.env.SGRID_CONFIG), key, "");
  } catch (e) {
    console.log("e", e);
    return "";
  }
}
