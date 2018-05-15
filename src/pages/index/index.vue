<template>
    <div class="index">
        <!--第一屏-->
        <div class="baseMes">
            <mt-swipe :auto="3000" class="banner">
                <mt-swipe-item v-for="item in banner" :key="item.picId">
                    <a :href="item.picLink">
                        <img class="bannerImg" :src="item.picUrl">
                    </a>
                </mt-swipe-item>
            </mt-swipe>

            <div class="username">
                <div class="userImg">
                    <img src="./images/1_1.png">
                </div>

                <h3>{{userMes.userStore}}</h3>

                <router-link to="/message" tag="div" class="messageIcon">
                    <img src="./images/1_2.png">
                    <span v-if="userMes.messageNum > 0">{{userMes.messageNum}}</span>
                    <span v-if="userMes.messageNum > 99">99</span>
                </router-link>
            </div>

            <div class="score">
                <span class="currentScore">当前积分：{{userMes.currentPoints}}分</span>
                <span class="sales" v-if="!IsChangsha">累计销售金额：{{userMes.amount}}元</span>
                <span class="sales" v-if="IsChangsha">累计扫码：{{topinfo[0].sales}}箱/{{topinfo[0].standardSales}}标箱</span>
            </div>

            <div class="saleState">
                <div class="progressCon">
                    <img class="proBg" src="./images/2_1.png">
                    <div class="progress" :style="{height: userMes.percentage * 100 + '%'}">
                        <img src="./images/2_2.png">
                    </div>
                </div>
                <div :class="{hidden: userMes.rank == 0}">
                    <div class="userRank">{{userMes.rank}}</div>
                    <div class="rankName">您当前排名</div>
                </div>

                <div class="monthSale" v-if="IsChangsha">本月销售量:{{topinfo[1].sales}}箱/{{topinfo[1].standardSales}}标箱</div>
                <div class="monthSale" v-if="!IsChangsha">本月销售金额：{{userMes.monthAmount}}元</div>
<!--                <div class="saleTip" v-if="userMes.targetAmount != ''">
                    距下一任务目标还差{{userMes.targetAmount}}元，即可获得{{userMes.rewardPoints}}任务积分
                </div>
                <div class="saleTip" v-else>恭喜你，完成当月所有任务目标</div>-->
            </div>
            <div class="rankTip">
                <img class="arrow" src="./images/3_3.png">
                <div>
                    <img class="rankIcon" src="./images/3_1.png">
                    <span>积分排名</span>
                </div>
            </div>
        </div>

        <!--排名-->
        <div class="rankCon">
            <div class="place">{{userMes.area | formatCity}} &nbsp; {{date | formatDate}}</div>

            <table class="list">
                <thead>
                <tr>
                    <th class="col1">排名</th>
                    <th>售点名称</th>
                    <th class="col3">当月积分</th>
                    <th class="col4" v-if="IsChangsha">当月扫码</th>
                    <th class="col4" v-if="!IsChangsha">当月销售金额</th>

                </tr>
                </thead>
                <tbody>
                <tr v-for="item in rankList" :class="{active: user.userId == item.userId}">
                    <td>
                        <img src="./images/4_1.png" v-if="item.rank == 1">
                        <img src="./images/4_2.png" v-else-if="item.rank == 2">
                        <img src="./images/4_3.png" v-else-if="item.rank == 3">
                        <span v-else>{{item.rank}}</span>
                    </td>
                    <td>{{item.userStore}}</td>
                    <td>{{item.points}}</td>
                    <td v-if="!IsChangsha">{{item.amount}}</td>
                    <td v-if="IsChangsha">{{item.sales}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <router-link to="./wxsao">
            <span class="wxsaoico" v-if="IsChangsha">扫一扫</span>
        </router-link>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    export default{
        data(){
            return {
                banner: [],
                userMes: {},
                rankList: [],
                topinfo:{},
                IsChangsha:false,
                date: new Date,
                height:0
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
				self.$indicator.close();
                if (!self.user.userId) {
                    return;
                }               
                if(self.user.areaCode =="1232"){
                	self.IsChangsha = true;
                }                
                let postData = self.$qs.stringify({
                    "budUser.userId": self.user.userId
                });
                
                self.$axios.post(self.$api.index, postData).then(res => {
                	console.log(JSON.stringify(res.data.userData))
                    self.$indicator.close();
                    if (res.data.opflag) {                    	
                        self.banner = res.data.indexPic;
                        self.userMes = res.data.userData;
                        self.topinfo = res.data.allsale;
                        self.rankList = res.data.rankData;
                    } else {
                        self.$toast({
                            message: "获取首页数据失败"
                        });
                    }
                }).catch(() => {
                });
            },
            getlocation(){
            	wx.ready(function(){
					wx.getLocation({
					    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					    success: function (res) {
					        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
					        var longitude = res.longitude ; // 经度，浮点数，范围为180 ~ -180。
					        var speed = res.speed; // 速度，以米/每秒计
					        var accuracy = res.accuracy; // 位置精度
					    }
					});
            	})
            },
            setHeight(){
                this.height = document.documentElement.clientHeight-38;
            }
        },

        filters: {
            formatCity(val){
                if (val) {
                    return val.split("|")[0]
                }
            },

            formatDate(val){
                return val.getFullYear() + "年" + (val.getMonth() + 1) + "月"
            }
        },

        mounted(){
            this.loadData();            
            this.setHeight();
        }
    }
</script>

<style lang="less">
    @import "./less/index";
</style>
