<template>
    <div class="taskDetail">
        <v-header>做任务</v-header>

        <div class="taskTitle">
            <h3>{{task.taskTitle}}</h3>
            <div class="time">起止时间：{{task.startTime}} - {{task.endTime}}</div>
        </div>

        <div class="question" v-for="question in queList">
            <div class="queTitle">{{question.cdtaskDescribe}}</div>
            <div class="score">本任务积分：<span v-if="question.taskPoints == 0">敬请期待</span><span v-else>{{question.taskPoints}}积分</span></div>

            <!--单选题-->
            <div v-if="question.cdtaskType == '1'">
                <div class="select" v-for="select in question.budTaskAnswer">
                    <label>
                        <input type="radio" :disabled="question.ifTrue === '1'" class="radio"
                               :name="question.childTaskId"
                               :value="select.answerOption"
                               v-model="question.userReply">
                        <span>{{select.answerOption}}、{{select.answerContent}}</span>
                    </label>
                </div>

                <div v-if="question.ifTrue == '1'" class="textGreen">正确</div>
                <div v-if="question.ifTrue == '0'" class="textRed">错误</div>
            </div>

            <!--多选题-->
            <div v-if="question.cdtaskType == '2'">
                <div class="select" v-for="select in question.budTaskAnswer">
                    <label>
                        <input :disabled="question.ifTrue === '1'" type="checkbox" class="checkbox"
                               :name="question.childTaskId"
                               :value="select.answerOption" v-model="question.userReply">
                        <span>{{select.answerOption}}、{{select.answerContent}}</span>
                    </label>
                </div>

                <div v-if="question.ifTrue == '1'" class="textGreen">正确</div>
                <div v-if="question.ifTrue == '0'" class="textRed">错误</div>
            </div>

            <!--判断题-->
            <div v-if="question.cdtaskType == '3'">
                <div class="select">
                    <label>
                        <input :disabled="question.ifTrue === '1'" type="radio" class="radio"
                               :name="question.childTaskId" value="1"
                               v-model="question.userReply">
                        <span>A、对</span>
                    </label>
                </div>
                <div class="select">
                    <label>
                        <input :disabled="question.ifTrue === '1'" type="radio" class="radio"
                               :name="question.childTaskId" value="0"
                               v-model="question.userReply">
                        <span>B、错</span>
                    </label>
                </div>

                <div v-if="question.ifTrue == '1'" class="textGreen">正确</div>
                <div v-if="question.ifTrue == '0'" class="textRed">错误</div>
            </div>

            <!--简答题-->
            <div v-if="question.cdtaskType == '4'">
                <textarea :disabled="question.checkStatus !== '0'" placeholder="请输入详细信息" class="textArea"
                          v-model="question.userReply"></textarea>
                <div class="textRed" v-if="question.checkStatus == '0'">状态：审核未通过</div>
                <div class="textGreen" v-if="question.checkStatus == '1'">状态：审核通过</div>
                <div class="textRed" v-if="question.checkStatus == '2'">状态：审核中</div>
            </div>

            <!--图片-->
            <div v-if="question.cdtaskType == '5'">
                <!--审核未通过-->
                <div class="uploadCon" v-if="question.checkStatus === '0'">
                    <div class="li" v-for="item in question.userReply">
                        <div class="imgList">
                            <img :src="item.blob" class="imgPreview">
                            <span class="percent" v-if="item.state == 'upload'">{{parseInt(item.progress)}}%</span>
                            <span class="percent" v-if="item.state == 'success'">已上传</span>
                            <span class="percent" v-if="item.state == 'error'">上传失败</span>
                        </div>
                    </div>

                    <div class="li">
                        <v-upload class="uploadImgBtn" v-model="question.userReply" :multiple="true" accept="image/*"
                                  @input-filter="inputFilter" :post-action="uploadImgUrl" @input-file="inputFile">
                            <i class="fa fa-plus" aria-hidden="true"></i>
                        </v-upload>
                    </div>
                </div>
                <!--审核通过-->
                <div class="uploadCon" v-else>
                    <div class="li" v-for="item in question.userReply">
                        <div class="imgList">
                            <img :src="item" class="imgPreview">
                        </div>
                    </div>
                </div>

                <div class="textRed" v-if="question.checkStatus == '0'">状态：审核未通过</div>
                <div class="textGreen" v-if="question.checkStatus == '1'">状态：审核通过</div>
                <div class="textRed" v-if="question.checkStatus == '2'">状态：审核中</div>
            </div>

            <!--视频-->
            <div v-if="question.cdtaskType == '6'">
                <!--审核未通过-->
                <div class="uploadCon uploadVideo" v-if="question.checkStatus === '0'">
                    <div class="li" v-for="item in question.userReply">
                        <div class="imgList">
                            <span class="fa fa-play-circle"></span>

                            <span class="vState" v-if="item.state == 'upload'">{{parseInt(item.progress)}}%</span>
                            <span class="vState" v-if="item.state == 'success'">已上传</span>
                            <span class="vState" v-if="item.state == 'error'">上传失败</span>
                        </div>
                    </div>

                    <div class="li">
                        <v-upload class="uploadImgBtn" v-model="question.userReply" accept="video/*"
                                  @input-filter="inputFilter" :post-action="uploadFile" @input-file="inputFile">
                            <i class="fa fa-plus" aria-hidden="true"></i>
                        </v-upload>
                    </div>
                </div>
                <!--审核通过-->
                <div class="uploadCon uploadVideo" v-else>
                    <div class="li">
                        <div class="imgList">
                            <span class="fa fa-play-circle"></span>
                            <span class="vState">已上传</span>
                        </div>
                    </div>
                </div>

                <div class="textRed" v-if="question.checkStatus == '0'">状态：审核未通过</div>
                <div class="textGreen" v-if="question.checkStatus == '1'">状态：审核通过</div>
                <div class="textRed" v-if="question.checkStatus == '2'">状态：审核中</div>
            </div>
        </div>

        <a href="javascript:void(0)" class="submit" @click="submit">提交</a>
    </div>
