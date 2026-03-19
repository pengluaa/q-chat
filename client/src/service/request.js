const axios = require("axios");
import { requestUrl } from "../config";
import { getSession } from "./session";
import { Message } from "element-ui";

/**
 * @description _showError=true _errMsg="请求发生错误"
 * @param {options} opts
 */
export default function(opts = {}) {
  return new Promise(async (resolve, reject) => {
    axios.defaults.headers.common["Authorization"] = `SessionKey ${getSession()}`;
    const _showError = opts._showError !== false;
    const _errMsg = opts._errMsg || null;
    // delete params
    delete opts._showError;
    delete opts._errMsg;
    // request
    try {
      const response = await axios({
        method: "get",
        baseURL: requestUrl,
        timeout: 6000,
        ...opts
      });
      resolve(response.data);
    } catch (error) {
      const { response } = error;
      if (response && response.status === 401) {
        this.$router.push("/login");
        return;
      }

      if (_showError) {
        Message({
          showClose: true,
          message: response.data.content || _errMsg || "请求发生错误",
          type: "error"
        });
      }
      //   throw Error(response);
      reject(response);
    }
  });
}
