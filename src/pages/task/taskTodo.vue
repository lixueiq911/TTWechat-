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
                        <input type="radio" class="radio" :name="question.childTaskId" :value="select.answerOption"
                               v-model="question.answer">
                        <span>{{select.answerOption}}、{{select.answerContent}}</span>
                    </label>
                </div>
            </div>

            <!--多选题-->
            <div v-if="question.cdtaskType == '2'">
                <div class="select" v-for="select in question.budTaskAnswer">
                    <label>
                        <input type="checkbox" class="checkbox" :name="question.childTaskId"
                               :value="select.answerOption" v-model="question.answer">
                        <span>{{select.answerOption}}、{{select.answerContent}}</span>
                    </label>
                </div>
            </div>

            <!--判断题-->
            <div v-if="question.cdtaskType == '3'">
                <div class="select">
                    <label>
                        <input type="radio" class="radio" :name="question.childTaskId" value="1"
                               v-model="question.answer">
                        <span>A、对</span>
                    </label>
                </div>
                <div class="select">
                    <label>
                        <input type="radio" class="radio" :name="question.childTaskId" value="0"
                               v-model="question.answer">
                        <span>B、错</span>
                    </label>
                </div>
            </div>

            <!--简答题-->
            <div v-if="question.cdtaskType == '4'">
                <textarea placeholder="请输入详细信息" class="textArea" v-model="question.answer"></textarea>
            </div>

            <!--图片-->
            <div v-if="question.cdtaskType == '5'">
                <div class="uploadCon">
                    <div class="li" v-for="item in question.answer">
                        <div class="imgList">
                            <img :src="item.blob" class="imgPreview">
                            <span class="percent" v-if="item.state == 'upload'">{{parseInt(item.progress)}}%</span>
                            <span class="percent" v-if="item.state == 'success'">已上传</span>
                            <span class="percent" v-if="item.state == 'error'">上传失败</span>
                        </div>
                    </div>

                    <div class="li">
                        <v-upload class="uploadImgBtn" v-model="question.answer" :multiple="false" :maximum="0"
                                  accept="image/*"
                                  @input-filter="inputFilter" :post-action="uploadImgUrl" @input-file="inputFile">
                            <i class="fa fa-plus" aria-hidden="true"></i>
                        </v-upload>
                    </div>
                </div>
            </div>

            <!--视频-->
            <div v-if="question.cdtaskType == '6'">
                <div class="uploadCon uploadVideo">
                    <div class="li" v-for="item in question.answer">
                        <div class="imgList">
                            <span class="fa fa-play-circle"></span>

                            <span class="vState" v-if="item.state == 'upload'">{{parseInt(item.progress)}}%</span>
                            <span class="vState" v-if="item.state == 'success'">已上传</span>
                            <span class="vState" v-if="item.state == 'error'">上传失败</span>
                        </div>
                    </div>

                    <div class="li">
                        <v-upload class="uploadImgBtn" v-model="question.answer" accept="video/*"
                                  @input-filter="inputFilter" :post-action="uploadFile" @input-file="inputFile">
                            <i class="fa fa-plus" aria-hidden="true"></i>
                        </v-upload>
                    </div>
                </div>
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

                self.$axios.post(self.$api.taskTodo, postData).then(res => {
                    self.$indicator.close();

                    if (res.data.opflag) {
                        res.data.data.forEach(item => {
                            if (item.cdtaskType === "2" || item.cdtaskType === "5" || item.cdtaskType === "6") {
                                item.answer = [];
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

                console.log(file);

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
                self.$axios.post(self.$api.taskSubmit, postData).then(res => {
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

                    //单选题、判断题、简答题
                    if (que.cdtaskType === "1" || que.cdtaskType === "3" || que.cdtaskType === "4") {
                        if (que.answer === "") {
                            self.$messagebox.alert("请完成第" + que.cdtaskSort + "题");
                            return false;
                        }
                        reply["budTaskReply.replyContentList[" + i + "].reply"] = que.answer;
                    }

                    //多选题
                    if (que.cdtaskType === "2") {
                        if (que.answer.length === 0) {
                            self.$messagebox.alert("请完成第" + que.cdtaskSort + "题");
                            return false;
                        }
                        reply["budTaskReply.replyContentList[" + i + "].reply"] = que.answer.join(",");
                    }

                    //图片
                    if (que.cdtaskType === "5") {
                        let imgList = [];

                        que.answer.forEach(item => {
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
                    }

                    //视频
                    if (que.cdtaskType === "6") {
                        let fileUrl = "";

                        if (que.answer[0] && que.answer[0].response.opfileupload) {
                            fileUrl = que.answer[0].response.opfileupload[0].filepath;
                        }
                        if (que.answer[0].state === "upload") {
                            self.$messagebox.alert("视频上传中");
                            return false;
                        }
                        if (fileUrl === "") {
                            self.$messagebox.alert("请完成第" + que.cdtaskSort + "题");
                            return false;
                        }
                        reply["budTaskReply.replyContentList[" + i + "].reply"] = fileUrl;
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
    @import "./less/taskTodo";
</style>