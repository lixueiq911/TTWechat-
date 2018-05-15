<template>
    <div class="taskList">
        <v-header>任务清单</v-header>

        <div class="list">
            <div class="li" v-for="item in taskList">
                <div class="head">
                    <div class="title">{{item.taskTitle}}</div>
                    <div class="score">
                        <span v-if="item.rewardPoints == 0">敬请期待</span>
                        <span v-else>{{item.rewardPoints}}积分</span>
                    </div>
                </div>

                <div class="con">
                    <div class="taskImg" @click="previewImg(item.picUrl)">
                        <img :src="item.picUrl">
                    </div>

                    <div class="item">
                        <span class="itemName">起止时间：</span>
                        <span>{{item.startTime}} - {{item.endTime}}</span>
                    </div>

                    <div class="item">
                        <span class="itemName">状态：</span>
                        <span v-if="item.replyStatus == '0'">待审核</span>
                        <span v-if="item.replyStatus == '1'">已完成</span>
                        <span v-if="item.replyStatus == '2'">已过期</span>
                        <span v-if="item.replyStatus == '3'">新任务</span>
                        <span v-if="item.replyStatus == '4'">未开始</span>
                        <span v-if="item.replyStatus == '5'">需重新上传</span>
                    </div>

                    <div class="item"><span class="itemName">任务概要：</span>{{item.taskDescribe}}</div>

                    <a v-if="item.replyStatus == '3'" @click="turnDoTask(item.taskId)" class="btn"
                       href="javascript:void(0)">做任务</a>
                    <a v-if="item.replyStatus == '5'" @click="turnRedoTask(item.taskId)" class="btn"
                       href="javascript:void(0)">重做任务</a>
                    <router-link
                        class="btn"
                        v-if="item.replyStatus == '0' || item.replyStatus == '1'"
                        :to="'/task/done/' + item.taskId">查看任务
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default{
        data(){
            return {
                taskList: []          //销量得积分
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

        methods: {
            loadData(){
                let self = this;

                if (!self.user.userId) {
                    return;
                }

                let postData = self.$qs.stringify({
                    "budUser.userId": self.user.userId
                });

                self.$axios.post(self.$api.taskList, postData).then(res => {
                    self.$indicator.close();

                    if (res.data.opflag) {
                        self.taskList = res.data.data;
                    } else {
                        self.$toast({
                            message: "获取任务失败"
                        });
                    }
                })
            },

            //跳转到做任务页面
            turnDoTask(id){
                let self = this;

                if (!self.location.latitude) {
                    self.$messagebox.alert("未获取到您的地理位置。<br>如果您未允许公众号获取您的位置，请重新进入“威享会”，并在弹窗中点击“是”允许获取地理位置。<br>如果您已允许公众号获取您的位置，请打开手机GPS功能，刷新再试", "获取地理位置");
                    return;
                }

                self.$router.push("/task/todo/" + id);
            },

            turnRedoTask(id){
                let self = this;

                if (!self.location.latitude) {
                    self.$messagebox.alert("未获取到您的地理位置。<br>如果您未允许公众号获取您的位置，请重新进入“威享会”，并在弹窗中点击“是”允许获取地理位置。<br>如果您已允许公众号获取您的位置，请打开手机GPS功能，刷新再试", "获取地理位置");
                    return;
                }

                self.$router.push("/task/redo/" + id);
            },

            previewImg(url){
                wx.previewImage({
                    current: url,
                    urls: [url]
                });
            }
        },

        mounted(){
            this.loadData();
        }
    }
</script>

<style lang="less">
    @import "./less/task";
</style>