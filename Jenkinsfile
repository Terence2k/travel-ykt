// 公共，不需要修改
def registry = "ynty001-vpc.tencentcloudcr.com"


def project = "lijiang"
def image = "ykt-pc-web"

def commit_messages = ""
def image_name = "${registry}/${project}/${image}:${build_env}-${BUILD_NUMBER}"

pipeline
{
    agent any
    stages {

        stage("build images and push ")
        {
            steps{
                sh """
                        cp /usr/share/zoneinfo/Asia/Shanghai ./
                        sed -i 's,#GIT_URL,$git_url,g' Dockerfile
                        docker build -t ${image_name} .
                        docker push ${image_name}
                    """
                script{
                    commit_messages = getChangeString()
                }
            }
        }
    }
    post{
        failure{
		    httpRequest responseHandle: "NONE", url: "http://10.101.62.13:8000/DeployAutoReport/1/?name=${JOB_NAME}&build_number=${BUILD_NUMBER}&build_result=failure"
            sh "/var/jenkins_home/TencentAPI/wxworks/send2bot 02cffdbe-4cdf-491c-a47d-29b3ded9dd36 FAIL ${env.JOB_NAME} ${git_url} ${build_env} ${branch}"
            emailext(
               attachLog: true,
               subject: "构建失败：${env.JOB_NAME}",
               body: """<p>
                     环境：${build_env} <br>
                     代码分支：${branch} <br>
                     代码地址：${git_url} <br>
                     镜像版本：${image_name} <br>
                     详细日志见附件。<br>
                     </p>
                    """,
               to: "alisli@yntengyun.com,tangyanren@yntengyun.com,antizhu@yntengyun.com",
               from: "teg-sys-notice@yntengyun.com",
           )
        }
        success{
			httpRequest responseHandle: "NONE", url: "http://10.101.62.13:8000/DeployAutoReport/1/?name=${JOB_NAME}&build_number=${BUILD_NUMBER}&build_result=success"
            sh "/var/jenkins_home/TencentAPI/wxworks/send2bot 02cffdbe-4cdf-491c-a47d-29b3ded9dd36 SUCCESS ${env.JOB_NAME} \'${git_url}\r\n构建记录：${commit_messages}\' ${build_env} ${branch}"
            emailext(
               subject: "构建成功：${env.JOB_NAME}",
               body: """<p>
                     环境：${build_env} <br>
                     代码分支：${branch} <br>
                     代码地址：${git_url} <br>
                     镜像版本：${image_name} <br>
                     COMMIT_ID：${GIT_COMMIT} <br>
                     COMMIT_LOGS: ${commit_messages}
                     </p>
                    """,
               to: "alisli@yntengyun.com,tangyanren@yntengyun.com,antizhu@yntengyun.com",
               from: "teg-sys-notice@yntengyun.com",
           )
        }

    }
}



@NonCPS
import java.time.Instant
import java.util.Date


def getChangeString() {
    MAX_MSG_LEN = 100
    def changeString = ""

    echo "Gathering SCM changes"
    def changeLogSets = currentBuild.changeSets
    for (int i = 0; i < changeLogSets.size(); i++) {
        def entries = changeLogSets[i].items
        for (int j = 0; j < entries.length; j++) {
            def entry = entries[j]
            def unixTimeStamp = entry.timestamp
            Date date = new Date(unixTimeStamp)
            truncated_msg = entry.msg.take(MAX_MSG_LEN)
            changeString += "<br>&emsp;&emsp;" +  "[${entry.author}]: ${truncated_msg} - ${date}" + '&#10;&emsp;'
        }
    }
    if (!changeString) {
        changeString = " - No new changes"
    }
    return changeString
}