<template>
    <div></div>
</template>

<script>
    import {mapState} from "vuex";

    export default{
        data(){
            return {
                pageType: this.$route.params.page
            }
        },

        computed: {
            ...mapState(["user"])
        },

        watch: {
            user(){
                this.turnPage();
            }
        },

        methods: {
            turnPage(){
                let self = this;

                if (self.user.openId) {
                    if (self.pageType === "task") {
                        self.$router.push("/task");
                    } else if (self.pageType === "train") {
                        self.$router.push("/train");
                    } else if (self.pageType === "point") {
                        self.$router.push("/record");
                    }
                }
            }
        },

        mounted(){
            this.turnPage();
        }
    }
</script>
