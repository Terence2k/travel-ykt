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
// 根据时间戳生成文件名 （防重名覆盖）
const generateFilename = (fileName: any) => {
  const extension = getFileExtension(fileName);
  const rdm = (Math.random() * 10000).toFixed();
  return `${new Date().getTime() + rdm}.${extension}`;
};

/**
 * @description 构造aws对象
 */
const newAwsObj = () => {
  return new Promise<{
    aws: any;
    bucket: string;
    filePath: string;
    prefix: string;
  }>(async (resolve, reject) => {
    const res = await api.commonApi.cosUploadUrl();
    const awsTempKey = res;
    if (!awsTempKey) {
      handleUploadErr(reject, '获取 aws 配置信息错误~');
    } else {
      console.log('awsTempKey:', awsTempKey);
      resolve({
        // @ts-ignore
        aws: new AWS.S3({
          apiVersion: awsTempKey.apiVersion,
          accessKeyId: awsTempKey.accessKeyId,
          secretAccessKey: awsTempKey.secretAccessKey,
          endpoint: awsTempKey.hostName,
          sessionToken: awsTempKey.sessionToken,
          s3ForcePathStyle: awsTempKey.s3ForcePathStyle,
          signatureVersion: awsTempKey.signatureVersion,
          sslEnabled: awsTempKey.sslEnabled
        }),
        bucket: awsTempKey.bucket,
        filePath: awsTempKey.hostName,
        prefix: awsTempKey.prefix
      });
    }
  });
};

const awsUploadFile = (options: any) => {
  return new Promise<{
    files: string[];
  }>(async (resolve, reject) => {
    // businessType业态
    const { files, onProgress, businessType } = options;
    const { aws, bucket, filePath, prefix } = await newAwsObj();
    if (!aws) {
      handleUploadErr(reject, '生成 aws 实例失败');
    } else {
      try {
        const downloadFiles:string[] = [];
        const filesLength = files.length - 1;
        files.forEach((item: any, index: number) => {
          console.log(item);
          const filename = generateFilename(item.name);
          aws.putObject({
            Key: `${businessType.toLowerCase()}Pic/${filename}`,
            Bucket: `${bucket}${prefix}`,
            ContentType: item.type,
            Body: item,
          }, async (err: any, data: any) => {
            console.log(err);
            console.log(data);
            if (data) {
              console.log(err);
              // const fileUrl = `http://${filePath}/${bucket}${prefix}/${businessType.toLowerCase()}Pic/${filename}`;
              const fileUrl = `${businessType.toLowerCase()}Pic/${filename}`;
              downloadFiles.push(fileUrl);
              if (filesLength === index) {
                if (!downloadFiles.length) {
                  handleUploadErr(reject, 'aws 上传发生错误');
                }
  
                if (downloadFiles && downloadFiles.length) {
                  resolve({ files: downloadFiles });
                } else {
                  handleUploadErr(reject, 'aws 上传发生错误');
                }
              }
            }
            if (err) {
              handleUploadErr(reject, 'aws 上传发生错误');
            }
          });
        })
      } catch (error) {
        console.log(error);
        reject(error);
      }
      // return 下载的文件
      // resolve({ files: downloadFiles });
    }
  });
}

// 上传错误处理
const handleUploadErr = (reject: any, err: any) => {
  reject(err);
};

export default awsUploadFile;