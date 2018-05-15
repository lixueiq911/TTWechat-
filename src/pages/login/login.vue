<template>
    <div class="login" ref="login">
        <img class="bg" src="./images/3_1.jpg">

        <div class="form">
            <div class="formRow">
                <input type="text" placeholder="账号" v-model="username">
                <img class="icon" src="./images/2_1.png">
            </div>
            <div class="formRow">
                <input type="password" placehol4der="密码" v-model="password">
                <img class="icon" src="./images/2_2.png">
                <a href="tel:4008215028" class="forgetPwd">忘记密码</a>
            </div>

            <a href="javascript:void(0)" class="submit" @click="login">
                <img src="./images/3_2.png">
            </a>
        </div>
    </div>
</template>

<script>
    import store from "store";
    import {mapMutations} from "vuex";

    export default{
        data(){
            return {
                username: "",
                password: "",
                openId: store.get("openId")
            }
        },

        methods: {
            ...mapMutations(["initUser"]),

            login(){
                let self = this;
                if (self.username === "") {
                    self.$messagebox.alert("请输入账号");
                    return;
                }

                if (self.password === "") {
                    self.$messagebox.alert("请输入密码");
                    return;
                }

                let postData = self.$qs.stringify({
                    "budUser.userAccount": self.username,
                    "budUser.pwd": self.password,
                    "budUser.openId": self.openId
                });
                self.$indicator.open();
                self.$axios.post(self.$api.login, postData).then(res => {
                    self.$indicator.close();
                    if (res.data.opflag) {
                        self.initUser(res.data.data);
                        if (res.data.uppwdflag) {
                            self.$messagebox({
                                title: "初始密码修改",
                                message: "您当前的密码为初始密码，请立即修改！",
                                showCancelButton: true
                            }).then(action => {
                                if (action === "confirm") {
                                    self.$router.push("/password");
                                } else {
                                    self.$router.push("/index");
                                }
                            })
                        } else {
                            self.$router.push("/index");
                        }
                    } else {
                        self.$messagebox.alert(res.data.opmessage);
                    }
                })
            }
        },

        mounted(){
            let self = this;
            self.$nextTick(() => {
                self.$indicator.close();
                self.$refs.login.style.height = window.screen.availHeight + "px";
            });
        }
    }
</script>

<style lang="less">
    @import "./less/login";
</style>