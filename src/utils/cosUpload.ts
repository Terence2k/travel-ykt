/* eslint-disable no-async-promise-executor */
import COS from 'cos-js-sdk-v5';
import api from '@/api';

/**
 * @description 获取文件后缀
 */
const getFileExtension = (fileName: any, dot = false) => {
  if (!fileName || typeof fileName !== 'string') {
    return false;
  }
  const fileSplit = fileName.split('.');
  const extension = fileSplit[fileSplit.length - 1];
  return dot ? `.${extension}` : extension;
};

/**
 * @description 构造cos对象
 */
const newCosObj = (options: any) => {
  return new Promise<{
    cos: any;
    bucketName: string;
    region: string;
    filePath: string;
  }>(async (resolve, reject) => {
    const res = await api.commonApi.cosUploadUrl();
    console.log(res);
    const cosTempKey = res;
    if (!cosTempKey) {
      handleUploadErr(reject, '获取 cos 配置信息错误~');
    } else {
      const { credentials, expiredTime, bucketName, region, filePath } =
        cosTempKey;

      resolve({
        cos: new COS({
          getAuthorization: (opts: any, callback: (data: any) => void) => {
            callback({
              TmpSecretId: credentials.tmpSecretId,
              TmpSecretKey: credentials.tmpSecretKey,
              XCosSecurityToken: credentials.sessionToken,
              ExpiredTime: expiredTime
            });
          }
        }),
        bucketName,
        region,
        filePath
      });
    }
  });
};

// 根据时间戳生成文件名 （cos防重名覆盖）
const generateFilename = (fileName: any) => {
  const extension = getFileExtension(fileName);
  const rdm = (Math.random() * 10000).toFixed();
  return `${new Date().getTime() + rdm}.${extension}`;
};

const cosUploadFile = (options: any) => {
  return new Promise<{
    files: { url: string; key: string; name: string; fileName: string; size: number }[];
  }>(async (resolve, reject) => {
    const { type, businessType, files, isPrivate = true, onProgress } = options;
    const getCosConfParams = { type, businessType };
    const { cos, bucketName, region, filePath } = await newCosObj(
      getCosConfParams
    );
    if (!cos) {
      handleUploadErr(reject, '生成 Cos 实例失败');
    } else {
      try {
        const downloadFiles: {
          url: string;
          key: string;
          name: string;
          fileName: string;
          size: number;
        }[] = [];
        const filesLength = files.length - 1;
        files.forEach((item: any, index: number) => {
          console.log(item);
          const filename = generateFilename(item.name);
          const fileKey = `${filePath}/${filename}`;
          cos.putObject(
            {
              Bucket: bucketName,
              Region: region,
              Key: fileKey,
              Body: item,
              onProgress: onProgress
            },
            async (err: any, data: any) => {
              console.log(err);
              console.log(data);
              if (data) {
                const fileUrl = `https://${data.Location}`;
                downloadFiles.push({
                  url: fileUrl,
                  key: fileKey,
                  name: filename,
                  fileName: item.name,
                  size: item.size
                });
              }
              if (filesLength === index) {
                if (!downloadFiles.length) {
                  handleUploadErr(reject, 'cos 上传发生错误');
                }

                if (downloadFiles && downloadFiles.length) {
                  resolve({ files: downloadFiles });
                } else {
                  handleUploadErr(reject, 'cos 上传发生错误');
                }
              }
            }
          );
        });
      } catch (err) {
        console.log(err);
        reject(err);
      }
    }
  });
};

export const cosDownloadFile = (options: any, files: Array<any>) => {
  return new Promise<{ files: string[] }>(async (resolve, reject) => {
    const { type = 1, businessType = 1 } = options || {};
    const { cos, bucketName, region } = await newCosObj({
      type,
      businessType
    });
    if (!cos) {
      reject('生成 Cos 实例失败');
    } else {
      try {
        const filesLength = files.length - 1;
        const filePaths: string[] = [];
        files.forEach((item, index) => {
          cos.getObjectUrl(
            {
              Bucket: bucketName,
              Region: region,
              Key: item.key
            },
            (err: any, data: any) => {
              if (err != null) return false;
              filePaths.push(data.Url);
              if (index === filesLength) {
                resolve({ files: filePaths });
              }
            }
          );
        });
      } catch (err) {
        reject(err);
      }
    }
  });
};

// 上传错误处理
const handleUploadErr = (reject: any, err: any) => {
  reject(err);
};

export default cosUploadFile;