</template>

<script>
    import vUpload from "vue-upload-component";
    import {mapState} from "vuex";

    export default{
        data(){
            let self = this;

            return {
                taskId: self.$route.params.taskId,          //任务id
                task: {},                                   //任务信息
                queList: [],                                //题目列表
                imgList: [],                                //图片列表
                uploadImgUrl: self.$api.uploadPic,          //上传图片url
                uploadFile: self.$api.uploadFile            //上传视频url
            }
        },

        computed: {
            ...mapState(["user", "location"])
        },

        watch: {
            user(){
                this.loadData();
            }
        },

        components: {
            vUpload
        },

        methods: {
            loadData(){
                let self = this;

                if (!self.user.userId) {
                    return;
                }

                let postData = self.$qs.stringify({
                    "budTask.taskId": self.taskId,
                    "budUser.userId": self.user.userId
                });

                self.$axios.post(self.$api.taskDone, postData).then(res => {
                    self.$indicator.close();

                    if (res.data.opflag) {
                        res.data.data.forEach(item => {
                            if ((item.ifTrue === "" && item.checkStatus === "0") || item.ifTrue === "0") {
                                if (item.cdtaskType === "2" || item.cdtaskType === "5" || item.cdtaskType === "6") {
                                    item.userReply = [];
                                } else {
                                    item.userReply = "";
                                }
                            } else {
                                if (item.cdtaskType === "2" || item.cdtaskType === "5") {
                                    item.userReply = item.userReply.split(",");
                                }
                            }
                        });

                        self.task = res.data.task;
                        self.queList = res.data.data;
                    } else {
                        self.$toast({
                            message: "获取任务失败"
                        });
                    }
                })
            },

            //选择文件事件，自动上传
            inputFile(file){
                let self = this;

                if (!file) {
                    return;
                }

                if (file.size / 1024 / 1204 > 50) {
                    self.$messagebox.alert("文件大小不能超过50M");
                    return;
                }

                self.$set(file, "state", "upload");

                //自动上传
                file.active = true;

                if (file.success) {
                    file.response = JSON.parse(file.response);

                    if (file.response.error_code === 0) {
                        file.state = "success";
                    } else {
                        file.state = "error";
                    }
                } else if (file.error !== "") {
                    file.state = "error";
                }
            },

            //生成缩略图
            inputFilter(newFile, oldFile, prevent) {
                if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
                    // 创建 blob 字段
                    newFile.blob = '';
                    let URL = window.URL || window.webkitURL;
                    if (URL && URL.createObjectURL) {
                        newFile.blob = URL.createObjectURL(newFile.file)
                    }
                    // 缩略图
                    newFile.thumb = '';
                    if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
                        newFile.thumb = newFile.blob
                    }
                }
            },

            submit(){
                let self = this;

                let postData = self.getPostData();

                if (!postData) {
                    return;
                }

                self.$indicator.open();
                self.$axios.post(self.$api.taskRedo, postData).then(res => {
                    self.$indicator.close();

                    if (res.data.opflag) {
                        self.$messagebox.alert("提交成功").then(() => {
                            self.$router.go(-1);
                        });
                    } else {
                        self.$messagebox.alert(res.data.opmessage);
                    }
                })
            },

            //获取答题结果
            getPostData(){
                let self = this;
                let postData = {
                    "budTaskReply.userId": self.user.userId,
                    "budTaskReply.taskId": self.task.taskId,
                    "budTaskReply.replyId": self.task.replyId,
                    "budTaskReply.longitude": self.location.longitude,
                    "budTaskReply.latitude": self.location.latitude,
                    "budTaskReply.replyAddress": self.location.address
                    /*"budTaskReply.longitude": "113.917129",
                     "budTaskReply.latitude": "22.514777",
                     "budTaskReply.replyAddress": "深圳阳光科创"*/
                };
                let reply = {};

                for (let i = 0; i < self.queList.length; i++) {
                    let que = self.queList[i];

                    reply["budTaskReply.replyContentList[" + i + "].childTaskId"] = que.childTaskId;
                    reply["budTaskReply.replyContentList[" + i + "].replyContentId"] = que.replyContentId;

                    //单选题、判断题、简答题
                    if (que.cdtaskType === "1" || que.cdtaskType === "3" || que.cdtaskType === "4") {
                        if (que.userReply === "") {
                            self.$messagebox.alert("请完成第" + que.cdtaskSort + "题");
                            return false;
                        }

                        reply["budTaskReply.replyContentList[" + i + "].reply"] = que.userReply;
                    }

                    //多选题
                    if (que.cdtaskType === "2") {
                        reply["budTaskReply.replyContentList[" + i + "].reply"] = que.userReply.join(",");
                    }

                    //图片
                    if (que.cdtaskType === "5") {
                        if (que.checkStatus === "0") {
                            let imgList = [];

                            que.userReply.forEach(item => {
                                if (item.response && item.response.opfileupload && item.response.error_code === 0) {
                                    imgList.push(item.response.opfileupload[0].filepath);
                                }
                                if (item.state === "upload") {
                                    self.$messagebox.alert("图片上传中");
                                    return false;
                                }
                            });
                            if (imgList.length === 0) {
                                self.$messagebox.alert("请完成第" + que.cdtaskSort + "题");
                                return false;
                            }
                            reply["budTaskReply.replyContentList[" + i + "].reply"] = imgList.join(",");
                        } else {
                            reply["budTaskReply.replyContentList[" + i + "].reply"] = que.userReply.join(",");
                        }
                    }

                    //视频
                    if (que.cdtaskType === "6") {
                        if (que.checkStatus === "0") {
                            let fileUrl = "";

                            if (que.userReply[0] && que.userReply[0].response.opfileupload) {
                                fileUrl = que.userReply[0].response.opfileupload[0].filepath;
                            }
                            if (que.userReply[0].state === "upload") {
                                self.$messagebox.alert("视频上传中");
                                return false;
                            }
                            if (fileUrl === "") {
                                self.$messagebox.alert("请完成第" + que.cdtaskSort + "题");
                                return false;
                            }
                            reply["budTaskReply.replyContentList[" + i + "].reply"] = fileUrl;
                        } else {
                            reply["budTaskReply.replyContentList[" + i + "].reply"] = que.userReply;
                        }
                    }
                }

                postData = Object.assign(postData, reply);
                return self.$qs.stringify(postData);
            }
        },

        mounted(){
            this.loadData();
        }
    }
</script>

<style lang="less">
    @import "./less/taskRedo";
</style>