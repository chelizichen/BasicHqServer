import axios from "axios";
import _ from "lodash";
export function generateRandomCallbackName() {
  const randomPart = Math.floor(Math.random() * 10000000000000000).toString(); // 生成一个 16 位的随机数
  const timestamp = Date.now(); // 获取当前时间戳
  return `jQuery${randomPart}_${timestamp}`;
}

export function replaceTarget(URL) {
  const PARAMS = "[JSONPCALLBACK]";
  const NAME = generateRandomCallbackName();
  return {
    URL: URL.replace(PARAMS, NAME),
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

export function getConf(key: string) {
  try {
    return _.get(JSON.parse(process.env.SGRID_CONFIG), key, "");
  } catch (e) {
    console.log("e", e);
    return "";
  }
}
