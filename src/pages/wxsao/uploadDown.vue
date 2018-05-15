<template>
    <div class="uploadDown">
    	<v-header></v-header>
	    <div class="con">
	        <div class="img"></div>
	        <p class="title">上传成功</p>
	        <p class="tip">请您耐心等待审核结果</p>
	    </div>
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

                if (!self.user.userId) {
                    return;
                }

                let postData = self.$qs.stringify({
                    "budUser.userId": self.user.userId
                });

                self.$axios.post(self.$api.index, postData).then(res => {
                    self.$indicator.close();

                    if (res.data.opflag) {
                        self.banner = res.data.indexPic;
                        self.userMes = res.data.userData;
                        self.rankList = res.data.rankData;
                    } else {
                        self.$toast({
                            message: "获取首页数据失败"
                        });
                    }
                }).catch(() => {
                });
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
    @import "./less/wxsao";
</style>
