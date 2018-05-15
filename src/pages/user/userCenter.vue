<template>
    <div class="userCenter">
        <v-header :back="back">个人中心</v-header>

        <div class="baseMes">
            <img class="bg" src="./images/1_1.png">
            <div class="userName">{{user.userStore}}</div>
        </div>

        <ul class="list">
            <router-link to="/userMes" tag="li">
                <span>会员信息</span>
                <i class="fa fa-angle-right" aria-hidden="true"></i>
            </router-link>
            <router-link to="/message" tag="li">
                <span>我的消息</span>
                <i class="fa fa-angle-right" aria-hidden="true"></i>
            </router-link>
            <router-link to="/rule" tag="li">
                <span>积分规则</span>
                <i class="fa fa-angle-right" aria-hidden="true"></i>
            </router-link>
            <router-link to="/record" tag="li">
                <span>积分记录</span>
                <i class="fa fa-angle-right" aria-hidden="true"></i>
            </router-link>
            <li>
                <a href="tel:4008215028" style="display: block">
                    <span>联系客服</span>
                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                </a>
            </li>
            <router-link to="/password" tag="li">
                <span>修改密码</span>
                <i class="fa fa-angle-right" aria-hidden="true"></i>
            </router-link>
        </ul>

        <router-link class="loginOut" to="/login">退出登录</router-link>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default{
        computed: {
            ...mapState(["user"])
        },

        methods: {
            back(){
                this.$router.push("/index");
            }
        },

        mounted(){
            let self = this;
            self.$nextTick(() => {
                self.$indicator.close();
            });
        }
    }
</script>

<style lang="less">
    @import "./less/userCenter";
</style>