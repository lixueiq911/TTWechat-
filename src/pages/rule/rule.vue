<template>
    <div class="rule">
        <v-header>积分规则</v-header>

        <div class="ruleName">
            <span>满额奖积分</span>
            <!--<i class="fa fa-angle-down" aria-hidden="true"></i>-->
        </div>

        <div class="ruleCon rulePoint">
            <table>
                <thead>
                <tr>
                    <th>销售金额</th>
                    <th>奖励积分</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in rewardRules.salesPointsDTO">
                    <td>{{item.amount}}</td>
                    <td>{{item.points}}</td>                    
                </tr>
                </tbody>
            </table>
        </div>        
        <div class="ruleName">
            <span>扫码得积分</span>
            <!--<i class="fa fa-angle-down" aria-hidden="true"></i>-->
        </div>
        <div class="ruleCon rulePoint">
            <table>
                <thead>
                <tr>
                    <th>百威产品</th>
                    <th>对应指标</th>
                    <th>得积分</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in CSrewardRules">
                    <td>{{item.skuName}}</td>
                    <td>{{item.standard}}标准箱</td>
                    <td>{{item.points}}</td>
                </tr>
                </tbody>
            </table>
        </div>       
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default{
        data(){
            return {
                rewardRules: {},    //销量奖励规则
                CSrewardRules:{}    //长沙
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
                    "budUser.areaCode" : self.user.areaCode
                });
				
                self.$axios.post(self.$api.rule, postData).then(res => {
                	console.log(JSON.stringify(res))
                    self.$indicator.close();
                    if (res.data.opflag) {
                        self.rewardRules = res.data.salesRewardRules;
                        self.CSrewardRules = res.data.salesCSRewardRules;
                    } else {
                        self.$toast({
                            message: "获取规则失败"
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
    @import "./less/rule";
</style>