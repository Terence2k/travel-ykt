import axios, { Method } from "axios";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// import { loading } from "/Users/xuyifei/Documents/study/npm/ant_vue3_ui_ts/lib/index"; // 这种引入不能打包之后不能使用s
import { loading } from "ant3-ui";
// import type { SearchProp } from "ant3-ui";

let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.T1RZd09qWXhPakUyTlRjd01EazFNVGN6TURBPQ.ISZxqdG9R7NM7dxRU0RXELtEkd8ZYXr6OAYT1pnsal8";

interface OptionsProp {
  method?: Method | "postfile";
  url: string;
  headers?: any;
  data?: any;
  showLoading?: boolean;
}
// responseType:'stream'
const fetch = async (options: OptionsProp) => {
  const { method = "get", data, url, headers = {}, showLoading } = options;

  const cloneData = data;

  if (!token) {
    token = window.localStorage.getItem("token") || "";
  }
  if (showLoading) {
    loading.show();
  }

  switch (method.toLowerCase()) {
    case "get":
      return axios.get(url, {
        params: cloneData,
        headers: {
          token,
          ...headers,
        },
      });
    case "delete":
      return axios.delete(url, {
        data: cloneData,
        headers: {
          token,
          ...headers,
        },
      });
    case "post":
      return axios({
        method: "post",
        url,
        data: cloneData,
        headers: {
          token,
          ...headers,
        },
      });
    /**
     * {
     *  'name':'file'
     *  'file':File //文件
     * }
     */
    case "postfile":
      // eslint-disable-next-line no-case-declarations
      const params = new FormData();
      params.append(cloneData.name || "file", cloneData.file);
      return axios({
        method: "post",
        url,
        data: params,
        headers: {
          token,
          "Content-Type": "multipart/form-data",
          ...headers,
        },
      });
    case "put":
      return axios({
        ...options,
        method: "put",
        url,
        data: cloneData,
        headers: {
          token,
          ...headers,
        },
      });
    case "patch":
      return axios.patch(url, cloneData);
    default:
      return axios(options);
  }
};

export function request(options: OptionsProp) {
  return fetch(options)
    .then((response) => {
      if (options.showLoading) {
        loading.hidden();
      }

      // Toast.clear()
      const { statusText, status } = response;
      const { data } = response;
      // eslint-disable-next-line no-prototype-builtins
      if (data && data.hasOwnProperty("code")) {
        if (data.code.toString() === "0") {
          // 成功
          return {
            success: true,
            message: statusText,
            statusCode: status,
            ...data,
          };
        } else {
          return {
            success: false,
            statusCode: status,
            code: data.code,
            message: data.message,
          };
        }
      } else {
        return response;
      }

      // eslint-disable-next-line no-unreachable
    })
    .catch((error) => {
      const { response } = error;
      let msg;
      loading.hidden();
      let statusCode;
      if (response && response instanceof Object) {
        const { data, statusText } = response;
        statusCode = response.status;
        msg = data.message || statusText;
      } else {
        statusCode = 600;
        msg = error.message || "网络请求错误";
      }
      return {
        success: false,
        statusCode,
        message: msg,
      };
    });
}

export function clearToken() {
  if (token) {
    token = "";
  }
}
