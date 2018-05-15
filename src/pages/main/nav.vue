<template>
    <div class="footNav">
        <img class="footBg" src="./images/6_1.png">
        <ul class="list">
            <router-link to="/index" tag="li">
                <div class="icon">
                    <img class="icon1" src="./images/1_1.png">
                    <img class="icon2" src="./images/1_2.png">
                </div>
                <p>首页</p>
            </router-link>
            <router-link to="/task" tag="li">
                <div class="icon">
                    <img class="icon1" src="./images/2_1.png">
                    <img class="icon2" src="./images/2_2.png">
                </div>
                <p>任务</p>
            </router-link>
            <router-link to="/train" tag="li">
                <div class="icon">
                    <img class="icon1" src="./images/3_1.png">
                    <img class="icon2" src="./images/3_2.png">
                </div>
                <p>培训</p>
            </router-link>
            <li>
                <a :href="storeUrl">
                    <div class="icon">
                        <img class="icon1" src="./images/4_1.png">
                    </div>
                    <p>商城</p>
                </a>
            </li>
            <router-link to="/userCenter" tag="li">
                <div class="icon">
                    <img class="icon1" src="./images/5_1.png">
                </div>
                <p>我的</p>
            </router-link>
        </ul>
    </div>
</template>

<script>
    import api from "../../common/js/api";
    import axios from "axios";
    import qs from "qs";

    import {Toast} from 'mint-ui';

    import {mapState} from "vuex";

    export default{
        data(){
            return {
                store: {}
            }
        },

        computed: {
            ...mapState(["user"]),

            storeUrl(){
                let self = this;

                if (self.store.loginType) {
                    let param = "Signature=" + self.store.signature + "&Timestamp=" + self.store.timestamp + "&ProgrameCode=" +
                        self.store.programeCode + "&LoginType=" + self.store.loginType + "&Account=" + self.user.userAccount;

                    return self.store.storeWebsite + "LoginMobile/ForwardIndex?" + param;
                } else {
                    return "javascript:void(0)";
                }
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

                axios.post(api.storeMethod).then(res => {
                    if (res.data.opflag) {
                        self.store = res.data.data;
                    } else {
                        Toast({
                            message: "获取商城数据失败"
                        });
                    }
                }).catch(() => {
                    Toast({
                        message: "获取商城数据失败"
                    });
                });
            }
        },

        mounted(){
            this.loadData();
        }
    }
</script>

<style lang="less">
    .footNav {
        position: fixed;
        width: 100%;
        height: 1.5rem;
        left: 0;
        bottom: 0;
        color: #fff;
        z-index: 1;

        .footBg {
            position: absolute;
            width: 100%;
            left: 0;
            bottom: 0;
        }

        .list {
            position: absolute;
            width: 100%;
            left: 0;
            bottom: 0;
            height: 0.95rem;
            display: flex;
            flex-wrap: nowrap;

            li {
                flex-grow: 1;
            }

            .icon {
                width: 0.5rem;
                height: 0.5rem;
                margin: 0 auto;
                position: relative;

                img {
                    position: absolute;
                    width: 100%;
                    top: 0;
                    left: 0;
                }

                .icon1 {
                    display: block;
                }

                .icon2 {
                    display: none;
                }
            }

            p {
                text-align: center;
                font-size: 0.24rem;
            }

            .router-link-active {
                font-weight: bolder;

                .icon {
                    .icon1 {
                        display: none;
                    }

                    .icon2 {
                        display: block;
                    }
                }
            }
        }
    }
</style>