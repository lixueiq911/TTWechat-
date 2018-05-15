<template>
    <div class="record">
        <v-header>积分记录</v-header>

        <div class="dateCon">
            <div class="date">{{date | formatDate}}</div>
            <p>支出：{{pointPay}} &nbsp; 收入：{{pointGet}}</p>
            <img src="./images/calendar.png" class="dateBtn" @click="openDatePicker">
        </div>

        <div class="recordList" ref="recordListCon">
            <mt-loadmore :bottom-method="loadData"
                         :bottom-all-loaded="allLoaded"
                         bottomPullText=""
                         bottomDropText=""
                         :autoFill="false"
                         ref="recordList">
                <div class="li" v-for="item in recordList">
                    <div class="time">
                        <p>{{item.createTime.split(" ")[0]}}</p>
                        <p>{{item.createTime.split(" ")[1]}}</p>
                    </div>

                    <img class="icon" src="./images/2_1.png" v-if="item.type == 1 || item.type == 3">
                    <img class="icon" src="./images/2_2.png" v-if="item.type == 2">
                    <img class="icon" src="./images/2_5.png" v-if="item.type == 4">
                    <img class="icon" src="./images/2_3.png" v-if="item.type == 5 || item.type == 6 || item.type == 7">
                    <img class="icon" src="./images/2_6.png" v-if="item.type == 8">

                    <p class="itemName">
                        <span v-if="item.type == 1">销量积分</span>
                        <span v-if="item.type == 2">任务奖励积分</span>
                        <span v-if="item.type == 3">积分兑换</span>
                        <span v-if="item.type == 4">调整积分</span>
                        <span v-if="item.type == 5">商城下单</span>
                        <span v-if="item.type == 6">商城退单</span>
                        <span v-if="item.type == 7">取消订单</span>
                        <span v-if="item.type == 8">活动积分</span>

                        <span>{{item.remark}}</span>
                    </p>

                    <p class="itemName" v-if="item.sku != ''">{{item.sku}}</p>
                    <p class="itemName" v-if="item.title != ''">{{item.title}}</p>
                    <p class="itemName" v-if="item.amount != ''">{{item.amount}}元</p>

                    <div class="score">
                        <span :class="{pointAdd: item.point > 0, pointSub: item.point < 0}">{{item.point}}积分</span>
                    </div>
                </div>
            </mt-loadmore>
        </div>

        <mt-datetime-picker
            ref="datePicker"
            type="date"
            @confirm="onSelectDate"
            v-model="date">
        </mt-datetime-picker>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import moment from "moment";

    export default{
        data(){
            return {
                allLoaded: false,
                pageIndex: 1,               //当前页码
                pageSize: 10,               //每次加载数量
                recordList: [],             //积分记录列表
                pickerVisible: false,
                date: new Date(),
                pointGet: 0,
                pointPay: 0
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
                    "budPointRecord.userId": self.user.userId,  //用户主键
                    "budPointRecord.createTimeStr": moment(self.date).format("YYYY-MM") + "-01",  //时间  格式为 2017-10-01（月份后面加个-01的尾巴）
                    "processor.pageIndex": self.pageIndex,  //必填   翻页  默认1
                    "processor.pageSize": self.pageSize   //每页数量  默认10
                });

                self.$axios.post(self.$api.record, postData).then(res => {
                    self.$indicator.close();

                    if (res.data.opflag) {
                        self.recordList = self.recordList.concat(res.data.data.records);
                        self.pointGet = res.data.get;
                        self.pointPay = Math.abs(res.data.pay);
                        self.pageIndex++;

                        //判断是否全部加载完成
                        self.allLoaded = res.data.data.records.length < self.pageSize;
                        if (self.pageIndex > 2) {
                            self.$refs.recordList.onBottomLoaded();
                        }
                    } else {
                        self.$toast({
                            message: "获取积分记录失败"
                        });
                    }
                })
            },

            //打开日期弹框
            openDatePicker(){
                this.$refs.datePicker.open();
            },

            //关闭日期弹框
            onSelectDate(){
                this.pageIndex = 1;
                this.recordList = [];
                this.loadData();
            }
        },

        filters: {
            formatDate(val){
                return moment(val).format("YYYY-MM")
            }
        },

        mounted(){
            this.loadData();
        }
    }
</script>

<style lang="less">
    @import "./less/record";
</style>