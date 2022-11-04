import { Method, ResponseType } from "axios";
import axios from './axios'
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// import { loading } from "/Users/xuyifei/Documents/study/npm/ant_vue3_ui_ts/lib/index"; // 这种引入不能打包之后不能使用s
import loading from "@/components/Loading/index";
import { cloneDeep } from "lodash";

interface OptionsProp {
  method?: Method | "postfile" | "postExport" ;
  url: string;
  headers?: any;
  data?: any;
  showLoading?: boolean;
  responseType?: ResponseType
}
// responseType:'stream'
const fetch = async (options: OptionsProp) => {
  const { method = "get", data, url, headers = {}, showLoading, responseType } = options;

  const cloneData = cloneDeep(data);

  if (showLoading) {
    loading.show();
  }

  switch (method.toLowerCase()) {
    case "get":
      return axios.request({
        url,
        params: cloneData,
        method: 'GET',
        headers,
        responseType
      });
    case "post":
      return axios.request({
        url: url,
        data,
        method: 'POST',
        headers,
        responseType
      });
    case "put":
      return axios.request({
        url: url,
        data,
        method: 'PUT',
        headers,
        responseType
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
      for (let k in cloneData) {
        params.append(k, cloneData[k])
      }
      // params.append(cloneData.name || "file", cloneData.file);
      return axios.request({
        method: "POST",
        url,
        data: params,
        headers: {
          "Content-Type": "multipart/form-data",
          ...headers,
        },
        responseType
      });
    case "postExport":
      // const fileType =  'xlsx'
      // const fileName = '品质指数评分工单'
      return new Promise((resolve, reject) => {
        return axios.request({
          method: "POST",
          url,
          data,
          headers,
          responseType: 'blob'
        }).then(err => {
          resolve(err.data)
          if (!err) {
            return
          }
          const url = window.URL.createObjectURL(err.data)
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          // link.setAttribute('download', `${fileName}.${fileType}`)
          document.body.appendChild(link)
          link.click()
        })
        .catch(err => {
          reject(err.data)
        })
      });
    default:
      return axios.request(options);
  }
};

export function request(options: OptionsProp) {
  return fetch(options)
    .then((response) => {
      if (options.showLoading) {
        loading.hidden();
      }
      return Promise.resolve(response);
    })
    .catch((error) => {
      loading.hidden();
      return Promise.reject(error);
    });
}
