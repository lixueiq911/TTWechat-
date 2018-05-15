<template>
    <div class="taskDetail">
        <v-header>查看任务</v-header>

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
                        <input disabled type="radio" class="radio" :name="question.childTaskId"
                               :value="select.answerOption"
                               v-model="question.userReply">
                        <span>{{select.answerOption}}、{{select.answerContent}}</span>
                    </label>
                </div>

                <div v-if="question.ifTrue == '1'" class="textGreen">恭喜答对</div>
                <div v-if="question.ifTrue == '0'" class="textRed">答错了，重做呗</div>
            </div>

            <!--多选题-->
            <div v-if="question.cdtaskType == '2'">
                <div class="select" v-for="select in question.budTaskAnswer">
                    <label>
                        <input disabled type="checkbox" class="checkbox" :name="question.childTaskId"
                               :value="select.answerOption" v-model="question.userReply">
                        <span>{{select.answerOption}}、{{select.answerContent}}</span>
                    </label>
                </div>

                <div v-if="question.ifTrue == '1'" class="textGreen">恭喜答对</div>
                <div v-if="question.ifTrue == '0'" class="textRed">答错了，重做呗</div>
            </div>

            <!--判断题-->
            <div v-if="question.cdtaskType == '3'">
                <div class="select">
                    <label>
                        <input disabled type="radio" class="radio" :name="question.childTaskId" value="1"
                               v-model="question.userReply">
                        <span>A、对</span>
                    </label>
                </div>
                <div class="select">
                    <label>
                        <input disabled type="radio" class="radio" :name="question.childTaskId" value="0"
                               v-model="question.userReply">
                        <span>B、错</span>
                    </label>
                </div>

                <div v-if="question.ifTrue == '1'" class="textGreen">恭喜答对</div>
                <div v-if="question.ifTrue == '0'" class="textRed">答错了，重做呗</div>
            </div>

            <!--简答题-->
            <div v-if="question.cdtaskType == '4'">
                <textarea disabled placeholder="请输入详细信息" class="textArea" v-model="question.userReply"></textarea>
                <div class="textRed" v-if="question.checkStatus == '0'">状态：审核未通过</div>
                <div class="textGreen" v-if="question.checkStatus == '1'">状态：审核通过</div>
                <div class="textRed" v-if="question.checkStatus == '2'">状态：审核中</div>
            </div>

            <!--图片-->
            <div v-if="question.cdtaskType == '5'">
                <div class="uploadCon">
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
                <div class="uploadCon uploadVideo">
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
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default{
        data(){
            let self = this;

            return {
                taskId: self.$route.params.taskId,          //任务id
                task: {},                                   //任务信息
                queList: []                                 //题目列表
            }
        },

        computed: {
            ...mapState(["user"])
        },

        watch: {
            user(){
                this.loadData();
            }
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
                            if (item.cdtaskType === "2" || item.cdtaskType === "5") {
                                item.userReply = item.userReply.split(",");
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
            }
        },

        mounted(){
            this.loadData();
        }
    }
</script>

<style lang="less">
    @import "./less/taskDone";
</style>