<template>
    <div>
        <v-header>会员信息</v-header>

        <div class="userMes">
            <div class="row">
                <span class="itemName">账号</span>
                <span class="itemVal">{{userMes.userAccount}}</span>
            </div>
            <div class="row">
                <span class="itemName">售点名称</span>
                <span class="itemVal">{{userMes.userStore}}</span>
            </div>
            <div class="row">
                <span class="itemName">手机号码</span>
                <span class="itemVal">{{userMes.userAccount}}</span>
            </div>
            <div class="row">
                <span class="itemName">销售人员姓名</span>
                <span class="itemVal">{{userMes.m1}}</span>
            </div>
            <div class="row">
                <span class="itemName">销售人员联系方式</span>
                <span class="itemVal">{{userMes.m1Tel}}</span>
            </div>
            <div class="row">
                <span class="itemName">所属区域</span>
                <span
                    class="itemVal">{{place}}</span>
            </div>
            <div class="address">
                <span class="itemName">详细地址</span>
                <p class="itemVal">{{userMes.storeAddress}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default{
        data(){
            return {
                userMes: {}
            }
        },

        computed: {
            ...mapState(["user"]),

            place(){
                if (this.userMes.bu)
                    return this.userMes.bu.split("|")[0] + "-" + this.userMes.region.split("|")[0] + "-" + this.userMes.area.split("|")[0];
                else
                    return ""
            }
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

                self.$axios.post(self.$api.userMes, postData).then(res => {
                    self.$indicator.close();

                    if (res.data.opflag) {
                        self.userMes = res.data.data;
                    } else {
                        self.$toast({
                            message: "获取用户信息失败"
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
    @import "./less/userMes";
</style>