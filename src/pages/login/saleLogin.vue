<template>
    <div class="login" ref="login">
        <img class="bg" src="./images/3_1.jpg">

        <div class="form" style="top: 42%;">
            <div class="formRow btm">
                <select v-model="salesman" class="select">
                    <option value="" disabled selected style="display:none;">销售</option>
                    <option value="m1">M1</option>
                    <option value="m2">M2</option>
                    <option value="m3">M3</option>
                </select>
                <img class="icon1" src="./images/2_0.png">
                <img src="./images/4_1.png" class="selectPo">
            </div>

            <div class="formRow btm">
                <input type="text" placeholder="账号" v-model="username">
                <img class="icon" src="./images/2_1.png">
            </div>
            <div class="formRow btm">
                <input type="password" placeholder="密码" v-model="password">
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
    export default {
        data(){
            return {
                salesman: "",
                username: "",
                password: "",
                openId: store.get("openId")
            }
        },

        methods: {
            ...mapMutations(["initUser"]),

            login(){
                let self = this;
                if (self.salesman === "") {
                    self.$messagebox.alert("请选择销售职位");
                    return;
                }

                if (self.username === "") {
                    self.$messagebox.alert("请输入账号");
                    return;
                }

                if (self.password === "") {
                    self.$messagebox.alert("请输入密码");
                    return;
                }
                let postData = self.$qs.stringify({
                    "budSalesman.salesmanAccount": self.username,
                    "budSalesman.role": self.salesman,
                    "budSalesman.pwd": self.password,
                    "budSalesman.openId": self.openId
                });

                self.$indicator.open();
                self.$axios.post(self.$api.salesmanLogin, postData).then(res => {
                    self.$indicator.close();
/*                    console.log(res);*/
                    if (res.data.opflag) {
                        self.initUser(res.data.data);
/*                        console.log(res);*/
                        if(res.data.data.role === "M1") {
                            self.$router.push("/pointM1");
                        }else if(res.data.data.role === "M2") {
                            self.$router.push("/pointM2");
                        } else {
                            self.$router.push("/pointM3");
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