<template>
    <div class="changePassword">
        <v-header :back="back">修改密码</v-header>

        <div class="form">
            <input v-model="p1" type="text" placeholder="请输入当前密码">
            <input v-model="p2" type="text" placeholder="请输入新密码">
            <input v-model="p3" type="text" placeholder="请确认新密码">

            <a href="javascript:void(0)" class="submit" @click="submit">确认提交</a>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default{
        data(){
            return {
                p1: "",
                p2: "",
                p3: ""
            }
        },

        computed: {
            ...mapState(["user"])
        },

        methods: {
            back(){
                this.$router.push("/userCenter");
            },

            submit(){
                let self = this;

                if (self.p1 === "") {
                    self.$messagebox.alert("请输入当前密码");
                    return;
                }
                if (self.p2 === "") {
                    self.$messagebox.alert("请输入新密码");
                    return;
                }
                if (self.p3 === "") {
                    self.$messagebox.alert("请确认新密码");
                    return;
                }
                if (self.p2 !== self.p3) {
                    self.$messagebox.alert("请保持确认密码和新密码一致");
                    return;
                }

                if (!self.user.userId) {
                    return;
                }

                let postData = self.$qs.stringify({
                    "budUserDTO.userId": self.user.userId,
                    "budUserDTO.oldPwd": self.p1,
                    "budUserDTO.newPwd": self.p2
                });

                self.$axios.post(self.$api.password, postData).then(res => {
                    self.$indicator.close();

                    if (res.data.opflag) {
                        self.$messagebox.alert("修改成功").then(() => {
                            self.$router.push("/index");
                        });
                    } else {
                        self.$messagebox.alert(res.data.opmessage);
                    }
                })
            }
        },

        mounted(){
            this.$nextTick(() => {
                this.$indicator.close();
            })
        }
    }
</script>

<style lang="less">
    .changePassword {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: #fff;

        .form {
            padding: 0.4rem 0.4rem 0 0.4rem;

            input {
                display: block;
                width: 100%;
                height: 0.9rem;
                box-sizing: border-box;
                border: 1px solid #ddd;
                border-radius: 0.1rem;
                margin-bottom: 0.4rem;
                padding: 0 0.3rem;
                font-size: 0.3rem;
            }

            .submit {
                display: block;
                width: 100%;
                height: 0.9rem;
                line-height: 0.9rem;
                text-align: center;
                background-color: #db0025;
                color: #fff;
                border-radius: 0.1rem;
            }
        }
    }
</style>