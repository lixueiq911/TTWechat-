<template>
    <div class="message">
        <v-header>我的消息</v-header>

        <div class="messageList">
            <mt-loadmore :bottom-method="loadData"
                         :bottom-all-loaded="allLoaded"
                         bottomPullText=""
                         bottomDropText=""
                         :autoFill="false"
                         ref="messageList">
                <ul class="list">
                    <li v-for="item in messageList" @click="readMessage(item)">
                        <span class="readState" v-if="item.messageStatus == '0'"></span>
                        <div class="title">
                            <h3>{{item.messageTitle}}</h3>
                            <span class="time">{{item.sendTime}}</span>
                        </div>
                        <div class="content">{{item.messageContent}}</div>
                    </li>
                </ul>
            </mt-loadmore>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default{
        data(){
            return {
                allLoaded: false,        //是否全部加载完成
                pageIndex: 1,           //当前页码
                pageSize: 10,           //每次加载数量
                messageList: []
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
                    "budUser.userId": self.user.userId,
                    "processor.pageIndex": self.pageIndex,
                    "processor.pageSize": self.pageSize
                });

                self.$axios.post(self.$api.message, postData).then(res => {
                    self.$indicator.close();

                    if (res.data.opflag) {
                        self.messageList = self.messageList.concat(res.data.data.records);
                        self.pageIndex++;

                        //判断是否全部加载完成
                        self.allLoaded = res.data.data.records.length < self.pageSize;
                        self.$refs.messageList.onBottomLoaded();
                    } else {
                        self.$toast({
                            message: "获取消息失败"
                        });
                    }
                })
            },

            //消息详情
            readMessage(mes){
                let self = this;

                self.$messagebox.alert(mes.messageContent, mes.messageTitle).then(() => {
                    if (mes.messageStatus === "1") {
                        return;
                    }

                    let postData = self.$qs.stringify({
                        "budUserMessage.messageId": mes.messageId,
                        "budUserMessage.messagetype": mes.messagetype
                    });

                    self.$axios.post(self.$api.readMessage, postData).then(res => {
                        if (res.data.opflag) {
                            mes.messageStatus = "1";
                        } else {
                            self.$toast({
                                message: "阅读消息失败"
                            });
                        }
                    })
                });
            }
        },

        mounted(){
            this.loadData();
        }
    }
</script>

<style lang="less">
    @import "./less/message";
</style>