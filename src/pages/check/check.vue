<template>
    <div></div>
</template>

<script>
    import {mapState} from "vuex";

    export default{
        data(){
            return {
                userType: this.$route.params.userType
            }
        },

        computed: {
            ...mapState(["user"])
        },

        watch: {
            user(){
                this.checks();
            }
        },

        methods: {
            checks(){
                let self = this;

                if (self.user.openId) {
                    if (self.user.role === "store" && self.userType === "user") {
                        self.$router.push("/index");
                    } else if (self.user.role === "M1" && self.userType === "manager") {
                        self.$router.push("/pointM1");
                    } else if (self.user.role === "M2" && self.userType === "manager") {
                        self.$router.push("/pointM2");
                    } else if (self.user.role === "M3" && self.userType === "manager") {
                        self.$router.push("/pointM3");
                    } else {
                        if (self.userType === "user") {
                            self.$router.push("/login");
                        } else if (self.userType === "manager") {
                            self.$router.push("/saleLogin");
                        }
                    }
                }
            }
        },

        mounted(){
            this.checks();
        }
    }
</script>
